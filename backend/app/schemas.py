from datetime import date, time, datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr


class Token(BaseModel):
    access_token: str
    token_type: str = 'bearer'


class TokenData(BaseModel):
    user_id: int
    email: EmailStr


class UserBase(BaseModel):
    email: EmailStr
    name: str
    birth_date: date
    birth_time: Optional[time]
    birth_place: Optional[str]


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ReportSection(BaseModel):
    id: str
    title: str
    summary: str
    details: List[str]


class AstrologyReportPayload(BaseModel):
    generated_at: datetime
    sign: str
    sun: str
    moon: str
    rising: str
    sections: List[ReportSection]


class ZodiacReportPayload(BaseModel):
    generated_at: datetime
    zodiac: str
    element: str
    summary: str
    year: int
    sections: List[ReportSection]


class AstrologyReportResponse(BaseModel):
    id: int
    report_type: str
    generated_at: datetime
    payload: AstrologyReportPayload

    class Config:
        from_attributes = True


class ZodiacReportResponse(BaseModel):
    id: int
    year: int
    generated_at: datetime
    payload: ZodiacReportPayload

    class Config:
        from_attributes = True


class ArticleBase(BaseModel):
    title: str
    summary: Optional[str]
    cover_url: Optional[str]
    tags: List[str] = []
    content: str
    status: str = 'draft'


class ArticleCreate(ArticleBase):
    pass


class ArticleResponse(ArticleBase):
    id: int
    slug: str
    published_at: datetime

    class Config:
        from_attributes = True


class ZodiacInterpretationBase(BaseModel):
    title: str
    date_range: str
    element: str
    modality: str
    keywords: List[str]
    summary: str
    love: str
    career: str
    wellbeing: str
    ritual: str
    mantra: str
    lucky_color: str


class ZodiacInterpretationCreate(ZodiacInterpretationBase):
    sign: str


class ZodiacInterpretationUpdate(ZodiacInterpretationBase):
    pass


class ZodiacInterpretationResponse(ZodiacInterpretationBase):
    id: int
    sign: str
    updated_at: datetime

    class Config:
        from_attributes = True

