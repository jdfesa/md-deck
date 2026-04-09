/**
 * md-deck Parser
 * Converts a Markdown file into a slide AST (array of slide objects).
 *
 * Conventions:
 *   ---           → Slide separator (horizontal rule)
 *   --            → Vertical slide separator (sub-slide)
 *   # H1          → Title slide (first one becomes the cover)
 *   ## H2         → Section title slide (auto-numbered)
 *   ### H3        → Sub-heading within a slide
 *   > [!note]     → Highlight box (note style)
 *   > [!tip]      → Highlight box (tip style)
 *   > [!warning]  → Highlight box (warning style)
 *   > [!important]→ Highlight box (important style)
 *   > [!card]     → Content card
 *   > [!problem]  → Problem statement box
 *   ```lang       → Code block with syntax highlighting
 *   | table |     → Styled table
 *   ![alt](src)   → Image in diagram container
 *   {.two-cols}   → Two-column layout marker
 */

import matter from 'gray-matter';

/**
 * @typedef {Object} SlideMeta
 * @property {string} [title]
 * @property {string} [subtitle]
 * @property {string} [author]
 * @property {string} [date]
 * @property {string} [institution]
 * @property {string} [subject]
 * @property {string} [professor]
 * @property {string} [theme]
 * @property {string} [lang]
 * @property {string} [expires]
 */

/**
 * @typedef {Object} Slide
 * @property {'title'|'section'|'content'|'end'} type
 * @property {string} markdown - Raw markdown content of the slide
 * @property {number} [sectionNumber] - Auto-assigned section number for section slides
 */

/**
 * Parse a markdown string into frontmatter metadata and an array of slides.
 * @param {string} raw - Raw markdown file content
 * @returns {{ meta: SlideMeta, slides: Slide[] }}
 */
export function parse(raw) {
  // 1. Extract frontmatter
  const { data: meta, content } = matter(raw);

  // 2. Split content into raw slide blocks by `---`
  //    We need to be careful: `---` can appear in code blocks.
  const slideBlocks = splitSlides(content);

  // 3. Classify each block as a slide type
  let sectionCounter = 0;
  const slides = [];

  for (let i = 0; i < slideBlocks.length; i++) {
    const block = slideBlocks[i].trim();
    if (!block) continue;

    const slide = classifySlide(block, i, sectionCounter, slides.length === 0);
    if (slide.type === 'section') {
      sectionCounter++;
      slide.sectionNumber = sectionCounter;
    }
    slides.push(slide);
  }

  // Set defaults for meta
  meta.lang = meta.lang || 'es';
  meta.theme = meta.theme || 'default';

  return { meta, slides };
}

/**
 * Split markdown content by `---` slide separators, ignoring those inside code blocks.
 * @param {string} content
 * @returns {string[]}
 */
function splitSlides(content) {
  const lines = content.split('\n');
  const blocks = [];
  let current = [];
  let inCodeBlock = false;

  for (const line of lines) {
    // Track code block state
    if (line.trimStart().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
    }

    // Only treat `---` as separator outside code blocks
    if (!inCodeBlock && /^\s*---\s*$/.test(line)) {
      blocks.push(current.join('\n'));
      current = [];
    } else {
      current.push(line);
    }
  }

  // Push the last block
  if (current.length > 0) {
    blocks.push(current.join('\n'));
  }

  return blocks;
}

/**
 * Classify a slide block into a type based on its content.
 * @param {string} block - Trimmed markdown block
 * @param {number} index - Index in the original array
 * @param {number} sectionCount - Current section count
 * @param {boolean} isFirst - Whether this is the first non-empty slide
 * @returns {Slide}
 */
function classifySlide(block, index, sectionCount, isFirst) {
  const lines = block.split('\n').filter(l => l.trim() !== '');

  // Check if it's a title slide: starts with `# ` and is the first slide
  // or has very few lines (title + subtitle only)
  const firstLine = lines[0] || '';
  const isH1 = /^#\s+/.test(firstLine);

  if (isH1 && isFirst) {
    return { type: 'title', markdown: block };
  }

  // Check if it's a section title: starts with ## and has at most
  // 2 substantive lines (heading + optional description)
  const isH2 = /^##\s+/.test(firstLine) && !/^###/.test(firstLine);
  if (isH2 && lines.length <= 3) {
    // Short slide with only a heading and optionally a short description → section title
    const contentLines = lines.slice(1).filter(l => !l.startsWith('#'));
    const totalContentLength = contentLines.join(' ').length;
    if (totalContentLength < 200) {
      return { type: 'section', markdown: block, sectionNumber: 0 };
    }
  }

  // Check if it's an ending slide: last block with a short
  // thank-you or closing message
  // We don't autodetect this — user marks it with `# ¡Gracias!` or similar
  if (isH1 && !isFirst && lines.length <= 3) {
    return { type: 'end', markdown: block };
  }

  // Default: content slide
  return { type: 'content', markdown: block };
}
