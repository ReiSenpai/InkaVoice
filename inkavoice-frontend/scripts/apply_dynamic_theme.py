import sys
import re

def convert(filepath):
    with open(filepath, encoding='utf-8') as f:
        content = f.read()

    # 1. Agregar import de useTheme si no existe
    if 'useTheme' not in content:
        # Insertar después del último import
        imports = list(re.finditer(r'^import .+;$', content, re.MULTILINE))
        last_import_end = imports[-1].end()
        content = content[:last_import_end] + "\nimport { useTheme } from '../context/ThemeContext';" + content[last_import_end:]

    # 2. Encontrar "const styles = StyleSheet.create({" y su cierre "});"
    match = re.search(r'const styles = StyleSheet\.create\(\{', content)
    if not match:
        print(f"NO_STYLES_BLOCK: {filepath}")
        return

    start = match.start()
    brace_start = content.index('{', match.start())
    depth = 0
    i = brace_start
    while i < len(content):
        if content[i] == '{':
            depth += 1
        elif content[i] == '}':
            depth -= 1
            if depth == 0:
                break
        i += 1
    # i is now at the closing '}' of the object; find the following ');'
    close_paren = content.index(')', i)
    end = close_paren + 1
    # incluir el ';' final si existe
    if end < len(content) and content[end] == ';':
        end += 1

    styles_block = content[start:end]
    # Quitar ese bloque de su posición original
    content = content[:start] + content[end:]

    # 3. Insertar "const { colors } = useTheme();" + el bloque de estilos justo antes del primer "return ("
    return_match = re.search(r'\n(\s*)return \(', content)
    if not return_match:
        print(f"NO_RETURN_FOUND: {filepath}")
        return

    indent = return_match.group(1)
    insertion = f"\n{indent}const {{ colors }} = useTheme();\n{indent}{styles_block}\n"
    insert_pos = return_match.start()
    content = content[:insert_pos] + insertion + content[insert_pos:]

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"OK: {filepath}")

if __name__ == '__main__':
    for path in sys.argv[1:]:
        convert(path)
