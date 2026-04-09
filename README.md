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

### Paso 1: Clonar e instalar dependencias (local al proyecto)

```bash
git clone https://github.com/jdfesa/md-deck.git
cd md-deck
npm install
```

> Las dependencias (`commander`, `marked`, `gray-matter`) se instalan **dentro del proyecto** en la carpeta `node_modules/`. No se contamina el sistema global.

### Paso 2 (Opcional): Registrar el comando global

Si querés usar `md-deck` como comando desde cualquier carpeta de tu sistema:

```bash
npm link
```

Esto crea un symlink (acceso directo) global que apunta al binario del proyecto. **No duplica las dependencias**, solo las referencia.

Si preferís no instalar nada de forma global, siempre podés ejecutar directamente:

```bash
node bin/md-deck.js build mi-presentacion.md
```

---

## 🚀 Quick Start

```bash
# Opción A: Si hiciste npm link (comando global)
md-deck build mi-presentacion.md
md-deck serve mi-presentacion.md --open

# Opción B: Sin instalar nada global (desde la raíz del proyecto)
node bin/md-deck.js build mi-presentacion.md
node bin/md-deck.js serve mi-presentacion.md --open
```

## 📚 Documentación Detallada

Para usuarios avanzados y desarrolladores que deseen entender el funcionamiento interno de `md-deck` o la lista exhaustiva de componentes, pueden consultar la carpeta de `docs/`:

- [Arquitectura Interna](docs/arquitectura.md): Cómo funciona el parseo y renderizado.
- [Sintaxis y Componentes](docs/sintaxis.md): Lista completa de todo lo que puedes hacer con Markdown en `md-deck`.

---

## 📝 Formato del Markdown (Resumen)

### Frontmatter (YAML)

```yaml
---
title: "Mi Presentación"
author: "Tu Nombre"
date: "2026-04-08"
institution: "Tu Institución"
subject: "Materia"
professor: "Nombre del Profesor"
lang: es
expires: "2026-04-22"   # Opcional: fecha de expiración
---
```

### Separar Slides

Usá `---` (tres guiones) para separar diapositivas:

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

### Imágenes

Las imágenes se renderizan dentro de un contenedor con borde gradiente:

```markdown
![Diagrama UML](img/diagrama.png)
```

Colocá tus imágenes en una carpeta `img/` junto al `.md`. Se copian automáticamente al output.

### Tablas


Las tablas Markdown se renderizan con estilo premium:

```markdown
| Columna 1 | Columna 2 | Columna 3 |
|---|---|---|
| Dato | Dato | Dato |
```

### Código

Los bloques de código se renderizan con syntax highlighting (Highlight.js/Monokai):

````markdown
```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello");
    }
}
```
````

---

## ⚡ Comandos

### `md-deck build <archivo.md>`

Lee el archivo Markdown, lo procesa y genera una carpeta dentro de `output/` con un **`index.html` autocontenido** listo para abrir directamente en cualquier navegador o subir a un hosting estático.

**¿Qué se genera?**

```
output/
└── a1b2c3d4-mi-presentacion/    ← carpeta con prefijo UUID único
    ├── index.html                ← la presentación completa
    └── img/                      ← copia de las imágenes (si existían)
```

> El prefijo UUID evita colisiones si generás varias versiones. Podés desactivarlo con `--no-uuid` o especificar tu propia carpeta con `-o`.

| Flag | Descripción | Default |
|---|---|---|
| `-t, --theme <name>` | Tema CSS | `default` |
| `-o, --output <dir>` | Directorio de salida personalizado | `output/<uuid>-<nombre>` |
| `--title <string>` | Override del título | Valor del frontmatter |
| `--expires <date>` | Fecha de expiración (YYYY-MM-DD) | — |
| `--no-uuid` | Sin prefijo UUID en la carpeta | `false` |

**Ejemplo:**

```bash
md-deck build examples/guia-rapida.md
# ✅ Presentation built successfully!
# 📂 /Users/jd/Development/md-deck/output/f3a1b9c2-guia-rapida
# 📄 /Users/jd/.../output/f3a1b9c2-guia-rapida/index.html

# Después simplemente abrí el archivo:
open output/f3a1b9c2-guia-rapida/index.html
```

### `md-deck serve <archivo.md>`

Genera la presentación y **levanta un servidor HTTP local** en tu máquina para previsualizarla en el navegador. Ideal mientras estás editando el `.md`.

El servidor utiliza Node.js puro (`node:http`), sin dependencias externas adicionales. Se auto-asigna el puerto `8080` por defecto, y si ese puerto está ocupado, prueba el siguiente automáticamente.

