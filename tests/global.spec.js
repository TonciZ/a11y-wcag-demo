import { test, expect } from '@playwright/test';
import { CHECKPOINTS, INDEX_PAGE } from './fixtures/checkpoints.js';
import { reportIssue } from './helpers/issue-collector.js';

test.describe('Global - Page Basics', () => {
  for (const cp of CHECKPOINTS) {
    test(`${cp.id} - page loads without errors`, async ({ page }, testInfo) => {
      const errors = [];
      page.on('pageerror', (err) => errors.push(err.message));

      const response = await page.goto(`/checkpoints/${cp.file}`);
      expect(response.status()).toBe(200);

      if (errors.length > 0) {
        reportIssue(testInfo, {
          checkpoint: cp.id,
          file: cp.file,
          category: 'site-shell',
          severity: 'warning',
          description: `Console errors: ${errors.join('; ')}`,
          element: 'page',
          action: 'needs-review',
        });
      }
    });

    test(`${cp.id} - has valid page title`, async ({ page }) => {
      await page.goto(`/checkpoints/${cp.file}`);
      const title = await page.title();
      expect(title).toBeTruthy();
      expect(title.trim().length).toBeGreaterThan(0);
      expect(title).toContain(cp.id);
    });
  }
});

test.describe('Global - Skip Link', () => {
  for (const cp of CHECKPOINTS) {
    test(`${cp.id} - skip link exists and is first focusable`, async ({ page }) => {
      await page.goto(`/checkpoints/${cp.file}`);

      // First Tab should focus the skip link
      await page.keyboard.press('Tab');
      const skipLink = await page.evaluate(() => {
        const el = document.activeElement;
        return {
          tag: el?.tagName?.toLowerCase(),
          href: el?.getAttribute('href'),
          text: el?.textContent?.trim(),
          className: el?.className,
        };
      });

      expect(skipLink.tag).toBe('a');
      expect(skipLink.href).toBe('#main-content');
      expect(skipLink.text.toLowerCase()).toContain('skip');
    });

    test(`${cp.id} - skip link moves focus to main content`, async ({ page }) => {
      await page.goto(`/checkpoints/${cp.file}`);

      await page.keyboard.press('Tab'); // focus skip link
      await page.keyboard.press('Enter'); // activate it

      // Main may not be directly focusable — check that focus moved
      // to main-content or a descendant of it, or that the hash changed
      const result = await page.evaluate(() => {
        const el = document.activeElement;
        const main = document.getElementById('main-content');
        return {
          focusedId: el?.id,
          isMain: el === main,
          isInMain: main?.contains(el),
          hash: window.location.hash,
        };
      });
      const focusMovedToMain = result.isMain || result.isInMain || result.hash === '#main-content';
      expect(focusMovedToMain).toBe(true);
    });
  }
});

