/**
 * md-deck Renderer
 * Converts a slide AST into a complete, self-contained HTML file.
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

/**
 * Render the slide AST into a full HTML string.
 * @param {{ meta: import('./parser.js').SlideMeta, slides: import('./parser.js').Slide[] }} ast
 * @param {object} options
 * @param {string} [options.theme] - Theme name (default: 'default')
 * @returns {string} Complete HTML document
 */
export function render(ast, options = {}) {
  const { meta, slides } = ast;
  const themeName = options.theme || meta.theme || 'default';

  // 1. Load base template
  const template = readFileSync(join(ROOT, 'templates', 'base.html'), 'utf-8');

  // 2. Load theme CSS
  const themeCss = readFileSync(join(ROOT, 'themes', `${themeName}.css`), 'utf-8');

  // 3. Generate slides HTML
  const slidesHtml = slides.map(slide => renderSlide(slide, meta)).join('\n\n');

  // 4. Generate expiration script (if meta.expires is set)
  const expirationScript = meta.expires ? generateExpirationScript(meta.expires) : '';

  // 5. Assemble
  const title = meta.title || 'Presentation';
  const description = meta.subtitle || meta.title || '';
  const author = meta.author || '';
  const lang = meta.lang || 'es';

  let html = template
    .replace('{{lang}}', lang)
    .replace('{{title}}', escapeHtml(title))
    .replace('{{description}}', escapeHtml(description))
    .replace('{{author}}', escapeHtml(author))
    .replace('{{theme_css}}', themeCss)
    .replace('{{slides_html}}', slidesHtml)
    .replace('{{expiration_script}}', expirationScript);

  return html;
}

/**
 * Render a single slide into an HTML <section>.
 * @param {import('./parser.js').Slide} slide
 * @param {import('./parser.js').SlideMeta} meta
 * @returns {string}
 */
function renderSlide(slide, meta) {
  switch (slide.type) {
    case 'title':
      return renderTitleSlide(slide, meta);
    case 'section':
      return renderSectionSlide(slide);
    case 'end':
      return renderEndSlide(slide, meta);
    case 'content':
    default:
      return renderContentSlide(slide);
  }
}

/**
 * Render the title/cover slide.
 */
