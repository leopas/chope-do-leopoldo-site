from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_env: str = Field(default="local", alias="APP_ENV")
    app_name: str = Field(default="chope-do-leopoldo-site", alias="APP_NAME")
    api_prefix: str = Field(default="/api", alias="API_PREFIX")
    cors_allowed_origins: str = Field(
        default="http://localhost:5173,http://localhost:8000",
        alias="CORS_ALLOWED_ORIGINS",
    )
    database_url: str | None = Field(default=None, alias="DATABASE_URL")
    db_ssl_enabled: bool = Field(default=False, alias="DB_SSL_ENABLED")
    db_ssl_ca_path: str | None = Field(default=None, alias="DB_SSL_CA_PATH")
    db_ssl_mode: str = Field(default="verify-full", alias="DB_SSL_MODE")

    @property
    def database_configured(self) -> bool:
        return bool(self.database_url and self.database_url.strip())

    @property
    def cors_origins_list(self) -> list[str]:
        return [
            origin.strip()
            for origin in self.cors_allowed_origins.split(",")
            if origin.strip()
        ]


@lru_cache
def get_settings() -> Settings:
    return Settings()
