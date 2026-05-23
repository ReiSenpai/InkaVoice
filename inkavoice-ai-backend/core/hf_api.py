import requests
import time
from core.config import HF_TOKEN

def call_hf_api(model_id: str, payload: bytes, content_type: str) -> dict | list:
    api_url = f"https://router.huggingface.co/hf-inference/models/{model_id}"
    headers = {
        "Authorization": f"Bearer {HF_TOKEN}",
        "Content-Type": content_type
    }

    for attempt in range(3):
        try:
            response = requests.post(
                api_url,
                headers=headers,
                data=payload,
                timeout=60.0
                # ← SIN proxies, deja que el sistema maneje la red
            )

            if response.status_code == 200:
                content_type_resp = response.headers.get("Content-Type", "")
                if "audio" in content_type_resp or "octet-stream" in content_type_resp:
                    return response.content
                return response.json()

            elif response.status_code == 503 and "estimated_time" in response.text:
                wait_time = response.json().get("estimated_time", 20)
                print(f"[INFO] Modelo cargando, esperando {wait_time}s...")
                time.sleep(wait_time)
                continue

            else:
                raise Exception(f"API Error ({response.status_code}): {response.text}")

        except requests.exceptions.ConnectionError as e:
            if attempt < 2:
                print(f"[WARN] Error de conexión en intento {attempt+1}, reintentando en 5s...")
                time.sleep(5)
                continue
            raise Exception(f"Fallo de conexión tras 3 intentos: {str(e)}")

        except requests.exceptions.RequestException as e:
            raise Exception(f"Fallo crítico de conexión HTTP: {str(e)}")

    raise Exception("El modelo tardó demasiado en responder. Intenta nuevamente.")