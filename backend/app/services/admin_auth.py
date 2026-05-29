from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import Settings, get_settings
from app.core.security import create_access_token, hash_password, verify_password
from app.models.admin_user import AdminUser
from app.schemas.auth import AdminUserOut, LoginResponse

ADMIN_USER_ID = "admin-default"


def seed_admin_user(db: Session, settings: Settings | None = None) -> None:
    cfg = settings or get_settings()
    email = (cfg.admin_initial_email or "").strip().lower()
    password = cfg.admin_initial_password or ""
    if not email or not password:
        return

    row = db.get(AdminUser, ADMIN_USER_ID)
    if row is None:
        row = AdminUser(
            id=ADMIN_USER_ID,
            email=email,
            password_hash=hash_password(password),
            full_name="Administrador",
            is_active=True,
        )
        db.add(row)
    else:
        row.email = email
        row.password_hash = hash_password(password)
        row.is_active = True
    db.commit()


def _user_out(user: AdminUser) -> AdminUserOut:
    return AdminUserOut(id=user.id, email=user.email, full_name=user.full_name)


def authenticate(db: Session, email: str, password: str) -> LoginResponse:
    settings = get_settings()
    if not settings.jwt_secret:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Autenticação não configurada (JWT_SECRET ausente)",
        )

    normalized = email.strip().lower()
    user = db.scalar(select(AdminUser).where(AdminUser.email == normalized))
    if user is None or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha inválidos",
        )
    if not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha inválidos",
        )

    token = create_access_token(user.id, settings)
    return LoginResponse(
        access_token=token,
        expires_in=settings.jwt_expires_minutes * 60,
        user=_user_out(user),
    )


def get_admin_by_id(db: Session, user_id: str) -> AdminUser:
    user = db.get(AdminUser, user_id)
    if user is None or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário não autorizado",
        )
    return user


def ensure_admin_user_exists(db: Session) -> None:
    """Cria admin a partir do env se ainda não existir nenhum usuário."""
    existing = db.scalar(select(AdminUser.id).limit(1))
    if existing is not None:
        return
    seed_admin_user(db)
