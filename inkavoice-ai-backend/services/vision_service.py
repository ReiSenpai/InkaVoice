import base64
from groq import Groq
from core.config import GROQ_API_KEY

client = Groq(api_key=GROQ_API_KEY)

def analyze_archaeological_image(image_bytes: bytes) -> str:
    image_base64 = base64.b64encode(image_bytes).decode("utf-8")
    
    response = client.chat.completions.create(
        model="meta-llama/llama-4-scout-17b-16e-instruct",
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
                        "text": "Eres un experto en arqueología peruana. Describe brevemente lo que ves en esta imagen, mencionando elementos arqueológicos, culturales o turísticos relevantes."
                    }
                ]
            }
        ],
        max_tokens=200
    )
    return response.choices[0].message.content