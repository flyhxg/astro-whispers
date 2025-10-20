from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import schemas
from ..dependencies import get_current_user
from ..database import get_db

router = APIRouter(prefix='/api/users', tags=['users'])


@router.get('/me', response_model=schemas.UserResponse)
def read_profile(current_user=Depends(get_current_user)):
    return current_user

