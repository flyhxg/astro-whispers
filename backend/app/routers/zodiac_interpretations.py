from sqlalchemy import func
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..dependencies import get_current_user

router = APIRouter(prefix='/api/zodiac-interpretations', tags=['zodiac'])


@router.get('', response_model=list[schemas.ZodiacInterpretationResponse])
def list_interpretations(db: Session = Depends(get_db)):
    records = (
        db.query(models.ZodiacInterpretation)
        .order_by(models.ZodiacInterpretation.id)
        .all()
    )
    return records


@router.get('/{sign}', response_model=schemas.ZodiacInterpretationResponse)
def get_interpretation(sign: str, db: Session = Depends(get_db)):
    record = (
        db.query(models.ZodiacInterpretation)
        .filter(func.lower(models.ZodiacInterpretation.sign) == sign.lower())
        .first()
    )
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Interpretation not found')
    return record


@router.post('', response_model=schemas.ZodiacInterpretationResponse, status_code=status.HTTP_201_CREATED)
def create_interpretation(
    payload: schemas.ZodiacInterpretationCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    existing = (
        db.query(models.ZodiacInterpretation)
        .filter(func.lower(models.ZodiacInterpretation.sign) == payload.sign.lower())
        .first()
    )
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Interpretation already exists')
    record = models.ZodiacInterpretation(
        sign=payload.sign,
        title=payload.title,
        date_range=payload.date_range,
        element=payload.element,
        modality=payload.modality,
        keywords=payload.keywords,
        summary=payload.summary,
        love=payload.love,
        career=payload.career,
        wellbeing=payload.wellbeing,
        ritual=payload.ritual,
        mantra=payload.mantra,
        lucky_color=payload.lucky_color,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.put('/{sign}', response_model=schemas.ZodiacInterpretationResponse)
def update_interpretation(
    sign: str,
    payload: schemas.ZodiacInterpretationUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    record = (
        db.query(models.ZodiacInterpretation)
        .filter(func.lower(models.ZodiacInterpretation.sign) == sign.lower())
        .first()
    )
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Interpretation not found')

    record.title = payload.title
    record.date_range = payload.date_range
    record.element = payload.element
    record.modality = payload.modality
    record.keywords = payload.keywords
    record.summary = payload.summary
    record.love = payload.love
    record.career = payload.career
    record.wellbeing = payload.wellbeing
    record.ritual = payload.ritual
    record.mantra = payload.mantra
    record.lucky_color = payload.lucky_color

    db.commit()
    db.refresh(record)
    return record
