"""Dashboard aggregation endpoints."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.investment import Investment
from app.models.sector import Sector
from app.services.predictive_analytics import PredictiveAnalyticsService

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/summary")
def dashboard_overview(db: Session = Depends(get_db)):
    """Dashboard overview KPIs."""
    service = PredictiveAnalyticsService(db)
    return service.get_dashboard_summary()


@router.get("/fdi-trend")
def fdi_trend(db: Session = Depends(get_db)):
    """Monthly FDI trend data with forecast."""
    service = PredictiveAnalyticsService(db)
    return service.forecast_fdi_trends(horizon_months=12)


@router.get("/sector-heatmap")
def sector_heatmap(db: Session = Depends(get_db)):
    """Sector investment concentration data."""
    results = db.query(
        Sector.name, Sector.code,
        func.sum(Investment.investment_amount_usd),
        func.count(Investment.id),
        func.sum(Investment.jobs_created),
    ).join(Investment, Investment.sector_id == Sector.id).group_by(Sector.name, Sector.code).all()
    return [{"sector": r[0], "code": r[1], "investment": r[2] or 0, "count": r[3], "jobs": r[4] or 0} for r in results]


@router.get("/province-distribution")
def province_distribution(db: Session = Depends(get_db)):
    """Investment distribution by province."""
    results = db.query(
        Investment.province, func.sum(Investment.investment_amount_usd), func.count(Investment.id),
    ).group_by(Investment.province).all()
    return [{"province": r[0] or "N/A", "value": r[1] or 0, "count": r[2]} for r in results]


@router.get("/recent-activity")
def recent_activity(db: Session = Depends(get_db)):
    """Recent investment activity."""
    recent = db.query(Investment).order_by(Investment.created_at.desc()).limit(10).all()
    return [{"project_name": r.project_name, "investor_name": r.investor_name,
             "status": r.status, "amount": r.investment_amount_usd,
             "date": str(r.date_received) if r.date_received else None} for r in recent]


@router.get("/top-investors")
def top_investors(db: Session = Depends(get_db)):
    """Top investors by amount."""
    results = db.query(Investment).order_by(Investment.investment_amount_usd.desc()).limit(10).all()
    items = []
    for inv in results:
        sector = db.query(Sector).filter(Sector.id == inv.sector_id).first()
        items.append({
            "name": inv.investor_name or inv.project_name, "country": inv.investor_country or "N/A",
            "amount": inv.investment_amount_usd, "sector": sector.name if sector else "N/A",
            "status": inv.status,
        })
    return items
