from typing import Union
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file='.env', 
        env_file_encoding='utf-8',
        extra='ignore')

    app_title: str = "App Backend Server"
    app_description: str = "Backend server for the dashboard app built on fastapi"

    host: str = "0.0.0.0"
    port: int = 7000

    database_url: str
    sambanova_api_key: str
    auth0_domain: str
    auth0_audience: str

    @classmethod
    @field_validator("database_url", "sambanova_api_key", "auth0_domain", "auth0_audience")
    def check_not_empty(cls, v):
        assert v != "", f"{v} is not defined"
        return v

settings = Settings()