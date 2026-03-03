---
id: 2.4.3
title: Focus Order
level: A
wcag_url: https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html
---

## Description

If a web page can be navigated sequentially and the navigation sequences affect meaning or operation, focusable components must receive focus in an order that preserves meaning and operability. This means that as users press Tab to move through a page, the order in which interactive elements receive focus must follow a logical reading and interaction sequence — typically matching the visual top-to-bottom, left-to-right order of the content.

## Fail Explanation

A failure occurs when the tab order jumps unpredictably across the page — for example, tabbing from a form field in the header straight to the footer, then back to the middle of the page, then to a sidebar. This commonly happens when CSS is used to visually reorder content without updating the underlying DOM order, or when `tabindex` values are set to large positive integers that override the natural DOM sequence. Disordered focus order disorients keyboard users and makes it very difficult for screen reader users to build a mental model of the page.

## Pass Explanation

A passing implementation achieves a logical focus order by ensuring the DOM source order matches the intended reading and interaction sequence, so that the default tab flow (which follows DOM order) is already correct. Where visual reordering is necessary (e.g., through CSS flexbox `order` or `position: absolute`), the DOM order must still be arranged logically. Use of positive `tabindex` values (anything above 0) should be avoided; using `tabindex="0"` and `tabindex="-1"` is acceptable and recommended.

## How To Test

1. Use only the keyboard and press Tab repeatedly to move through all focusable elements on the page.
2. Observe the order in which elements receive focus and compare it to the visual and logical reading order.
3. Note any instances where focus jumps backward, skips a section, or moves to an unexpected location.
4. Inspect the DOM using browser DevTools to check whether the source order differs significantly from the visual layout.
5. Search for any elements with positive `tabindex` values (1 or higher) that may be forcing an unnatural focus order.
6. Test interactive widgets such as modal dialogs to confirm focus moves into the dialog when it opens and returns to the trigger when it closes.

## Notes

Focus order does not need to be identical to visual reading order in every case — only when the order affects meaning or operation. For example, a search field followed by search results does not require a rigid order as long as the relationship is clear. However, modal dialogs, inline error messages, and dynamically inserted content do require careful focus management to avoid confusion.
