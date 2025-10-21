from typing import Optional

from fastapi import Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from .database import get_db
from .auth import decode_token
from . import models


def get_current_user(authorization: Optional[str] = Header(default=None), db: Session = Depends(get_db)) -> models.User:
    if not authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Authorization header missing')
    if not authorization.startswith('Bearer '):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid token header')
    token = authorization.split(' ', 1)[1]
    try:
        payload = decode_token(token)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Token expired or invalid') from exc
    user = db.get(models.User, payload['uid'])
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='User not found')
    return user

