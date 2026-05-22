import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_voice_endpoint_no_file():
    # Prueba que falle correctamente si no se envía archivo
    response = client.post("/api/ai/voice")
    assert response.status_code == 422