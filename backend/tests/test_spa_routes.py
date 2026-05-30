"""Smoke HTTP das rotas SPA (CRP-009/010)."""

from pathlib import Path

from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.main import _register_spa_routes


def test_spa_fallback_routes(tmp_path: Path) -> None:
    spa = tmp_path / "frontend"
    spa.mkdir()
    (spa / "index.html").write_text(
        '<html><body><div id="root">SPA OK</div></body></html>',
        encoding="utf-8",
    )
    assets = spa / "assets"
    assets.mkdir()
    (assets / "app.js").write_text("console.log(1)", encoding="utf-8")

    test_app = FastAPI()
    _register_spa_routes(test_app, spa)
    client = TestClient(test_app)

    for path in ("/", "/menu", "/admin/login", "/lp/karaoke-sexta"):
        response = client.get(path)
        assert response.status_code == 200, path
        assert "SPA OK" in response.text

    assert client.get("/assets/app.js").status_code == 200
    assert client.get("/api/foo").status_code == 404
