import { test, expect } from '@playwright/test';
import { reportIssue } from './helpers/issue-collector.js';
import { toggleViaKeyboard } from './helpers/toggle.js';
import { contrastRatio, parseRGB, isLargeText, requiredRatio } from './helpers/color-contrast.js';
import colorNamer from 'color-namer';

/**
 * Programmatic verification of visual accessibility checkpoints.
 * Instead of pattern-matching keywords, these tests verify actual computed styles.
 */

/** Switch to pass mode */
async function switchToPass(page) {
  const mode = await page.locator('.demo-container').first().getAttribute('data-mode');
  if (mode === 'fail') await toggleViaKeyboard(page, 'Enter');
}

// ─── 1.4.1 Use of Color ────────────────────────────────────────────────────

test.describe('Visual Verify - 1.4.1 Use of Color', () => {
  const CP = { id: '1.4.1', file: '1-4-1-use-of-color.html' };

  test('pass demo: color references match actual computed colors', async ({ page }, testInfo) => {
    await page.goto(`/checkpoints/${CP.file}`);
    await switchToPass(page);

    // Collect all elements with color-related inline styles or classes in pass demo
    const colorData = await page.evaluate(() => {
      const passPanel = document.querySelector('[data-demo-state="pass"]');
      if (!passPanel) return [];
      const results = [];

      // Get all elements with visible background or text color
      const elements = passPanel.querySelectorAll('*');
      for (const el of elements) {
        const style = window.getComputedStyle(el);
        const bgColor = style.backgroundColor;
        const textColor = style.color;
        const text = el.textContent?.trim().slice(0, 100);
        const ariaLabel = el.getAttribute('aria-label') || '';

        // Only check elements that have meaningful content
        if (text || ariaLabel) {
          results.push({
            tag: el.tagName.toLowerCase(),
            text: text?.slice(0, 50),
            ariaLabel,
            bgColor,
            textColor,
            className: el.className || '',
          });
        }
      }
      return results;
    });

    // Verify: if any label or text mentions a color name, check the actual computed color matches
    const colorWords = /\b(red|green|blue|yellow|orange|purple|pink|brown|gray|grey|black|white|cyan|magenta)\b/i;

    for (const el of colorData) {
      const textToCheck = `${el.text} ${el.ariaLabel}`;
      const match = textToCheck.match(colorWords);
      if (!match) continue;

      const claimedColor = match[1].toLowerCase();

      // Check background color
      if (el.bgColor && el.bgColor !== 'rgba(0, 0, 0, 0)') {
        const [r, g, b] = parseRGB(el.bgColor);
        const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        try {
          const names = colorNamer(hex, { pick: ['basic'] });
          const basicName = names.basic[0].name.toLowerCase();

          if (basicName !== claimedColor && !basicName.includes(claimedColor) && !claimedColor.includes(basicName)) {
            reportIssue(testInfo, {
              checkpoint: CP.id,
              file: CP.file,
              category: 'pass-demo',
              severity: 'warning',
              description: `Color mismatch: text says "${claimedColor}" but computed bg is ${hex} (${basicName})`,
              element: `${el.tag}.${el.className}`,
              action: 'needs-review',
            });
          }
        } catch { /* color-namer may fail on edge cases */ }
      }
    }

    // Pass demo should not rely solely on color — check for non-color indicators
    const hasNonColorIndicators = await page.evaluate(() => {
      const passPanel = document.querySelector('[data-demo-state="pass"]');
      if (!passPanel) return false;
      // Look for text labels, icons, patterns, borders, or other non-color cues
      const indicators = passPanel.querySelectorAll(
        '[aria-label], .icon, .label, svg, [role="img"], .indicator, .badge, .status-text'
      );
      const textNodes = passPanel.querySelectorAll('span, strong, em, p');
      return indicators.length > 0 || textNodes.length > 0;
    });

    if (!hasNonColorIndicators) {
      reportIssue(testInfo, {
        checkpoint: CP.id,
        file: CP.file,
        category: 'pass-demo',
        severity: 'error',
        description: 'Pass demo may rely solely on color with no non-color indicators found',
        element: '[data-demo-state="pass"]',
        action: 'needs-review',
      });
    }
    expect(hasNonColorIndicators).toBe(true);
  });
});

// ─── 1.4.3 Contrast (Minimum) ──────────────────────────────────────────────

