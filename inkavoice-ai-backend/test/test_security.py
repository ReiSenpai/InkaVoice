import pytest
import jwt
from fastapi import HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from core.config import settings
from core.security import verify_jwt

def test_verify_jwt_valid_token():
    # 1. Generamos un token válido simulado usando el secreto de tu archivo .env
    token = jwt.encode({"sub": "turista_123"}, settings.JWT_SECRET, algorithm="HS256")
    credentials = HTTPAuthorizationCredentials(scheme="Bearer", credentials=token)
    
    # 2. Verificamos que tu función de seguridad logre extraer el ID del usuario
    user_id = verify_jwt(credentials)
    assert user_id == "turista_123"

def test_verify_jwt_invalid_token():
    # 1. Enviamos un texto que no es un JWT real
    credentials = HTTPAuthorizationCredentials(scheme="Bearer", credentials="un_token_inventado")
    
    # 2. Verificamos que FastAPI levante el error 401 (No Autorizado)
    with pytest.raises(HTTPException) as exc_info:
        verify_jwt(credentials)
    
    assert exc_info.value.status_code == 401
    assert exc_info.value.detail == "Token inválido."