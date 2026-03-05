---
id: 3.2.1
title: On Focus
level: A
wcag_url: https://www.w3.org/WAI/WCAG22/Understanding/on-focus.html
---

## Description

When any user interface component receives focus, it must not initiate a change of context. A change of context is a major change in the content of a web page that can disorient users if triggered unexpectedly, including changes such as opening a new window, moving focus to a different component, submitting a form, or significantly rearranging the page's content. This criterion ensures that focus alone - without an explicit user action such as a click or keypress - does not cause such disruptive changes.

## Fail Explanation

A common failure occurs when a `select` element or a custom dropdown automatically submits a form or navigates to a new URL as soon as a user tabs into it. Another failure is a pop-up dialog or new browser window that launches the moment a component receives keyboard focus. These behaviors are especially harmful for keyboard-only users and screen reader users, who cannot predict or prevent focus from triggering consequential actions and may become confused about where they are in the page or workflow.

## Pass Explanation

A page passes when receiving keyboard focus on any interactive component merely highlights or visually indicates that component without triggering navigation, form submissions, new windows, or other context-shifting events. Any meaningful action should require an explicit activation step - such as pressing Enter, Space, or clicking - so that users retain full control over when changes occur.

## How To Test

1. Using only the keyboard (Tab, Shift+Tab), move focus through all interactive elements on the page: links, buttons, form fields, and custom widgets.
2. Observe whether receiving focus on any element triggers a change of context, such as page navigation, a new window, a form submission, or a significant content change.
3. Pay particular attention to `<select>` menus, custom comboboxes, and auto-suggest inputs - verify that focus alone does not submit or navigate.
4. Check that modal dialogs, tooltips, and popups triggered by focus do not move focus away from the current control unexpectedly.
5. Use a screen reader (e.g., NVDA + Firefox) and tab through the page, listening for unexpected announcements indicating a context change.

## Notes

There is an important distinction between a context change and a simple content update: appearing inline hints, expanding tooltips, or highlighting are generally not context changes and do not fail this criterion. The focus is on major, disorienting changes that interfere with the user's ability to predict the result of their navigation.
