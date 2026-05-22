import jwt
from fastapi import HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from core.config import settings


security = HTTPBearer()

def verify_jwt(credentials: HTTPAuthorizationCredentials = Security(security)):
    "Validar el token enviado desde la App, este generado por Spring Security"
    try:
        token= credentials.credentials
        payload=jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
        return payload.get("sub") #Devuelve el identificador del usuario
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="El token ha expirado. Inicia sesión nuevamente.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido o no autorizado.")