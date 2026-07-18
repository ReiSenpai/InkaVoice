import re

REPLACEMENTS = {
    'screens/MapaScreen.tsx': (
        "const C = { bg: '#E6ECE8', white: '#FFF', green: '#00332D', green2: '#1A3A1E', gold: '#C9A84C', border: '#E6E6E6', text: '#122014', muted: '#666' };",
        "const C = { bg: colors.background, white: colors.white, green: colors.green, green2: colors.greenDark, gold: colors.gold, border: colors.border, text: colors.greenDark, muted: colors.muted };"
    ),
    'screens/CameraScreen.tsx': (
        "const C = { dark: '#0D1A0E', green: '#00332D', gold: '#C9A84C', goldL: '#F4D03F', white: '#F5F0E8', gray: '#718096' };",
        "const C = { dark: colors.greenDark, green: colors.green, gold: colors.gold, goldL: colors.goldLight, white: colors.beige, gray: colors.gray400 };"
    ),
    'screens/RecorridoScreen.tsx': (
        "const C = { bg: '#F7F4F2', green: '#1E5A46', gold: '#D8B347', text: '#10261D', muted: '#6E7773', white: '#FFF', border: '#E5E5E5' };",
        "const C = { bg: colors.background, green: colors.green, gold: colors.gold, text: colors.greenDark, muted: colors.muted, white: colors.white, border: colors.border };"
    ),
    'screens/ResultadoScreen.tsx': (
        "const C = { green: '#00332D', gold: '#C9A84C', goldL: '#F4D03F', white: '#FFFFFF', cream: '#F9F5EC', muted: '#555', border: '#E8E8E8', dark: '#0D1A0E' };",
        "const C = { green: colors.green, gold: colors.gold, goldL: colors.goldLight, white: colors.white, cream: colors.beige, muted: colors.muted, border: colors.border, dark: colors.greenDark };"
    ),
    'screens/AudioguiaScreen.tsx': (
        "const C = { bg: '#F3EFE6', dark: '#0D1A0E', green: '#00332D', gold: '#8B6914', goldL: '#C9A84C', white: '#FFFFFF', muted: '#777', card: '#F0EDE3' };",
        "const C = { bg: colors.background, dark: colors.greenDark, green: colors.green, gold: colors.gold, goldL: colors.goldLight, white: colors.white, muted: colors.muted, card: colors.beige };"
    ),
}

for filepath, (old, new) in REPLACEMENTS.items():
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    if old not in content:
        print(f"AVISO: no se encontro el bloque exacto en {filepath}, revisar manualmente")
        continue
    content = content.replace(old, new)
    # Añadir el import de colors si no existe ya
    if "from '../theme/colors'" not in content:
        content = content.replace(
            "import { Ionicons } from '@expo/vector-icons';",
            "import { Ionicons } from '@expo/vector-icons';\nimport { colors } from '../theme/colors';",
            1
        )
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"OK: {filepath}")

print("Listo")
