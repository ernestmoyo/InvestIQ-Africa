"""Investor profile and investment opportunity models."""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Boolean, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base


def gen_uuid():
    return str(uuid.uuid4())


class InvestorProfile(Base):
    """Investor profiles for matching engine."""
    __tablename__ = "investor_profiles"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    company_name = Column(String(255), nullable=False)
    country_of_origin = Column(String(100))
    investor_type = Column(String(50))  # corporate, private_equity, sovereign_fund, dfi, individual
    sectors_of_interest = Column(JSON)  # List of sector codes
    investment_range_min = Column(Float)
    investment_range_max = Column(Float)
    risk_appetite = Column(String(20))  # low, medium, high
    geographic_preferences = Column(JSON)  # List of provinces
    previous_africa_investments = Column(Boolean, default=False)
    previous_zimbabwe_investments = Column(Boolean, default=False)
    sez_interest = Column(Boolean, default=False)
    jv_preference = Column(Boolean, default=False)
    local_partner_required = Column(Boolean, default=False)
    inquiry_text = Column(Text)
    engagement_score = Column(Float, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)


class InvestmentOpportunity(Base):
    """Available investment opportunities in Zimbabwe."""
    __tablename__ = "investment_opportunities"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    sector_id = Column(String(36), ForeignKey("sectors.id"), nullable=True)
    province = Column(String(100))
    district = Column(String(100))
    minimum_investment = Column(Float)
    maximum_investment = Column(Float)
    expected_return_rate = Column(Float)
    risk_level = Column(String(20))  # low, medium, high
    sez_id = Column(String(36), ForeignKey("special_economic_zones.id"), nullable=True)
    jv_available = Column(Boolean, default=False)
    local_partner_available = Column(Boolean, default=False)
    incentives = Column(JSON)
    status = Column(String(50))  # available, under_negotiation, committed
    tags = Column(JSON)  # greenfield, brownfield, expansion, privatisation
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)

    sector = relationship("Sector", back_populates="opportunities")
