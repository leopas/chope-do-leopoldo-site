from pathlib import Path

from app.core.config import Settings
from app.models.media_asset import StorageProvider
from app.services.storage.base import StorageResult
from app.services.storage.upload_validation import safe_storage_name


class LocalStorage:
    def __init__(self, settings: Settings) -> None:
        self._dir = settings.uploads_path
        self._dir.mkdir(parents=True, exist_ok=True)

    @property
    def directory(self) -> Path:
        return self._dir

    def save(self, content: bytes, content_type: str, original_name: str) -> StorageResult:
        filename = safe_storage_name(original_name, content_type)
        path = self._dir / filename
        path.write_bytes(content)
        return StorageResult(
            url=f"/uploads/{filename}",
            blob_name=filename,
            storage_provider=StorageProvider.local,
        )

    def delete(self, blob_name: str) -> None:
        if not blob_name or ".." in blob_name or "/" in blob_name or "\\" in blob_name:
            return
        path = self._dir / blob_name
        if path.is_file():
            path.unlink()
