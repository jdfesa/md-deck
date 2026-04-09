# Arquitectura Interna de md-deck

`md-deck` sigue un flujo determinista dividido en tres fases o "motores": **Parsing, Rendering, y Serving/Building**. 

No usamos librerías complejas como React o motores de plantillas pesados. Todo está optimizado para velocidad y manipulación pura de strings basándonos en convenciones predecibles.

## 1. El Parser (`src/parser.js`)

La entrada de `md-deck` es el archivo `.md`.
El parser primero utiliza `gray-matter` para separar los metadatos YAML del contenido real en Markdown.

Luego, se realiza el **split** (división) por diapositiva buscando literalmente la cadena `\n---\n`. El parser es lo suficientemente inteligente para identificar bloqueos de código, y si encuentra un `---` dentro de un bloque de código, lo ignora y no corta la diapositiva.

### Clasificador de Slides (AST)
El parser evalúa cada bloque de texto y lo clasifica según su título para entender qué debe renderizar:
- `title_slide`: Solo se genera una vez. Es la portada que utiliza los datos del YAML.
- `section_slide`: Se detecta si el bloque de texto es MUY corto y empieza con un `##` (un título de sección simple).
- `end_slide`: Se detecta si es la última slide y contiene, por ejemplo, `# ¡Gracias!`.
- `content_slide`: Cualquier otra slide que tenga tablas, texto general o código.

Devuelve un objeto general (Abstract Syntax Tree rudimentario) con el meta y el array de slides generados.

## 2. El Renderer (`src/renderer.js`)

Toma el Abstract Syntax Tree del parser y genera el HTML crudo que inyectaremos en la plantilla de Reveal.

### Parseo de Tokens
El Renderer intercepta el HTML crudo retornado y aplica Expresiones Regulares para dar vida a los "Custom Components":
- **Callouts**: Detecta `> [!tipo] Titulo` y lo rodea de un `div class="callout callout-tipo"`.
- **Columnas**: Las palabras clave `:::columns`, `:::split` y `:::end` son transformadas a las clases CSS flexibles definidas.

### El Template Base (`templates/base.html`)
Una vez armadas todas las `<section>` de Reveal.js, el renderer ubica el archivo `templates/base.html`, inyecta el `themes/default.css` precompilado de forma *inline*, inyecta el HTML de las slides y, si aplica, el script de "Expiración".

Esto produce un archivo totalmente autocontenido.

## 3. Server y Output CLI (`src/server.js` y `bin/md-deck.js`)

Si el usuario llama a `build`, el sistema guarda este gran string en un `index.html` en la carpeta `output/`, y copia recursivamente los assets asociados (`img/`).

Si el usuario llama a `serve`, el CLI no emite el archivo al disco permanente, lo hace en memoria local o un temp folder, utiliza `node:http` para levantar un servidor nativo, le asigna auto-incrementport si detecta conflictos, y usa dependencias de Node.js (`child_process`) para abrir dinámicamente el navegador en el puerto seleccionado.
