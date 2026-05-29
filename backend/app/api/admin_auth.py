from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.api.deps import require_admin
from app.db.session import get_public_db
from app.models.admin_user import AdminUser
from app.schemas.auth import AdminUserOut, LoginRequest, LoginResponse
from app.services import admin_auth as auth_service

router = APIRouter(prefix="/admin/auth", tags=["admin-auth"])


@router.post("/login", response_model=LoginResponse)
def admin_login(
    body: LoginRequest, db: Session = Depends(get_public_db)
) -> LoginResponse:
    auth_service.ensure_admin_user_exists(db)
    return auth_service.authenticate(db, body.email, body.password)


@router.get("/me", response_model=AdminUserOut)
def admin_me(current_user: AdminUser = Depends(require_admin)) -> AdminUserOut:
    return AdminUserOut(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
    )


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def admin_logout() -> Response:
    """Logout stateless — o cliente descarta o JWT."""
    return Response(status_code=status.HTTP_204_NO_CONTENT)
