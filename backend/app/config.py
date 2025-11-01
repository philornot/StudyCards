from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    app_name: str = "Study Cards API"
    database_url: str = "postgresql://postgres:postgres@localhost:5432/studycards"

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings():
    return Settings()