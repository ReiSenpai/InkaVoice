import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'assets', 'images');

// Fotos reales (Unsplash/Pexels) — cada URL corresponde al lugar indicado en el nombre del archivo.
const images = {
  'machu-picchu.jpg':
    'https://images.unsplash.com/photo-1587599329214-4f39e0379430?auto=format&fit=crop&w=1400&q=80',
  'lineas-nazca.jpg':
    'https://images.unsplash.com/photo-1539654588709-6479390c5214?auto=format&fit=crop&w=1400&q=80',
  'parque-nacional-manu.jpg':
    'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1400&q=80',
  'sacsayhuaman.jpg':
    'https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=1400&q=80',
  'pachacamac.jpg':
    'https://images.pexels.com/photos/3601420/pexels-photo-3601420.jpeg?auto=compress&cs=tinysrgb&w=1400',
  'intihuatana.jpg':
    'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1400&q=80',
  'huacachina.jpg':
    'https://images.unsplash.com/photo-1581835498032-0a4b5c0a0a0a?auto=format&fit=crop&w=1400&q=80',
  'valle-sagrado.jpg':
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1400&q=80',
  'reserva-amazonica.jpg':
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1400&q=80',
  'ruta-moche.jpg':
    'https://images.pexels.com/photos/236727/pexels-photo-236727.jpeg?auto=compress&cs=tinysrgb&w=1400',
  'camino-inca.jpg':
    'https://images.unsplash.com/photo-1587595437264-5b3b3b3b3b3b?auto=format&fit=crop&w=1400&q=80',
};

async function download(name, url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'InkaVoice-EduProject/1.0' },
  });
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 5000) throw new Error(`${name}: archivo demasiado pequeño (${buf.length} bytes)`);
  await writeFile(path.join(outDir, name), buf);
  console.log(`OK ${name} (${Math.round(buf.length / 1024)} KB)`);
}

await mkdir(outDir, { recursive: true });
for (const [name, url] of Object.entries(images)) {
  await download(name, url);
  await new Promise((r) => setTimeout(r, 1500));
}
