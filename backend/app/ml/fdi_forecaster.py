"""FDI forecasting using time series analysis and regression."""
import numpy as np
import pandas as pd
from typing import Optional, Dict, List


class FDIForecaster:
    """Time series forecasting for FDI inflows."""

    def __init__(self):
        self.data = None
        self.trend_coef = None
        self.alpha = 0.3
        self.fitted = False

    def fit(self, data: pd.DataFrame, date_col: str = "period", value_col: str = "value"):
        self.data = data.sort_values(date_col).reset_index(drop=True)
        self.values = self.data[value_col].values.astype(float)
        n = len(self.values)
        if n < 2:
            self.trend_coef = (0, self.values[0] if n > 0 else 0)
            self.fitted = True
            return
        x = np.arange(n)
        self.trend_coef = np.polyfit(x, self.values, 1)
        residuals = self.values - np.polyval(self.trend_coef, x)
        self.residual_std = np.std(residuals) if len(residuals) > 1 else 0
        self.fitted = True

    def predict(self, horizon_months: int = 24, confidence: float = 0.95) -> Dict:
        if not self.fitted:
            raise RuntimeError("Model not fitted. Call fit() first.")
        n = len(self.values)
        z_score = 1.96 if confidence >= 0.95 else 1.645
        predictions = []
        for i in range(horizon_months):
            idx = n + i
            value = np.polyval(self.trend_coef, idx)
            spread = self.residual_std * z_score * np.sqrt(1 + i / 12)
            predictions.append({
                "step": i + 1,
                "value": round(float(max(value, 0)), 2),
                "lower_bound": round(float(max(value - spread, 0)), 2),
                "upper_bound": round(float(value + spread), 2),
                "is_forecast": True,
            })
        history = []
        for i, val in enumerate(self.values):
            history.append({"step": i, "value": round(float(val), 2), "is_forecast": False})
        return {
            "history": history,
            "predictions": predictions,
            "model_accuracy": round(float(1.0 - self.residual_std / np.mean(self.values)) * 100, 1) if np.mean(self.values) > 0 else 0,
        }

    def decompose_trend(self, data: pd.DataFrame, value_col: str = "value", period: int = 4) -> Dict:
        values = data[value_col].values.astype(float)
        n = len(values)
        trend = np.convolve(values, np.ones(period) / period, mode='same')
        trend[:period // 2] = trend[period // 2]
        trend[-(period // 2):] = trend[-(period // 2) - 1]
        seasonal = values - trend
        if n >= period:
            seasonal_avg = np.array([np.mean(seasonal[i::period]) for i in range(period)])
            seasonal = np.tile(seasonal_avg, n // period + 1)[:n]
        residual = values - trend - seasonal
        return {
            "trend": trend.tolist(),
            "seasonal": seasonal.tolist(),
            "residual": residual.tolist(),
        }

    def regression_forecast(self, features: pd.DataFrame, target: pd.Series) -> Dict:
        X = features.values
        y = target.values
        X_with_intercept = np.column_stack([np.ones(len(X)), X])
        coef, residuals, _, _ = np.linalg.lstsq(X_with_intercept, y, rcond=None)
        predictions = X_with_intercept @ coef
        ss_res = np.sum((y - predictions) ** 2)
        ss_tot = np.sum((y - np.mean(y)) ** 2)
        r_squared = 1 - (ss_res / ss_tot) if ss_tot > 0 else 0
        return {
            "coefficients": coef.tolist(),
            "r_squared": round(float(r_squared), 4),
            "predictions": predictions.tolist(),
            "feature_names": ["intercept"] + list(features.columns),
        }
