from pathlib import Path

from app.spa import resolve_spa_directory


def test_resolve_spa_directory_prefers_frontend_subfolder(tmp_path: Path, monkeypatch) -> None:
    static = tmp_path / "static"
    frontend = static / "frontend"
    frontend.mkdir(parents=True)
    (frontend / "index.html").write_text("<html></html>", encoding="utf-8")
    (static / "index.html").write_text("<html>legacy</html>", encoding="utf-8")

    import app.spa as spa_module

    monkeypatch.setattr(spa_module, "_STATIC_ROOT", static)
    assert resolve_spa_directory() == frontend


def test_resolve_spa_directory_legacy_root_index(tmp_path: Path, monkeypatch) -> None:
    static = tmp_path / "static"
    static.mkdir()
    (static / "index.html").write_text("<html></html>", encoding="utf-8")

    import app.spa as spa_module

    monkeypatch.setattr(spa_module, "_STATIC_ROOT", static)
    assert resolve_spa_directory() == static


def test_resolve_spa_directory_missing(tmp_path: Path, monkeypatch) -> None:
    static = tmp_path / "static"
    static.mkdir()

    import app.spa as spa_module

    monkeypatch.setattr(spa_module, "_STATIC_ROOT", static)
    assert resolve_spa_directory() is None
