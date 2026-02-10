"""Investment matching endpoints."""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.investor import InvestorProfile, InvestmentOpportunity
from app.schemas.matching import InvestorProfileCreate, InquiryAnalysisRequest
from app.services.matching_engine import InvestmentMatchingEngine

router = APIRouter(prefix="/matching", tags=["Investment Matching"])


@router.post("/investor-to-opportunities/{investor_id}")
def match_investor(investor_id: str, top_n: int = Query(10, ge=1, le=50), db: Session = Depends(get_db)):
    """Match investor to best opportunities."""
    engine = InvestmentMatchingEngine(db)
    return engine.match_investor_to_opportunities(investor_id, top_n)


@router.post("/opportunity-to-investors/{opportunity_id}")
def match_opportunity(opportunity_id: str, top_n: int = Query(10, ge=1, le=50), db: Session = Depends(get_db)):
    """Find best investors for an opportunity."""
    engine = InvestmentMatchingEngine(db)
    return engine.match_opportunity_to_investors(opportunity_id, top_n)


@router.post("/analyse-inquiry")
def analyse_inquiry(request: InquiryAnalysisRequest, db: Session = Depends(get_db)):
    """Analyse investor inquiry text using NLP."""
    engine = InvestmentMatchingEngine(db)
    return engine.analyse_investor_inquiry(request.inquiry_text)


@router.get("/similarity-network")
def similarity_network(db: Session = Depends(get_db)):
    """Get investment similarity network graph data."""
    engine = InvestmentMatchingEngine(db)
    return engine.build_similarity_network()


@router.get("/match-score/{investor_id}/{opportunity_id}")
def match_score(investor_id: str, opportunity_id: str, db: Session = Depends(get_db)):
    """Get detailed match score between investor and opportunity."""
    engine = InvestmentMatchingEngine(db)
    return engine.compute_match_score(investor_id, opportunity_id)


@router.get("/recommendations/proactive")
def proactive_recommendations(db: Session = Depends(get_db)):
    """Get proactive outreach recommendations for ZIDA."""
    engine = InvestmentMatchingEngine(db)
    return engine.get_proactive_recommendations()


@router.get("/investors")
def list_investors(db: Session = Depends(get_db)):
    """List all investor profiles."""
    investors = db.query(InvestorProfile).all()
    return [{"id": str(i.id), "company_name": i.company_name, "country_of_origin": i.country_of_origin,
             "investor_type": i.investor_type, "sectors_of_interest": i.sectors_of_interest,
             "investment_range_min": i.investment_range_min, "investment_range_max": i.investment_range_max,
             "risk_appetite": i.risk_appetite, "engagement_score": i.engagement_score} for i in investors]


@router.post("/investors", status_code=201)
def create_investor(data: InvestorProfileCreate, db: Session = Depends(get_db)):
    """Create an investor profile."""
    investor = InvestorProfile(**data.model_dump())
    db.add(investor)
    db.commit()
    db.refresh(investor)
    return {"id": str(investor.id), "company_name": investor.company_name}


@router.get("/investors/{investor_id}")
def get_investor(investor_id: str, db: Session = Depends(get_db)):
    """Get investor profile."""
    inv = db.query(InvestorProfile).filter(InvestorProfile.id == investor_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investor not found")
    return {"id": str(inv.id), "company_name": inv.company_name, "country_of_origin": inv.country_of_origin,
            "investor_type": inv.investor_type, "sectors_of_interest": inv.sectors_of_interest,
            "investment_range_min": inv.investment_range_min, "investment_range_max": inv.investment_range_max,
            "risk_appetite": inv.risk_appetite, "inquiry_text": inv.inquiry_text}


@router.get("/opportunities")
def list_opportunities(db: Session = Depends(get_db)):
    """List all investment opportunities."""
    opps = db.query(InvestmentOpportunity).all()
    return [{"id": str(o.id), "title": o.title, "description": o.description, "province": o.province,
             "minimum_investment": o.minimum_investment, "maximum_investment": o.maximum_investment,
             "expected_return_rate": o.expected_return_rate, "risk_level": o.risk_level,
             "status": o.status, "tags": o.tags} for o in opps]


@router.get("/opportunities/{opportunity_id}")
def get_opportunity(opportunity_id: str, db: Session = Depends(get_db)):
    """Get opportunity details."""
    opp = db.query(InvestmentOpportunity).filter(InvestmentOpportunity.id == opportunity_id).first()
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    return {"id": str(opp.id), "title": opp.title, "description": opp.description, "province": opp.province,
            "minimum_investment": opp.minimum_investment, "maximum_investment": opp.maximum_investment,
            "expected_return_rate": opp.expected_return_rate, "risk_level": opp.risk_level,
            "status": opp.status, "tags": opp.tags, "incentives": opp.incentives}
