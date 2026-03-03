---
id: 3.3.1
title: Error Identification
level: A
wcag_url: https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html
---

## Description

If an input error is automatically detected, the item that is in error must be identified and the error must be described to the user in text. When a form is submitted with missing required fields or invalid values, the page must clearly communicate which specific fields have errors and what those errors are, using text that is programmatically associated with the erroneous fields. This ensures that users of assistive technology receive the same error information as sighted users who might rely on visual cues like red borders or warning icons.

## Fail Explanation

A form that uses only colour (such as a red border) or an icon (such as a warning triangle) to indicate an error, without any accompanying text, fails this criterion because users who are blind, have low vision, or have colour blindness cannot perceive or interpret purely visual error signals. Similarly, displaying a generic message like "There was a problem with your submission" without identifying which specific fields caused the error is a failure, because users cannot determine what they need to correct without further exploration.

## Pass Explanation

A form passes when it displays clear, descriptive text error messages that identify both the field in error (by name or label) and the nature of the error (e.g., "Email address is required" or "Password must be at least 8 characters long"). These messages should be programmatically associated with their respective fields — ideally using `aria-describedby` or by positioning error text adjacent to the labeled input — so that screen readers announce the error when the user navigates to or focuses the affected field.

## How To Test

1. Submit the form without filling in any required fields and observe how errors are communicated.
2. Confirm that error messages are conveyed in text (not solely through colour, icons, or visual styling).
3. Verify that each error message identifies the specific field that is in error, using the same name or label visible on screen.
4. Check that each error message describes what the error is (e.g., "required", "invalid format", "too short").
5. Inspect the HTML to confirm error messages are programmatically associated with their fields (e.g., via `aria-describedby`, `aria-errormessage`, or proximity within a `<label>` or fieldset).
6. Use a screen reader (e.g., NVDA or VoiceOver) to navigate to each field in error and confirm the error text is announced when the field is focused.
7. Check that the error messages are not removed or obscured when the user begins correcting the field.

## Notes

This criterion requires error identification in text but does not mandate how errors are surfaced (inline, summary list, or both). For complex forms, providing both an error summary at the top of the page and inline messages next to each field is considered best practice and helps all users, especially those using screen readers.
