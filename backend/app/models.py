from datetime import datetime
from sqlalchemy import Column, Integer, String, Date, Time, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from .database import Base


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    name = Column(String(120), nullable=False)
    birth_date = Column(Date, nullable=False)
    birth_time = Column(Time, nullable=True)
    birth_place = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    astrology_reports = relationship('AstrologyReport', back_populates='user')
    zodiac_reports = relationship('ZodiacReport', back_populates='user')


class AstrologyReport(Base):
    __tablename__ = 'astrology_reports'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    report_type = Column(String(32), nullable=False)
    generated_at = Column(DateTime, default=datetime.utcnow)
    payload = Column(JSONB, nullable=False)

    user = relationship('User', back_populates='astrology_reports')


class ZodiacReport(Base):
    __tablename__ = 'zodiac_reports'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    year = Column(Integer, nullable=False)
    generated_at = Column(DateTime, default=datetime.utcnow)
    payload = Column(JSONB, nullable=False)

    user = relationship('User', back_populates='zodiac_reports')


class Article(Base):
    __tablename__ = 'articles'

    id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False)
    summary = Column(String(800), nullable=True)
    cover_url = Column(String(512), nullable=True)
    tags = Column(JSONB, default=list)
    content = Column(Text, nullable=False)
    author_id = Column(Integer, ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    published_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String(32), default='draft')

