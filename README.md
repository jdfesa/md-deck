# 📽️ md-deck

**Markdown → Presentación Reveal.js pulida en un comando.**

Escribí tu contenido en Markdown, ejecutá `md-deck build`, y obtené una presentación profesional lista para compartir.

## 📖 Filosofía del Proyecto

`md-deck` nace de la necesidad de **separar el contenido del diseño**. En lugar de perder horas ajustando transiciones, márgenes y alineaciones en herramientas visuales u otras librerías programáticas complejas, `md-deck` ofrece un flujo de trabajo **determinista y offline-first**:

1. **Escribís en Markdown:** Usás tu editor favorito (como Obsidian o VS Code).
2. **Aplicás convenciones simples:** Separás slides con `---` y usás *Callouts* para componentes ricos.
3. **Generás:** El motor renderiza un único archivo HTML autocontenido con un diseño *premium* preconfigurado.

Tu única preocupación debe ser enseñar, explicar o exponer el contenido; `md-deck` se encarga de que se vea espectacular.

---

## 📦 Instalación

### Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior.

### Paso 1: Clonar e instalar dependencias

```bash
git clone https://github.com/jdfesa/md-deck.git
cd md-deck
npm install
```

> Las dependencias (`commander`, `marked`, `gray-matter`, `chalk`, `@inquirer/prompts`) se instalan **dentro del proyecto** en la carpeta `node_modules/`. No se contamina el sistema global.

### Paso 2 (Opcional): Registrar el comando global

Si querés usar `md-deck` como comando desde cualquier carpeta de tu sistema:

```bash
npm link
```

Esto crea un symlink global que apunta al binario del proyecto. **No duplica las dependencias**, solo las referencia.

---

## 🚀 Quick Start

### Modo Interactivo (Recomendado)

Ejecutá `md-deck` sin argumentos para abrir el **menú interactivo** con asistente guiado:

```bash
md-deck
```

El menú te permite:
- ✨ **Generar una plantilla** de presentación con la estructura correcta.
- 🛠️ **Construir** una presentación eligiendo archivo y tema visualmente.
- 🌐 **Iniciar un servidor local** con preview en vivo.

### Modo Directo (CLI)

```bash
md-deck build mi-presentacion.md
md-deck serve mi-presentacion.md --open
```

> Si no hiciste `npm link`, usá `node bin/md-deck.js` en vez de `md-deck`.

---

## 🧠 Auto-Paginador Inteligente

`md-deck` puede convertir **cualquier archivo Markdown** en una presentación, incluso si no tiene separadores `---`.

**¿Cómo funciona?** Si el motor detecta que tu archivo no contiene `---`, activa el **modo Auto-Cura**: recorre el contenido y genera una nueva diapositiva automáticamente antes de cada título `##` o `###`. Todo se procesa en memoria sin modificar tu archivo original.

Esto significa que podés tomar un `README.md`, un apunte de clase o un artículo y convertirlo en presentación al instante.

> Si tu archivo **sí contiene** separadores `---`, el auto-paginador se desactiva y respeta tu estructura manual.

---

## 🛡️ Sanitizador Automático (Linter)

`md-deck` incluye un motor de pre-procesamiento silencioso que actúa como un **"Linter de Markdown"** antes de iniciar el renderizado. 
Su objetivo es garantizar que la presentación no se rompa si el archivo de origen presenta inconsistencias comunes o descuidos de formato.

**¿Qué problemas resuelve automáticamente?**
- **Estandarización de viñetas:** Tolerar el uso errático de asteriscos (`*`) o signos de suma (`+`) como listas, transformándolos internamente al estándar unificado de guion medio (`-`) para evitar colisiones lógicas en el empaquetado del parser.
- **Reparación de separadores:** Resuelve el pegado accidental de texto al separador `---`, inyectando los saltos de línea vitales alrededor del mismo.
- **Títulos seguros:** Agrega los espacios faltantes si un usuario escribe accidentalmente un título pegado sin separar (ej: `##Título` -> `## Título`).

> *Todo este filtrado ocurre estrictamente en memoria (RAM) y nunca reescribe ni contamina tu archivo local original.*

---

## 📝 Formato del Markdown

### Frontmatter (YAML)

```yaml
---
title: "Mi Presentación"
author: "Tu Nombre"
date: "2026-04-08"
institution: "Tu Institución"
subject: "Materia"
professor: "Nombre del Profesor"
theme: moon
lang: es
expires: "2026-04-22"
---
```

> El campo `theme` en el frontmatter permite definir el tema directamente desde el archivo. Si se pasa `--theme` por CLI, este último toma prioridad.

### Separar Slides

Usá `---` (tres guiones) para separar diapositivas manualmente:

```markdown
# Título de la Presentación
Subtítulo

---

## Sección 1
Descripción de la sección.

---

### Contenido de la sección

- Punto 1
- Punto 2
- Punto 3

---

# ¡Gracias!
Texto de cierre
```

### Tipos de Slides (autodetectados)

| Markdown | Tipo de Slide | Visual |
|---|---|---|
| `# Título` (primer slide) | **Portada** | Badge institucional, metadata grid, gradiente |
| `## Sección` (slide corta) | **Título de sección** | Número grande + título centrado |
| Contenido general | **Content** | Markdown renderizado con estilos premium |
| `# ¡Gracias!` (último slide) | **Cierre** | Emoji 🎓, info del autor |

### Callouts (estilo Obsidian)

Se soportan callouts de Obsidian que se convierten en componentes visuales:

