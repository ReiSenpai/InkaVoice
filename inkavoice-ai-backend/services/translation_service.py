import httpx
from core.config import settings

async def generate_tourist_response(transcribed_text: str, output_language: str) -> str:
    headers = {"Authorization": f"Bearer {settings.HF_API_KEY}"}
    prompt = f"""<|system|>
Eres InkaVoice, un guía turístico experto en Machu Picchu. Responde de forma concisa (máximo 2 oraciones).
Responde ESTRICTAMENTE en el idioma correspondiente al código ISO: '{output_language}'.
<|user|>
{transcribed_text}
<|assistant|>"""
    
    payload = {
        "inputs": prompt,
        "parameters": {"max_new_tokens": 100, "temperature": 0.5, "return_full_text": False}
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(settings.LLM_API_URL, headers=headers, json=payload, timeout=50.0)
        if response.status_code == 503:
            raise Exception("Guía virtual cargando. Reintenta en 20s.")
        response.raise_for_status()
        return response.json()[0].get("generated_text", "").strip()