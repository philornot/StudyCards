from functools import lru_cache

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Study Cards API"
    database_url: str = "sqlite:///./studycards.db"

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings():
    return Settings()
