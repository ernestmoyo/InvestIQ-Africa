"""Tests for the economic multiplier model."""
import pytest
from app.ml.multiplier_model import MultiplierModel


class TestMultiplierModel:
    """Test economic multiplier calculations with known outputs."""

    def setup_method(self):
        self.model = MultiplierModel()

    def test_direct_impact_mining(self):
        result = self.model.calculate_direct_impact(100_000_000, "mining")
        assert result["direct_output"] > 0
        assert result["direct_jobs"] > 0
        assert result["sector"] == "mining"

    def test_direct_impact_agriculture(self):
        result = self.model.calculate_direct_impact(50_000_000, "agriculture")
        assert result["direct_output"] > 0
        # Agriculture should have higher employment multiplier than mining
        mining_result = self.model.calculate_direct_impact(50_000_000, "mining")
        assert result["direct_jobs"] > mining_result["direct_jobs"]

    def test_total_impact_includes_all_components(self):
        result = self.model.calculate_total_impact(100_000_000, "manufacturing")
        assert "direct" in result
        assert "indirect" in result
        assert "induced" in result
        assert "total_output" in result
        assert result["total_output"] > result["direct"]["direct_output"]

    def test_job_creation_structure(self):
        result = self.model.calculate_job_creation(100_000_000, "tourism")
        assert "direct_jobs" in result
        assert "indirect_jobs" in result
        assert "induced_jobs" in result
        assert "total_jobs" in result
        assert result["total_jobs"] == (
            result["direct_jobs"] + result["indirect_jobs"] + result["induced_jobs"]
        )

    def test_job_creation_skills_distribution(self):
        result = self.model.calculate_job_creation(100_000_000, "ict")
        assert "skills_distribution" in result
        skills = result["skills_distribution"]
        total_pct = sum(skills.values())
        assert abs(total_pct - 100.0) < 0.1

    def test_tax_revenue_calculation(self):
        result = self.model.calculate_tax_revenue(
            100_000_000, "manufacturing", is_sez=False
        )
        assert result["corporate_tax"] > 0
        assert result["vat"] > 0
        assert result["paye"] > 0
        assert result["total_tax"] > 0

    def test_sez_tax_benefits(self):
        standard = self.model.calculate_tax_revenue(
            100_000_000, "manufacturing", is_sez=False
        )
        sez = self.model.calculate_tax_revenue(
            100_000_000,
            "manufacturing",
            is_sez=True,
            sez_incentives={"corporate_tax_rate": 0.0, "tax_holiday_years": 5},
        )
        assert sez["corporate_tax"] < standard["corporate_tax"]

    def test_zero_investment_returns_zero(self):
        result = self.model.calculate_direct_impact(0, "mining")
        assert result["direct_output"] == 0
        assert result["direct_jobs"] == 0

    def test_invalid_sector_raises_error(self):
        with pytest.raises((KeyError, ValueError)):
            self.model.calculate_direct_impact(100_000_000, "invalid_sector")

    def test_multiplier_values_reasonable(self):
        """Verify multipliers are within economically reasonable ranges."""
        for sector, multipliers in MultiplierModel.SECTOR_MULTIPLIERS.items():
            assert 1.0 <= multipliers["output"] <= 4.0, (
                f"{sector} output multiplier out of range"
            )
            assert 1.0 <= multipliers["employment"] <= 5.0, (
                f"{sector} employment multiplier out of range"
            )
