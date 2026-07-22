import base64
from groq import Groq
from core.config import GROQ_API_KEY

client = Groq(api_key=GROQ_API_KEY)

# Añadimos el parámetro 'language'
def analyze_archaeological_image(image_bytes: bytes, language: str) -> str:
    image_base64 = base64.b64encode(image_bytes).decode("utf-8")
    
    # Instrucción estricta para el idioma
    prompt_multilingue = f"""
    Eres un experto en arqueología peruana. Describe brevemente lo que ves en esta imagen, 
    mencionando elementos arqueológicos, culturales o turísticos relevantes.
    REGLA ESTRICTA: Tu respuesta debe estar OBLIGATORIAMENTE en el idioma correspondiente a este código ISO: '{language}'.
    ('es' = Español, 'en' = Inglés, 'qu' = Quechua). Si es Quechua, traduce tu análisis al Runasimi.
    """
    
    response = client.chat.completions.create(
        model="llama-3.2-90b-vision-preview", # Asegúrate de usar un modelo de Groq que soporte visión
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{image_base64}"
                        }
                    },
                    {
                        "type": "text",
                        "text": prompt_multilingue
                    }
                ]
            }
        ],
        max_tokens=250
    )
    return response.choices[0].message.content