import httpx
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os

security = HTTPBearer()

# API Gateway URL - all inter-service communication goes through the gateway
GATEWAY_URL = os.getenv("GATEWAY_URL", "http://localhost:8080")

async def validate_token_with_oauth(token: str) -> dict:
    """Validate token by calling the OAuth service via API Gateway"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{GATEWAY_URL}/api/auth/validate",
                params={"token": token},
                timeout=10.0
            )
            
            if response.status_code == 200:
                return response.json()
            elif response.status_code == 400:
                raise HTTPException(
                    status_code=401,
                    detail="Invalid or expired token"
                )
            else:
                raise HTTPException(
                    status_code=500,
                    detail="OAuth service error"
                )
    except httpx.RequestError as e:
        raise HTTPException(
            status_code=503,
            detail=f"OAuth service unavailable: {str(e)}"
        )

async def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)) -> dict:
    """Extract and validate current user via OAuth service"""
    token = credentials.credentials
    user_data = await validate_token_with_oauth(token)
    
    return {
        "email": user_data.get("email"),
        "role": user_data.get("role"),
        "user_id": user_data.get("userId"),
        "firstName": user_data.get("firstName"),
        "lastName": user_data.get("lastName")
    }

async def require_professor(credentials: HTTPAuthorizationCredentials = Security(security)) -> dict:
    """Require PROFESSOR role"""
    current_user = await get_current_user(credentials)
    role = current_user.get("role")
    
    # Accept both ROLE_PROFESSOR and PROFESSOR formats
    if role not in ["ROLE_PROFESSOR", "PROFESSOR"]:
        raise HTTPException(
            status_code=403,
            detail="Access denied. Professor privileges required."
        )
    return current_user

async def require_student_or_admin(credentials: HTTPAuthorizationCredentials = Security(security)) -> dict:
    """Require STUDENT or ADMIN role for viewing"""
    current_user = await get_current_user(credentials)
    role = current_user.get("role")
    
    # Accept both ROLE_ prefixed and non-prefixed formats
    allowed_roles = ["ROLE_STUDENT", "ROLE_ADMIN", "ROLE_PROFESSOR", "STUDENT", "ADMIN", "PROFESSOR"]
    if role not in allowed_roles:
        raise HTTPException(
            status_code=403,
            detail="Access denied. Student, Admin, or Professor privileges required."
        )
    return current_user
