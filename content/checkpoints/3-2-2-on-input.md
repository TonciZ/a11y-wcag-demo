---
id: 3.2.2
title: On Input
level: A
wcag_url: https://www.w3.org/WAI/WCAG22/Understanding/on-input.html
---

## Description

Changing the setting of any user interface component must not automatically cause a change of context unless the user has been advised of the behaviour before using the component. A change of context includes events like navigating to a new page, submitting a form, opening a pop-up window, or moving keyboard focus to an entirely different part of the interface. Users must be able to change settings - such as selecting a radio button, checking a checkbox, or choosing an option from a dropdown - without triggering unexpected, disruptive behaviour.

## Fail Explanation

A classic failure is a navigation `<select>` element that immediately redirects the browser to a new URL when the user selects an option, without requiring the user to also activate a "Go" button. Another failure is a radio button group that submits a form automatically when a radio is selected. These patterns are particularly problematic for keyboard and switch-device users, who may inadvertently change a value while scanning options using arrow keys and be sent to an unintended destination before they can make a deliberate choice.

## Pass Explanation

A page passes when changing the value of a form control - selecting a radio button, toggling a checkbox, typing in a field, or picking from a dropdown - does not by itself trigger a context change. If an automated behaviour is intentional and desirable, the page must warn the user in advance (for example, with visible label text that says "Selecting an option will immediately navigate to that section"). The safest implementation is to always require an explicit submit or activate action to process user input.

## How To Test

1. Using the keyboard, navigate to each interactive form control on the page (radio buttons, checkboxes, select menus, text inputs).
2. Change the value of each control (select an option, check a box, type text) and observe whether a context change occurs automatically.
3. Verify that no unexpected navigation, form submissions, new windows, or focus movements are triggered solely by the input change.
4. If an automated context change does occur, check whether the page clearly warned the user before they interacted with the component.
5. Test with a screen reader (e.g., JAWS or NVDA) to confirm that changing values does not produce unexpected announcements indicating navigation or major content shifts.
6. Specifically test any `<select>` elements - confirm they require a submit action rather than automatically navigating on `change`.

## Notes

This criterion is closely related to 3.2.1 On Focus; the distinction is that 3.2.1 addresses focus events while 3.2.2 addresses input or value-change events. Both criteria allow behaviour changes when the user has been explicitly informed of them in advance.
