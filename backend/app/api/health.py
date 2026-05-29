from fastapi import APIRouter, HTTPException

from app.db.session import check_db_connection, is_database_configured

router = APIRouter()


@router.get("/health/db")
def health_db() -> dict[str, str]:
    if not is_database_configured():
        return {"status": "skipped", "database": "not_configured"}

    ok, detail = check_db_connection()
    if ok:
        return {"status": "ok", "database": "connected"}

    raise HTTPException(
        status_code=503,
        detail={
            "status": "error",
            "database": detail,
        },
    )
