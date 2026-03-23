/**
 * Color and contrast verification helpers.
 * Used for programmatic testing of WCAG 2.2 SC 1.4.1, 1.4.3, 1.4.4 pass demos.
 * Formulas per WCAG 2.2 (identical to 2.0/2.1 — the math is unchanged across versions).
 */

/**
 * Calculate relative luminance per WCAG 2.2 formula.
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {number} Relative luminance (0-1)
 */
export function relativeLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors.
 * @param {string} color1 - CSS color string (rgb/rgba)
 * @param {string} color2 - CSS color string (rgb/rgba)
 * @returns {number} Contrast ratio (1-21)
 */
export function contrastRatio(color1, color2) {
  const [r1, g1, b1] = parseRGB(color1);
  const [r2, g2, b2] = parseRGB(color2);
  const l1 = relativeLuminance(r1, g1, b1);
  const l2 = relativeLuminance(r2, g2, b2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Parse an rgb/rgba CSS string into [r, g, b].
 * @param {string} color - e.g. "rgb(255, 0, 0)" or "rgba(255, 0, 0, 1)"
 * @returns {number[]} [r, g, b]
 */
export function parseRGB(color) {
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return [0, 0, 0];
  return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
}

/**
 * Determine if text is "large" per WCAG (>=18px or >=14px bold).
 * @param {number} fontSize - in px
 * @param {number} fontWeight - numeric weight
 * @returns {boolean}
 */
export function isLargeText(fontSize, fontWeight) {
  return fontSize >= 18 || (fontSize >= 14 && fontWeight >= 700);
}

/**
 * Get the minimum required contrast ratio for text.
 * @param {boolean} large - Whether text is large per WCAG
 * @returns {number} 3.0 for large text, 4.5 for normal
 */
export function requiredRatio(large) {
  return large ? 3.0 : 4.5;
}
