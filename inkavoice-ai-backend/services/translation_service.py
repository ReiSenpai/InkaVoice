from core.config import hf_client, MODELS

def generate_tourist_response(user_text: str, language: str) -> str:
    """Genera la respuesta inteligente basada en la pregunta del turista."""
    prompt = f"Eres un guía de turismo experto en sitios arqueológicos de Perú. Responde de forma concisa y clara en el idioma {language} a esta pregunta: {user_text}"
    
    response = hf_client.text_generation(
        prompt,
        model=MODELS["llm_chat"],
        max_new_tokens=150
    )
    return response