"""Tests for the Monte Carlo simulation engine."""
import pytest
import numpy as np
from app.ml.monte_carlo import MonteCarloEngine


class TestMonteCarloEngine:
    """Test Monte Carlo simulation with known statistical properties."""

    def setup_method(self):
        self.engine = MonteCarloEngine()

    def test_simulation_returns_correct_count(self):
        result = self.engine.run_simulation(
            investment_amount=50_000_000,
            sector="mining",
            num_simulations=1000,
            scenario="base",
            years=5,
        )
        assert len(result["outcomes"]) == 1000

    def test_simulation_stats_structure(self):
        result = self.engine.run_simulation(
            investment_amount=50_000_000,
            sector="mining",
            num_simulations=5000,
            scenario="base",
            years=5,
        )
        stats = result["statistics"]
        assert "mean" in stats
        assert "median" in stats
        assert "std" in stats
        assert "percentile_5" in stats
        assert "percentile_95" in stats
        assert "var_95" in stats

    def test_optimistic_better_than_pessimistic(self):
        optimistic = self.engine.run_simulation(
            investment_amount=50_000_000,
            sector="mining",
            num_simulations=5000,
            scenario="optimistic",
            years=5,
        )
        pessimistic = self.engine.run_simulation(
            investment_amount=50_000_000,
            sector="mining",
            num_simulations=5000,
            scenario="pessimistic",
            years=5,
        )
        assert (
            optimistic["statistics"]["mean"] > pessimistic["statistics"]["mean"]
        )

    def test_var_less_than_mean(self):
        result = self.engine.run_simulation(
            investment_amount=50_000_000,
            sector="agriculture",
            num_simulations=5000,
            scenario="base",
            years=5,
        )
        stats = result["statistics"]
        assert stats["var_95"] <= stats["mean"]

    def test_larger_investment_larger_outcomes(self):
        small = self.engine.run_simulation(
            investment_amount=10_000_000,
            sector="tourism",
            num_simulations=5000,
            scenario="base",
            years=5,
        )
        large = self.engine.run_simulation(
            investment_amount=100_000_000,
            sector="tourism",
            num_simulations=5000,
            scenario="base",
            years=5,
        )
        assert large["statistics"]["mean"] > small["statistics"]["mean"]

    def test_distribution_stats_consistency(self):
        result = self.engine.run_simulation(
            investment_amount=50_000_000,
            sector="manufacturing",
            num_simulations=10000,
            scenario="base",
            years=5,
        )
        stats = result["statistics"]
        assert stats["percentile_5"] <= stats["percentile_25"]
        assert stats["percentile_25"] <= stats["median"]
        assert stats["median"] <= stats["percentile_75"]
        assert stats["percentile_75"] <= stats["percentile_95"]