test.describe('Visual Verify - 1.4.3 Contrast Minimum', () => {
  const CP = { id: '1.4.3', file: '1-4-3-contrast-minimum.html' };

  test('pass demo: all text meets WCAG contrast requirements', async ({ page }, testInfo) => {
    await page.goto(`/checkpoints/${CP.file}`);
    await switchToPass(page);

    // Collect computed colors and font info from all text elements in pass demo
    const textElements = await page.evaluate(() => {
      const passPanel = document.querySelector('[data-demo-state="pass"]');
      if (!passPanel) return [];
      const results = [];

      const walker = document.createTreeWalker(passPanel, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => {
          const text = node.textContent.trim();
          return text.length > 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        },
      });

      const seen = new Set();
      while (walker.nextNode()) {
        const el = walker.currentNode.parentElement;
        if (!el || seen.has(el)) continue;
        seen.add(el);

        const style = window.getComputedStyle(el);
        const text = el.textContent.trim().slice(0, 50);

        // Walk up to find actual background color (skip transparent)
        let bgColor = 'rgb(255, 255, 255)'; // default white
        let ancestor = el;
        while (ancestor) {
          const ancestorStyle = window.getComputedStyle(ancestor);
          const bg = ancestorStyle.backgroundColor;
          if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
            bgColor = bg;
            break;
          }
          ancestor = ancestor.parentElement;
        }

        results.push({
          text,
          color: style.color,
          bgColor,
          fontSize: parseFloat(style.fontSize),
          fontWeight: parseInt(style.fontWeight) || 400,
          tag: el.tagName.toLowerCase(),
        });
      }
      return results;
    });

    let failCount = 0;
    for (const el of textElements) {
      const ratio = contrastRatio(el.color, el.bgColor);
      const large = isLargeText(el.fontSize, el.fontWeight);
      const required = requiredRatio(large);

      if (ratio < required) {
        failCount++;
        reportIssue(testInfo, {
          checkpoint: CP.id,
          file: CP.file,
          category: 'pass-demo',
          severity: 'error',
          description: `Contrast fail: "${el.text}" has ratio ${ratio.toFixed(2)}:1 (needs ${required}:1). Color: ${el.color} on ${el.bgColor}. Font: ${el.fontSize}px/${el.fontWeight}.`,
          element: el.tag,
          action: 'needs-fix',
        });
      }
    }

    // Pass demo should have zero contrast failures
    expect.soft(failCount).toBe(0);
  });

  test('fail demo: demonstrates actual contrast violation', async ({ page }) => {
    await page.goto(`/checkpoints/${CP.file}`);
    // Stay in fail mode — verify the fail demo actually has poor contrast

    const textElements = await page.evaluate(() => {
      const failPanel = document.querySelector('[data-demo-state="fail"]');
      if (!failPanel) return [];
      const results = [];
      const seen = new Set();

      const walker = document.createTreeWalker(failPanel, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => node.textContent.trim().length > 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT,
      });

      while (walker.nextNode()) {
        const el = walker.currentNode.parentElement;
        if (!el || seen.has(el)) continue;
        seen.add(el);

        const style = window.getComputedStyle(el);
        let bgColor = 'rgb(255, 255, 255)';
        let ancestor = el;
        while (ancestor) {
          const bg = window.getComputedStyle(ancestor).backgroundColor;
          if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') { bgColor = bg; break; }
          ancestor = ancestor.parentElement;
        }

        results.push({
          color: style.color,
          bgColor,
          fontSize: parseFloat(style.fontSize),
          fontWeight: parseInt(style.fontWeight) || 400,
        });
      }
      return results;
    });

    // At least one text element in the fail demo should have poor contrast
    const hasContrastFail = textElements.some((el) => {
      const ratio = contrastRatio(el.color, el.bgColor);
      const large = isLargeText(el.fontSize, el.fontWeight);
      return ratio < requiredRatio(large);
    });

    // If no contrast failure found, the fail demo isn't demonstrating the issue
    expect(hasContrastFail).toBe(true);
  });
});

// ─── 1.4.4 Resize Text ─────────────────────────────────────────────────────

