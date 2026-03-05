---
id: 2.5.7
title: Dragging Movements
level: AA
wcag_url: https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html
---

## Description

This criterion, new in WCAG 2.2, requires that all functionality that uses a dragging movement can also be achieved with a single pointer without dragging. Dragging requires the user to press down, maintain contact while moving the pointer, and then release - a multi-step motor action that many users with motor impairments cannot reliably perform. A simple alternative such as clicking a "Move left" button, clicking to pick up and then clicking to place, or entering coordinates achieves the same result without dragging.

## Fail Explanation

A failure occurs when content is only operable through a drag interaction with no non-dragging alternative. For example, a Kanban board where cards can only be moved between columns by dragging, a slider that has no corresponding number input field, or a sortable list where items can only be reordered by drag-and-drop - all fail if no equivalent single-click or keyboard mechanism is provided. Users with Parkinson's disease, hand tremors, or those using switch access or voice control cannot reliably perform sustained drag actions.

## Pass Explanation

A passing implementation provides at least one alternative to every drag interaction that requires only a single pointer action (a tap or click). For a sortable list, this could be "Move up" and "Move down" buttons on each item. For a range slider, a text input that accepts the numeric value is a valid alternative. For a map with draggable pins, a button that opens a dialog where coordinates can be typed would satisfy the requirement. The alternative does not need to provide an identical experience, only equivalent functionality.

## How To Test

1. Identify all drag interactions on the page: sortable lists, sliders, draggable cards, resizable panels, map pins, and file upload drop zones.
2. For each drag interaction, look for a non-dragging alternative that accomplishes the same task using only single-pointer clicks or taps.
3. Attempt to complete each drag-based task without performing any drag movement - using only clicks, taps, or keyboard input.
4. Verify the non-drag alternative is accessible via keyboard as well (this also relates to 2.1.1 Keyboard).
5. Test with a pointing device set to a low precision (or simulated tremor) to understand the difficulty of drag interactions for affected users.

## Notes

This criterion applies to drag interactions that are author-implemented, not to browser or operating system drag behaviors. Scroll dragging (using a scrollbar or touch-scrolling a region) is specifically excluded from this criterion. The criterion is closely related to 2.1.1 (Keyboard) but focuses specifically on pointer-based dragging rather than all keyboard accessibility, and applies to mouse/touch interfaces that lack equivalent non-drag paths.
