---
id: 2.1.4
title: Character Key Shortcuts
level: A
wcag_url: https://www.w3.org/WAI/WCAG22/Understanding/character-key-shortcuts.html
---

## Description

If a keyboard shortcut is implemented using only a single letter, punctuation, number, or symbol character key, then the user must be able to turn it off, remap it to include a modifier key (such as Ctrl, Alt, or Shift), or have it active only when the relevant component has focus. This criterion was introduced to address conflicts between web application shortcuts and the single-character shortcuts used by screen readers and other assistive technologies.

## Fail Explanation

A failure occurs when a web application binds functionality to a single character key globally — for example, pressing "S" to search or "D" to delete — with no way for the user to disable or remap that shortcut. Screen reader users often speak commands letter-by-letter or use single-key navigation shortcuts, and these will accidentally trigger the application's shortcut instead, causing unintended actions such as deleting content, submitting forms, or navigating away from the current view.

## Pass Explanation

A passing implementation either avoids single-character shortcuts altogether, or provides an accessible setting within the application to turn them off or reassign them to include a modifier key (such as Ctrl+S). Alternatively, a shortcut is acceptable if it only activates while a specific component — such as a search input — has keyboard focus, rather than firing globally across the entire page.

## How To Test

1. Review the page or application documentation for any advertised keyboard shortcuts.
2. Tab through the page and, without focusing any form field, press single letter keys (a–z), number keys, and common punctuation keys (/, ?, !, etc.).
3. Note any unintended actions that are triggered by these single-character keypresses.
4. If single-character shortcuts exist, look for a setting (often in a preferences or help menu) to turn them off or remap them to use a modifier key.
5. Verify the setting works and that shortcuts remain disabled or remapped after the setting is saved.
6. Confirm that shortcuts tied to a specific focused component (e.g., arrow key navigation inside a list) only fire when that component has focus.

## Notes

This criterion is particularly relevant for single-page applications and productivity tools (email clients, document editors, project management apps) that implement rich keyboard shortcut schemes. Shortcuts that already require a modifier key (e.g., Ctrl+S) are not subject to this criterion.
