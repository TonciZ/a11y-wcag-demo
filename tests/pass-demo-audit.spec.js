import { test, expect } from '@playwright/test';
import { CHECKPOINTS } from './fixtures/checkpoints.js';
import { reportIssue } from './helpers/issue-collector.js';
import { toggleViaKeyboard } from './helpers/toggle.js';

/**
 * Switch to pass mode before each test.
 * All tests in this file inspect ONLY the pass demo content.
 */
async function switchToPass(page) {
  const container = page.locator('.demo-container').first();
  const mode = await container.getAttribute('data-mode');
  if (mode === 'fail') {
    await toggleViaKeyboard(page, 'Enter');
  }
}

test.describe('Pass Demo Audit - Semantic HTML', () => {
  for (const cp of CHECKPOINTS) {
    test(`${cp.id} - interactive elements use native HTML`, async ({ page }, testInfo) => {
      await page.goto(`/checkpoints/${cp.file}`);
      const container = page.locator('.demo-container').first();
      if ((await container.count()) === 0) { test.skip(); return; }
      await switchToPass(page);

      const issues = await page.evaluate(() => {
        const passPanel = document.querySelector('[data-demo-state="pass"]');
        if (!passPanel) return [];
        const found = [];

        // div/span with role="button" should be native <button>
        passPanel.querySelectorAll('div[role="button"], span[role="button"]').forEach((el) => {
          found.push({
            element: `${el.tagName.toLowerCase()}[role="button"]`,
            message: `Use native <button> instead of ${el.tagName.toLowerCase()}[role="button"]`,
          });
        });

        // div/span with role="link" should be native <a>
        passPanel.querySelectorAll('div[role="link"], span[role="link"]').forEach((el) => {
          found.push({
            element: `${el.tagName.toLowerCase()}[role="link"]`,
            message: `Use native <a> instead of ${el.tagName.toLowerCase()}[role="link"]`,
          });
        });

        // Check for redundant ARIA on native elements
        const implicitRoles = { button: 'button', a: 'link', input: 'textbox', select: 'listbox' };
        for (const [tag, role] of Object.entries(implicitRoles)) {
          passPanel.querySelectorAll(`${tag}[role="${role}"]`).forEach((el) => {
            found.push({
              element: `${tag}[role="${role}"]`,
              message: `Redundant role="${role}" on native <${tag}>`,
            });
          });
        }

        return found;
      });

      for (const item of issues) {
        reportIssue(testInfo, {
          checkpoint: cp.id,
          file: cp.file,
          category: 'pass-demo',
          severity: 'warning',
          description: item.message,
          element: item.element,
          action: 'needs-review',
        });
      }
      expect.soft(issues.length).toBe(0);
    });

    test(`${cp.id} - images have alt text`, async ({ page }, testInfo) => {
      await page.goto(`/checkpoints/${cp.file}`);
      const container = page.locator('.demo-container').first();
      if ((await container.count()) === 0) { test.skip(); return; }
      await switchToPass(page);

      const missingAlt = await page.evaluate(() => {
        const passPanel = document.querySelector('[data-demo-state="pass"]');
        if (!passPanel) return [];
        const imgs = passPanel.querySelectorAll('img');
        return Array.from(imgs)
          .filter((img) => !img.hasAttribute('alt'))
          .map((img) => img.src || img.className || 'unknown img');
      });

      for (const img of missingAlt) {
        reportIssue(testInfo, {
          checkpoint: cp.id,
          file: cp.file,
          category: 'pass-demo',
          severity: 'error',
          description: `Image missing alt attribute: ${img}`,
          element: 'img',
          action: 'needs-fix',
        });
      }
      expect.soft(missingAlt.length).toBe(0);
    });

    test(`${cp.id} - form inputs have associated labels`, async ({ page }, testInfo) => {
      await page.goto(`/checkpoints/${cp.file}`);
      const container = page.locator('.demo-container').first();
      if ((await container.count()) === 0) { test.skip(); return; }
      await switchToPass(page);

      const unlabeled = await page.evaluate(() => {
        const passPanel = document.querySelector('[data-demo-state="pass"]');
        if (!passPanel) return [];
        const inputs = passPanel.querySelectorAll('input, select, textarea');
        return Array.from(inputs)
          .filter((input) => {
            if (input.type === 'hidden') return false;
            const id = input.id;
            const hasLabel = id && document.querySelector(`label[for="${id}"]`);
            const wrappedInLabel = !!input.closest('label');
            const ariaLabel = input.getAttribute('aria-label');
            const ariaLabelledBy = input.getAttribute('aria-labelledby');
            return !(hasLabel || wrappedInLabel || ariaLabel || ariaLabelledBy);
          })
          .map((input) => ({
            type: input.type || input.tagName.toLowerCase(),
            id: input.id || '',
            name: input.name || '',
          }));
      });

      for (const input of unlabeled) {
        reportIssue(testInfo, {
          checkpoint: cp.id,
          file: cp.file,
          category: 'pass-demo',
          severity: 'error',
          description: `Form ${input.type} has no associated label (id: ${input.id}, name: ${input.name})`,
          element: `input[type="${input.type}"]`,
          action: 'needs-fix',
        });
      }
      expect.soft(unlabeled.length).toBe(0);
    });

    test(`${cp.id} - buttons and links have visible text`, async ({ page }, testInfo) => {
      await page.goto(`/checkpoints/${cp.file}`);
      const container = page.locator('.demo-container').first();
      if ((await container.count()) === 0) { test.skip(); return; }
      await switchToPass(page);

      const nameless = await page.evaluate(() => {
        const passPanel = document.querySelector('[data-demo-state="pass"]');
        if (!passPanel) return [];
        const found = [];

        passPanel.querySelectorAll('button, a[href]').forEach((el) => {
          const text = el.textContent?.trim();
          const ariaLabel = el.getAttribute('aria-label');
          const ariaLabelledBy = el.getAttribute('aria-labelledby');

          if (!text && !ariaLabel && !ariaLabelledBy) {
            found.push({
              tag: el.tagName.toLowerCase(),
              id: el.id || '',
              className: el.className || '',
            });
          }
        });

        return found;
      });

      for (const item of nameless) {
        reportIssue(testInfo, {
          checkpoint: cp.id,
          file: cp.file,
          category: 'pass-demo',
          severity: 'error',
          description: `${item.tag} has no accessible name (id: ${item.id}, class: ${item.className})`,
          element: item.tag,
          action: 'needs-fix',
        });
      }
      expect.soft(nameless.length).toBe(0);
    });
  }
});

