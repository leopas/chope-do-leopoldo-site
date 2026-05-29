from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from app.core.config import get_settings

# PNG 1×1 válido
MINI_PNG = (
    b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01"
    b"\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc\xf8\x0f"
    b"\x00\x00\x01\x01\x00\x05\x18\xd8N\x00\x00\x00\x00IEND\xaeB`\x82"
)


@pytest.fixture
def uploads_tmp(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> Path:
    upload_dir = tmp_path / "uploads"
    upload_dir.mkdir()
    monkeypatch.setenv("UPLOADS_DIR", str(upload_dir))
    get_settings.cache_clear()
    yield upload_dir
    get_settings.cache_clear()


def test_media_upload_creates_asset_and_file(
    seeded_client: TestClient, uploads_tmp: Path, admin_headers: dict[str, str]
) -> None:
    response = seeded_client.post(
        "/api/admin/media/upload",
        files={"file": ("foto-produto.png", MINI_PNG, "image/png")},
        data={"alt": "Caneco de chope", "type": "product"},
        headers=admin_headers,
    )
    assert response.status_code == 201
    body = response.json()
    assert body["url"].startswith("/uploads/")
    assert body["alt"] == "Caneco de chope"
    assert body["type"] == "product"

    filename = body["url"].split("/")[-1]
    assert (uploads_tmp / filename).is_file()

    listed = seeded_client.get("/api/admin/media", headers=admin_headers).json()
    assert any(m["id"] == body["id"] for m in listed)

    seeded_client.delete(f"/api/admin/media/{body['id']}", headers=admin_headers)
    assert not (uploads_tmp / filename).is_file()


def test_media_upload_rejects_invalid_mime(
    seeded_client: TestClient, uploads_tmp: Path, admin_headers: dict[str, str]
) -> None:
    del uploads_tmp  # fixture side effect only
    response = seeded_client.post(
        "/api/admin/media/upload",
        files={"file": ("doc.txt", b"hello", "text/plain")},
        data={"type": "product"},
        headers=admin_headers,
    )
    assert response.status_code == 415


def test_media_upload_rejects_mismatched_content(
    seeded_client: TestClient, uploads_tmp: Path, admin_headers: dict[str, str]
) -> None:
    del uploads_tmp
    response = seeded_client.post(
        "/api/admin/media/upload",
        files={"file": ("fake.png", b"not-a-png", "image/png")},
        data={"type": "product"},
        headers=admin_headers,
    )
    assert response.status_code == 415
