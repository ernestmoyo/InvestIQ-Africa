"""Investment impact calculation service."""
import numpy as np
from typing import Optional, Dict, List
from sqlalchemy.orm import Session

from app.models.investment import SpecialEconomicZone
from app.models.sector import Sector
from app.ml.multiplier_model import MultiplierModel
from app.ml.monte_carlo import MonteCarloEngine


class InvestmentImpactCalculator:
    SECTOR_CODE_MAP = {
        "MIN": "mining", "AGR": "agriculture", "TOU": "tourism", "MAN": "manufacturing",
        "ICT": "ict", "ENR": "energy", "INF": "infrastructure", "FIN": "financial_services", "HLT": "health",
    }
    REVENUE_DEFAULTS = {
        "mining": {"growth": 0.08, "op_ratio": 0.65, "ramp_years": 3},
        "agriculture": {"growth": 0.06, "op_ratio": 0.60, "ramp_years": 2},
        "tourism": {"growth": 0.10, "op_ratio": 0.55, "ramp_years": 2},
        "manufacturing": {"growth": 0.07, "op_ratio": 0.65, "ramp_years": 3},
        "ict": {"growth": 0.15, "op_ratio": 0.50, "ramp_years": 1},
        "energy": {"growth": 0.05, "op_ratio": 0.70, "ramp_years": 4},
        "infrastructure": {"growth": 0.06, "op_ratio": 0.60, "ramp_years": 3},
        "financial_services": {"growth": 0.10, "op_ratio": 0.45, "ramp_years": 1},
        "health": {"growth": 0.08, "op_ratio": 0.55, "ramp_years": 2},
    }

    def __init__(self, db: Session):
        self.db = db
        self.multiplier = MultiplierModel()
        self.monte_carlo = MonteCarloEngine()

    def _resolve_sector(self, sector: str) -> str:
        return self.SECTOR_CODE_MAP.get(sector.upper(), sector.lower())

    def calculate_job_creation(self, investment_amount, sector, province, is_sez=False) -> Dict:
        s = self._resolve_sector(sector)
        result = self.multiplier.calculate_job_creation(investment_amount, s)
        if is_sez:
            result["total_jobs"] = int(result["total_jobs"] * 1.1)
            result["direct_jobs"] = int(result["direct_jobs"] * 1.1)
        result["province"] = province
        result["sector"] = s
        return result

    def calculate_gdp_contribution(self, investment_amount, sector, years=10) -> Dict:
        s = self._resolve_sector(sector)
        impact = self.multiplier.calculate_total_impact(investment_amount, s)
        tax = self.multiplier.calculate_tax_revenue(investment_amount, s)
        defaults = self.REVENUE_DEFAULTS.get(s, {"growth": 0.08, "op_ratio": 0.60, "ramp_years": 3})
        year_by_year = []
        cumulative = 0
        for y in range(1, years + 1):
            ramp = min(y / defaults["ramp_years"], 1.0)
            annual = impact["total_output"] * 0.1 * ramp * (1 + defaults["growth"]) ** y
            cumulative += annual
            year_by_year.append({"year": y, "gdp": round(annual, 2), "cumulative": round(cumulative, 2)})
        return {
            "direct_gdp": round(impact["direct"]["direct_output"] * 0.1, 2),
            "multiplier_effect": round(impact["total_output"] * 0.1 - impact["direct"]["direct_output"] * 0.1, 2),
            "total_gdp": round(impact["total_output"] * 0.1, 2),
            "tax_revenue": tax,
            "forex_generation": round(investment_amount * 0.3, 2),
            "year_by_year": year_by_year,
        }

    def run_monte_carlo_simulation(self, investment_amount, sector, num_simulations=10000, scenario="base") -> Dict:
        s = self._resolve_sector(sector)
        return self.monte_carlo.run_simulation(investment_amount, s, num_simulations, scenario)

    def calculate_sez_incentive_impact(self, investment_amount, sez_id, sector, years=10) -> Dict:
        s = self._resolve_sector(sector)
        sez = self.db.query(SpecialEconomicZone).filter(SpecialEconomicZone.id == sez_id).first()
        incentives = sez.incentive_package if sez else {}
        tax_with = self.multiplier.calculate_tax_revenue(investment_amount, s, is_sez=True, sez_incentives=incentives)
        tax_without = self.multiplier.calculate_tax_revenue(investment_amount, s, is_sez=False)
        tax_savings = tax_without["total_tax"] - tax_with["total_tax"]
        return {
            "with_incentive": tax_with, "without_incentive": tax_without,
            "annual_tax_savings": round(tax_savings, 2),
            "total_savings_over_period": round(tax_savings * min(incentives.get("tax_holiday_years", 5), years), 2),
            "sez_name": sez.name if sez else "N/A",
            "incentive_package": incentives,
        }

    def generate_roi_timeline(self, investment_amount, sector, revenue_assumptions=None) -> Dict:
        s = self._resolve_sector(sector)
        defaults = self.REVENUE_DEFAULTS.get(s, {"growth": 0.08, "op_ratio": 0.60, "ramp_years": 3})
        growth = revenue_assumptions.get("growth_rate", defaults["growth"]) if revenue_assumptions else defaults["growth"]
        op_ratio = revenue_assumptions.get("op_cost_ratio", defaults["op_ratio"]) if revenue_assumptions else defaults["op_ratio"]
        discount_rate = revenue_assumptions.get("discount_rate", 0.10) if revenue_assumptions else 0.10
        ramp = defaults["ramp_years"]
        years, capex_list, revenue_list, opex_list, cf_list, cum_cf = [], [], [], [], [], []
        base_revenue = investment_amount * 0.25
        cumulative = -investment_amount
        for y in range(0, 11):
            if y == 0:
                years.append(y); capex_list.append(-investment_amount); revenue_list.append(0)
                opex_list.append(0); cf_list.append(-investment_amount); cum_cf.append(cumulative)
                continue
            ramp_factor = min(y / ramp, 1.0)
            rev = base_revenue * ramp_factor * (1 + growth) ** y
            opex = rev * op_ratio
            cf = rev - opex
            cumulative += cf
            years.append(y); capex_list.append(0); revenue_list.append(round(rev, 2))
            opex_list.append(round(opex, 2)); cf_list.append(round(cf, 2)); cum_cf.append(round(cumulative, 2))
        breakeven = next((y for y, c in zip(years, cum_cf) if c > 0), 10)
        npv_values = {}
        for rate in [0.08, 0.10, 0.12, 0.15]:
            npv = sum(cf / (1 + rate) ** y for y, cf in zip(years, cf_list))
            npv_values[f"{int(rate*100)}%"] = round(npv, 2)
        try:
            irr = np.irr(cf_list) if hasattr(np, 'irr') else self._calc_irr(cf_list)
        except Exception:
            irr = self._calc_irr(cf_list)
        return {
            "years": years, "capex": capex_list, "revenue": revenue_list,
            "opex": opex_list, "cash_flow": cf_list, "cumulative_cash_flow": cum_cf,
            "npv": npv_values, "irr": round(irr * 100, 2), "breakeven_year": breakeven,
        }

    def _calc_irr(self, cashflows, iterations=100):
        rate = 0.1
        for _ in range(iterations):
            npv = sum(cf / (1 + rate) ** i for i, cf in enumerate(cashflows))
            dnpv = sum(-i * cf / (1 + rate) ** (i + 1) for i, cf in enumerate(cashflows))
            if abs(dnpv) < 1e-10:
                break
            rate -= npv / dnpv
        return max(min(rate, 1.0), -0.5)

    def get_sector_benchmarks(self) -> List[Dict]:
        sectors = self.db.query(Sector).all()
        return [{
            "name": s.name, "code": s.code, "avg_return": s.avg_return_rate,
            "risk_score": s.risk_score, "employment_multiplier": s.employment_multiplier,
            "gdp_contribution": s.contribution_to_gdp, "growth_rate": s.growth_rate_5yr,
        } for s in sectors]

    def generate_comprehensive_report(self, investment_amount, sector, province, is_sez=False, sez_id=None) -> Dict:
        jobs = self.calculate_job_creation(investment_amount, sector, province, is_sez)
        gdp = self.calculate_gdp_contribution(investment_amount, sector)
        mc = self.run_monte_carlo_simulation(investment_amount, sector, 5000)
        roi = self.generate_roi_timeline(investment_amount, sector)
        result = {"job_creation": jobs, "gdp_contribution": gdp, "monte_carlo": mc["statistics"], "roi_timeline": roi}
        if is_sez and sez_id:
            result["sez_impact"] = self.calculate_sez_incentive_impact(investment_amount, sez_id, sector)
        return result
