/**
 * Focus visibility and order verification helpers.
 * Only checks site shell elements — skips anything inside .demo-container.
 */

/**
 * Check if the currently focused element has a visible focus indicator.
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<{visible: boolean, element: string, isInDemo: boolean}>}
 */
export async function checkFocusVisible(page) {
  return page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body || el === document.documentElement) {
      return { visible: true, element: 'body', isInDemo: false, index: -1, isBody: true };
    }

    const isInDemo = !!el.closest('.demo-container');
    const style = window.getComputedStyle(el);
    const outlineWidth = parseFloat(style.outlineWidth) || 0;
    const boxShadow = style.boxShadow;
    const hasOutline = outlineWidth > 0 && style.outlineStyle !== 'none';
    const hasBoxShadow = boxShadow && boxShadow !== 'none';

    // Also check if :focus-visible styles are applied via CSS rule matching
    // Chromium applies :focus-visible on keyboard navigation, but getComputedStyle
    // may not reflect it in some cases. Check if the element matches :focus-visible.
    let matchesFocusVisible = false;
    try { matchesFocusVisible = el.matches(':focus-visible'); } catch { /* old browsers */ }

    const tag = el.tagName.toLowerCase();
    const id = el.id ? `#${el.id}` : '';
    const cls = el.className && typeof el.className === 'string'
      ? `.${el.className.split(' ').filter(Boolean).join('.')}`
      : '';
    const text = (el.textContent || '').trim().slice(0, 30);
    const href = el.getAttribute('href') || '';

    // Use index among all focusable elements for unique identification
    const allFocusable = Array.from(document.querySelectorAll(
      'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ));
    const index = allFocusable.indexOf(el);

    return {
      visible: hasOutline || hasBoxShadow || matchesFocusVisible,
      element: `${tag}${id}${cls}`,
      uniqueKey: `${index}:${tag}${id}[${href}]{${text.slice(0, 20)}}`,
      isInDemo,
      index,
    };
  });
}

/**
 * Tab through the page and collect the focus order for site shell elements.
 * Stops when focus cycles back to an already-visited element or after maxTabs.
 * @param {import('@playwright/test').Page} page
 * @param {number} maxTabs
 * @returns {Promise<Array<{element: string, isInDemo: boolean, visible: boolean}>>}
 */
export async function collectFocusOrder(page, maxTabs = 100) {
  const focusPath = [];
  const seen = new Set();

  for (let i = 0; i < maxTabs; i++) {
    await page.keyboard.press('Tab');
    const info = await checkFocusVisible(page);

    // Use uniqueKey (index-based) for cycle detection instead of element string
    const key = info.uniqueKey || info.element;
    if (seen.has(key)) break;
    seen.add(key);
    focusPath.push(info);
  }

  return focusPath;
}

/**
 * Get only site shell focusable elements (outside .demo-container).
 * @param {Array<{element: string, isInDemo: boolean, visible: boolean}>} focusPath
 * @returns {Array<{element: string, visible: boolean}>}
 */
export function filterSiteShell(focusPath) {
  return focusPath.filter(item => !item.isInDemo);
}
