# md-deck — Project Board & TODO

Este documento mantiene el estado actual del proyecto, indicando las fases completadas y el trabajo futuro.

## 🟢 Fase 1: Fundaciones (Completado)
- [x] Estructura inicial del proyecto Node.js (`package.json`, `.gitignore`).
- [x] Extracción del core de estilos de Reveal.js y componentes (creación de `themes/default.css`).
- [x] Setup del esqueleto (template) base de HTML (`templates/base.html`).

## 🟢 Fase 2: Motor Core (Completado)
- [x] Parser Markdown a AST de Slides (`src/parser.js`), reconociendo metadatos, separadores `---` e ignorando bloques de código.
- [x] Clasificador de tipos de slides: *Title, Section, Content, End*.
- [x] Renderer AST a HTML (`src/renderer.js`).
- [x] Soporte para componentes ricos (Callouts tipo Obsidian, Columnas `:::columns`).
- [x] Script local ligero de Server (`src/server.js`).

## 🟢 Fase 3: CLI e Integración (Completado)
- [x] Integración de `commander.js` (`bin/md-deck.js`).
- [x] Comando `build` para exportar a `/output`.
- [x] Comando `serve` con hot-preview y random ports (`--open`).
- [x] Copia automática de recursos gráficos (carpeta `img/` y `diagramas/`).
- [x] Funcionalidad de *Expiración Exclusiva* `--expires YYYY-MM-DD` (bloqueo Client-Side).

## 🟢 Fase 4: Documentación y Pulido (Completado)
- [x] README principal con la filosofía y un Quick Start.
- [x] Creación de la carpeta `docs/` con manuales de arquitectura y sintaxis avanzados.
- [x] Verificación visual de los componentes (Tarjetas, Callouts, Layouts).
- [x] Slide de ejemplo funcional con todas las features (`example.md`).

## 🟡 Fase 5: Despliegue y Distribución (Pendiente / En Progreso)
- [ ] Analizar flujos de despliegue a una línea: `md-deck deploy`.
  - *Posible integración con Netlify CLI, Surge, o Vercel CLI.*
- [ ] Refactorización si es necesaria para compatibilidad de sub-rutas en páginas estáticas.
- [ ] Soporte para empaquetado en un solo ejecutable en el futuro (si aplica) o simplemente publicar en NPM global.

## 🟣 Ideas a Futuro (Backlog)
- [ ] Soporte para plantillas customizables o más temas predefinidos (Light Mode / Material Theme).
- [ ] PDF Export incorporado (Print to PDF via Puppeteer / Playwright).
- [ ] Extensión de VS Code u Obsidian vinculada directamente al CLI.
