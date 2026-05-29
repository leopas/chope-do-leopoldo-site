from dataclasses import dataclass
from typing import Protocol

from app.models.media_asset import StorageProvider


@dataclass(frozen=True)
class StorageResult:
    url: str
    blob_name: str
    storage_provider: StorageProvider


class MediaStorage(Protocol):
    def save(self, content: bytes, content_type: str, original_name: str) -> StorageResult: ...

    def delete(self, blob_name: str) -> None: ...
