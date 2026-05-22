import httpx
import base64
from core.config import settings

async def analyze_image(image_bytes: bytes, output_language: str) -> str:
    headers = {"Authorization": f"Bearer {settings.HF_API_KEY}"}
    image_b64 = base64.b64encode(image_bytes).decode("utf-8")
    prompt = f"USER: <image>\nIdentify this archaeological structure in Peru. Describe it historically in {output_language}.\nASSISTANT:"
    payload = {"inputs": prompt, "image": image_b64}
    
    async with httpx.AsyncClient() as client:
        response = await client.post(settings.VISION_API_URL, headers=headers, json=payload, timeout=50.0)
        if response.status_code == 503:
            raise Exception("Modelo de Visión cargando. Reintenta en 20s.")
        response.raise_for_status()
        full_text = response.json()[0].get("generated_text", "")
        return full_text.split("ASSISTANT:")[1].strip() if "ASSISTANT:" in full_text else full_text