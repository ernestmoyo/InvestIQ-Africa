"""Investment and Special Economic Zone models."""
import uuid
from datetime import datetime, date
from sqlalchemy import Column, String, Float, Integer, Boolean, Text, Date, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base


def gen_uuid():
    return str(uuid.uuid4())


class Investment(Base):
    """Investment records from ZIDA licensing data."""
    __tablename__ = "investments"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    project_name = Column(String(255), nullable=False)
    investor_name = Column(String(255))
    investor_country = Column(String(100))
    sector_id = Column(String(36), ForeignKey("sectors.id"), nullable=True)
    investment_amount_usd = Column(Float, nullable=False)
    jobs_created = Column(Integer, default=0)
    jobs_projected = Column(Integer)
    licence_type = Column(String(50))  # investment_licence, special_licence, sez_permit
    status = Column(String(50))  # inquiry, approved, active, completed, withdrawn
    sez_id = Column(String(36), ForeignKey("special_economic_zones.id"), nullable=True)
    date_received = Column(Date)
    date_approved = Column(Date, nullable=True)
    date_operational = Column(Date, nullable=True)
    province = Column(String(100))
    district = Column(String(100))
    local_content_percentage = Column(Float, default=0)
    technology_transfer = Column(Boolean, default=False)
    export_oriented = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)

    sector = relationship("Sector", back_populates="investments")
    sez = relationship("SpecialEconomicZone", back_populates="investments")


class SpecialEconomicZone(Base):
    """Zimbabwe Special Economic Zones."""
    __tablename__ = "special_economic_zones"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    name = Column(String(255), nullable=False)
    location_province = Column(String(100))
    total_area_hectares = Column(Float)
    occupied_percentage = Column(Float)
    incentive_package = Column(JSON)
    target_sectors = Column(JSON)  # List of sector codes
    total_investment_attracted = Column(Float, default=0)
    total_jobs_created = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    investments = relationship("Investment", back_populates="sez")
