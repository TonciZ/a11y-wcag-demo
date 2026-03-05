---
id: 1.4.3
title: Contrast (Minimum)
level: AA
wcag_url: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
---

## Description

The visual presentation of text and images of text must have a contrast ratio of at least 4.5:1 against their background. Large text - defined as 18pt (approximately 24px) or 14pt bold (approximately 18.67px bold) or larger - requires a lower minimum ratio of 3:1. Sufficient contrast is essential for users with low vision, color deficiencies, or those viewing screens in bright ambient light conditions.

## Fail Explanation

A failure occurs when text does not meet the minimum contrast ratio against its background color. Common failures include light grey text on a white background, muted brand-colored text that blends into its background, placeholder text in form fields that falls below the threshold, and text overlaid on images without a sufficiently opaque background. Users with low vision who do not use a screen reader rely on sufficient contrast to read text, and insufficient contrast can make content effectively unreadable.

## Pass Explanation

A passing implementation ensures that all text meets or exceeds the required contrast ratio. This is verified by calculating the relative luminance of the foreground and background colors using the WCAG contrast ratio formula. Normal text achieves at least 4.5:1 and large text achieves at least 3:1. Decorative text that conveys no information and text that is part of a logo or brand name is exempt from this requirement.

## How To Test

1. Identify text throughout the page, including body text, headings, links, button labels, form labels, placeholder text, and error messages.
2. Use a color contrast checking tool (such as the WebAIM Contrast Checker or browser developer tools) to measure the contrast ratio of text against its background.
3. Verify normal-sized text achieves at least 4.5:1 contrast ratio.
4. Verify large text (18pt or 14pt bold and larger) achieves at least 3:1 contrast ratio.
5. Check text that appears on images or gradient backgrounds, testing the worst-case background color under the text.
6. Check placeholder text in form inputs, which is often styled with insufficient contrast.
7. Confirm text in disabled controls is exempt, but note that decorative text and logo text are also exempt.

## Notes

Placeholder text in `<input>` elements is frequently a source of failure because it is often styled in grey to visually distinguish it from entered values, but must still meet the 4.5:1 minimum. Note that this criterion covers text contrast only; contrast requirements for user interface components and graphical objects are covered by 1.4.11 Non-text Contrast.
