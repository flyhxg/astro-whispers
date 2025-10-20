from datetime import datetime, timedelta
from typing import Optional

import jwt
from passlib.context import CryptContext

from .config import get_settings

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
settings = get_settings()


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, hashed: str) -> bool:
    return pwd_context.verify(password, hashed)


def create_access_token(user_id: int, email: str, expires_delta: Optional[timedelta] = None) -> str:
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.access_token_expire_minutes))
    payload = {'sub': email, 'uid': user_id, 'exp': expire}
    return jwt.encode(payload, settings.secret_key, algorithm='HS256')


def decode_token(token: str):
    return jwt.decode(token, settings.secret_key, algorithms=['HS256'])