| Flag | Descripción | Default |
|---|---|---|
| `-p, --port <number>` | Puerto del servidor | `8080` |
| `--open` | Abrir el navegador automáticamente | `false` |
| `-t, --theme <name>` | Tema CSS | `default` |

**Ejemplo:**

```bash
md-deck serve examples/guia-rapida.md --open
#
#  📽️  md-deck — Live Preview
#  ─────────────────────────
#  🌐 http://localhost:8080       ← abrí esta URL en tu navegador
#  📂 output/guia-rapida
#  ⌨️  Press Ctrl+C to stop       ← para detener el servidor
#
```

---

## 🎨 Sistema de Diseño

El tema `default` incluye:

- **Dark mode premium** con acentos vibrantes
- **Paleta de colores**: Púrpura `#7c6aef`, Verde `#06d6a0`, Amarillo `#ffd166`, Rosa `#ef476f`, Azul `#118ab2`
- **Tipografía**: Inter (headings + body) + JetBrains Mono (código)
- **Componentes**: Cards, badges, highlight boxes, diagram containers, tablas estilizadas
- **Transiciones**: `data-auto-animate` automático entre slides
- **Progress bar**: Gradiente púrpura → verde
- **Numeración**: Slide counter en esquina inferior derecha

---

## 📂 Estructura del Proyecto

```
md-deck/
├── bin/md-deck.js        # CLI entry point
├── src/
│   ├── parser.js         # Markdown → slide AST
│   ├── renderer.js       # Slide AST → HTML
│   └── server.js         # Servidor local
├── templates/base.html   # Skeleton HTML (Reveal.js)
├── themes/default.css    # Tema dark premium
├── examples/             # Presentaciones de ejemplo
│   ├── guia-rapida.md    # Template básico
│   └── relaciones-uml.md # Caso de uso real
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

## 🗺️ Roadmap / TODO

El proyecto está en constante evolución. Consulta el archivo [TODO.md](TODO.md) en la raíz del repositorio para ver en qué fase del desarrollo nos encontramos y qué funcionalidades están planeadas para el futuro (como despliegues automatizados a Netlify/Surge).

---

## 🔍 Análisis: Puntos de Mejora Identificados

A continuación se detallan áreas donde el README podría mejorarse para mayor claridad y utilidad:

### 1. **Diagrama de Flujo Completo Faltante**
Actualmente no hay un ejemplo paso a paso que muestre: `archivo.md` → generar → visualizar en navegador. Podría ayudar mostrar un "Antes y Después" visual.

### 2. **Documentación Incompleta de Estructura de Carpetas**
Se menciona que imágenes van en `img/` y diagramas en `diagramas/`, pero no está explícito dónde exactamente deben colocarse estos directorios en relación al archivo `.md`.

**Ejemplo que falta:**
```
mi-presentacion/
├── presentacion.md
├── img/
│   ├── diagrama1.png
│   └── foto.jpg
└── diagramas/
    └── arquitectura.svg
```

### 3. **Diferenciación de Comandos No es Clara**
Aunque `build` y `serve` están documentados, no queda explícito **cuándo usar cada uno**:
- `build`: para generar una presentación final lista para compartir/desplegar
- `serve`: para desarrollo local con preview en vivo mientras editás

### 4. **Callouts en el README son Muy Básicos**
La sección de formato muestra `[!note]`, `[!tip]`, etc., pero el ejemplo es simplista. En `docs/sintaxis.md` hay más detalles pero es fácil pasar por alto la documentación externa.

### 5. **Falta Información sobre Output**
Un usuario novel no sabe bien qué esperar después de ejecutar `md-deck build`. ¿Dónde va el archivo? ¿Está listo para compartir? ¿Ocupa mucho espacio? Se agregó más abajo en la descripción de comandos, pero podría anticiparse.

### 6. **Ejemplos de Uso Están Dispersos**
Hay ejemplos en Quick Start, en la sección de comandos, en formato de Markdown, etc. Consolidar un ejemplo **end-to-end real** sería de ayuda.

### 7. **Sistema de Temas Poco Documentado**
Se menciona `--theme <name>` pero no queda claro: ¿cuáles son los temas disponibles? ¿Cómo crear uno personalizado? Actualmente solo existe `default`.

### 8. **Falta Troubleshooting / FAQ**
No hay sección que responda dudas comunes como:
- "¿Por qué se ve extraño mi presentación?"
- "¿Puedo cambiar colores sin editar CSS?"
- "¿Funciona offline?"

---

## 📄 Licencia

MIT
