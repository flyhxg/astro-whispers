from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..auth import hash_password, verify_password, create_access_token
from ..database import get_db

router = APIRouter(prefix='/api/auth', tags=['auth'])


@router.post('/register', response_model=schemas.UserResponse)
def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.email == user_in.email).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Email already registered')
    user = models.User(
        email=user_in.email,
        password_hash=hash_password(user_in.password),
        name=user_in.name,
        birth_date=user_in.birth_date,
        birth_time=user_in.birth_time,
        birth_place=user_in.birth_place
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post('/login', response_model=schemas.Token)
def login(login_req: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == login_req.email).first()
    if not user or not verify_password(login_req.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Incorrect email or password')
    token = create_access_token(user_id=user.id, email=user.email, expires_delta=timedelta(minutes=60))
    return schemas.Token(access_token=token)

