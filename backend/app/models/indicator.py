"""Macroeconomic indicator model."""
import uuid
from datetime import datetime, date
from sqlalchemy import Column, String, Float, Date, DateTime
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base


class MacroeconomicIndicator(Base):
    """Zimbabwe macroeconomic indicators from ZIMSTAT, RBZ, World Bank, IMF."""
    __tablename__ = "macroeconomic_indicators"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    indicator_name = Column(String(100), nullable=False)
    value = Column(Float, nullable=False)
    period = Column(Date, nullable=False)
    source = Column(String(100))
    unit = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)
