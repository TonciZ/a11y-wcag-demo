---
id: 2.4.13
title: Focus Appearance
level: AA
wcag_url: https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html
---

## Description

This criterion, new in WCAG 2.2, establishes minimum measurable requirements for the visual appearance of keyboard focus indicators. When the keyboard focus indicator is visible, it must: (1) have a focus indicator area of at least the perimeter of the unfocused component multiplied by a 2 CSS pixel outline; (2) have a contrast ratio of at least 3:1 between the pixels in the focused and unfocused states; and (3) not be fully obscured by author-created content. This criterion provides measurable thresholds that the weaker 2.4.7 (Focus Visible) does not.

## Fail Explanation

A failure occurs when a custom focus indicator is too small or too low-contrast to be reliably perceivable. For example, a 1px dotted outline in a medium gray color on a white background, or a very thin outline that only appears on one side of an element, may technically be "visible" but fails the size and contrast requirements of this criterion. Users with low vision who do not use screen readers depend heavily on a clear, high-contrast focus ring to track their keyboard position on the page.

## Pass Explanation

A passing implementation provides a focus indicator that meets both the size and contrast thresholds. The minimum size requirement is roughly equivalent to a solid 2px outline that traces the full perimeter of the focused component. The contrast requirement means the outline color (or the change in appearance) must contrast at 3:1 or greater against both the unfocused state of the component and the adjacent background. A common passing implementation is a 3px solid outline in a dark color (e.g., black or dark blue) combined with an offset so the outline appears around the element boundary with a white gap between the element and the outline.

## How To Test

1. Navigate to the page using only the keyboard and observe the focus indicator on each interactive element.
2. For each focus indicator, estimate its width and perimeter - it should be at least equivalent to a 2px outline around the full component boundary.
3. Use a color contrast checking tool (such as the APCA Colour Contrast Checker or browser DevTools) to measure the contrast between the focused state pixels and the unfocused state pixels.
4. Verify the contrast ratio is at least 3:1 between focused and unfocused states.
5. Check that the focus indicator is not partially or fully hidden by other elements.
6. Pay particular attention to custom buttons, links with removed underlines, and form controls with custom styling.

## Notes

This criterion is new in WCAG 2.2 and is one of the most technically specific criteria in the standard, providing concrete measurable thresholds. It applies to focus indicators that are author-created - the browser's default focus ring is generally acceptable if it meets the thresholds, but browser defaults vary significantly. Designers should explicitly specify focus styles rather than relying on browser defaults to ensure compliance.
