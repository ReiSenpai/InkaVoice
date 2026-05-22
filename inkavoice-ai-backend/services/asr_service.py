import httpx
from core.config import settings

async def recognize_speech(audio_bytes: bytes, input_language: str) -> str:
    headers = {"Authorization": f"Bearer {settings.HF_API_KEY}"}
    api_url = settings.ASR_MMS_QUE_URL if input_language == "qu" else settings.ASR_WHISPER_URL
    
    async with httpx.AsyncClient() as client:
        response = await client.post(api_url, headers=headers, content=audio_bytes, timeout=40.0)
        if response.status_code == 503:
            raise Exception("Modelo ASR cargando. Reintenta en 20s.")
        response.raise_for_status()
        return response.json().get("text", "")