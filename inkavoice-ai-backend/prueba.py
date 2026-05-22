import urllib.request

print("--- INICIANDO PRUEBA DE RED DE PYTHON ---")

# 1. Prueba a Google (Para ver si Python tiene salida a Internet)
try:
    print("Intentando conectar a Google...")
    respuesta_google = urllib.request.urlopen("https://www.google.com", timeout=5)
    print("✅ ÉXITO: Python TIENE internet. Código:", respuesta_google.getcode())
except Exception as e:
    print("❌ ERROR CRÍTICO: Python NO tiene internet en absoluto. Detalle:", e)

print("-" * 40)

# 2. Prueba a Hugging Face (Para ver si el bloqueo es específico)
try:
    print("Intentando conectar a la IA (Hugging Face)...")
    respuesta_hf = urllib.request.urlopen("https://api-inference.huggingface.co", timeout=5)
    print("✅ ÉXITO: Hugging Face responde. Código:", respuesta_hf.getcode())
except Exception as e:
    print("❌ ERROR ESPECÍFICO: Tu proveedor/Antivirus está BLOQUEANDO a Hugging Face. Detalle:", e)