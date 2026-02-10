"""Economic multiplier calculations calibrated to Zimbabwe's economy.

Sources: ZIMSTAT National Accounts, World Bank Development Indicators, RBZ Reports.
"""
import numpy as np
from typing import Dict, Optional


class MultiplierModel:
    """Calculates direct, indirect, and induced economic impacts of investments."""

    SECTOR_MULTIPLIERS = {
        "mining": {"output": 2.1, "employment": 1.8, "income": 1.6, "tax": 0.12},
        "agriculture": {"output": 2.4, "employment": 3.2, "income": 1.9, "tax": 0.08},
        "manufacturing": {"output": 2.3, "employment": 2.5, "income": 2.0, "tax": 0.15},
        "tourism": {"output": 2.0, "employment": 2.8, "income": 1.7, "tax": 0.10},
        "ict": {"output": 1.8, "employment": 1.5, "income": 2.2, "tax": 0.18},
        "energy": {"output": 2.5, "employment": 1.4, "income": 1.5, "tax": 0.14},
        "infrastructure": {"output": 2.7, "employment": 3.0, "income": 2.1, "tax": 0.11},
        "financial_services": {"output": 1.9, "employment": 1.3, "income": 2.3, "tax": 0.20},
        "health": {"output": 2.2, "employment": 2.0, "income": 1.8, "tax": 0.09},
    }

    JOBS_PER_MILLION = {
        "mining": 4.2, "agriculture": 8.5, "manufacturing": 5.8, "tourism": 7.2,
        "ict": 3.5, "energy": 2.8, "infrastructure": 6.5,
        "financial_services": 2.2, "health": 4.0,
    }

    SKILLS_DISTRIBUTION = {
        "mining": {"unskilled": 30, "semi_skilled": 35, "skilled": 25, "professional": 10},
        "agriculture": {"unskilled": 45, "semi_skilled": 30, "skilled": 18, "professional": 7},
        "manufacturing": {"unskilled": 25, "semi_skilled": 40, "skilled": 25, "professional": 10},
        "tourism": {"unskilled": 35, "semi_skilled": 35, "skilled": 20, "professional": 10},
        "ict": {"unskilled": 5, "semi_skilled": 15, "skilled": 45, "professional": 35},
        "energy": {"unskilled": 20, "semi_skilled": 30, "skilled": 35, "professional": 15},
        "infrastructure": {"unskilled": 40, "semi_skilled": 30, "skilled": 20, "professional": 10},
        "financial_services": {"unskilled": 5, "semi_skilled": 20, "skilled": 40, "professional": 35},
        "health": {"unskilled": 15, "semi_skilled": 25, "skilled": 35, "professional": 25},
    }

    STANDARD_CORPORATE_TAX = 0.2575
    SEZ_TAX_HOLIDAY_RATE = 0.0
    SEZ_POST_HOLIDAY_RATE = 0.15

    def _validate_sector(self, sector: str) -> str:
        sector = sector.lower().replace(" ", "_").replace("&", "and")
        if sector not in self.SECTOR_MULTIPLIERS:
            raise ValueError(f"Unknown sector: {sector}. Valid: {list(self.SECTOR_MULTIPLIERS.keys())}")
        return sector

    def calculate_direct_impact(self, amount: float, sector: str) -> Dict:
        sector = self._validate_sector(sector)
        if amount <= 0:
            return {"direct_output": 0, "direct_jobs": 0, "sector": sector}
        millions = amount / 1_000_000
        jobs = int(round(millions * self.JOBS_PER_MILLION[sector]))
        return {
            "direct_output": amount,
            "direct_jobs": jobs,
            "sector": sector,
            "investment_amount": amount,
        }

    def calculate_indirect_impact(self, amount: float, sector: str) -> Dict:
        sector = self._validate_sector(sector)
        m = self.SECTOR_MULTIPLIERS[sector]
        supply_chain_factor = (m["output"] - 1) * 0.6
        indirect_output = amount * supply_chain_factor
        direct_jobs = int(round((amount / 1_000_000) * self.JOBS_PER_MILLION[sector]))
        indirect_jobs = int(round(direct_jobs * (m["employment"] - 1) * 0.55))
        return {
            "indirect_output": indirect_output,
            "indirect_jobs": indirect_jobs,
            "supply_chain_factor": supply_chain_factor,
        }

    def calculate_induced_impact(self, amount: float, sector: str) -> Dict:
        sector = self._validate_sector(sector)
        m = self.SECTOR_MULTIPLIERS[sector]
        induced_factor = (m["income"] - 1) * 0.4
        induced_output = amount * induced_factor
        direct_jobs = int(round((amount / 1_000_000) * self.JOBS_PER_MILLION[sector]))
        indirect_jobs = int(round(direct_jobs * (m["employment"] - 1) * 0.55))
        induced_jobs = int(round((direct_jobs + indirect_jobs) * induced_factor * 0.5))
        return {
            "induced_output": induced_output,
            "induced_jobs": induced_jobs,
            "induced_factor": induced_factor,
        }

    def calculate_total_impact(self, amount: float, sector: str) -> Dict:
        direct = self.calculate_direct_impact(amount, sector)
        indirect = self.calculate_indirect_impact(amount, sector)
        induced = self.calculate_induced_impact(amount, sector)
        total_output = direct["direct_output"] + indirect["indirect_output"] + induced["induced_output"]
        return {
            "direct": direct,
            "indirect": indirect,
            "induced": induced,
            "total_output": total_output,
            "output_multiplier": total_output / amount if amount > 0 else 0,
        }

    def calculate_job_creation(self, amount: float, sector: str) -> Dict:
        sector = self._validate_sector(sector)
        direct = self.calculate_direct_impact(amount, sector)
        indirect = self.calculate_indirect_impact(amount, sector)
        induced = self.calculate_induced_impact(amount, sector)
        direct_jobs = direct["direct_jobs"]
        indirect_jobs = indirect["indirect_jobs"]
        induced_jobs = induced["induced_jobs"]
        total_jobs = direct_jobs + indirect_jobs + induced_jobs
        skills = self.SKILLS_DISTRIBUTION.get(sector, self.SKILLS_DISTRIBUTION["manufacturing"])
        gender_female_pct = 0.40 if sector in ("tourism", "agriculture", "health") else 0.30
        return {
            "direct_jobs": direct_jobs,
            "indirect_jobs": indirect_jobs,
            "induced_jobs": induced_jobs,
            "total_jobs": total_jobs,
            "skills_distribution": skills,
            "gender_split": {
                "male": round((1 - gender_female_pct) * 100, 1),
                "female": round(gender_female_pct * 100, 1),
            },
            "construction_phase": int(total_jobs * 0.3),
            "operational_phase": int(total_jobs * 0.7),
        }

    def calculate_tax_revenue(
        self, amount: float, sector: str, is_sez: bool = False,
        sez_incentives: Optional[Dict] = None,
    ) -> Dict:
        sector = self._validate_sector(sector)
        m = self.SECTOR_MULTIPLIERS[sector]
        annual_revenue = amount * m["output"] * 0.3
        if is_sez and sez_incentives:
            corp_rate = sez_incentives.get("corporate_tax_rate", self.SEZ_TAX_HOLIDAY_RATE)
        elif is_sez:
            corp_rate = self.SEZ_TAX_HOLIDAY_RATE
        else:
            corp_rate = self.STANDARD_CORPORATE_TAX
        profit_margin = 0.15
        corporate_tax = annual_revenue * profit_margin * corp_rate
        vat = annual_revenue * 0.075
        jobs = self.calculate_job_creation(amount, sector)
        avg_salary = 8000
        paye = jobs["direct_jobs"] * avg_salary * 0.25
        withholding = annual_revenue * 0.02
        return {
            "corporate_tax": round(corporate_tax, 2),
            "vat": round(vat, 2),
            "paye": round(paye, 2),
            "withholding": round(withholding, 2),
            "total_tax": round(corporate_tax + vat + paye + withholding, 2),
            "effective_rate": round(m["tax"], 4),
        }
