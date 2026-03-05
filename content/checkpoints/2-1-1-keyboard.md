---
id: 2.1.1
title: Keyboard
level: A
wcag_url: https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html
---

## Description

All functionality of the content must be operable through a keyboard interface without requiring specific timings for individual keystrokes. This means any action that can be done with a mouse - clicking buttons, filling forms, activating links, operating custom widgets - must also be achievable using only a keyboard. The criterion does not require a keyboard-specific shortcut for every action, only that every action can be reached and executed via keyboard navigation.

## Fail Explanation

A failure occurs when one or more interactive elements or features are only reachable or operable via mouse, touch, or pointer input. For example, a drag-and-drop file upload widget that has no keyboard alternative, or a custom dropdown menu that opens only on mouse hover, will exclude keyboard-only users and screen reader users who cannot control a pointer device. This prevents access to essential content and tasks for people with motor disabilities, power users, and screen reader users.

## Pass Explanation

A passing implementation ensures every interactive element can receive keyboard focus and be activated using standard keys (Tab to move focus, Enter or Space to activate, arrow keys for composite widgets). Custom JavaScript widgets such as carousels, date pickers, and accordions must implement appropriate keyboard interaction patterns - typically following the ARIA Authoring Practices Guide - so all functionality is reachable without a mouse.

## How To Test

1. Disconnect or set aside your mouse so only keyboard input is used.
2. Press Tab to move forward through all interactive elements on the page, and Shift+Tab to move backward.
3. Confirm every link, button, form field, and custom control receives visible focus.
4. Attempt to activate each interactive element using Enter or Space, and use arrow keys inside composite widgets (menus, tabs, sliders).
5. Identify any action that can be triggered by mouse (hover, click, drag) and verify an equivalent keyboard-only path exists.
6. Test any time-based interactions to confirm they do not require precise timing of keystrokes.
7. If a screen reader is available, navigate with NVDA or JAWS (Windows) or VoiceOver (macOS/iOS) and verify all functionality remains reachable.

## Notes

This criterion applies to all functionality, not just navigation - operations like drag-and-drop, right-click context menus, and hover-triggered tooltips all require keyboard-accessible equivalents. The exception for "path-dependent" input (such as freehand drawing) is narrow and applies only when the path itself, not just the endpoints, is essential.
