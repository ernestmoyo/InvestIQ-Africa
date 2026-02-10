"""Investment CRUD endpoints."""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.investment import Investment
from app.models.sector import Sector
from app.schemas.investment import InvestmentCreate, InvestmentUpdate, InvestmentResponse, InvestmentListResponse
from app.api.dependencies import PaginationParams

router = APIRouter(prefix="/investments", tags=["Investments"])


@router.get("/stats/summary")
def investment_stats(db: Session = Depends(get_db)):
    """Quick investment statistics."""
    total = db.query(func.count(Investment.id)).scalar() or 0
    total_amount = db.query(func.sum(Investment.investment_amount_usd)).scalar() or 0
    active = db.query(func.count(Investment.id)).filter(Investment.status == "active").scalar() or 0
    approved = db.query(func.count(Investment.id)).filter(Investment.status == "approved").scalar() or 0
    inquiry = db.query(func.count(Investment.id)).filter(Investment.status == "inquiry").scalar() or 0
    return {"total": total, "total_amount": total_amount, "active": active, "approved": approved, "inquiry": inquiry}


@router.get("/by-sector")
def investments_by_sector(db: Session = Depends(get_db)):
    """Investments grouped by sector."""
    results = db.query(Sector.name, Sector.code, func.sum(Investment.investment_amount_usd), func.count(Investment.id)
    ).join(Investment, Investment.sector_id == Sector.id).group_by(Sector.name, Sector.code).all()
    return [{"sector": r[0], "code": r[1], "total_amount": r[2] or 0, "count": r[3]} for r in results]


@router.get("/by-province")
def investments_by_province(db: Session = Depends(get_db)):
    """Investments grouped by province."""
    results = db.query(Investment.province, func.sum(Investment.investment_amount_usd), func.count(Investment.id)
    ).group_by(Investment.province).all()
    return [{"province": r[0] or "N/A", "total_amount": r[1] or 0, "count": r[2]} for r in results]


@router.get("/", response_model=InvestmentListResponse)
def list_investments(
    sector: Optional[str] = None, status: Optional[str] = None, province: Optional[str] = None,
    min_amount: Optional[float] = None, max_amount: Optional[float] = None,
    pagination: PaginationParams = Depends(), db: Session = Depends(get_db),
):
    """List investments with filtering and pagination."""
    query = db.query(Investment)
    if sector:
        sec = db.query(Sector).filter(Sector.code == sector.upper()).first()
        if sec:
            query = query.filter(Investment.sector_id == sec.id)
    if status:
        query = query.filter(Investment.status == status)
    if province:
        query = query.filter(Investment.province == province)
    if min_amount:
        query = query.filter(Investment.investment_amount_usd >= min_amount)
    if max_amount:
        query = query.filter(Investment.investment_amount_usd <= max_amount)
    total = query.count()
    items = query.order_by(Investment.investment_amount_usd.desc()).offset(pagination.offset).limit(pagination.per_page).all()
    return {"items": items, "total": total, "page": pagination.page, "per_page": pagination.per_page}


@router.get("/{investment_id}", response_model=InvestmentResponse)
def get_investment(investment_id: str, db: Session = Depends(get_db)):
    """Get a single investment by ID."""
    inv = db.query(Investment).filter(Investment.id == investment_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investment not found")
    return inv


@router.post("/", response_model=InvestmentResponse, status_code=201)
def create_investment(data: InvestmentCreate, db: Session = Depends(get_db)):
    """Create a new investment record."""
    inv = Investment(**data.model_dump())
    db.add(inv)
    db.commit()
    db.refresh(inv)
    return inv


@router.put("/{investment_id}", response_model=InvestmentResponse)
def update_investment(investment_id: str, data: InvestmentUpdate, db: Session = Depends(get_db)):
    """Update an investment record."""
    inv = db.query(Investment).filter(Investment.id == investment_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investment not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(inv, key, value)
    db.commit()
    db.refresh(inv)
    return inv
