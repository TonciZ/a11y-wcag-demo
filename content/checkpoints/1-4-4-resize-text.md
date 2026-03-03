---
id: 1.4.4
title: Resize Text
level: AA
wcag_url: https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html
---

## Description

Text must be resizable up to 200 percent without assistive technology and without loss of content or functionality. Many users with low vision use browser zoom or operating system text size settings to increase text size to a readable level. If a website is built in a way that causes content to become hidden, truncated, or broken when text is enlarged, those users lose access to the content.

## Fail Explanation

A failure occurs when enlarging text to 200% causes content to be cut off, overlap other content, become hidden, or make functionality unavailable. Common failure patterns include fixed-height containers that clip overflowing text, absolutely positioned elements that overlap when text grows, navigation menus that collapse or break at larger text sizes, and text in buttons or labels that becomes truncated. Using viewport units or fixed pixel values for container heights without `overflow: auto` or `min-height` settings are common technical causes.

## Pass Explanation

A passing implementation uses relative units (such as `em`, `rem`, or percentages) for font sizes and container dimensions, and avoids fixed-height containers that would clip enlarged text. The layout is tested at 200% text zoom to confirm all content remains visible and readable and all interactive components remain operable. CSS `min-height` instead of `height`, and `overflow: visible` or `overflow: auto` rather than `overflow: hidden`, are practical implementation techniques.

## How To Test

1. Open the page in a browser and navigate to the browser's text size settings.
2. Increase the text size to 200% (or use Ctrl/Cmd + + to zoom to 200% in browsers where text zoom equals page zoom).
3. Read through all sections of the page and verify no text is clipped, hidden, or overlapping.
4. Verify all interactive controls (buttons, links, form inputs, menus) remain visible and operable.
5. Scroll horizontally if necessary and check that content has not been pushed off-screen or made inaccessible.
6. Test modal dialogs, tooltips, dropdown menus, and other dynamic content at 200% zoom.
7. Inspect the CSS for fixed-height containers with `overflow: hidden` that may clip enlarged text.

## Notes

This criterion specifically addresses text resize, not full-page zoom. However, in modern browsers, browser zoom also enlarges text, so testing with browser zoom at 200% is a practical and widely accepted testing method. The related criterion 1.4.10 Reflow covers the requirement that content must remain usable at 400% zoom without horizontal scrolling.
