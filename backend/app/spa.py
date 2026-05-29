"""Resolução do diretório da SPA (Vite build) para servir em produção."""

from pathlib import Path

_STATIC_ROOT = Path(__file__).resolve().parent / "static"


def resolve_spa_directory() -> Path | None:
    """
    Preferência: app/static/frontend (CRP-009 / Docker).
    Fallback: app/static/ com index.html na raiz (build legado).
    """
    frontend = _STATIC_ROOT / "frontend"
    if (frontend / "index.html").is_file():
        return frontend
    if (_STATIC_ROOT / "index.html").is_file():
        return _STATIC_ROOT
    return None
