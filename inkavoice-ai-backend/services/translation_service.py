import httpx
from core.config import settings

async def generate_tourist_response(transcribed_text: str, input_language: str, output_language: str) -> str:
    """
    Toma la pregunta del turista, consulta al LLM dándole el rol de guía arqueológico,
    y exige que la respuesta esté en el idioma solicitado.
    """
    headers = {"Authorization": f"Bearer {settings.HF_API_KEY}"}
    
    # Prompt de Sistema: Le damos identidad a la IA y limitamos su contexto a Machu Picchu
    prompt = f"""<|system|>
    Eres InkaVoice, un guía turístico experto en el Santuario Histórico de Machu Picchu y la arquitectura Inca. 
    Responde de forma concisa (máximo 3 oraciones), históricamente precisa y amigable. 
    Si te preguntan algo fuera de contexto, redirige la conversación al turismo en Perú.
    Debes generar tu respuesta final ESTRICTAMENTE en el idioma correspondiente a este código ISO: '{output_language}' (es=Español, en=Inglés, qu=Quechua).
    <|user|>
    El turista dice: "{transcribed_text}"
    <|assistant|>"""
    
    payload = {
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": 150,  # Mantenerlo corto para que el audio (TTS) no sea muy pesado
            "temperature": 0.5,     # Temperatura media para respuestas precisas y no alucinadas
            "return_full_text": False # Para que Hugging Face no nos devuelva el prompt repetido
        }
    }
    
    async with httpx.AsyncClient() as client:
        # LLM_API_URL apunta a un modelo como Mistral o Llama 3
        response = await client.post(settings.LLM_API_URL, headers=headers, json=payload, timeout=50.0)
        
        if response.status_code == 503:
            raise Exception("El guía virtual (LLM) se está cargando. Reintenta en 20s.")
        response.raise_for_status()
        
        result = response.json()
        return result[0].get("generated_text", "").strip()