from groq import Groq
from core.config import GROQ_API_KEY

client = Groq(api_key=GROQ_API_KEY)

def generate_tourist_response(user_text: str, language: str) -> str:
    # 1. Creamos un "traductor" para que Llama 3 entienda qué idioma queremos
    idiomas = {
        "es": "Español",
        "en": "Inglés",
        "qu": "Quechua"
    }
    
    # 2. Obtenemos el nombre completo del idioma (Si llega "en", se convierte en "Inglés")
    nombre_idioma = idiomas.get(language, "Español")

    # 3. Le damos la instrucción a la IA con el nombre del idioma claro
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "system", 
                "content": f"Eres un guía de turismo experto en sitios arqueológicos de Perú. Es OBLIGATORIO que respondas a la pregunta del usuario EXCLUSIVAMENTE en el idioma {nombre_idioma}. Sé conciso y claro."
            },
            {"role": "user", "content": user_text}
        ],
        max_tokens=150
    )
    return response.choices[0].message.content