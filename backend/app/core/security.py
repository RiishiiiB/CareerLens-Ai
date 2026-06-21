from __future__ import annotations

import base64
import hashlib
import hmac
import json
import secrets
from datetime import UTC, datetime, timedelta
from typing import Any

from app.core.config import get_settings
from app.models.enums import TokenType, UserRole

try:
    import bcrypt
except ImportError:  # pragma: no cover - only happens in incomplete envs
    bcrypt = None  # type: ignore[assignment]


class TokenError(ValueError):
    pass


def _base64url_encode(raw_bytes: bytes) -> str:
    return base64.urlsafe_b64encode(raw_bytes).rstrip(b"=").decode("ascii")


def _base64url_decode(raw_value: str) -> bytes:
    padding = "=" * (-len(raw_value) % 4)
    return base64.urlsafe_b64decode(raw_value + padding)


def _json_dumps(payload: dict[str, Any]) -> bytes:
    return json.dumps(payload, separators=(",", ":"), sort_keys=True).encode("utf-8")


def hash_password(password: str) -> str:
    if bcrypt is None:
        raise RuntimeError("bcrypt is required for password hashing")
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, password_hash: str | None) -> bool:
    if not password_hash or bcrypt is None:
        return False
    return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))


def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def create_jti() -> str:
    return secrets.token_urlsafe(32)


def create_jwt_token(
    *,
    subject: int,
    role: UserRole | str,
    token_type: TokenType,
    expires_delta: timedelta,
    jti: str | None = None,
    extra_claims: dict[str, Any] | None = None,
) -> str:
    settings = get_settings()
    if settings.jwt_algorithm != "HS256":
        raise ValueError("Only HS256 JWT signing is supported")

    now = datetime.now(UTC)
    role_value = role.value if isinstance(role, UserRole) else role
    claims: dict[str, Any] = {
        "sub": str(subject),
        "role": role_value,
        "type": token_type.value,
        "jti": jti or create_jti(),
        "iat": int(now.timestamp()),
        "exp": int((now + expires_delta).timestamp()),
    }
    if extra_claims:
        claims.update(extra_claims)

    header = {"alg": settings.jwt_algorithm, "typ": "JWT"}
    signing_input = (
        f"{_base64url_encode(_json_dumps(header))}."
        f"{_base64url_encode(_json_dumps(claims))}"
    )
    signature = hmac.new(
        settings.jwt_secret_key.encode("utf-8"),
        signing_input.encode("ascii"),
        hashlib.sha256,
    ).digest()
    return f"{signing_input}.{_base64url_encode(signature)}"


def decode_jwt_token(token: str) -> dict[str, Any]:
    settings = get_settings()
    try:
        header_segment, payload_segment, signature_segment = token.split(".")
    except ValueError as exc:
        raise TokenError("Invalid token format") from exc

    signing_input = f"{header_segment}.{payload_segment}"
    expected_signature = hmac.new(
        settings.jwt_secret_key.encode("utf-8"),
        signing_input.encode("ascii"),
        hashlib.sha256,
    ).digest()
    actual_signature = _base64url_decode(signature_segment)
    if not hmac.compare_digest(expected_signature, actual_signature):
        raise TokenError("Invalid token signature")

    try:
        header = json.loads(_base64url_decode(header_segment))
        payload = json.loads(_base64url_decode(payload_segment))
    except (json.JSONDecodeError, ValueError) as exc:
        raise TokenError("Invalid token payload") from exc

    if header.get("alg") != settings.jwt_algorithm:
        raise TokenError("Invalid token algorithm")

    expires_at = payload.get("exp")
    if not isinstance(expires_at, int):
        raise TokenError("Token expiration is missing")
    if datetime.now(UTC).timestamp() >= expires_at:
        raise TokenError("Token has expired")

    return payload
