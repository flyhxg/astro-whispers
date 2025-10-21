from datetime import datetime, timedelta
from typing import Optional

import jwt
from passlib.context import CryptContext

from .config import get_settings

BCRYPT_MAX_BYTES = 72
pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
settings = get_settings()


def _truncate_password(password: str) -> str:
    encoded = password.encode('utf-8')
    if len(encoded) <= BCRYPT_MAX_BYTES:
        return password
    truncated = encoded[:BCRYPT_MAX_BYTES]
    return truncated.decode('utf-8', 'ignore')


def hash_password(password: str) -> str:
    return pwd_context.hash(_truncate_password(password))


def verify_password(password: str, hashed: str) -> bool:
    return pwd_context.verify(_truncate_password(password), hashed)


def create_access_token(user_id: int, email: str, expires_delta: Optional[timedelta] = None) -> str:
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.access_token_expire_minutes))
    payload = {'sub': email, 'uid': user_id, 'exp': expire}
    return jwt.encode(payload, settings.secret_key, algorithm='HS256')


def decode_token(token: str):
    return jwt.decode(token, settings.secret_key, algorithms=['HS256'])

