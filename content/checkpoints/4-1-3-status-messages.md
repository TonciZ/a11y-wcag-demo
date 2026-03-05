---
id: 4.1.3
title: Status Messages
level: AA
wcag_url: https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html
---

## Description

In content implemented using markup languages, status messages must be programmatically determinable through role or properties so that they can be presented to the user by assistive technologies without receiving focus. A status message is any update that informs the user of the success or result of an action, a waiting state, the progress of a process, or the existence of errors - where that message does not take focus. Examples include "Your form has been submitted successfully", "3 items added to cart", "Loading, please wait…", or "5 search results found." These messages must reach screen reader users even though keyboard focus remains elsewhere on the page.

## Fail Explanation

A dynamic success message that appears visually on screen after a form submission but is injected into the DOM without an appropriate ARIA live region role will not be announced by screen readers, because the user's focus has not moved to the message. Screen reader users will complete an action - such as adding an item to their cart or submitting a search query - and receive no feedback that the action succeeded or produced results. This is a significant usability barrier for blind users who depend entirely on audio output to understand the result of their interactions.

## Pass Explanation

Status messages pass when they are inserted into a container element that carries an appropriate ARIA live region role or property. For success and completion messages, `role="status"` (which maps to `aria-live="polite"`) is appropriate; for urgent alerts, `role="alert"` (which maps to `aria-live="assertive"`) can be used when the message requires immediate attention. The container element should ideally be present in the DOM on page load (even if empty), and the message text should be injected into it dynamically so that assistive technologies can detect and announce the change.

## How To Test

1. Identify all actions on the page that produce status messages without moving keyboard focus: form submissions, cart additions, search result counts, loading indicators, and process progress updates.
2. Trigger each action and observe whether a status message appears visually.
3. Inspect the DOM to confirm the message container has an appropriate role: `role="status"`, `role="alert"`, `aria-live="polite"`, or `aria-live="assertive"`.
4. Verify the container element was present in the DOM before the message was injected (not inserted into the DOM at the same time as the message).
5. Test with a screen reader (e.g., NVDA + Firefox): trigger the action and confirm the status message is announced without focus being moved to it.
6. Check that `role="alert"` is used sparingly and only for truly urgent messages, not for routine status updates, to avoid over-interrupting the user.
7. Confirm that error summaries that do receive focus (e.g., after form submission) do not also need a live region, as they rely on focus management instead.

## Notes

This criterion applies to status messages that do not receive focus; messages that are displayed in a dialog or by moving focus to the notification do not need a live region, as the focus management itself informs the screen reader. The pre-existing container pattern is important because some browsers do not announce live region content if the element itself is inserted dynamically into the DOM.
