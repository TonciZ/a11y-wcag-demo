---
id: 1.4.13
title: Content on Hover or Focus
level: AA
wcag_url: https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html
---

## Description

Where receiving and then removing pointer hover or keyboard focus triggers additional content to become visible and then hidden (such as tooltips and sub-menus), three conditions must be met: the additional content must be dismissible without moving focus or the pointer, the additional content must be hoverable (the pointer can move over the additional content without it disappearing), and the additional content must be persistent until the user dismisses it, moves focus away, or the information is no longer relevant. This ensures low-vision users who zoom in and users with motor disabilities who may accidentally trigger hover events can perceive and use the additional content.

## Fail Explanation

A failure occurs when additional content triggered by hover or focus disappears before the user has had a chance to read or interact with it. Examples include custom tooltips that disappear as soon as the pointer moves slightly off the trigger, dropdown menus that close if the pointer travels in a straight line rather than along the menu edge, and tooltips that cannot be dismissed by pressing Escape. For low-vision users who use screen magnification, triggered content often appears outside their current view and requires them to pan the viewport to find it, during which the hover state may be lost and the content disappears.

## Pass Explanation

A passing implementation ensures all three conditions are satisfied. The additional content is dismissible by pressing the Escape key (or equivalent) without the user needing to move focus. The triggered content is hoverable - the pointer can travel from the trigger element onto the content itself without the content closing. The content remains visible until the user deliberately dismisses it or moves focus entirely away from the trigger. ARIA tooltips and custom dropdowns should be tested against all three conditions.

## How To Test

1. Identify all elements on the page that display additional content on hover or focus (tooltips, sub-menus, custom dropdowns, etc.).
2. Hover over or focus each trigger and verify the additional content appears.
3. While the content is visible, move the pointer slowly from the trigger onto the additional content itself and verify the content remains visible (hoverable condition).
4. While the content is visible, press the Escape key and verify the content is dismissed without moving focus away from the trigger (dismissible condition).
5. Hover over the trigger, then move the pointer away without pressing Escape, and verify the content disappears only when focus or hover leaves the region (persistent condition).
6. Test with keyboard focus using the Tab key and verify the same three conditions are satisfied for keyboard-triggered content.
7. Test with a screen magnifier (such as Windows Magnifier or ZoomText) to verify content remains reachable when the view is zoomed.

## Notes

This criterion was added in WCAG 2.1 specifically to address the problems low-vision users experience with hover-triggered content that disappears before they can read it or navigate to it. The Escape key requirement for dismissal aligns with the general usability convention for closing dialogs and popups.