test.describe('Global - Navigation', () => {
  for (const cp of CHECKPOINTS) {
    test(`${cp.id} - checkpoint pages do NOT have sidebar nav (search replaces it)`, async ({ page }) => {
      await page.goto(`/checkpoints/${cp.file}`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(500);
      const nav = page.locator('.checkpoint-nav');
      await expect(nav).not.toBeAttached();
    });
  }
});

test.describe('Global - Landmarks', () => {
  for (const cp of CHECKPOINTS) {
    test(`${cp.id} - has required landmarks`, async ({ page }, testInfo) => {
      await page.goto(`/checkpoints/${cp.file}`);

      // Check header/banner
      const header = page.locator('header, [role="banner"]');
      await expect(header).toBeAttached();

      // Check main
      const main = page.locator('main, [role="main"]');
      await expect(main).toBeAttached();

      // Nav landmark is optional on checkpoint pages (left nav removed, search replaces it)
      // Only report as info if missing, not an error

      // Check footer/contentinfo
      const footer = page.locator('footer, [role="contentinfo"]');
      await expect(footer).toBeAttached();

      // No duplicate main landmarks
      const mainCount = await page.locator('main').count();
      if (mainCount > 1) {
        reportIssue(testInfo, {
          checkpoint: cp.id,
          file: cp.file,
          category: 'site-shell',
          severity: 'error',
          description: `Multiple <main> landmarks found (${mainCount})`,
          element: 'main',
          action: 'needs-fix',
        });
      }
      expect(mainCount).toBe(1);

      // If multiple navs, check they have labels
      const navCount = await page.locator('nav').count();
      if (navCount > 1) {
        const unlabeledNavs = await page.evaluate(() => {
          const navs = document.querySelectorAll('nav');
          return Array.from(navs).filter(
            (n) => !n.getAttribute('aria-label') && !n.getAttribute('aria-labelledby')
          ).length;
        });
        if (unlabeledNavs > 0) {
          reportIssue(testInfo, {
            checkpoint: cp.id,
            file: cp.file,
            category: 'site-shell',
            severity: 'warning',
            description: `${unlabeledNavs} nav element(s) missing aria-label (${navCount} navs total)`,
            element: 'nav',
            action: 'needs-review',
          });
        }
      }
    });
  }
});

test.describe('Global - Heading Hierarchy', () => {
  for (const cp of CHECKPOINTS) {
    test(`${cp.id} - valid heading structure`, async ({ page }, testInfo) => {
      await page.goto(`/checkpoints/${cp.file}`);

      const headings = await page.evaluate(() => {
        // Only site shell headings — exclude demo container
        const all = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        return Array.from(all)
          .filter((h) => !h.closest('.demo-container'))
          .map((h) => ({
            level: parseInt(h.tagName[1]),
            text: h.textContent.trim(),
          }));
      });

      // Single h1
      const h1s = headings.filter((h) => h.level === 1);
      if (h1s.length !== 1) {
        reportIssue(testInfo, {
          checkpoint: cp.id,
          file: cp.file,
          category: 'site-shell',
          severity: 'error',
          description: `Expected 1 h1, found ${h1s.length}`,
          element: 'h1',
          action: 'needs-fix',
        });
      }
      expect(h1s.length).toBe(1);

      // No skipped levels
      for (let i = 1; i < headings.length; i++) {
        const prev = headings[i - 1].level;
        const curr = headings[i].level;
        // Can go deeper by 1, or jump back to any higher level
        if (curr > prev + 1) {
          reportIssue(testInfo, {
            checkpoint: cp.id,
            file: cp.file,
            category: 'site-shell',
            severity: 'error',
            description: `Skipped heading level: h${prev} → h${curr} ("${headings[i].text}")`,
            element: `h${curr}`,
            action: 'needs-fix',
          });
        }
        expect(curr).toBeLessThanOrEqual(prev + 1);
      }

      // No empty headings
      for (const h of headings) {
        if (!h.text || h.text.length === 0) {
          reportIssue(testInfo, {
            checkpoint: cp.id,
            file: cp.file,
            category: 'site-shell',
            severity: 'error',
            description: `Empty h${h.level} heading`,
            element: `h${h.level}`,
            action: 'needs-fix',
          });
        }
        expect(h.text.length).toBeGreaterThan(0);
      }
    });
  }
});

test.describe('Global - Paragraphs', () => {
  for (const cp of CHECKPOINTS) {
    test(`${cp.id} - has descriptive text content`, async ({ page }) => {
      await page.goto(`/checkpoints/${cp.file}`);

      const result = await page.evaluate(() => {
        const ps = document.querySelectorAll('main p');
        const siteShellPs = Array.from(ps)
          .filter((p) => !p.closest('.demo-container'))
          .map((p) => p.textContent.trim());
        const nonEmpty = siteShellPs.filter((t) => t.length > 0);
        const empty = siteShellPs.filter((t) => t.length === 0);
        return { total: siteShellPs.length, nonEmpty: nonEmpty.length, emptyCount: empty.length };
      });

      // Page should have at least some descriptive text
      expect(result.nonEmpty).toBeGreaterThan(0);
    });
  }
});

test.describe('Global - Links', () => {
  for (const cp of CHECKPOINTS) {
    test(`${cp.id} - links have meaningful text`, async ({ page }, testInfo) => {
      await page.goto(`/checkpoints/${cp.file}`);
      await page.waitForTimeout(500); // wait for nav injection

      const links = await page.evaluate(() => {
        const allLinks = document.querySelectorAll('a');
        return Array.from(allLinks)
          .filter((a) => !a.closest('.demo-container'))
          .map((a) => ({
            text: (a.textContent || '').trim(),
            ariaLabel: a.getAttribute('aria-label'),
            href: a.getAttribute('href'),
          }));
      });

      const genericTexts = ['click here', 'read more', 'here', 'link', 'more'];

      for (const link of links) {
        const name = link.ariaLabel || link.text;

        // Must have accessible name
        if (!name || name.length === 0) {
          reportIssue(testInfo, {
            checkpoint: cp.id,
            file: cp.file,
            category: 'site-shell',
            severity: 'error',
            description: `Link with no accessible name (href: ${link.href})`,
            element: `a[href="${link.href}"]`,
            action: 'needs-fix',
          });
        }
        expect(name?.length || 0).toBeGreaterThan(0);

        // No generic link text
        const lower = (name || '').toLowerCase().trim();
        if (genericTexts.includes(lower)) {
          reportIssue(testInfo, {
            checkpoint: cp.id,
            file: cp.file,
            category: 'site-shell',
            severity: 'warning',
            description: `Generic link text "${name}" (href: ${link.href})`,
            element: `a[href="${link.href}"]`,
            action: 'needs-review',
          });
        }
        expect(genericTexts).not.toContain(lower);

        // Valid href
        if (!link.href || link.href === '#') {
          reportIssue(testInfo, {
            checkpoint: cp.id,
            file: cp.file,
            category: 'site-shell',
            severity: 'warning',
            description: `Link with empty or "#" href: "${name}"`,
            element: `a`,
            action: 'needs-review',
          });
        }
      }
    });
  }
});
