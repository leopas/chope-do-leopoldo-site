from app.core.config import Settings, get_settings
from app.services.storage.base import MediaStorage, StorageResult
from app.services.storage.local_storage import LocalStorage


def get_media_storage(settings: Settings | None = None) -> MediaStorage:
    cfg = settings or get_settings()
    provider = (cfg.media_storage_provider or "local").strip().lower()
    if provider == "azure_blob":
        from app.services.storage.azure_blob_storage import AzureBlobStorage

        return AzureBlobStorage(cfg)
    return LocalStorage(cfg)


__all__ = ["MediaStorage", "StorageResult", "get_media_storage", "LocalStorage"]
