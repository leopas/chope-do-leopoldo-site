"""Smoke agregado — critérios CRP-010 (complementa testes por domínio)."""

from pathlib import Path


def test_health_db_connected_when_database_seeded(seeded_client) -> None:
    response = seeded_client.get("/api/health/db")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    assert body["database"] == "connected"


def test_public_menu_and_campaign_slug(seeded_client) -> None:
    menu = seeded_client.get("/api/public/menu")
    assert menu.status_code == 200
    assert menu.json()["settings"]["businessName"]

    campaign = seeded_client.get("/api/public/campaigns/karaoke-sexta")
    assert campaign.status_code == 200
    assert campaign.json()["slug"] == "karaoke-sexta"


def test_runtime_has_no_ods_or_datamart() -> None:
    """Gate: regra de ouro do projeto — sem ODS/Datamart no backend app."""
    app_dir = Path(__file__).resolve().parents[1] / "app"
    forbidden = ("datamart", "ods_datamart")
    for py_file in app_dir.rglob("*.py"):
        content = py_file.read_text(encoding="utf-8").lower()
        for term in forbidden:
            assert term not in content, f"{term} encontrado em {py_file.relative_to(app_dir)}"
