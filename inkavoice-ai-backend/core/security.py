import os
from fastapi import Security, HTTPException, status
from fastapi.security import APIKeyHeader
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("INKAVOICE_API_KEY", "llave-por-defecto-si-falla")
api_key_header = APIKeyHeader(name="X-API-Key")

def verify_api_key(api_key_header: str = Security(api_key_header)):
    if api_key_header != API_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Acceso denegado. API Key inválida."
        )
    return api_key_header