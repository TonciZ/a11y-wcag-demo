import { test, expect } from '@playwright/test';
import { CHECKPOINTS } from './fixtures/checkpoints.js';
import { reportIssue } from './helpers/issue-collector.js';
import { getDemoMode, toggleViaKeyboard, getAnnouncement, getAnnouncementAttributes } from './helpers/toggle.js';

/** Regex to detect visual-reference language in announcements */
const VISUAL_REF_PATTERN = /\b(color|colour|red|green|blue|yellow|orange|purple|gray|grey|white|black|#[0-9a-fA-F]{3,8}|px|pixel|contrast ratio|font.size|bold|italic|underline|bright|dark(?![\s-]*mode))\b/i;

/** Checkpoints where visual terms are expected — verified programmatically instead */
const PROGRAMMATIC_VERIFY_IDS = ['1.4.1', '1.4.3', '1.4.4'];

test.describe('Demo Toggle - Mechanics', () => {
  for (const cp of CHECKPOINTS) {
    test(`${cp.id} - toggle switches data-mode`, async ({ page }) => {
      await page.goto(`/checkpoints/${cp.file}`);
      const container = page.locator('.demo-container').first();
      const count = await container.count();
      if (count === 0) { test.skip(); return; }

      expect(await container.getAttribute('data-mode')).toBe('fail');
      await toggleViaKeyboard(page, 'Enter');
      expect(await container.getAttribute('data-mode')).toBe('pass');
      await toggleViaKeyboard(page, 'Enter');
      expect(await container.getAttribute('data-mode')).toBe('fail');
    });

    test(`${cp.id} - toggle button is native <button>`, async ({ page }, testInfo) => {
      await page.goto(`/checkpoints/${cp.file}`);
      const toggle = page.locator('.demo-toggle').first();
      const count = await toggle.count();
      if (count === 0) { test.skip(); return; }

      const tagName = await toggle.evaluate((el) => el.tagName.toLowerCase());
      if (tagName !== 'button') {
        reportIssue(testInfo, {
          checkpoint: cp.id,
          file: cp.file,
          category: 'toggle',
          severity: 'error',
          description: `Toggle is <${tagName}> instead of native <button>`,
          element: '.demo-toggle',
          action: 'needs-fix',
        });
      }
      expect(tagName).toBe('button');
    });

    test(`${cp.id} - aria-pressed updates on toggle`, async ({ page }) => {
      await page.goto(`/checkpoints/${cp.file}`);
      const toggle = page.locator('.demo-toggle').first();
      const count = await toggle.count();
      if (count === 0) { test.skip(); return; }

      expect(await toggle.getAttribute('aria-pressed')).toBe('false');
      await toggleViaKeyboard(page, 'Enter');
      expect(await toggle.getAttribute('aria-pressed')).toBe('true');
      await toggleViaKeyboard(page, 'Enter');
      expect(await toggle.getAttribute('aria-pressed')).toBe('false');
    });
  }
});

test.describe('Demo Toggle - Announcements', () => {
  for (const cp of CHECKPOINTS) {
    test(`${cp.id} - announcement fires on toggle`, async ({ page }) => {
      await page.goto(`/checkpoints/${cp.file}`);
      const container = page.locator('.demo-container').first();
      const count = await container.count();
      if (count === 0) { test.skip(); return; }

      const before = await getAnnouncement(page);
      await toggleViaKeyboard(page, 'Enter');
      const after = await getAnnouncement(page);

      // Announcement should have changed
      expect(after.length).toBeGreaterThan(0);
      expect(after).not.toBe(before);
    });

    test(`${cp.id} - announcement uses functional language`, async ({ page }, testInfo) => {
      await page.goto(`/checkpoints/${cp.file}`);
      const container = page.locator('.demo-container').first();
      const count = await container.count();
      if (count === 0) { test.skip(); return; }

      // Skip keyword check for checkpoints verified programmatically in visual-verify.spec.js
      if (PROGRAMMATIC_VERIFY_IDS.includes(cp.id)) { test.skip(); return; }

      const attrs = await getAnnouncementAttributes(page);

      for (const [mode, text] of [['fail', attrs.fail], ['pass', attrs.pass]]) {
        if (!text) continue;
        const match = text.match(VISUAL_REF_PATTERN);
        if (match) {
          reportIssue(testInfo, {
            checkpoint: cp.id,
            file: cp.file,
            category: 'announcement',
            severity: 'warning',
            description: `${mode} announcement contains visual reference: "${match[0]}" in "${text}"`,
            element: `data-announce-${mode}`,
            action: 'needs-review',
          });
        }
        expect.soft(match).toBeNull();
      }
    });

    test(`${cp.id} - pass announcement matches data attribute`, async ({ page }) => {
      await page.goto(`/checkpoints/${cp.file}`);
      const container = page.locator('.demo-container').first();
      const count = await container.count();
      if (count === 0) { test.skip(); return; }

      const attrs = await getAnnouncementAttributes(page);
      if (!attrs.pass) { test.skip(); return; }

      await toggleViaKeyboard(page, 'Enter'); // switch to pass
      const announced = await getAnnouncement(page);
      expect(announced).toBe(attrs.pass);
    });

    test(`${cp.id} - fail announcement matches data attribute`, async ({ page }) => {
      await page.goto(`/checkpoints/${cp.file}`);
      const container = page.locator('.demo-container').first();
      const count = await container.count();
      if (count === 0) { test.skip(); return; }

      const attrs = await getAnnouncementAttributes(page);
      if (!attrs.fail) { test.skip(); return; }

      // Toggle to pass then back to fail
      await toggleViaKeyboard(page, 'Enter');
      await toggleViaKeyboard(page, 'Enter');
      const announced = await getAnnouncement(page);
      expect(announced).toBe(attrs.fail);
    });
  }
});

test.describe('Demo Toggle - ARIA Hygiene', () => {
  for (const cp of CHECKPOINTS) {
    test(`${cp.id} - no redundant ARIA on semantic elements`, async ({ page }, testInfo) => {
      await page.goto(`/checkpoints/${cp.file}`);

      const redundant = await page.evaluate(() => {
        const issues = [];
        // Map of element → implicit role
        const implicitRoles = {
          button: 'button',
          nav: 'navigation',
          main: 'main',
          header: 'banner',
          footer: 'contentinfo',
          form: 'form',
          aside: 'complementary',
          article: 'article',
          section: 'region',
        };

        // Only check site shell elements
        for (const [tag, role] of Object.entries(implicitRoles)) {
          const els = document.querySelectorAll(`${tag}[role="${role}"]`);
          for (const el of els) {
            if (el.closest('.demo-container')) continue;
            issues.push({
              element: `${tag}[role="${role}"]`,
              message: `Redundant role="${role}" on <${tag}> (implicit role)`,
            });
          }
        }

        // Check for div/span with role="button" in site shell
        const fakeBtns = document.querySelectorAll('div[role="button"], span[role="button"]');
        for (const el of fakeBtns) {
          if (el.closest('.demo-container')) continue;
          issues.push({
            element: `${el.tagName.toLowerCase()}[role="button"]`,
            message: `Use native <button> instead of ${el.tagName.toLowerCase()}[role="button"]`,
          });
        }

        return issues;
      });

      for (const item of redundant) {
        reportIssue(testInfo, {
          checkpoint: cp.id,
          file: cp.file,
          category: 'site-shell',
          severity: 'warning',
          description: item.message,
          element: item.element,
          action: 'needs-review',
        });
      }

      // Soft assertion — redundant ARIA is a warning, not a blocker
      expect.soft(redundant.length).toBe(0);
    });
  }
});
