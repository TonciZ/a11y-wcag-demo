---
id: 2.4.7
title: Focus Visible
level: AA
wcag_url: https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html
---

## Description

Any keyboard-operable user interface must have a mode of operation where the keyboard focus indicator is visible. When a user moves focus to an interactive element by pressing Tab or another keyboard key, there must be a visible visual change — typically a border, outline, highlight, or background color change — indicating which element currently has focus. Without a visible focus indicator, keyboard users cannot tell where they are on the page.

## Fail Explanation

A failure occurs most commonly when CSS contains `outline: none` or `outline: 0` applied to focused elements globally (e.g., `*:focus { outline: none; }`), removing the browser's default focus ring without providing a custom replacement. This leaves keyboard users with no visual indicator of their position on the page, making the entire interface unusable. Low-contrast or very thin custom focus styles that are not perceivable also constitute a failure, though this is more precisely addressed in WCAG 2.2's new 2.4.13 (Focus Appearance).

## Pass Explanation

A passing implementation ensures that every focusable element displays a clearly visible focus indicator when focused. The browser's default focus ring is acceptable, but custom focus styles must be visible enough to be noticed. Common passing approaches include a high-contrast outline (e.g., a 2px solid outline in a color with at least 3:1 contrast against adjacent colors), a background color change, or an underline. The focus style must be present on all interactive elements including links, buttons, form inputs, and custom widgets.

## How To Test

1. Navigate to the page using only the keyboard (Tab and Shift+Tab).
2. As you Tab through each element, observe whether a visible focus indicator appears on the currently focused element.
3. Check whether the focus indicator disappears on any element — this is a failure if `outline: none` is applied without a replacement.
4. Inspect the CSS for `outline: none`, `outline: 0`, or `box-shadow` replacements on `:focus` or `:focus-visible` states.
5. If a custom focus style is provided, assess whether it is visually distinct and perceivable against the background and surrounding content.
6. Test all interactive elements: links, buttons, inputs, selects, checkboxes, radio buttons, and custom widgets.

## Notes

WCAG 2.2 introduced the new criterion 2.4.11 (Focus Not Obscured) and 2.4.13 (Focus Appearance) to address additional aspects of focus visibility. Note that 2.4.7 is a relatively low bar — it only requires that focus be visible in some mode, not that the focus indicator meet specific size or contrast requirements. The `:focus-visible` CSS pseudo-class allows developers to show focus indicators for keyboard navigation only, without showing them on mouse click, which is an acceptable and widely used approach.
