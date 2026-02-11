"""Macroeconomic indicator model."""
import uuid
from datetime import datetime, date
from sqlalchemy import Column, String, Float, Date, DateTime
from app.database import Base


def gen_uuid():
    return str(uuid.uuid4())


class MacroeconomicIndicator(Base):
    """Zimbabwe macroeconomic indicators from ZIMSTAT, RBZ, World Bank, IMF."""
    __tablename__ = "macroeconomic_indicators"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    indicator_name = Column(String(100), nullable=False)
    value = Column(Float, nullable=False)
    period = Column(Date, nullable=False)
    source = Column(String(100))
    unit = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)
