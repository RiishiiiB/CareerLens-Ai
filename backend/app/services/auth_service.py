from __future__ import annotations

from datetime import UTC, datetime, timedelta

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.security import (
    TokenError,
    create_jti,
    create_jwt_token,
    decode_jwt_token,
    hash_password,
    hash_token,
    verify_password,
)
from app.models.enums import TokenType, UserRole
from app.models.user import User
from app.repositories.auth_repository import RefreshTokenRepository
from app.repositories.user_repository import UserRepository
from app.schemas.auth import (
    AuthResponse,
    LoginRequest,
    RefreshTokenResponse,
    RegisterRequest,
    TokenResponse,
)


class AuthService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.settings = get_settings()
        self.users = UserRepository(db)
        self.refresh_tokens = RefreshTokenRepository(db)

    def register(self, payload: RegisterRequest) -> AuthResponse:
        if self.users.get_by_email(payload.email):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A user with this email already exists",
            )
        if (
            payload.registration_number
            and self.users.get_by_registration_number(payload.registration_number)
        ):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A user with this registration number already exists",
            )

        user = self.users.create(
            {
                "registration_number": payload.registration_number,
                "college_name": payload.college_name,
                "full_name": payload.full_name,
                "email": payload.email.lower(),
                "phone_number": payload.phone_number,
                "department": payload.department,
                "graduation_year": payload.graduation_year,
                "linkedin_url": payload.linkedin_url,
                "github_url": payload.github_url,
                "password_hash": hash_password(payload.password),
                "role": payload.role.value,
                "is_active": True,
            },
        )
        return AuthResponse(user=user, tokens=self._issue_token_pair(user))

    def login(self, payload: LoginRequest) -> AuthResponse:
        user = self.users.get_by_email(payload.email)
        if user is None or not verify_password(payload.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is inactive",
            )
        user.last_login_at = datetime.now(UTC)
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return AuthResponse(user=user, tokens=self._issue_token_pair(user))

    def refresh(self, refresh_token: str) -> RefreshTokenResponse:
        try:
            payload = decode_jwt_token(refresh_token)
        except TokenError as exc:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=str(exc),
            ) from exc

        if payload.get("type") != TokenType.REFRESH.value:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token required",
            )

        stored_token = self.refresh_tokens.get_active_by_hash(
            hash_token(refresh_token),
        )
        if stored_token is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token is invalid or revoked",
            )

        user = self.users.get_by_id(stored_token.user_id)
        if user is None or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User is inactive or no longer exists",
            )

        self.refresh_tokens.revoke(stored_token)
        return self._issue_token_pair(user)

    def logout(self, refresh_token: str) -> None:
        stored_token = self.refresh_tokens.get_active_by_hash(
            hash_token(refresh_token),
        )
        if stored_token is not None:
            self.refresh_tokens.revoke(stored_token)

    def _issue_token_pair(self, user: User) -> TokenResponse:
        access_expires = timedelta(
            minutes=self.settings.access_token_expire_minutes,
        )
        refresh_expires = timedelta(days=self.settings.refresh_token_expire_days)
        refresh_jti = create_jti()
        access_token = create_jwt_token(
            subject=user.id,
            role=user.role or UserRole.STUDENT.value,
            token_type=TokenType.ACCESS,
            expires_delta=access_expires,
        )
        refresh_token = create_jwt_token(
            subject=user.id,
            role=user.role or UserRole.STUDENT.value,
            token_type=TokenType.REFRESH,
            expires_delta=refresh_expires,
            jti=refresh_jti,
        )
        self.refresh_tokens.create(
            user_id=user.id,
            token_hash=hash_token(refresh_token),
            jti=refresh_jti,
            expires_at=datetime.now(UTC) + refresh_expires,
        )
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=int(access_expires.total_seconds()),
        )
