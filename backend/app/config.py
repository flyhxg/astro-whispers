from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "AstroWhispers API"
    secret_key: str = "super-secret-key"
    access_token_expire_minutes: int = 60 * 24
    database_url: str = "sqlite+pysqlite:///./astro.db"

    class Config:
        env_file = '.env'


@lru_cache()
def get_settings() -> Settings:
    return Settings()
