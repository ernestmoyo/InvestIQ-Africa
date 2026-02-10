"""AI-powered investment matching engine."""
from typing import List, Dict, Optional
from sqlalchemy.orm import Session

from app.models.investor import InvestorProfile, InvestmentOpportunity
from app.models.sector import Sector
from app.models.investment import Investment
from app.ml.recommender import InvestmentRecommender
from app.ml.nlp_processor import NLPProcessor


class InvestmentMatchingEngine:
    def __init__(self, db: Session):
        self.db = db
        self.recommender = InvestmentRecommender()
        self.nlp = NLPProcessor()

    def _profile_to_dict(self, p: InvestorProfile) -> Dict:
        return {
            "id": str(p.id), "company_name": p.company_name, "country_of_origin": p.country_of_origin,
            "investor_type": p.investor_type, "sectors_of_interest": p.sectors_of_interest or [],
            "investment_range_min": p.investment_range_min or 0, "investment_range_max": p.investment_range_max or 1e12,
            "risk_appetite": p.risk_appetite, "geographic_preferences": p.geographic_preferences or [],
            "sez_interest": p.sez_interest, "jv_preference": p.jv_preference,
            "previous_zimbabwe_investments": p.previous_zimbabwe_investments,
            "inquiry_text": p.inquiry_text or "",
        }

    def _opp_to_dict(self, o: InvestmentOpportunity) -> Dict:
        sector = self.db.query(Sector).filter(Sector.id == o.sector_id).first()
        return {
            "id": str(o.id), "title": o.title, "description": o.description or "",
            "sector_code": sector.code.lower() if sector else "", "province": o.province or "",
            "minimum_investment": o.minimum_investment or 0, "maximum_investment": o.maximum_investment or 1e12,
            "expected_return_rate": o.expected_return_rate or 0, "risk_level": o.risk_level,
            "sez_id": str(o.sez_id) if o.sez_id else None, "jv_available": o.jv_available,
            "tags": o.tags or [],
        }

    def match_investor_to_opportunities(self, investor_id, top_n=10) -> List[Dict]:
        investor = self.db.query(InvestorProfile).filter(InvestorProfile.id == investor_id).first()
        if not investor:
            return []
        opportunities = self.db.query(InvestmentOpportunity).filter(
            InvestmentOpportunity.status == "available").all()
        inv_dict = self._profile_to_dict(investor)
        opp_dicts = [self._opp_to_dict(o) for o in opportunities]
        ranked = self.recommender.rank_opportunities(inv_dict, opp_dicts)
        return ranked[:top_n]

    def match_opportunity_to_investors(self, opportunity_id, top_n=10) -> List[Dict]:
        opp = self.db.query(InvestmentOpportunity).filter(InvestmentOpportunity.id == opportunity_id).first()
        if not opp:
            return []
        investors = self.db.query(InvestorProfile).all()
        opp_dict = self._opp_to_dict(opp)
        inv_dicts = [self._profile_to_dict(i) for i in investors]
        ranked = self.recommender.rank_investors(opp_dict, inv_dicts)
        return ranked[:top_n]

    def analyse_investor_inquiry(self, inquiry_text: str) -> Dict:
        return self.nlp.full_analysis(inquiry_text)

    def build_similarity_network(self) -> Dict:
        investments = self.db.query(Investment).limit(50).all()
        opportunities = self.db.query(InvestmentOpportunity).limit(20).all()
        nodes, edges = [], []
        for inv in investments:
            sector = self.db.query(Sector).filter(Sector.id == inv.sector_id).first()
            nodes.append({
                "id": str(inv.id), "label": inv.project_name, "type": "investment",
                "cluster": hash(sector.code) % 5 if sector else 0, "size": inv.investment_amount_usd / 1e9,
            })
        for opp in opportunities:
            sector = self.db.query(Sector).filter(Sector.id == opp.sector_id).first()
            nodes.append({
                "id": str(opp.id), "label": opp.title, "type": "opportunity",
                "cluster": hash(sector.code) % 5 if sector else 0, "size": (opp.maximum_investment or 1e7) / 1e9,
            })
        for i, n1 in enumerate(nodes):
            for j, n2 in enumerate(nodes):
                if i < j and n1["cluster"] == n2["cluster"]:
                    edges.append({"source": n1["id"], "target": n2["id"], "weight": 0.7})
        clusters = [{"id": c, "name": f"Cluster {c}", "count": sum(1 for n in nodes if n["cluster"] == c)} for c in set(n["cluster"] for n in nodes)]
        return {"nodes": nodes, "edges": edges[:100], "clusters": clusters}

    def compute_match_score(self, investor_id, opportunity_id) -> Dict:
        investor = self.db.query(InvestorProfile).filter(InvestorProfile.id == investor_id).first()
        opp = self.db.query(InvestmentOpportunity).filter(InvestmentOpportunity.id == opportunity_id).first()
        if not investor or not opp:
            return {"overall_score": 0, "breakdown": {}}
        scores = self.recommender.compute_match_score(self._profile_to_dict(investor), self._opp_to_dict(opp))
        explanation = self.recommender.explain_match(self._profile_to_dict(investor), self._opp_to_dict(opp), scores)
        return {**scores, "explanation": explanation}

    def get_proactive_recommendations(self) -> List[Dict]:
        investors = self.db.query(InvestorProfile).limit(20).all()
        opportunities = self.db.query(InvestmentOpportunity).filter(InvestmentOpportunity.status == "available").all()
        results = []
        for investor in investors:
            inv_dict = self._profile_to_dict(investor)
            best_score, best_opp = 0, None
            for opp in opportunities:
                opp_dict = self._opp_to_dict(opp)
                score = self.recommender.compute_match_score(inv_dict, opp_dict)
                if score["overall_score"] > best_score:
                    best_score = score["overall_score"]
                    best_opp = opp
            if best_opp and best_score > 40:
                results.append({
                    "investor_id": str(investor.id), "investor_name": investor.company_name,
                    "opportunity_id": str(best_opp.id), "opportunity_title": best_opp.title,
                    "match_score": best_score, "reason": f"Strong alignment based on sector and investment size preferences",
                })
        return sorted(results, key=lambda x: x["match_score"], reverse=True)[:10]
