"""Investment recommendation algorithms for matching engine."""
import numpy as np
from typing import List, Dict, Optional


class InvestmentRecommender:
    """Hybrid recommendation system combining content-based and collaborative filtering."""

    WEIGHTS = {
        "sector_alignment": 25, "size_fit": 20, "risk_compatibility": 15,
        "geographic_match": 10, "sez_alignment": 10,
        "historical_similarity": 10, "semantic_match": 10,
    }

    def _sector_score(self, investor: Dict, opportunity: Dict) -> float:
        inv_sectors = set(s.lower() for s in investor.get("sectors_of_interest", []))
        opp_sector = opportunity.get("sector_code", "").lower()
        if opp_sector in inv_sectors:
            return 25.0
        adjacent = {
            "min": ["enr", "inf"], "agr": ["man", "hlt"], "tou": ["inf", "ict"],
            "man": ["agr", "min"], "ict": ["fin", "man"], "enr": ["min", "inf"],
            "inf": ["enr", "man"], "fin": ["ict", "man"], "hlt": ["agr", "man"],
        }
        adj_sectors = adjacent.get(opp_sector, [])
        if any(s in inv_sectors for s in adj_sectors):
            return 15.0
        return 0.0

    def _size_score(self, investor: Dict, opportunity: Dict) -> float:
        inv_min = investor.get("investment_range_min", 0)
        inv_max = investor.get("investment_range_max", float("inf"))
        opp_min = opportunity.get("minimum_investment", 0)
        opp_max = opportunity.get("maximum_investment", float("inf"))
        overlap_min = max(inv_min, opp_min)
        overlap_max = min(inv_max, opp_max)
        if overlap_min <= overlap_max:
            inv_range = inv_max - inv_min if inv_max != float("inf") else inv_min * 10
            overlap = overlap_max - overlap_min
            ratio = overlap / inv_range if inv_range > 0 else 1.0
            return min(ratio * 20.0, 20.0)
        return 0.0

    def _risk_score(self, investor: Dict, opportunity: Dict) -> float:
        risk_map = {"low": 1, "medium": 2, "high": 3}
        inv_risk = risk_map.get(investor.get("risk_appetite", "medium"), 2)
        opp_risk = risk_map.get(opportunity.get("risk_level", "medium"), 2)
        diff = abs(inv_risk - opp_risk)
        return {0: 15.0, 1: 8.0, 2: 2.0}.get(diff, 0)

    def _geo_score(self, investor: Dict, opportunity: Dict) -> float:
        prefs = [p.lower() for p in investor.get("geographic_preferences", [])]
        if not prefs:
            return 5.0
        opp_prov = opportunity.get("province", "").lower()
        return 10.0 if opp_prov in prefs else 2.0

    def _sez_score(self, investor: Dict, opportunity: Dict) -> float:
        if investor.get("sez_interest") and opportunity.get("sez_id"):
            return 10.0
        if not investor.get("sez_interest") and not opportunity.get("sez_id"):
            return 5.0
        return 2.0

    def compute_match_score(self, investor: Dict, opportunity: Dict) -> Dict:
        scores = {
            "sector_alignment": self._sector_score(investor, opportunity),
            "size_fit": self._size_score(investor, opportunity),
            "risk_compatibility": self._risk_score(investor, opportunity),
            "geographic_match": self._geo_score(investor, opportunity),
            "sez_alignment": self._sez_score(investor, opportunity),
            "historical_similarity": 5.0 + (3.0 if investor.get("previous_zimbabwe_investments") else 0),
            "semantic_match": 5.0,
        }
        total = sum(scores.values())
        return {"overall_score": round(total, 1), "breakdown": scores}

    def explain_match(self, investor: Dict, opportunity: Dict, scores: Dict) -> str:
        breakdown = scores.get("breakdown", {})
        top_factors = sorted(breakdown.items(), key=lambda x: x[1], reverse=True)[:3]
        parts = []
        for factor, score in top_factors:
            label = factor.replace("_", " ").title()
            if score > 0:
                parts.append(f"{label} ({score:.0f}/{self.WEIGHTS[factor]})")
        return f"Top matching factors: {', '.join(parts)}" if parts else "Low overall compatibility"

    def rank_opportunities(self, investor: Dict, opportunities: List[Dict]) -> List[Dict]:
        results = []
        for opp in opportunities:
            scores = self.compute_match_score(investor, opp)
            explanation = self.explain_match(investor, opp, scores)
            results.append({
                "id": opp.get("id", ""),
                "name": opp.get("title", ""),
                "overall_score": scores["overall_score"],
                "score_breakdown": scores["breakdown"],
                "explanation": explanation,
            })
        results.sort(key=lambda x: x["overall_score"], reverse=True)
        for i, r in enumerate(results):
            r["rank"] = i + 1
        return results

    def rank_investors(self, opportunity: Dict, investors: List[Dict]) -> List[Dict]:
        results = []
        for inv in investors:
            scores = self.compute_match_score(inv, opportunity)
            explanation = self.explain_match(inv, opportunity, scores)
            results.append({
                "id": inv.get("id", ""),
                "name": inv.get("company_name", ""),
                "overall_score": scores["overall_score"],
                "score_breakdown": scores["breakdown"],
                "explanation": explanation,
            })
        results.sort(key=lambda x: x["overall_score"], reverse=True)
        for i, r in enumerate(results):
            r["rank"] = i + 1
        return results
