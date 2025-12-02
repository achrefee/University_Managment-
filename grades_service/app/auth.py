import jwt
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.config import settings

security = HTTPBearer()

def decode_token(token: str) -> dict:
    """Decode and validate JWT token"""
    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret,
            algorithms=[settings.jwt_algorithm]
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Token has expired"
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=401,
            detail=f"Invalid authentication credentials: {str(e)}"
        )

def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)) -> dict:
    """Extract and validate current user from JWT token"""
    token = credentials.credentials
    payload = decode_token(token)
    
    if not payload.get("sub"):
        raise HTTPException(status_code=401, detail="Invalid token payload")
    
    return {
        "email": payload.get("sub"),
        "role": payload.get("role"),
        "user_id": payload.get("user_id")
    }

def require_professor(current_user: dict = Security(get_current_user)) -> dict:
    """Require PROFESSOR role"""
    if current_user.get("role") != "ROLE_PROFESSOR":
        raise HTTPException(
            status_code=403,
            detail="Access denied. Professor privileges required."
        )
    return current_user

def require_student_or_admin(current_user: dict = Security(get_current_user)) -> dict:
    """Require STUDENT or ADMIN role for viewing"""
    role = current_user.get("role")
    if role not in ["ROLE_STUDENT", "ROLE_ADMIN", "ROLE_PROFESSOR"]:
        raise HTTPException(
            status_code=403,
            detail="Access denied. Student, Admin, or Professor privileges required."
        )
    return current_user
