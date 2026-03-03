---
id: 4.1.2
title: Name, Role, Value
level: A
wcag_url: https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html
---

## Description

For all user interface components — including form elements, links, and custom widgets created with scripting — the following must be programmatically determinable or settable: the name and role of the component, and any states, properties, and values that can be set by the user. This criterion ensures that assistive technologies such as screen readers can identify what a component is (its role), what it is called (its name), and what state it is in (e.g., expanded, selected, checked). It is the foundation of accessible rich internet applications and applies to every interactive element on a page.

## Fail Explanation

A custom button built from a `<div>` or `<span>` element that has no `role` attribute and no accessible name fails this criterion, because a screen reader has no way to identify it as a button or know what it does. Similarly, a custom accordion widget that expands and collapses content but does not use `aria-expanded` to communicate its state leaves screen reader users unable to know whether the panel is open or closed. Using images as buttons without `alt` text, or linking icons without accessible names, are also very common failures.

## Pass Explanation

A component passes when it has a programmatically determinable accessible name (from visible label text, `aria-label`, `aria-labelledby`, or an `alt` attribute), a correct semantic role (either from native HTML semantics or an explicit ARIA `role`), and accurate state information conveyed via ARIA attributes (such as `aria-expanded`, `aria-checked`, `aria-selected`, `aria-pressed`). Native HTML elements like `<button>`, `<input>`, `<select>`, and `<a href>` satisfy these requirements when used correctly with proper labels; custom widgets require explicit ARIA and scripting to achieve the same result.

## How To Test

1. Using browser developer tools or an accessibility tree inspector (e.g., Firefox Accessibility panel), examine every interactive element on the page.
2. Confirm each element has a non-empty accessible name (visible label, `aria-label`, `aria-labelledby`, or `alt` text for images).
3. Confirm each element has an appropriate role — either from native HTML semantics (button, link, checkbox) or an explicit `role` attribute.
4. For stateful components (accordions, toggles, tabs, checkboxes, comboboxes), confirm the current state is communicated through the appropriate ARIA attribute.
5. Test with a screen reader (e.g., NVDA + Chrome or VoiceOver + Safari): navigate to each interactive control and confirm its name, role, and state are announced correctly.
6. Activate interactive controls (open accordions, toggle switches, select tabs) and confirm the screen reader announces the updated state.
7. Check that any custom widgets built with `<div>`, `<span>`, or `<a>` elements that function as buttons or other controls carry the necessary `role` and `aria-*` attributes.

## Notes

This criterion specifically covers author-created UI components and does not apply to platform-level user agent controls that the author cannot modify. The easiest way to satisfy this criterion is to use native, semantic HTML elements (which have built-in name, role, and value semantics) rather than building custom widgets from generic elements, which require additional ARIA and scripting to achieve the same accessibility outcome.
