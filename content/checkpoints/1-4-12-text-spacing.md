---
id: 1.4.12
title: Text Spacing
level: AA
wcag_url: https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html
---

## Description

No loss of content or functionality must occur when users apply the following text spacing overrides: line height set to at least 1.5 times the font size, letter spacing set to at least 0.12 times the font size, word spacing set to at least 0.16 times the font size, and spacing following paragraphs set to at least 2 times the font size. Users with dyslexia, low vision, or cognitive disabilities commonly apply custom text spacing through user stylesheets or browser extensions to improve readability, and content must not break under these adjustments.

## Fail Explanation

A failure occurs when applying the specified text spacing values causes content to become hidden, truncated, or to overlap in a way that makes it unreadable. Common failure patterns include fixed-height containers that clip text when line height increases, text in tooltips or modal dialogs that overflows its container when letter spacing is increased, navigation menu items that overlap when word spacing is expanded, and truncation of text within table cells or card components. Using CSS `overflow: hidden` on containers with fixed heights combined with pixel-based font sizes is a frequent cause of failure.

## Pass Explanation

A passing implementation ensures that the content remains fully readable and functional when any combination of the four text spacing properties is applied at their specified maximum values. This is achieved by using flexible container heights (with `min-height` rather than `height`), using relative units for sizing, and avoiding `overflow: hidden` on text containers. Layouts should be tested with a bookmarklet or browser extension that applies the maximum text spacing values simultaneously.

## How To Test

1. Install or create a bookmarklet that overrides text spacing to the WCAG 1.4.12 test values: line-height: 1.5em, letter-spacing: 0.12em, word-spacing: 0.16em, and paragraph spacing: 2em.
2. Activate the bookmarklet on the page being tested.
3. Scroll through all content and verify no text is clipped, hidden, or overlapping.
4. Test interactive components: menus, modals, tooltips, dropdowns, and accordions.
5. Verify all form labels, button text, and link text remain fully visible.
6. Inspect the DOM for containers using fixed heights with `overflow: hidden` that may clip expanded text.
7. Return text spacing to default and confirm the before/after comparison shows no loss of content.

## Notes

This criterion tests resilience to user overrides, not the default text spacing of the page itself. The WCAG Understanding document provides a test bookmarklet that applies all four spacing values simultaneously. Authors should note that this criterion was added in WCAG 2.1 and is commonly overlooked in design systems where card and tooltip heights are defined in pixels.
