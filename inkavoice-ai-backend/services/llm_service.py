# services/llm_service.py
from huggingface_hub import InferenceClient
from core.config import HF_TOKEN

client = InferenceClient(token=HF_TOKEN)

# Modelo de texto rápido y gratuito (puedes cambiarlo)
MODELO_TEXTO = "HuggingFaceH4/zephyr-7b-beta"

def generar_respuesta_textual(mensaje: str, idioma: str = "es") -> str:
    """
    Genera una respuesta textual para preguntas sin imagen (solo texto).
    Ideal para continuar una conversación después de haber compartido una imagen.
    """
    idiomas = {"es": "Español", "en": "Inglés", "qu": "Quechua"}
    nombre_idioma = idiomas.get(idioma, "Español")
    
    prompt = f"""<|system|>
Eres un guía turístico experto en Machu Picchu y la cultura inca. Responde de forma amable, detallada y en {nombre_idioma}.</s>
<|user|>
{mensaje}</s>
<|assistant|>"""
    
    try:
        resultado = client.text_generation(
            model=MODELO_TEXTO,
            prompt=prompt,
            max_new_tokens=256,
            temperature=0.7
        )
        return resultado.strip()
    except Exception as e:
        return f"Error en IA de texto: {e}"

def responder_con_contexto_visual(pregunta: str, descripcion_imagen: str, idioma: str = "es") -> str:
    """
    Si ya tienes una descripción de la imagen (obtenida con otro modelo), puedes usarla
    como contexto para que el LLM responda preguntas específicas sobre lo que se ve.
    """
    idiomas = {"es": "Español", "en": "Inglés", "qu": "Quechua"}
    nombre_idioma = idiomas.get(idioma, "Español")
    
    prompt = f"""<|system|>
Eres un guía en Machu Picchu. Tienes la siguiente descripción de lo que el usuario está viendo:
{descripcion_imagen}
Responde a la pregunta del usuario basándote en esa información y en tu conocimiento. Habla en {nombre_idioma}.</s>
<|user|>
{pregunta}</s>
<|assistant|>"""
    
    try:
        resultado = client.text_generation(
            model=MODELO_TEXTO,
            prompt=prompt,
            max_new_tokens=256,
            temperature=0.7
        )
        return resultado.strip()
    except Exception as e:
        return f"Error en LLM contextual: {e}"