test.describe('Pass Demo Audit - Structure & Focus', () => {
  for (const cp of CHECKPOINTS) {
    test(`${cp.id} - heading structure in pass demo`, async ({ page }, testInfo) => {
      await page.goto(`/checkpoints/${cp.file}`);
      const container = page.locator('.demo-container').first();
      if ((await container.count()) === 0) { test.skip(); return; }
      await switchToPass(page);

      const headings = await page.evaluate(() => {
        const passPanel = document.querySelector('[data-demo-state="pass"]');
        if (!passPanel) return [];
        const hs = passPanel.querySelectorAll('h1, h2, h3, h4, h5, h6');
        return Array.from(hs).map((h) => ({
          level: parseInt(h.tagName[1]),
          text: h.textContent.trim(),
        }));
      });

      // Only check if pass demo has headings
      if (headings.length === 0) return;

      for (let i = 1; i < headings.length; i++) {
        const prev = headings[i - 1].level;
        const curr = headings[i].level;
        if (curr > prev + 1) {
          reportIssue(testInfo, {
            checkpoint: cp.id,
            file: cp.file,
            category: 'pass-demo',
            severity: 'warning',
            description: `Pass demo: skipped heading h${prev} → h${curr}`,
            element: `h${curr}`,
            action: 'needs-review',
          });
          expect.soft(curr).toBeLessThanOrEqual(prev + 1);
        }
      }
    });

    test(`${cp.id} - interactive elements keyboard-focusable in pass demo`, async ({ page }, testInfo) => {
      await page.goto(`/checkpoints/${cp.file}`);
      const container = page.locator('.demo-container').first();
      if ((await container.count()) === 0) { test.skip(); return; }
      await switchToPass(page);

      const interactives = await page.evaluate(() => {
        const passPanel = document.querySelector('[data-demo-state="pass"]');
        if (!passPanel) return [];
        const els = passPanel.querySelectorAll('button, a[href], input, select, textarea, [tabindex]');
        return Array.from(els)
          .filter((el) => !el.hidden && el.offsetParent !== null)
          .map((el) => ({
            tag: el.tagName.toLowerCase(),
            tabIndex: el.tabIndex,
            text: el.textContent?.trim().slice(0, 50),
          }));
      });

      for (const el of interactives) {
        if (el.tabIndex < 0) {
          reportIssue(testInfo, {
            checkpoint: cp.id,
            file: cp.file,
            category: 'pass-demo',
            severity: 'warning',
            description: `Pass demo: ${el.tag} "${el.text}" has tabIndex=${el.tabIndex} (not keyboard-reachable)`,
            element: el.tag,
            action: 'needs-review',
          });
        }
        expect.soft(el.tabIndex).toBeGreaterThanOrEqual(0);
      }
    });

    test(`${cp.id} - focus visible in pass demo`, async ({ page }, testInfo) => {
      await page.goto(`/checkpoints/${cp.file}`);
      const container = page.locator('.demo-container').first();
      if ((await container.count()) === 0) { test.skip(); return; }
      await switchToPass(page);

      // Find interactive elements in pass demo and check focus visibility
      const interactiveCount = await page.evaluate(() => {
        const passPanel = document.querySelector('[data-demo-state="pass"]');
        if (!passPanel) return 0;
        return passPanel.querySelectorAll('button, a[href], input, select, textarea, [tabindex="0"]').length;
      });

      if (interactiveCount === 0) return;

      // Tab to the toggle button first (it's before demo content), then keep tabbing
      const toggle = page.locator('.demo-toggle').first();
      await toggle.focus();

      const invisibleElements = [];
      for (let i = 0; i < interactiveCount + 5; i++) {
        await page.keyboard.press('Tab');
        const result = await page.evaluate(() => {
          const el = document.activeElement;
          if (!el || el === document.body) return null;
          if (!el.closest('[data-demo-state="pass"]')) return null;

          const style = window.getComputedStyle(el);
          const hasOutline = parseFloat(style.outlineWidth) > 0 && style.outlineStyle !== 'none';
          const hasBoxShadow = style.boxShadow && style.boxShadow !== 'none';

          return {
            element: `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}`,
            visible: hasOutline || hasBoxShadow,
          };
        });

        if (result && !result.visible) {
          invisibleElements.push(result.element);
        }
      }

      for (const el of invisibleElements) {
        reportIssue(testInfo, {
          checkpoint: cp.id,
          file: cp.file,
          category: 'pass-demo',
          severity: 'warning',
          description: `Pass demo: no visible focus indicator on ${el}`,
          element: el,
          action: 'needs-review',
        });
      }
      expect.soft(invisibleElements.length).toBe(0);
    });
  }
});
