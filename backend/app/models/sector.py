"""Sector model for Zimbabwe economic sectors."""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Boolean, Text, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base


class Sector(Base):
    """Zimbabwe investment sectors aligned with ZIDA priority areas."""
    __tablename__ = "sectors"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    code = Column(String(10), unique=True, nullable=False)
    description = Column(Text)
    avg_return_rate = Column(Float)
    risk_score = Column(Float)  # 0-100
    growth_rate_5yr = Column(Float)
    contribution_to_gdp = Column(Float)
    employment_multiplier = Column(Float)
    priority_sector = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    investments = relationship("Investment", back_populates="sector")
    opportunities = relationship("InvestmentOpportunity", back_populates="sector")
