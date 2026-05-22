import httpx
from core.config import settings

async def synthesize_speech(text: str, output_language: str) -> bytes:
    headers = {"Authorization": f"Bearer {settings.HF_API_KEY}"}
    api_url = settings.TTS_MMS_QUE_URL if output_language == "qu" else settings.TTS_MELO_ES_URL
    payload = {"inputs": text}
    
    async with httpx.AsyncClient() as client:
        response = await client.post(api_url, headers=headers, json=payload, timeout=40.0)
        if response.status_code == 503:
            raise Exception("Modelo TTS cargando. Reintenta en 20s.")
        response.raise_for_status()
        return response.content