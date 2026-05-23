from groq import Groq
from core.config import GROQ_API_KEY

client = Groq(api_key=GROQ_API_KEY)

def generate_tourist_response(user_text: str, language: str) -> str:
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": f"Eres un guía de turismo experto en sitios arqueológicos de Perú. Responde de forma concisa y clara en el idioma {language}."},
            {"role": "user", "content": user_text}
        ],
        max_tokens=150
    )
    return response.choices[0].message.content