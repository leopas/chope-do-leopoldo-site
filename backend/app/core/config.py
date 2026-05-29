from functools import lru_cache
from pathlib import Path

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

    media_storage_provider: str = Field(default="local", alias="MEDIA_STORAGE_PROVIDER")
    max_upload_mb: int = Field(default=5, alias="MAX_UPLOAD_MB")
    uploads_dir: str | None = Field(default=None, alias="UPLOADS_DIR")
    azure_storage_connection_string: str | None = Field(
        default=None, alias="AZURE_STORAGE_CONNECTION_STRING"
    )
    azure_storage_container: str = Field(
        default="chope-media", alias="AZURE_STORAGE_CONTAINER"
    )
    azure_storage_account_url: str | None = Field(
        default=None, alias="AZURE_STORAGE_ACCOUNT_URL"
    )

    @property
    def max_upload_bytes(self) -> int:
        return self.max_upload_mb * 1024 * 1024

    @property
    def uploads_path(self) -> Path:
        if self.uploads_dir:
            return Path(self.uploads_dir)
        return Path(__file__).resolve().parent.parent / "static" / "uploads"

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
