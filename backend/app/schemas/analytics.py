"""Analytics and dashboard schemas."""
from typing import Optional, List, Dict
from pydantic import BaseModel, Field


class FDIForecastRequest(BaseModel):
    sector_id: Optional[str] = None
    horizon_months: int = Field(default=24, ge=1, le=60)
    confidence_interval: float = Field(default=0.95, ge=0.5, le=0.99)


class ForecastPoint(BaseModel):
    date: str
    value: float
    lower_bound: Optional[float] = None
    upper_bound: Optional[float] = None
    is_forecast: bool = False


class FDIForecastResponse(BaseModel):
    predictions: List[ForecastPoint]
    trend_component: List[float] = []
    seasonal_component: List[float] = []
    key_drivers: List[str] = []
    model_accuracy: Optional[float] = None


class SectorRiskReturn(BaseModel):
    sector_name: str
    sector_code: str
    avg_return: float
    volatility: float
    sharpe_ratio: float
    beta: float
    total_investment: float
    investment_count: int


class PortfolioOptimisationRequest(BaseModel):
    total_budget: float = Field(gt=0)
    risk_tolerance: str = "moderate"  # conservative, moderate, aggressive
    constraints: Optional[Dict] = None


class AllocationItem(BaseModel):
    sector: str
    sector_code: str
    amount: float
    percentage: float
    expected_return: float


class PortfolioAllocation(BaseModel):
    allocations: List[AllocationItem]
    expected_portfolio_return: float
    portfolio_risk: float
    sharpe_ratio: float


class EfficientFrontierPoint(BaseModel):
    risk: float
    expected_return: float


class InvestmentPattern(BaseModel):
    cluster_id: int
    pattern_name: str
    description: str
    investment_count: int
    avg_amount: float
    top_sectors: List[str]
    top_origins: List[str]


class DashboardSummary(BaseModel):
    total_fdi_ytd: float
    active_investments: int
    total_jobs: int
    pending_inquiries: int
    sector_breakdown: List[Dict]
    monthly_trend: List[Dict]
    top_investors: List[Dict]
    province_distribution: List[Dict] = []


class TrendDecomposition(BaseModel):
    dates: List[str]
    trend: List[float]
    seasonal: List[float]
    residual: List[float]
