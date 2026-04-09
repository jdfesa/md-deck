---
title: "Guía de Inicio Rápido"
subtitle: "Crea presentaciones épicas con md-deck"
author: "Equipo md-deck"
date: "2026-04-09"
institution: "Documentación md-deck"
subject: "Tutorial de Usuario"
lang: es
---

# Bienvenido a md-deck
El motor de presentaciones para desarrolladores

---

## ¿Qué es md-deck?
Es una herramienta CLI que toma un archivo **Markdown** y lo convierte en una presentación **Reveal.js** con diseño premium de forma instantánea.

---

### Componentes: Callouts
Usa la sintaxis de Obsidian para resaltar información importante.

:::columns

> [!note] Nota
> Para información general y aclaraciones.

> [!tip] Consejo
> Buenas prácticas y atajos útiles.

:::split

> [!warning] Advertencia
> Para puntos donde hay que tener cuidado.

> [!important] Vital
> Conceptos que no se pueden olvidar.

:::end

---

### Layout de Columnas
Perfecto para comparaciones o dividir texto y multimedia.

:::columns
#### Izquierda
- Listas de puntos
- Descripciones cortas
- Iconos
:::split
#### Derecha
```javascript
// O bloques de código
function hello() {
  console.log("Hello md-deck!");
}
```
:::end

---

### Tablas Estilizadas

| Característica | md-deck | Otros |
|---|---|---|
| Tiempo de diseño | 0 min | Horas |
| Control de versión | Git | Binario |
| Estética | Premium | Básica |

---

# ¡A crear!
Ejecuta `md-deck serve examples/guia-rapida.md` para ver esta presentación en vivo.
