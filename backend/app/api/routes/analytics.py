"""Predictive analytics endpoints."""
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.sector import Sector
from app.models.investment import SpecialEconomicZone
from app.models.indicator import MacroeconomicIndicator
from app.services.predictive_analytics import PredictiveAnalyticsService
from app.schemas.analytics import PortfolioOptimisationRequest

router = APIRouter(prefix="/analytics", tags=["Predictive Analytics"])


@router.get("/dashboard-summary")
def dashboard_summary(db: Session = Depends(get_db)):
    """Aggregated dashboard KPI data."""
    service = PredictiveAnalyticsService(db)
    return service.get_dashboard_summary()


@router.get("/fdi-forecast")
def fdi_forecast(sector: Optional[str] = None, horizon: int = Query(24, ge=1, le=60), db: Session = Depends(get_db)):
    """FDI forecast with confidence intervals."""
    service = PredictiveAnalyticsService(db)
    sector_id = None
    if sector:
        s = db.query(Sector).filter(Sector.code == sector.upper()).first()
        sector_id = s.id if s else None
    return service.forecast_fdi_trends(sector_id, horizon)


@router.get("/sector-risk-return")
def sector_risk_return(db: Session = Depends(get_db)):
    """Sector risk-return profiles."""
    service = PredictiveAnalyticsService(db)
    return service.compute_sector_risk_return()


@router.post("/portfolio-optimisation")
def portfolio_optimisation(request: PortfolioOptimisationRequest, db: Session = Depends(get_db)):
    """Optimize portfolio allocation across sectors."""
    service = PredictiveAnalyticsService(db)
    return service.optimise_portfolio_allocation(request.total_budget, request.risk_tolerance)


@router.get("/investment-patterns")
def investment_patterns(db: Session = Depends(get_db)):
    """Investment clustering patterns."""
    service = PredictiveAnalyticsService(db)
    return service.detect_investment_patterns()


@router.get("/trend-decomposition")
def trend_decomposition(indicator: str = Query("fdi_inflow"), db: Session = Depends(get_db)):
    """Decompose indicator trends into components."""
    service = PredictiveAnalyticsService(db)
    return service.get_trend_decomposition(indicator)


@router.get("/sectors")
def list_sectors(db: Session = Depends(get_db)):
    """List all sectors."""
    return [{"id": str(s.id), "name": s.name, "code": s.code, "description": s.description,
             "avg_return_rate": s.avg_return_rate, "risk_score": s.risk_score,
             "growth_rate_5yr": s.growth_rate_5yr, "contribution_to_gdp": s.contribution_to_gdp,
             "employment_multiplier": s.employment_multiplier, "priority_sector": s.priority_sector}
            for s in db.query(Sector).all()]


@router.get("/sez")
def list_sez(db: Session = Depends(get_db)):
    """List all Special Economic Zones."""
    return [{"id": str(s.id), "name": s.name, "location_province": s.location_province,
             "total_area_hectares": s.total_area_hectares, "occupied_percentage": s.occupied_percentage,
             "incentive_package": s.incentive_package, "target_sectors": s.target_sectors,
             "total_investment_attracted": s.total_investment_attracted, "total_jobs_created": s.total_jobs_created}
            for s in db.query(SpecialEconomicZone).all()]


@router.get("/macro-indicators")
def list_macro_indicators(indicator: Optional[str] = None, db: Session = Depends(get_db)):
    """List macroeconomic indicators."""
    query = db.query(MacroeconomicIndicator)
    if indicator:
        query = query.filter(MacroeconomicIndicator.indicator_name == indicator)
    results = query.order_by(MacroeconomicIndicator.period).all()
    return [{"id": str(r.id), "indicator_name": r.indicator_name, "value": r.value,
             "period": str(r.period), "source": r.source, "unit": r.unit} for r in results]
