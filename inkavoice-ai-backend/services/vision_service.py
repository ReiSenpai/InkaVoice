from core.config import hf_client, MODELS
import base64

def analyze_archaeological_image(image_bytes: bytes) -> str:
    """Recibe una imagen y devuelve la historia del sitio u objeto."""
    prompt = "Describe detalladamente qué sitio u objeto arqueológico peruano aparece en esta imagen. Actúa como un guía de turismo contando su historia."
    
    # Hugging Face a veces requiere la imagen en Base64 dentro del prompt para modelos VLM
    encoded_image = base64.b64encode(image_bytes).decode('utf-8')
    
    response = hf_client.text_generation(
        f"User: <image data:image/jpeg;base64,{encoded_image}>\n{prompt}\nAssistant:",
        model=MODELS["vision_model"],
        max_new_tokens=300
    )
    return response