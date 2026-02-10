"""Sector risk-return profiling using Modern Portfolio Theory."""
import numpy as np
from typing import List, Dict, Optional
from scipy.optimize import minimize


class RiskScorer:
    """Calculate risk-return profiles and optimize portfolios."""

    RISK_FREE_RATE = 0.08  # Zimbabwe T-bill rate

    def calculate_sector_metrics(self, sector_data: List[Dict]) -> List[Dict]:
        results = []
        all_returns = [s.get("avg_return_rate", 0.1) for s in sector_data]
        market_return = np.mean(all_returns) if all_returns else 0.1
        market_vol = np.std(all_returns) if len(all_returns) > 1 else 0.05

        for s in sector_data:
            ret = s.get("avg_return_rate", 0.1)
            risk = s.get("risk_score", 50) / 100.0
            vol = risk * 0.3
            sharpe = (ret - self.RISK_FREE_RATE) / vol if vol > 0 else 0
            beta = (ret - self.RISK_FREE_RATE) / (market_return - self.RISK_FREE_RATE) if (market_return - self.RISK_FREE_RATE) != 0 else 1.0
            results.append({
                "sector_name": s.get("name", ""),
                "sector_code": s.get("code", ""),
                "avg_return": round(ret, 4),
                "volatility": round(vol, 4),
                "sharpe_ratio": round(sharpe, 4),
                "beta": round(beta, 4),
                "total_investment": s.get("total_investment", 0),
                "investment_count": s.get("investment_count", 0),
            })
        return results

    def compute_correlation_matrix(self, returns_data: Dict[str, List[float]]) -> Dict:
        sectors = list(returns_data.keys())
        n = len(sectors)
        matrix = np.eye(n)
        for i in range(n):
            for j in range(i + 1, n):
                r1 = np.array(returns_data[sectors[i]])
                r2 = np.array(returns_data[sectors[j]])
                min_len = min(len(r1), len(r2))
                if min_len > 1:
                    corr = np.corrcoef(r1[:min_len], r2[:min_len])[0, 1]
                else:
                    corr = 0.0
                matrix[i, j] = corr
                matrix[j, i] = corr
        return {"sectors": sectors, "matrix": matrix.tolist()}

    def efficient_frontier(self, expected_returns: np.ndarray, cov_matrix: np.ndarray,
                          num_portfolios: int = 100) -> List[Dict]:
        n = len(expected_returns)
        results = []
        target_returns = np.linspace(expected_returns.min(), expected_returns.max(), num_portfolios)

        for target in target_returns:
            constraints = [
                {"type": "eq", "fun": lambda w: np.sum(w) - 1},
                {"type": "eq", "fun": lambda w, t=target: np.dot(w, expected_returns) - t},
            ]
            bounds = tuple((0, 1) for _ in range(n))
            init = np.ones(n) / n
            result = minimize(
                lambda w: np.sqrt(np.dot(w.T, np.dot(cov_matrix, w))),
                init, method="SLSQP", bounds=bounds, constraints=constraints,
            )
            if result.success:
                risk = float(np.sqrt(np.dot(result.x.T, np.dot(cov_matrix, result.x))))
                ret = float(np.dot(result.x, expected_returns))
                results.append({"risk": round(risk, 6), "expected_return": round(ret, 6), "weights": result.x.tolist()})
        return results

    def optimize_portfolio(self, expected_returns: np.ndarray, cov_matrix: np.ndarray,
                          risk_tolerance: str = "moderate", constraints: Optional[Dict] = None) -> Dict:
        n = len(expected_returns)
        risk_multiplier = {"conservative": 0.3, "moderate": 0.6, "aggressive": 1.0}.get(risk_tolerance, 0.6)
        target_return = expected_returns.min() + risk_multiplier * (expected_returns.max() - expected_returns.min())

        opt_constraints = [
            {"type": "eq", "fun": lambda w: np.sum(w) - 1},
            {"type": "ineq", "fun": lambda w: np.dot(w, expected_returns) - target_return},
        ]
        bounds = tuple((0.02, 0.40) for _ in range(n))
        init = np.ones(n) / n
        result = minimize(
            lambda w: np.sqrt(np.dot(w.T, np.dot(cov_matrix, w))),
            init, method="SLSQP", bounds=bounds, constraints=opt_constraints,
        )
        weights = result.x if result.success else np.ones(n) / n
        port_return = float(np.dot(weights, expected_returns))
        port_risk = float(np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights))))
        sharpe = (port_return - self.RISK_FREE_RATE) / port_risk if port_risk > 0 else 0
        return {
            "weights": weights.tolist(),
            "expected_return": round(port_return, 4),
            "risk": round(port_risk, 4),
            "sharpe_ratio": round(sharpe, 4),
        }
