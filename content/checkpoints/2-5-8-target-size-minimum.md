---
id: 2.5.8
title: Target Size (Minimum)
level: AA
wcag_url: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
---

## Description

This criterion, new in WCAG 2.2, requires that the size of pointer targets (areas that respond to pointer input such as mouse clicks or touch taps) is at least 24 by 24 CSS pixels, with an exception where targets that do not meet the minimum have sufficient spacing from adjacent targets such that the combined area of the target and its spacing meets the 24×24 pixel threshold. The related Level AAA criterion 2.5.5 requires a minimum of 44×44 CSS pixels with no spacing exception. This criterion reduces the difficulty of accurately tapping small targets for users with motor disabilities.

## Fail Explanation

A failure occurs when a tappable or clickable target is smaller than 24×24 CSS pixels and does not have sufficient spacing around it to compensate. For example, a row of small icon buttons spaced tightly together — each 16×16 pixels with only 2 pixels of gap — fails because the combined area of each icon plus its spacing is less than 24×24 pixels. Users with tremors, limited fine motor control, or who use assistive touch technology cannot reliably tap such small, densely packed targets without accidentally activating adjacent ones.

## Pass Explanation

A passing implementation either sizes all interactive targets to at least 24×24 CSS pixels, or provides sufficient spacing around smaller targets so that the spacing area around each target, when added to the target itself, covers a 24×24 CSS pixel area. For example, a 16×16 pixel icon button with 4 pixels of transparent padding on each side reaches an effective target area of 24×24 pixels and passes. Native HTML form controls typically meet the minimum in most browsers, but custom small icon buttons, inline links in dense text, and close/dismiss icons frequently fail.

## How To Test

1. Identify all pointer targets on the page: buttons, links, checkboxes, radio buttons, custom controls, and icon buttons.
2. Use browser DevTools to inspect the computed width and height of each target element, including any padding.
3. For targets smaller than 24×24 CSS pixels, measure the spacing between adjacent targets (the gap between the target's bounding box and the nearest adjacent target).
4. Calculate whether the target size plus the available spacing in each direction meets the 24×24 threshold.
5. Check that there is no other target within the 24×24 CSS pixel area around any failing target (which would reduce available spacing).
6. Pay special attention to icon-only buttons, social media share icons, close buttons on modals or toasts, and pagination links.

## Notes

This criterion is new in WCAG 2.2 and is particularly important for mobile and touch interfaces where small tap targets are a common usability and accessibility problem. Inline text links are exempt from this criterion when the size of the target is constrained by the line-height of the text. The 24×24 minimum is intentionally more achievable than the 44×44 target of 2.5.5 (Level AAA), but teams should aim for 44×44 as best practice wherever possible.
