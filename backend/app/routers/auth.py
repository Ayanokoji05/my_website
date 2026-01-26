from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from datetime import timedelta
from ..auth import authenticate_admin, create_access_token, verify_token, ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter(prefix="/api/auth", tags=["authentication"])


class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str


@router.post("/login", response_model=LoginResponse)
def login(credentials: LoginRequest):
    """Admin login endpoint"""
    if not authenticate_admin(credentials.username, credentials.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": credentials.username},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.get("/verify")
def verify_auth(username: str = Depends(verify_token)):
    """Verify if token is valid"""
    return {"authenticated": True, "username": username}