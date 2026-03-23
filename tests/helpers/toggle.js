/**
 * Demo toggle interaction helpers.
 * Tests the toggle mechanism — never inspects demo content for a11y.
 */

/**
 * Get the current demo mode for a container.
 * @param {import('@playwright/test').Page} page
 * @param {number} index - Which demo container (0-based, for pages with multiple)
 * @returns {Promise<string>} "fail" or "pass"
 */
export async function getDemoMode(page, index = 0) {
  const container = page.locator('.demo-container').nth(index);
  return container.getAttribute('data-mode');
}

/**
 * Click the toggle button via keyboard (Tab to it, then press key).
 * @param {import('@playwright/test').Page} page
 * @param {'Enter'|'Space'} key
 * @param {number} index
 */
export async function toggleViaKeyboard(page, key = 'Enter', index = 0) {
  const button = page.locator('.demo-toggle').nth(index);
  await button.focus();
  await page.keyboard.press(key);
}

/**
 * Get the announcement text from the aria-live region.
 * @param {import('@playwright/test').Page} page
 * @param {number} index
 * @returns {Promise<string>}
 */
export async function getAnnouncement(page, index = 0) {
  const region = page.locator('[data-demo-announcement]').nth(index);
  return region.textContent();
}

/**
 * Get the data-announce-fail and data-announce-pass attribute values.
 * @param {import('@playwright/test').Page} page
 * @param {number} index
 * @returns {Promise<{fail: string|null, pass: string|null}>}
 */
export async function getAnnouncementAttributes(page, index = 0) {
  const container = page.locator('.demo-container').nth(index);
  const fail = await container.getAttribute('data-announce-fail');
  const pass = await container.getAttribute('data-announce-pass');
  return { fail, pass };
}
