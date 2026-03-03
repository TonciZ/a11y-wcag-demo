---
id: 2.4.11
title: Focus Not Obscured (Minimum)
level: AA
wcag_url: https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html
---

## Description

This criterion, new in WCAG 2.2, requires that when a user interface component receives keyboard focus, the component is not entirely hidden due to author-created content. In other words, a sticky header, cookie banner, chat widget, or other fixed or sticky element must not completely cover the focused component. At least some part of the focused element must remain visible. The related Level AAA criterion 2.4.12 goes further and requires the focused component to be fully visible, not just partially.

## Fail Explanation

A failure occurs when a keyboard user tabs to a link or button that is positioned behind a sticky navigation bar, a persistent cookie consent banner, or a floating chat widget, causing the focused element to be completely invisible. The user can still interact with the element — pressing Enter may activate it — but they cannot see which element has focus, which is severely disorienting and makes it impossible to understand page context or confirm what they are about to activate. This is increasingly common on pages with tall sticky headers or multiple overlapping fixed elements.

## Pass Explanation

A passing implementation ensures that when any focusable element receives focus, at least a portion of it remains visible above any fixed or sticky overlapping content. Common solutions include using `scroll-padding-top` (or `scroll-margin-top` on the focused element) to offset the scroll position so focused elements appear below the sticky header, or adjusting the height and z-index of sticky elements so they do not overlap focusable content. The criterion is met even if only part of the component is visible — full visibility is a AAA requirement.

## How To Test

1. Identify any fixed or sticky elements on the page (sticky headers, cookie banners, floating buttons, chat widgets).
2. Using only the keyboard, Tab through all focusable elements on the page.
3. For each focused element, observe whether it is fully or partially hidden behind a sticky or fixed element.
4. If a focused element is completely obscured — not even a pixel of it is visible — that is a failure of this criterion.
5. Scroll the page manually and re-tab to see if the browser scrolls to reveal focused elements automatically.
6. Check whether `scroll-padding-top` is set on the `<html>` or `<body>` element to account for sticky header height.

## Notes

This criterion is new in WCAG 2.2 and reflects a real-world problem that became widespread as sticky navigation patterns became dominant in web design. It applies to author-created overlapping content, not to browser-level UI such as the browser's own address bar. Even a 1px sliver of the focused component visible above the sticky element is technically a pass for 2.4.11, though 2.4.12 (Level AAA) requires the focused component to be entirely visible.
