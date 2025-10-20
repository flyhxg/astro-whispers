from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..dependencies import get_current_user
from ..services.reports import generate_astrology_report, generate_zodiac_report
from ..services.astro_utils import western_zodiac, chinese_zodiac, five_element_by_year

router = APIRouter(prefix='/api/reports', tags=['reports'])


@router.post('/astrology', response_model=schemas.AstrologyReportResponse)
def create_astrology_report(report_type: str = 'daily', db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    sign = western_zodiac(current_user.birth_date)
    payload = generate_astrology_report(
        sign=sign,
        sun=f'{sign} {datetime.utcnow().day}°',
        moon='双鱼座 02°',
        rising='双子座 11°'
    )

    report = models.AstrologyReport(user_id=current_user.id, report_type=report_type, payload=payload.model_dump())
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


@router.post('/zodiac', response_model=schemas.ZodiacReportResponse)
def create_zodiac_report(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    year = datetime.utcnow().year
    zodiac = chinese_zodiac(current_user.birth_date.year)
    element = five_element_by_year(current_user.birth_date.year)
    payload = generate_zodiac_report(zodiac=zodiac, element=element, year=year)

    report = models.ZodiacReport(user_id=current_user.id, year=year, payload=payload.model_dump())
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


@router.get('/astrology/latest', response_model=list[schemas.AstrologyReportResponse])
def list_astrology_reports(limit: int = 5, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    records = (
        db.query(models.AstrologyReport)
        .filter(models.AstrologyReport.user_id == current_user.id)
        .order_by(models.AstrologyReport.generated_at.desc())
        .limit(limit)
        .all()
    )
    return records


@router.get('/zodiac/latest', response_model=list[schemas.ZodiacReportResponse])
def list_zodiac_reports(limit: int = 5, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    records = (
        db.query(models.ZodiacReport)
        .filter(models.ZodiacReport.user_id == current_user.id)
        .order_by(models.ZodiacReport.generated_at.desc())
        .limit(limit)
        .all()
    )
    return records