```markdown
> [!note] Título opcional
> Contenido de la nota.

> [!tip] Consejo
> Contenido del tip con ícono 💡.

> [!warning] Atención
> Contenido de advertencia con ícono ⚠️.

> [!important] Composición
> Contenido importante con ícono 🔴.

> [!card] Título de la Card
> Contenido dentro de una tarjeta estilizada.

> [!problem] Enunciado
> Contenido del enunciado del problema.
```

### Layout de Dos Columnas

```markdown
:::columns

Contenido de la columna izquierda...

:::split

Contenido de la columna derecha...

:::end
```

### Tablas

Las tablas Markdown se renderizan con estilo premium:

| Columna 1 | Columna 2 | Columna 3 |
|---|---|---|
| Dato | Dato | Dato |

### Código

Los bloques de código se renderizan con syntax highlighting (Highlight.js/Monokai) dentro de una ventana estilo editor con los botones clásicos de macOS:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello");
    }
}
```

### Imágenes

Las imágenes se renderizan automáticamente dentro de un contenedor estilizado. Mantené tus recursos junto al archivo `.md`:

```text
mi-proyecto/
├── presentacion.md
├── img/
│   ├── foto.jpg
│   └── diagrama.png
```

> Al ejecutar `md-deck build`, las carpetas `img/` o `diagramas/` (si existen) se copian automáticamente a la carpeta de salida.

---

## ⚡ Comandos

### `md-deck build <archivo.md>`

Lee el archivo Markdown, lo procesa y genera una carpeta dentro de `output/` con un **`index.html` autocontenido** listo para abrir directamente en cualquier navegador o subir a un hosting estático.

```
output/
└── a1b2c3d4-mi-presentacion/
    ├── index.html
    └── img/
```

> El prefijo UUID evita colisiones si generás varias versiones. Podés desactivarlo con `--no-uuid` o especificar tu propia carpeta con `-o`.

| Flag | Descripción | Default |
|---|---|---|
| `-t, --theme <name>` | Tema CSS | `default` |
| `-o, --output <dir>` | Directorio de salida personalizado | `output/<uuid>-<nombre>` |
| `--title <string>` | Override del título | Valor del frontmatter |
| `--expires <date>` | Fecha de expiración (YYYY-MM-DD) | — |
| `--no-uuid` | Sin prefijo UUID en la carpeta | `false` |

### `md-deck serve <archivo.md>`

Genera la presentación y **levanta un servidor HTTP local** para previsualizarla en el navegador. Ideal mientras estás editando el `.md`.

| Flag | Descripción | Default |
|---|---|---|
| `-p, --port <number>` | Puerto del servidor | `8080` |
| `--open` | Abrir el navegador automáticamente | `false` |
| `-t, --theme <name>` | Tema CSS | `default` |

---

## 🎨 Temas Disponibles

`md-deck` incluye **5 temas** listos para usar:

| Tema | Descripción |
|---|---|
| `default` | Dark premium con acentos púrpura y verde |
| `dark` | Tonos oscuros con acentos cyan y rosa |
| `night` | Fondo profundo con acentos ámbar y turquesa |
| `moon` | Azul-gris elegante con acentos lavanda |
| `solarized` | Paleta Solarized Dark clásica |

Se seleccionan con `--theme <nombre>`, desde el frontmatter (`theme: moon`), o desde el menú interactivo.

### Sistema de Diseño

Todos los temas comparten:

- **Tipografía**: Inter (headings + body) + JetBrains Mono (código)
- **Componentes**: Cards, badges, highlight boxes, diagram containers, tablas estilizadas
- **Código**: Ventanas estilo editor con botones macOS y syntax highlighting
- **Transiciones**: `data-auto-animate` automático entre slides
- **Progress bar**: Gradiente animado
- **Numeración**: Slide counter en esquina inferior derecha
- **Scroll inteligente**: En slides con contenido extenso, aparece un indicador visual animado señalando que se puede hacer scroll

---

## 📂 Estructura del Proyecto

```
md-deck/
├── bin/md-deck.js        # CLI entry point + orquestador
├── src/
│   ├── interactive.js    # Menú interactivo + generador de plantillas
│   ├── parser.js         # Markdown → slide AST (con auto-paginación)
│   ├── renderer.js       # Slide AST → HTML
│   └── server.js         # Servidor local
├── templates/base.html   # Skeleton HTML (Reveal.js)
├── themes/               # Temas CSS
│   ├── default.css
│   ├── dark.css
│   ├── night.css
│   ├── moon.css
│   └── solarized.css
├── examples/             # Presentaciones de ejemplo
│   └── guia-rapida.md
├── docs/                 # Documentación técnica
│   ├── arquitectura.md
│   └── sintaxis.md
└── output/               # Presentaciones generadas
```

---

## ⌨️ Controles de la Presentación

| Tecla | Acción |
|---|---|
| `→` / `Espacio` | Slide siguiente |
| `←` | Slide anterior |
| `F` | Pantalla completa |
| `Esc` | Vista general (overview) |
| `S` | Speaker notes |
| `?` | Ayuda de atajos |

---

## 📚 Documentación Detallada

Para usuarios avanzados y desarrolladores que deseen entender el funcionamiento interno:

- [Arquitectura Interna](docs/arquitectura.md): Cómo funciona el parseo y renderizado.
- [Sintaxis y Componentes](docs/sintaxis.md): Lista completa de todo lo que puedes hacer con Markdown en `md-deck`.

---

## 🗺️ Roadmap

El proyecto está en constante evolución. Consultá el archivo [TODO.md](TODO.md) para ver las funcionalidades planeadas.

## 📄 Licencia

MIT
