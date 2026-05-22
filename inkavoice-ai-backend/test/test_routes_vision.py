import pytest
from fastapi.testclient import TestClient
from main import app

# Creamos un cliente de pruebas que levanta la app sin necesidad de usar Uvicorn en la consola
client = TestClient(app)

def test_vision_endpoint_no_file():
    # Prueba rápida para asegurar que el endpoint valide la obligatoriedad de la imagen
    # No enviamos el parámetro 'image_file'
    response = client.post("/api/ai/vision", data={"output_language": "es"})
    
    # Debe retornar 422 Unprocessable Entity (Falta un campo obligatorio)
    assert response.status_code == 422 

# Nota para la universidad: En un entorno corporativo, no hacemos pruebas que llamen 
# directamente a Hugging Face para no gastar saldo/cuota. En su lugar, se usa 
# la librería 'unittest.mock' para fingir que Hugging Face respondió.