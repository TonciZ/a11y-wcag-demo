---
id: 2.1.2
title: No Keyboard Trap
level: A
wcag_url: https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html
---

## Description

If keyboard focus can be moved to a component using a keyboard interface, then focus must be able to be moved away from that component using only a keyboard. If moving focus away requires more than standard navigation keys, users must be informed of the method. This ensures that keyboard users cannot become stranded inside a widget or page region with no way to escape.

## Fail Explanation

A keyboard trap occurs when a user tabs into an element — such as an embedded media player, a third-party widget, or a custom dialog — and cannot move focus out using Tab, Shift+Tab, Escape, or any other standard key. For keyboard-only users, including many screen reader users, a trap makes the rest of the page permanently inaccessible during that session. Even a single trapped component is a critical blocker because it forces the user to refresh the page and lose their context.

## Pass Explanation

A passing implementation ensures that pressing Tab, Shift+Tab, or Escape always allows focus to leave any component and continue navigating the page. When a modal dialog is open, focus may be intentionally constrained within the dialog, but a clearly labeled close mechanism (such as an Escape key handler and a visible Close button) must still allow the user to dismiss the dialog and return focus to the triggering element.

## How To Test

1. Navigate to the page using only the keyboard (Tab and Shift+Tab).
2. Tab into each interactive widget, embedded iframe, media player, and modal dialog.
3. After entering each component, attempt to exit by pressing Tab, Shift+Tab, and Escape.
4. Verify that focus moves away from the component without requiring mouse interaction.
5. If a component uses a non-standard exit key, check that this is communicated to the user through visible instructions or an accessible announcement.
6. For modal dialogs, confirm that Escape closes the dialog and returns focus to the element that opened it.

## Notes

An intentional focus lock inside a modal dialog is acceptable — and often desirable — as long as the dialog itself is dismissible via keyboard. The failure condition is a component from which there is no keyboard escape at all, not one that constrains focus to a logical region while still providing an exit.
