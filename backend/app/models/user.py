"""User model for authentication and RBAC."""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime
from app.database import Base


def gen_uuid():
    return str(uuid.uuid4())


class User(Base):
    """Platform users with role-based access control."""
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255))
    role = Column(String(50), default="public")  # admin, analyst, investor, public
    is_active = Column(Boolean, default=True)
    organization = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)