function renderTitleSlide(slide, meta) {
  const lines = slide.markdown.split('\n');
  const h1Match = lines[0]?.match(/^#\s+(.*)/);
  const title = h1Match ? h1Match[1].trim() : meta.title || 'Presentation';

  // Remaining lines become the subtitle
  const restLines = lines.slice(1).filter(l => l.trim() !== '');
  const subtitle = restLines.join('\n').trim();

  // Build metadata grid from frontmatter
  const metaItems = [];
  if (meta.institution) metaItems.push({ label: 'Institución', value: meta.institution });
  if (meta.subject) metaItems.push({ label: 'Materia', value: meta.subject });
  if (meta.professor) metaItems.push({ label: 'Profesor', value: meta.professor });
  if (meta.author) metaItems.push({ label: 'Autor', value: meta.author });
  if (meta.date) metaItems.push({ label: 'Fecha', value: meta.date });

  const metaHtml = metaItems.length > 0
    ? `<div class="title-meta">
${metaItems.map((item, i) => {
  // Make the last item span full width if odd count
  const isLast = i === metaItems.length - 1;
  const span = (isLast && metaItems.length % 2 !== 0) ? ' style="grid-column: span 2; text-align: center;"' : '';
  return `        <div class="meta-item"${span}>
          <span class="meta-label">${escapeHtml(item.label)}</span>
          <span class="meta-value">${escapeHtml(item.value)}</span>
        </div>`;
}).join('\n')}
      </div>`
    : '';

  const institutionBadge = meta.institution
    ? `<div class="institution-badge">🏛️ ${escapeHtml(meta.institution)}</div>`
    : '';

  const subtitleHtml = subtitle
    ? `<div class="subtitle" style="margin-bottom: 48px; opacity: 0.8; font-size: 0.75em;">${marked.parse(subtitle)}</div>`
    : '';

  return `      <section class="title-slide" data-background-color="#0a0a0f">
        ${institutionBadge}
        <h1>${escapeHtml(title)}</h1>
        ${subtitleHtml}
        ${metaHtml}
      </section>`;
}

/**
 * Render a section title slide with auto-numbered section.
 */
function renderSectionSlide(slide) {
  const lines = slide.markdown.split('\n').filter(l => l.trim() !== '');
  const h2Match = lines[0]?.match(/^##\s+(.*)/);
  const title = h2Match ? h2Match[1].trim() : 'Section';

  const descLines = lines.slice(1).filter(l => !l.startsWith('#'));
  const desc = descLines.join(' ').trim();

  const num = String(slide.sectionNumber).padStart(2, '0');

  const descHtml = desc
    ? `<p class="section-desc">${marked.parseInline(desc)}</p>`
    : '';

  return `      <section class="section-title" data-auto-animate>
        <div class="section-number">${num}</div>
        <h2>${escapeHtml(title)}</h2>
        ${descHtml}
      </section>`;
}

/**
 * Render the closing/thank-you slide.
 */
function renderEndSlide(slide, meta) {
  const lines = slide.markdown.split('\n').filter(l => l.trim() !== '');
  const h1Match = lines[0]?.match(/^#\s+(.*)/);
  const title = h1Match ? h1Match[1].trim() : '¡Gracias!';

  const restLines = lines.slice(1).filter(l => l.trim() !== '');
  const closingText = restLines.join(' ').trim();

  const closingHtml = closingText
    ? `<p class="subtitle" style="margin-bottom: 20px;">${escapeHtml(closingText)}</p>`
    : '';

  const infoLine = [meta.author, meta.institution, meta.date ? new Date().getFullYear() : null]
    .filter(Boolean).join(' · ');

  const infoHtml = infoLine
    ? `<div class="closing-info">${escapeHtml(infoLine)}</div>`
    : '';

  return `      <section class="end-slide" data-background-color="#0a0a0f">
        <div style="margin-bottom: 20px;">
          <span style="font-size: 3em;">🎓</span>
        </div>
        <h1 style="font-size: 2em;">${escapeHtml(title)}</h1>
        ${closingHtml}
        ${infoHtml}
      </section>`;
}

/**
 * Render a standard content slide.
 * Processes Obsidian-style callouts into styled components.
 */
function renderContentSlide(slide) {
  const md = slide.markdown;

  // Process the markdown through our custom pipeline
  const processedHtml = processMarkdown(md);

  return `      <section data-auto-animate>
${processedHtml}
      </section>`;
}

/**
 * Process markdown content into styled HTML.
 * Handles Obsidian callouts, images, and standard markdown.
 */
function processMarkdown(md) {
  // Pre-process: convert Obsidian callouts to HTML before marked
  let processed = preprocessCallouts(md);

  // Pre-process: wrap standalone images in diagram containers
  processed = preprocessImages(processed);

  // Pre-process: handle two-column layout markers
  processed = preprocessColumns(processed);

  // Run through marked
  const html = marked.parse(processed, {
    gfm: true,
    breaks: false,
  });

  // Post-process: indent for template (skip inside <pre> to preserve code formatting)
  const lines = html.split('\n');
  const result = [];
  let insidePre = false;
  for (const line of lines) {
    if (/<pre[^>]*>/i.test(line)) insidePre = true;
    result.push(insidePre ? line : '        ' + line);
    if (/<\/pre>/i.test(line)) insidePre = false;
  }
  return result.join('\n');
}

/**
 * Convert Obsidian-style callouts to styled HTML components.
 *
 * Supported callouts:
 *   > [!note] optional title    → highlight-box
 *   > [!tip] optional title     → highlight-box.tip
 *   > [!warning] optional title → highlight-box.warning
 *   > [!important]              → highlight-box.important
 *   > [!card] optional title    → content-card
 *   > [!problem] optional title → problem-box
 */
function preprocessCallouts(md) {
  const lines = md.split('\n');
  const result = [];
  let i = 0;

  while (i < lines.length) {
    const calloutMatch = lines[i].match(/^>\s*\[!(note|tip|warning|important|card|problem|caution)\]\s*(.*)?$/i);

    if (calloutMatch) {
      const type = calloutMatch[1].toLowerCase();
      const inlineTitle = (calloutMatch[2] || '').trim();
      const contentLines = [];
      i++;

      // Collect all subsequent `> ` lines
      while (i < lines.length && /^>/.test(lines[i])) {
        contentLines.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }

      const content = contentLines.join('\n').trim();
      const htmlContent = marked.parse(content, { gfm: true, breaks: false });

      if (type === 'card') {
        const titleHtml = inlineTitle ? `<h3>${escapeHtml(inlineTitle)}</h3>` : '';
        result.push(`<div class="content-card accent-primary">${titleHtml}${htmlContent}</div>`);
      } else if (type === 'problem') {
        const titleHtml = inlineTitle ? `<h3>${escapeHtml(inlineTitle)}</h3>` : '';
        result.push(`<div class="problem-box">${titleHtml}${htmlContent}</div>`);
      } else {
        // Highlight box variants
        const cssClass = type === 'note' ? '' : ` ${type}`;
        const prefix = type === 'tip' ? '💡 ' : type === 'warning' || type === 'caution' ? '⚠️ ' : type === 'important' ? '🔴 ' : '';
        const titleHtml = inlineTitle ? `<strong>${escapeHtml(inlineTitle)}</strong><br>` : '';
        result.push(`<div class="highlight-box${cssClass}">${prefix}${titleHtml}${htmlContent}</div>`);
      }
    } else {
      result.push(lines[i]);
      i++;
    }
  }

  return result.join('\n');
}

/**
 * Wrap standalone images (only content on a line) in diagram containers.
 */
function preprocessImages(md) {
  return md.replace(/^!\[([^\]]*)\]\(([^)]+)\)\s*$/gm, (match, alt, src) => {
    return `<div class="diagram-container"><img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}"></div>`;
  });
}

/**
 * Handle two-column layout markers.
 * Syntax:
 *   :::columns
 *   Left content...
 *   :::split
 *   Right content...
 *   :::end
 */
function preprocessColumns(md) {
  const lines = md.split('\n');
  const result = [];
  let i = 0;

  while (i < lines.length) {
    if (/^:::columns\s*$/i.test(lines[i])) {
      // Collect all column content until :::end
      const columns = [];
      let currentCol = [];
      i++;

      while (i < lines.length && !/^:::end\s*$/i.test(lines[i])) {
        if (/^:::split\s*$/i.test(lines[i])) {
          columns.push(currentCol.join('\n'));
          currentCol = [];
        } else {
          currentCol.push(lines[i]);
        }
        i++;
      }
      columns.push(currentCol.join('\n'));
      i++; // skip :::end

      // Parse each column through marked independently
      const colsHtml = columns.map(colMd => {
        const parsed = marked.parse(colMd.trim(), { gfm: true, breaks: false });
        return `<div>${parsed}</div>`;
      }).join('\n');

      result.push(`<div class="two-cols">${colsHtml}</div>`);
    } else {
      result.push(lines[i]);
      i++;
    }
  }

  return result.join('\n');
}

/**
 * Generate client-side JS that checks expiration date and shows an overlay.
 * @param {string} expiresDate - ISO date string (e.g. "2026-04-22")
 * @returns {string} Script tag HTML
 */
function generateExpirationScript(expiresDate) {
  return `
  <script>
    (function() {
      var expires = new Date('${expiresDate}T23:59:59');
      if (new Date() > expires) {
        document.addEventListener('DOMContentLoaded', function() {
          var overlay = document.createElement('div');
          overlay.className = 'expiration-overlay';
          overlay.innerHTML = '<h1>⏰ Presentación Expirada</h1>' +
            '<p>Esta presentación expiró el ' + expires.toLocaleDateString('es-AR') + '</p>' +
            '<p style="margin-top: 24px; font-size: 0.7em; opacity: 0.4;">md-deck</p>';
          document.body.prepend(overlay);
        });
      }
    })();
  </script>`;
}

/**
 * Escape HTML special characters.
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
