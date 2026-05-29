import secrets
from pathlib import Path

from fastapi import HTTPException, status

ALLOWED_CONTENT_TYPES = frozenset({"image/jpeg", "image/png", "image/webp"})
EXTENSION_BY_MIME = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}


def sniff_image_mime(content: bytes) -> str | None:
    if len(content) < 12:
        return None
    if content[:3] == b"\xff\xd8\xff":
        return "image/jpeg"
    if content[:8] == b"\x89PNG\r\n\x1a\n":
        return "image/png"
    if content[:4] == b"RIFF" and content[8:12] == b"WEBP":
        return "image/webp"
    return None


def validate_upload(content: bytes, declared_type: str, max_bytes: int) -> str:
    if len(content) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Arquivo excede o limite de {max_bytes // (1024 * 1024)} MB",
        )
    if declared_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Formato não suportado. Use JPG, PNG ou WebP.",
        )
    detected = sniff_image_mime(content)
    if detected is None or detected != declared_type:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Conteúdo do arquivo não corresponde a uma imagem válida (JPG, PNG ou WebP).",
        )
    return detected


def safe_storage_name(original_name: str, content_type: str) -> str:
    ext = EXTENSION_BY_MIME.get(content_type, ".bin")
    stem = Path(original_name).stem[:40] if original_name else "image"
    safe_stem = "".join(c if c.isalnum() or c in "-_" else "-" for c in stem).strip("-_") or "img"
    token = secrets.token_hex(8)
    return f"{safe_stem}-{token}{ext}"
