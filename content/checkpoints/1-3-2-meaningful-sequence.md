---
id: 1.3.2
title: Meaningful Sequence
level: A
wcag_url: https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html
---

## Description

If the sequence in which content is presented affects its meaning, a correct reading sequence must be programmatically determinable. This means the order in which a screen reader or other assistive technology encounters content in the DOM must match the logical reading order that conveys the intended meaning. When visual layout is achieved with CSS positioning or tables, the underlying code order must still be meaningful.

## Fail Explanation

A failure occurs when CSS positioning, floats, or layout tables cause content to be read in a different order than it appears visually, resulting in nonsensical or confusing output for screen reader users. For example, if a sidebar column appears visually after a main content block but is positioned before it in the DOM, screen reader users will encounter sidebar navigation or advertisements before the main page content, disrupting comprehension.

## Pass Explanation

A passing implementation ensures that the DOM order of content reflects the logical reading sequence. When CSS is disabled or a screen reader reads the page linearly, the content still flows in a meaningful order. Authors achieve this by writing HTML in the correct order and using CSS only for visual presentation, not to reorder content that has semantic relationships.

## How To Test

1. Open the page and disable CSS (using browser developer tools or a browser extension).
2. Read through the page content without styling and verify it still flows in a logical, meaningful order.
3. Enable a screen reader (such as NVDA or VoiceOver) and use the arrow keys to read through the page linearly.
4. Check that the reading sequence matches the intended logical sequence of the content.
5. Inspect the DOM using browser developer tools and compare the source order to the visual order.
6. Look for use of CSS properties such as `position: absolute`, `float`, `flex-direction: row-reverse`, or CSS Grid `order` that may create a discrepancy between visual and DOM order.

## Notes

The criterion only applies when the sequence matters for understanding; purely decorative content with no reading-order dependency is not in scope. CSS `order` and `grid-template-areas` are common sources of meaningful sequence failures in modern layouts.
