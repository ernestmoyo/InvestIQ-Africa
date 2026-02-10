"""Monte Carlo simulation engine for probabilistic impact estimation."""
import numpy as np
from typing import Dict


class MonteCarloEngine:
    """Runs Monte Carlo simulations to estimate probabilistic investment outcomes."""

    SCENARIO_PARAMS = {
        "base": {"return_mean": 0.12, "return_std": 0.05, "fx_vol": 0.15, "demand_var": 0.10},
        "optimistic": {"return_mean": 0.18, "return_std": 0.04, "fx_vol": 0.10, "demand_var": 0.05},
        "pessimistic": {"return_mean": 0.06, "return_std": 0.08, "fx_vol": 0.25, "demand_var": 0.20},
    }

    SECTOR_ADJUSTMENTS = {
        "mining": {"return_adj": 0.03, "vol_adj": 0.05},
        "agriculture": {"return_adj": -0.02, "vol_adj": 0.08},
        "manufacturing": {"return_adj": 0.0, "vol_adj": 0.03},
        "tourism": {"return_adj": 0.01, "vol_adj": 0.06},
        "ict": {"return_adj": 0.05, "vol_adj": 0.04},
        "energy": {"return_adj": -0.01, "vol_adj": 0.02},
        "infrastructure": {"return_adj": -0.02, "vol_adj": 0.02},
        "financial_services": {"return_adj": 0.04, "vol_adj": 0.05},
        "health": {"return_adj": 0.02, "vol_adj": 0.03},
    }

    def run_simulation(
        self, investment_amount: float, sector: str, num_simulations: int = 10000,
        scenario: str = "base", years: int = 5,
    ) -> Dict:
        params = self.SCENARIO_PARAMS.get(scenario, self.SCENARIO_PARAMS["base"])
        sector_key = sector.lower().replace(" ", "_").replace("&", "and")
        adj = self.SECTOR_ADJUSTMENTS.get(sector_key, {"return_adj": 0, "vol_adj": 0})

        mean_return = params["return_mean"] + adj["return_adj"]
        std_return = params["return_std"] + adj["vol_adj"]

        np.random.seed(None)
        annual_returns = np.random.normal(mean_return, std_return, (num_simulations, years))
        fx_shocks = np.random.normal(0, params["fx_vol"], (num_simulations, years))
        demand_shocks = np.random.normal(0, params["demand_var"], (num_simulations, years))
        effective_returns = annual_returns - 0.3 * np.abs(fx_shocks) - 0.2 * np.abs(demand_shocks)
        cumulative = np.prod(1 + effective_returns, axis=1)
        outcomes = investment_amount * cumulative

        stats = self.generate_distribution_stats(outcomes)
        return {"outcomes": outcomes.tolist(), "statistics": stats}

    def calculate_var(self, outcomes: np.ndarray, confidence: float = 0.95) -> float:
        return float(np.percentile(outcomes, (1 - confidence) * 100))

    def calculate_expected_shortfall(self, outcomes: np.ndarray, confidence: float = 0.95) -> float:
        var = self.calculate_var(outcomes, confidence)
        tail = outcomes[outcomes <= var]
        return float(np.mean(tail)) if len(tail) > 0 else var

    def generate_distribution_stats(self, outcomes) -> Dict:
        outcomes = np.array(outcomes)
        return {
            "mean": float(np.mean(outcomes)),
            "median": float(np.median(outcomes)),
            "std": float(np.std(outcomes)),
            "percentile_5": float(np.percentile(outcomes, 5)),
            "percentile_25": float(np.percentile(outcomes, 25)),
            "percentile_75": float(np.percentile(outcomes, 75)),
            "percentile_95": float(np.percentile(outcomes, 95)),
            "var_95": self.calculate_var(outcomes, 0.95),
            "expected_shortfall": self.calculate_expected_shortfall(outcomes, 0.95),
            "min": float(np.min(outcomes)),
            "max": float(np.max(outcomes)),
        }