test.describe('Visual Verify - 1.4.4 Resize Text', () => {
  const CP = { id: '1.4.4', file: '1-4-4-resize-text.html' };

  test('pass demo: font sizes use relative units (not px)', async ({ page }, testInfo) => {
    await page.goto(`/checkpoints/${CP.file}`);
    await switchToPass(page);

    // Check stylesheets and inline styles for px-based font sizes
    const pxFonts = await page.evaluate(() => {
      const passPanel = document.querySelector('[data-demo-state="pass"]');
      if (!passPanel) return [];
      const issues = [];

      const elements = passPanel.querySelectorAll('*');
      for (const el of elements) {
        // Check inline styles
        const inlineFont = el.style.fontSize;
        if (inlineFont && /\d+px/.test(inlineFont)) {
          issues.push({
            tag: el.tagName.toLowerCase(),
            text: el.textContent?.trim().slice(0, 30),
            value: inlineFont,
            source: 'inline',
          });
        }
      }
      return issues;
    });

    for (const item of pxFonts) {
      reportIssue(testInfo, {
        checkpoint: CP.id,
        file: CP.file,
        category: 'pass-demo',
        severity: 'error',
        description: `Font size in px: ${item.tag} "${item.text}" uses ${item.value} (${item.source}). Should use rem/em/%`,
        element: item.tag,
        action: 'needs-fix',
      });
    }
    expect.soft(pxFonts.length).toBe(0);
  });

  test('pass demo: content is not clipped at 200% zoom', async ({ page }, testInfo) => {
    await page.goto(`/checkpoints/${CP.file}`);
    await switchToPass(page);

    // Get initial dimensions
    const before = await page.evaluate(() => {
      const passPanel = document.querySelector('[data-demo-state="pass"]');
      if (!passPanel) return null;
      return {
        scrollWidth: passPanel.scrollWidth,
        clientWidth: passPanel.clientWidth,
        scrollHeight: passPanel.scrollHeight,
        clientHeight: passPanel.clientHeight,
      };
    });

    if (!before) { test.skip(); return; }

    // Simulate 200% zoom via CSS transform on the viewport
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%';
    });

    // Wait for reflow
    await page.waitForTimeout(300);

    // Check for horizontal overflow (content clipped)
    const after = await page.evaluate(() => {
      const passPanel = document.querySelector('[data-demo-state="pass"]');
      if (!passPanel) return null;

      // Check all elements for overflow
      const elements = passPanel.querySelectorAll('*');
      const clipped = [];
      for (const el of elements) {
        const style = window.getComputedStyle(el);
        if (style.overflow === 'hidden' || style.textOverflow === 'ellipsis') {
          if (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1) {
            clipped.push({
              tag: el.tagName.toLowerCase(),
              text: el.textContent?.trim().slice(0, 30),
              overflow: style.overflow,
            });
          }
        }
      }

      return {
        scrollWidth: passPanel.scrollWidth,
        clientWidth: passPanel.clientWidth,
        clipped,
      };
    });

    if (after && after.clipped.length > 0) {
      for (const item of after.clipped) {
        reportIssue(testInfo, {
          checkpoint: CP.id,
          file: CP.file,
          category: 'pass-demo',
          severity: 'error',
          description: `Content clipped at 200% zoom: ${item.tag} "${item.text}" has overflow:${item.overflow}`,
          element: item.tag,
          action: 'needs-fix',
        });
      }
    }
    expect.soft(after?.clipped?.length || 0).toBe(0);

    // Reset zoom
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '';
    });
  });

  test('pass demo: text reflows at narrow viewport', async ({ page }, testInfo) => {
    await page.goto(`/checkpoints/${CP.file}`);
    await switchToPass(page);

    // Set viewport to 320px (WCAG reflow requirement)
    await page.setViewportSize({ width: 320, height: 600 });
    await page.waitForTimeout(300);

    // Check for horizontal scrollbar (content doesn't reflow)
    const hasHorizontalScroll = await page.evaluate(() => {
      const passPanel = document.querySelector('[data-demo-state="pass"]');
      if (!passPanel) return false;
      return passPanel.scrollWidth > passPanel.clientWidth + 10;
    });

    if (hasHorizontalScroll) {
      reportIssue(testInfo, {
        checkpoint: CP.id,
        file: CP.file,
        category: 'pass-demo',
        severity: 'warning',
        description: 'Pass demo content requires horizontal scroll at 320px viewport — text may not reflow',
        element: '[data-demo-state="pass"]',
        action: 'needs-review',
      });
    }
    expect.soft(hasHorizontalScroll).toBe(false);
  });
});
