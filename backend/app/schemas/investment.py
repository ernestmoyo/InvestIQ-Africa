"""Investment, Sector, SEZ, and MacroIndicator schemas."""
from typing import Optional, List
from datetime import date, datetime
from pydantic import BaseModel, ConfigDict, Field


class SectorResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    name: str
    code: str
    description: Optional[str] = None
    avg_return_rate: Optional[float] = None
    risk_score: Optional[float] = None
    growth_rate_5yr: Optional[float] = None
    contribution_to_gdp: Optional[float] = None
    employment_multiplier: Optional[float] = None
    priority_sector: bool = False


class SEZResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    name: str
    location_province: str
    total_area_hectares: Optional[float] = None
    occupied_percentage: Optional[float] = None
    incentive_package: Optional[dict] = None
    target_sectors: Optional[list] = None
    total_investment_attracted: Optional[float] = None
    total_jobs_created: Optional[int] = None


class MacroIndicatorResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    indicator_name: str
    value: float
    period: date
    source: Optional[str] = None
    unit: Optional[str] = None


class InvestmentBase(BaseModel):
    project_name: str
    investor_name: Optional[str] = None
    investor_country: Optional[str] = None
    sector_id: Optional[str] = None
    investment_amount_usd: float = Field(gt=0)
    jobs_projected: Optional[int] = None
    licence_type: Optional[str] = None
    status: str = "inquiry"
    province: Optional[str] = None
    district: Optional[str] = None
    local_content_percentage: float = 0
    technology_transfer: bool = False
    export_oriented: bool = False


class InvestmentCreate(InvestmentBase):
    pass


class InvestmentUpdate(BaseModel):
    project_name: Optional[str] = None
    investor_name: Optional[str] = None
    investment_amount_usd: Optional[float] = None
    jobs_created: Optional[int] = None
    status: Optional[str] = None
    date_approved: Optional[date] = None
    date_operational: Optional[date] = None
    local_content_percentage: Optional[float] = None


class InvestmentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    project_name: str
    investor_name: Optional[str] = None
    investor_country: Optional[str] = None
    investment_amount_usd: float
    jobs_created: int = 0
    jobs_projected: Optional[int] = None
    licence_type: Optional[str] = None
    status: str
    province: Optional[str] = None
    district: Optional[str] = None
    local_content_percentage: float = 0
    technology_transfer: bool = False
    export_oriented: bool = False
    date_received: Optional[date] = None
    date_approved: Optional[date] = None
    created_at: Optional[datetime] = None


class InvestmentListResponse(BaseModel):
    items: List[InvestmentResponse]
    total: int
    page: int
    per_page: int


class InvestmentFilters(BaseModel):
    sector: Optional[str] = None
    status: Optional[str] = None
    province: Optional[str] = None
    min_amount: Optional[float] = None
    max_amount: Optional[float] = None
