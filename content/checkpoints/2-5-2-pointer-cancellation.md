---
id: 2.5.2
title: Pointer Cancellation
level: A
wcag_url: https://www.w3.org/WAI/WCAG22/Understanding/pointer-cancellation.html
---

## Description

For functionality that can be operated using a single pointer (mouse click, touch tap, or stylus), at least one of the following must be true: the down-event is not used to execute the function; the function is executed on the up-event and a mechanism exists to abort or undo it before completion; the up-event reverses any outcome of the preceding down-event; or completing the function on the down-event is essential. This criterion prevents accidental activation of controls because users can cancel a pointer action by moving away before releasing.

## Fail Explanation

A failure occurs when functionality triggers immediately on the pointer down event (mousedown or touchstart) with no way to abort or reverse the action before releasing the pointer. For example, a "Delete account" button that executes the deletion the instant the user presses down — before they even release the mouse button — means a user who mis-clicks cannot simply slide their pointer away to cancel. Users with motor disabilities that cause involuntary movements or tremors are particularly affected, as they may frequently trigger down events unintentionally.

## Pass Explanation

A passing implementation triggers actions on the pointer up event (mouseup or click), which is the browser default for standard HTML buttons and links. When an action is triggered on the up event, users can press down on a control, change their mind, drag the pointer away, and then release without activating the function. For more critical actions, an additional undo mechanism (such as a confirmation dialog or an undo command) provides an additional safety net. Drag-and-drop operations where down-event initiation is necessary may be acceptable if the drag can be canceled before drop completion.

## How To Test

1. Identify all interactive controls on the page: buttons, links, custom widgets, and touch targets.
2. Press and hold the mouse button down on a control, then drag the pointer away from the control before releasing.
3. Verify that the action is NOT triggered when you drag away and release outside the control.
4. Confirm that activating the control only occurs when the pointer is released (up-event) while still within the control's bounds.
5. For touch devices, perform the same test: tap and hold on a control, then slide your finger away before lifting — the action should not fire.
6. Check whether any JavaScript event listeners use `mousedown`, `touchstart`, or `pointerdown` to trigger primary actions directly.

## Notes

Standard HTML `<button>` and `<a>` elements natively fire their actions on the up-event by default, so they pass this criterion without additional effort. Failures typically arise from custom JavaScript event handlers that bind to `mousedown` or `touchstart` for performance reasons without a corresponding cancellation mechanism. This criterion does not prohibit down-event triggers for actions where it is essential, such as piano keyboard simulations or drawing applications.
