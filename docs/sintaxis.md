# Sintaxis y Compontentes en md-deck

Esta guía detalla toda la sintaxis especial provista nativamente por al renderizador personalizado.

## 1. Reglas Generales

- **Separación de diapositivas**: Se puede hacer de forma completamente manual aislando el marcador `---` entre líneas vacías. Sin embargo, si `md-deck` procesa el documento y no encuentra ni una sola vez este símbolo, disparará de forma silenciosa un **Auto-Paginador inteligente** seccionando el documento nativamente empleando los subtítulos (`##` y `###`) a modo de quiebre algorítmico y manteniendo así compatibilidad nativa con documentos genéricos.
- Las imágenes deben estar en una subcarpeta a nivel de tu archivo llamada `img/` o `diagramas/`. Al empaquetar, `md-deck` detectará y copiará esa carpeta hacia el Output.

---

## 2. Metadatos del Frontmatter

La cabecera YAML obligatoria (como mínimo el title) se estructura así:

```yaml
---
title: "Título principal"
subtitle: "Subtítulo de la portada"
author: "Tu nombre real o nick"
date: "Cualquier string, ej: 10 de Marzo"
institution: "Nombre de tu escuela o espacio"
subject: "Nombre del curso o la materia"
professor: "Referencia adicional"
lang: es # Idioma, para las properties de HTML.
expires: "2026-10-10" # Bloquea el render de la presentation desde esta fecha.
---
```

---

## 3. Comandos de Layout (Estructura en Pantalla)

En ocasiones es vital dividir el contenido en 2 áreas de trabajo, por ejemplo conceptualización a la izquierda, código a la derecha.

```markdown
:::columns

**Columna Izquierda**
Aquí va información descriptiva.
Puedes poner callouts, imágenes o listas.

:::split

**Columna Derecha**
Aquí suele ir información complementaria. 

:::end
```

---

## 4. Callouts / Cajas de Destacados

Inspirados en la sintaxis nativa de *Obsidian.md*. Generan contenedores con bordes remarcados del lado izquierdo e iconos dinámicos acordes a la temática de la caja.

**Sintaxis base:**
`> [!tipo] Título Opcional`
`> Contenido multilínea...`

### Lista de Callouts soportados por CSS:

- `> [!note]` (Color azul genérico, para notas base).
- `> [!tip]` (Color amarillo/dorado, para consejos y buenas prácticas).
- `> [!warning]` (Color naranja, para alertas sintácticas).
- `> [!important]` (Color rojo rosáceo fuerte, para énfasis vital).
- `> [!problem]` (Color púrpura claro, para plantear "Enunciados" de problemas).
- `> [!card]` (Variante neutra ideal para armar componentes como "Cards", útil en layouts tipo *columns*).

Ejemplo visible:

> [!important] Requerimiento Crítico
> El sistema fallará si esto no es completado a tiempo.

---

## 5. Expiración Temporizada (El Switch de la Destrucción)

Una función clave de la arquitectura diseñada es permitirte tener "charlas efímeras" o temporizadas mediante javascript client-side nativo.

Si incluyes `expires: "YYYY-MM-DD"` en el *frontmatter* o pasas el flag de terminal `--expires YYYY-MM-DD`, cuando el index trate de procesarse (al publicarlo), validará la fecha del usuario, si la fecha del cliente sobrepasa el límite, sobrescribirá el DOM mostrando una pantalla Fullscreen indicando el final de la vida útil de esta presentación temporal.
