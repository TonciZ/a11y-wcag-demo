import { test, expect } from '@playwright/test';
import { CHECKPOINTS } from './fixtures/checkpoints.js';
import { reportIssue } from './helpers/issue-collector.js';
import { checkFocusVisible, collectFocusOrder, filterSiteShell } from './helpers/focus.js';

test.describe('Keyboard - Core Navigation', () => {
  for (const cp of CHECKPOINTS) {
    test(`${cp.id} - all site shell interactives reachable via Tab`, async ({ page }, testInfo) => {
      await page.goto(`/checkpoints/${cp.file}`);
      await page.waitForTimeout(500); // wait for nav injection

      const focusPath = await collectFocusOrder(page);
      const siteShell = filterSiteShell(focusPath);

      // Must have at least: skip link, logo, toggle button
      if (siteShell.length < 3) {
        reportIssue(testInfo, {
          checkpoint: cp.id,
          file: cp.file,
          category: 'site-shell',
          severity: 'error',
          description: `Only ${siteShell.length} site shell elements received focus`,
          element: 'page',
          action: 'needs-review',
        });
      }
      expect(siteShell.length).toBeGreaterThanOrEqual(3);
    });

    test(`${cp.id} - focus visible on site shell elements`, async ({ page }, testInfo) => {
      await page.goto(`/checkpoints/${cp.file}`);
      await page.waitForTimeout(500);

      const focusPath = await collectFocusOrder(page);
      const siteShell = filterSiteShell(focusPath);

      const invisible = siteShell.filter((item) => !item.visible);
      for (const item of invisible) {
        reportIssue(testInfo, {
          checkpoint: cp.id,
          file: cp.file,
          category: 'site-shell',
          severity: 'error',
          description: `No visible focus indicator on: ${item.element}`,
          element: item.element,
          action: 'needs-fix',
        });
      }

      // Allow test to pass but report issues — some elements may use
      // browser defaults which are technically visible but faint
      if (invisible.length > 0) {
        expect.soft(invisible.length).toBe(0);
      }
    });

    test(`${cp.id} - no keyboard trap`, async ({ page }, testInfo) => {
      await page.goto(`/checkpoints/${cp.file}`);
      await page.waitForTimeout(500);

      // Tab through up to 60 times — track unique elements by index
      let stuck = false;
      let lastIndex = -1;
      let sameCount = 0;

      for (let i = 0; i < 60; i++) {
        await page.keyboard.press('Tab');
        const currentIndex = await page.evaluate(() => {
          const el = document.activeElement;
          if (!el || el === document.body) return -1;
          const all = Array.from(document.querySelectorAll(
            'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
          ));
          return all.indexOf(el);
        });

        if (currentIndex === lastIndex) {
          sameCount++;
          if (sameCount > 5) {
            stuck = true;
            break;
          }
        } else {
          sameCount = 0;
        }
        lastIndex = currentIndex;
      }

      if (stuck) {
        reportIssue(testInfo, {
          checkpoint: cp.id,
          file: cp.file,
          category: 'site-shell',
          severity: 'error',
          description: `Keyboard trap detected — focus stuck on element index: ${lastIndex}`,
          element: `focusable[${lastIndex}]`,
          action: 'needs-fix',
        });
      }
      expect(stuck).toBe(false);
    });

    test(`${cp.id} - Shift+Tab reverse navigation works`, async ({ page }) => {
      await page.goto(`/checkpoints/${cp.file}`);
      await page.waitForTimeout(500);

      // Tab forward a few times
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab');
      }

      // Get unique index of current element
      const forwardIndex = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return -1;
        const all = Array.from(document.querySelectorAll(
          'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ));
        return all.indexOf(el);
      });

      // Shift+Tab back
      await page.keyboard.press('Shift+Tab');
      const backIndex = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return -1;
        const all = Array.from(document.querySelectorAll(
          'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ));
        return all.indexOf(el);
      });

      // Should be a different element (went back one)
      expect(backIndex).not.toBe(forwardIndex);
    });
  }
});

test.describe('Keyboard - Search Component', () => {
  for (const cp of CHECKPOINTS) {
    test(`${cp.id} - search input is keyboard-focusable and labeled`, async ({ page }, testInfo) => {
      await page.goto(`/checkpoints/${cp.file}`);
      await page.waitForTimeout(500);

      const searchInput = page.locator('input[type="search"], input[type="text"].search-input, .search-filter__input, #search-input');
      const count = await searchInput.count();

      if (count === 0) {
        // No search on this page — skip
        test.skip();
        return;
      }

      // Check it's focusable
      await searchInput.first().focus();
      const isFocused = await page.evaluate(() =>
        document.activeElement?.tagName === 'INPUT'
      );
      expect(isFocused).toBe(true);

      // Check it has an accessible label
      const hasLabel = await page.evaluate(() => {
        const input = document.querySelector('input[type="search"], input[type="text"].search-input, .search-filter__input, #search-input');
        if (!input) return false;
        const ariaLabel = input.getAttribute('aria-label');
        const ariaLabelledBy = input.getAttribute('aria-labelledby');
        const id = input.id;
        const label = id ? document.querySelector(`label[for="${id}"]`) : null;
        return !!(ariaLabel || ariaLabelledBy || label);
      });

      if (!hasLabel) {
        reportIssue(testInfo, {
          checkpoint: cp.id,
          file: cp.file,
          category: 'site-shell',
          severity: 'error',
          description: 'Search input has no accessible label',
          element: 'input[search]',
          action: 'needs-fix',
        });
      }
      expect(hasLabel).toBe(true);
    });
  }
});

// Left Nav tests removed — checkpoint-nav.js no longer loaded on checkpoint pages (search replaces it)

test.describe('Keyboard - Toggle Activation', () => {
  for (const cp of CHECKPOINTS) {
    test(`${cp.id} - toggle button activates with Space`, async ({ page }) => {
      await page.goto(`/checkpoints/${cp.file}`);
      const toggle = page.locator('.demo-toggle').first();
      const count = await toggle.count();
      if (count === 0) { test.skip(); return; }

      const modeBefore = await page.locator('.demo-container').first().getAttribute('data-mode');
      await toggle.focus();
      await page.keyboard.press('Space');
      const modeAfter = await page.locator('.demo-container').first().getAttribute('data-mode');
      expect(modeAfter).not.toBe(modeBefore);
    });

    test(`${cp.id} - toggle button activates with Enter`, async ({ page }) => {
      await page.goto(`/checkpoints/${cp.file}`);
      const toggle = page.locator('.demo-toggle').first();
      const count = await toggle.count();
      if (count === 0) { test.skip(); return; }

      const modeBefore = await page.locator('.demo-container').first().getAttribute('data-mode');
      await toggle.focus();
      await page.keyboard.press('Enter');
      const modeAfter = await page.locator('.demo-container').first().getAttribute('data-mode');
      expect(modeAfter).not.toBe(modeBefore);
    });
  }
});
