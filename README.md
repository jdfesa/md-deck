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

## 🚀 Quick Start

```bash
# Instalar globalmente (una sola vez)
npm link

# Construir una presentación
md-deck build mi-presentacion.md

# Construir + servir localmente con preview
md-deck serve mi-presentacion.md --open

# Con fecha de expiración
md-deck build mi-presentacion.md --expires 2026-04-22
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

Genera la presentación en `output/`.

| Flag | Descripción | Default |
|---|---|---|
| `-t, --theme <name>` | Tema CSS | `default` |
| `-o, --output <dir>` | Directorio de salida | `output/<uuid>-<nombre>` |
| `--title <string>` | Override del título | Frontmatter |
| `--expires <date>` | Fecha de expiración (YYYY-MM-DD) | — |
| `--no-uuid` | Sin prefijo UUID en la carpeta | `false` |

### `md-deck serve <archivo.md>`

Genera + sirve localmente.

| Flag | Descripción | Default |
|---|---|---|
| `-p, --port <number>` | Puerto del servidor | `8080` |
| `--open` | Abrir browser automáticamente | `false` |
| `-t, --theme <name>` | Tema CSS | `default` |

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

## 📄 Licencia

MIT
