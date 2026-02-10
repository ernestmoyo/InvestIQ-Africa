"""Matching engine schemas."""
from typing import Optional, List, Dict
from pydantic import BaseModel, ConfigDict, Field


class InvestorProfileCreate(BaseModel):
    company_name: str
    country_of_origin: Optional[str] = None
    investor_type: str = "corporate"
    sectors_of_interest: List[str] = []
    investment_range_min: Optional[float] = None
    investment_range_max: Optional[float] = None
    risk_appetite: str = "medium"
    geographic_preferences: List[str] = []
    previous_africa_investments: bool = False
    previous_zimbabwe_investments: bool = False
    sez_interest: bool = False
    jv_preference: bool = False
    local_partner_required: bool = False
    inquiry_text: Optional[str] = None


class InvestorProfileResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    company_name: str
    country_of_origin: Optional[str] = None
    investor_type: str
    sectors_of_interest: Optional[list] = []
    investment_range_min: Optional[float] = None
    investment_range_max: Optional[float] = None
    risk_appetite: str
    engagement_score: float = 0


class OpportunityCreate(BaseModel):
    title: str
    description: Optional[str] = None
    sector_id: Optional[str] = None
    province: Optional[str] = None
    minimum_investment: Optional[float] = None
    maximum_investment: Optional[float] = None
    expected_return_rate: Optional[float] = None
    risk_level: str = "medium"
    jv_available: bool = False
    incentives: Optional[dict] = None
    tags: List[str] = []


class OpportunityResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    title: str
    description: Optional[str] = None
    province: Optional[str] = None
    minimum_investment: Optional[float] = None
    maximum_investment: Optional[float] = None
    expected_return_rate: Optional[float] = None
    risk_level: str
    status: str = "available"
    tags: Optional[list] = []


class MatchScoreBreakdown(BaseModel):
    sector_alignment: float = 0
    size_fit: float = 0
    risk_compatibility: float = 0
    geographic_match: float = 0
    sez_alignment: float = 0
    historical_similarity: float = 0
    semantic_match: float = 0


class MatchResult(BaseModel):
    id: str
    name: str
    overall_score: float
    score_breakdown: MatchScoreBreakdown
    rank: int
    explanation: str


class InquiryAnalysisRequest(BaseModel):
    inquiry_text: str = Field(min_length=10)


class InquiryAnalysisResponse(BaseModel):
    extracted_sectors: List[str]
    investment_size_indicator: Optional[str] = None
    timeline: Optional[str] = None
    concerns: List[str] = []
    inquiry_type: str  # exploratory, serious, ready_to_invest
    sentiment: str  # positive, neutral, negative
    recommended_department: str
    suggested_response: str


class NetworkNode(BaseModel):
    id: str
    label: str
    type: str
    cluster: int = 0
    size: float = 1.0


class NetworkEdge(BaseModel):
    source: str
    target: str
    weight: float


class SimilarityNetworkResponse(BaseModel):
    nodes: List[NetworkNode]
    edges: List[NetworkEdge]
    clusters: List[Dict]


class ProactiveRecommendation(BaseModel):
    investor_id: str
    investor_name: str
    opportunity_id: str
    opportunity_title: str
    match_score: float
    reason: str
