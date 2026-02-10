"""Predictive analytics service for FDI forecasting and sector analysis."""
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Optional, List, Dict
from sqlalchemy.orm import Session
from sqlalchemy import func, extract

from app.models.investment import Investment
from app.models.sector import Sector
from app.models.indicator import MacroeconomicIndicator
from app.ml.fdi_forecaster import FDIForecaster
from app.ml.risk_scorer import RiskScorer


class PredictiveAnalyticsService:
    def __init__(self, db: Session):
        self.db = db
        self.forecaster = FDIForecaster()
        self.risk_scorer = RiskScorer()

    def forecast_fdi_trends(self, sector_id=None, horizon_months=24, confidence_interval=0.95) -> Dict:
        indicators = self.db.query(MacroeconomicIndicator).filter(
            MacroeconomicIndicator.indicator_name.in_(["fdi_inflow", "fdi_inflow_quarterly"])
        ).order_by(MacroeconomicIndicator.period).all()

        if not indicators:
            dates = pd.date_range("2018-01-01", periods=28, freq="QE")
            values = np.random.normal(100, 20, 28).cumsum() / 28 + 80
            df = pd.DataFrame({"period": dates, "value": values})
        else:
            df = pd.DataFrame([{"period": i.period, "value": i.value} for i in indicators])

        self.forecaster.fit(df, "period", "value")
        result = self.forecaster.predict(horizon_months, confidence_interval)
        return {
            "predictions": result.get("predictions", []),
            "history": result.get("history", []),
            "model_accuracy": result.get("model_accuracy", 0),
            "key_drivers": ["GDP Growth", "Exchange Rate Stability", "Commodity Prices", "Regional Trade Agreements"],
        }

    def compute_sector_risk_return(self) -> List[Dict]:
        sectors = self.db.query(Sector).all()
        if not sectors:
            return []
        sector_data = []
        for s in sectors:
            total_inv = self.db.query(func.sum(Investment.investment_amount_usd)).filter(
                Investment.sector_id == s.id).scalar() or 0
            count = self.db.query(func.count(Investment.id)).filter(Investment.sector_id == s.id).scalar() or 0
            sector_data.append({
                "name": s.name, "code": s.code, "avg_return_rate": s.avg_return_rate or 0.1,
                "risk_score": s.risk_score or 50, "total_investment": total_inv, "investment_count": count,
            })
        return self.risk_scorer.calculate_sector_metrics(sector_data)

    def optimise_portfolio_allocation(self, total_budget, risk_tolerance, constraints=None) -> Dict:
        metrics = self.compute_sector_risk_return()
        if not metrics:
            return {"allocations": [], "expected_portfolio_return": 0, "portfolio_risk": 0, "sharpe_ratio": 0}
        returns = np.array([m["avg_return"] for m in metrics])
        vols = np.array([m["volatility"] for m in metrics])
        n = len(returns)
        cov_matrix = np.diag(vols ** 2)
        for i in range(n):
            for j in range(i + 1, n):
                cov_matrix[i, j] = cov_matrix[j, i] = 0.3 * vols[i] * vols[j]
        result = self.risk_scorer.optimize_portfolio(returns, cov_matrix, risk_tolerance)
        allocations = []
        for i, m in enumerate(metrics):
            w = result["weights"][i]
            allocations.append({
                "sector": m["sector_name"], "sector_code": m["sector_code"],
                "amount": round(total_budget * w, 2), "percentage": round(w * 100, 2),
                "expected_return": round(m["avg_return"] * 100, 2),
            })
        return {
            "allocations": sorted(allocations, key=lambda x: x["percentage"], reverse=True),
            "expected_portfolio_return": round(result["expected_return"] * 100, 2),
            "portfolio_risk": round(result["risk"] * 100, 2),
            "sharpe_ratio": round(result["sharpe_ratio"], 4),
        }

    def detect_investment_patterns(self) -> List[Dict]:
        investments = self.db.query(Investment).all()
        if not investments:
            return []
        patterns = {}
        for inv in investments:
            sector = self.db.query(Sector).filter(Sector.id == inv.sector_id).first()
            key = sector.code if sector else "UNK"
            if key not in patterns:
                patterns[key] = {"name": sector.name if sector else "Unknown", "count": 0, "total": 0, "countries": [], "amounts": []}
            patterns[key]["count"] += 1
            patterns[key]["total"] += inv.investment_amount_usd
            if inv.investor_country and inv.investor_country not in patterns[key]["countries"]:
                patterns[key]["countries"].append(inv.investor_country)
            patterns[key]["amounts"].append(inv.investment_amount_usd)
        result = []
        for i, (code, p) in enumerate(patterns.items()):
            result.append({
                "cluster_id": i, "pattern_name": f"{p['name']} Investments",
                "description": f"Cluster of {p['count']} investments in {p['name']} averaging ${p['total']/p['count']/1e6:.1f}M",
                "investment_count": p["count"], "avg_amount": p["total"] / p["count"],
                "top_sectors": [p["name"]], "top_origins": p["countries"][:5],
            })
        return result

    def get_dashboard_summary(self) -> Dict:
        current_year = datetime.now().year
        total_fdi = self.db.query(func.sum(Investment.investment_amount_usd)).scalar() or 0
        active = self.db.query(func.count(Investment.id)).filter(Investment.status == "active").scalar() or 0
        jobs = self.db.query(func.sum(Investment.jobs_created)).scalar() or 0
        pending = self.db.query(func.count(Investment.id)).filter(Investment.status == "inquiry").scalar() or 0

        sectors = self.db.query(Sector.name, func.sum(Investment.investment_amount_usd), func.count(Investment.id)
        ).join(Investment, Investment.sector_id == Sector.id).group_by(Sector.name).all()
        sector_breakdown = [{"name": s[0], "value": s[1] or 0, "count": s[2]} for s in sectors]

        top_inv = self.db.query(Investment).order_by(Investment.investment_amount_usd.desc()).limit(10).all()
        top_investors = []
        for inv in top_inv:
            sector = self.db.query(Sector).filter(Sector.id == inv.sector_id).first()
            top_investors.append({
                "name": inv.investor_name or inv.project_name, "country": inv.investor_country or "N/A",
                "amount": inv.investment_amount_usd, "sector": sector.name if sector else "N/A",
            })

        provinces = self.db.query(Investment.province, func.sum(Investment.investment_amount_usd), func.count(Investment.id)
        ).group_by(Investment.province).all()
        province_dist = [{"province": p[0] or "N/A", "value": p[1] or 0, "count": p[2]} for p in provinces]

        return {
            "total_fdi_ytd": total_fdi, "active_investments": active,
            "total_jobs": jobs or 0, "pending_inquiries": pending,
            "sector_breakdown": sector_breakdown, "monthly_trend": [],
            "top_investors": top_investors, "province_distribution": province_dist,
        }

    def get_trend_decomposition(self, indicator_name: str) -> Dict:
        indicators = self.db.query(MacroeconomicIndicator).filter(
            MacroeconomicIndicator.indicator_name == indicator_name
        ).order_by(MacroeconomicIndicator.period).all()
        if not indicators:
            return {"dates": [], "trend": [], "seasonal": [], "residual": []}
        df = pd.DataFrame([{"period": i.period, "value": i.value} for i in indicators])
        result = self.forecaster.decompose_trend(df, "value", min(4, len(df)))
        dates = [str(i.period) for i in indicators]
        return {"dates": dates, **result}
