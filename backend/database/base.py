"""
File: app/database/base.py

Purpose:
Shared SQLAlchemy base model for Clairva database schemas.
"""

from sqlalchemy.orm import declarative_base

Base = declarative_base()