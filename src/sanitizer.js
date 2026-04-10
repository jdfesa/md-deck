/**
 * md-deck Sanitizer
 * Pre-processes Markdown content to fix formatting inconsistencies
 * before parsing it into slides.
 */

/**
 * Applies a strict set of formatting rules to normalize markdown syntax.
 * @param {string} markdown - The markdown body content (without frontmatter)
 * @returns {string} - Clean, standardized markdown content
 */
export function sanitizeMarkdown(markdown) {
  if (!markdown) return '';

  let sanitized = markdown;

  // Regla 1: Estandarización de viñetas
  // Reemplaza asteriscos (* ) o sumas (+ ) al inicio de las líneas por guiones medios (- )
  // Esto previene fallos del clasificador de secciones y estandariza el estilo interno
  sanitized = sanitized.replace(/^(\s*)([*+])\s+/gm, '$1- ');

  // Regla 2: Separadores
  // Garantiza que el delimitador de diapositiva (---) o subdiapositiva (--) 
  // tenga saltos de línea a su alrededor para evitar que se fusione con otros párrafos.
  // Solo lo hacemos para líneas formadas íntegramente por guiones (al menos 2).
  sanitized = sanitized.replace(/([^\n])\n(\s*-{2,}\s*)\n([^\n])/g, '$1\n\n$2\n\n$3');

  // Segunda pasada para atrapar aquellos consecutivos (ej: un texto justo encima de un ---)
  sanitized = sanitized.replace(/([^\n])\n(\s*-{2,}\s*)$/gm, '$1\n\n$2');
  sanitized = sanitized.replace(/^(\s*-{2,}\s*)\n([^\n])/gm, '$1\n\n$2');

  // Regla 3: Títulos seguros
  // Asegura que todos los encabezados tengan al menos un espacio entre el '#' y el texto.
  // Ejemplo: ##Objetivos -> ## Objetivos
  sanitized = sanitized.replace(/^(#{1,6})([^#\s])/gm, '$1 $2');

  return sanitized;
}
