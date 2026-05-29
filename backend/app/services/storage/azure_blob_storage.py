from app.core.config import Settings
from app.models.media_asset import StorageProvider
from app.services.storage.base import StorageResult
from app.services.storage.upload_validation import safe_storage_name

try:
    from azure.storage.blob import BlobServiceClient, ContentSettings
except ImportError:  # pragma: no cover
    BlobServiceClient = None  # type: ignore[misc, assignment]
    ContentSettings = None  # type: ignore[misc, assignment]


class AzureBlobStorage:
    """Storage Azure Blob — ative com MEDIA_STORAGE_PROVIDER=azure_blob."""

    def __init__(self, settings: Settings) -> None:
        if BlobServiceClient is None:
            raise RuntimeError(
                "Pacote azure-storage-blob não instalado. "
                "Adicione-o ao ambiente ou use MEDIA_STORAGE_PROVIDER=local."
            )
        if not settings.azure_storage_connection_string:
            raise RuntimeError("AZURE_STORAGE_CONNECTION_STRING é obrigatório para azure_blob")
        self._container = settings.azure_storage_container
        self._account_url = (settings.azure_storage_account_url or "").rstrip("/")
        self._client = BlobServiceClient.from_connection_string(
            settings.azure_storage_connection_string
        )
        self._container_client = self._client.get_container_client(self._container)

    def save(self, content: bytes, content_type: str, original_name: str) -> StorageResult:
        blob_name = safe_storage_name(original_name, content_type)
        blob = self._container_client.get_blob_client(blob_name)
        blob.upload_blob(
            content,
            overwrite=True,
            content_settings=ContentSettings(content_type=content_type),
        )
        if self._account_url:
            url = f"{self._account_url}/{self._container}/{blob_name}"
        else:
            url = blob.url
        return StorageResult(
            url=url,
            blob_name=blob_name,
            storage_provider=StorageProvider.azure_blob,
        )

    def delete(self, blob_name: str) -> None:
        if not blob_name:
            return
        self._container_client.get_blob_client(blob_name).delete_blob(
            delete_snapshots="include"
        )
