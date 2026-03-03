---
id: 3.3.2
title: Labels or Instructions
level: A
wcag_url: https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html
---

## Description

When user input is required, labels or instructions must be provided to help users understand what is expected. This applies to all form controls and interactive widgets that require the user to enter or select data. Labels must clearly identify what each field expects, and where input format or constraints apply (such as date format, password rules, or character limits), instructions must be provided before or during data entry so users can supply correctly formatted input without trial and error.

## Fail Explanation

A form that uses placeholder text alone as a label fails this criterion, because placeholder text disappears when the user starts typing, leaving them without any indication of what the field expects — particularly problematic for users with cognitive disabilities or short-term memory impairments. Similarly, a date field that accepts only a specific format (e.g., DD/MM/YYYY) but does not display that format requirement before submission is a failure, as users cannot know what is expected until they receive an error message after the fact.

## Pass Explanation

A form passes when every input field has a persistent, visible label that clearly identifies the field's purpose, and when any format requirements or constraints are provided as visible text associated with the field before the user submits. Labels must be programmatically linked to their controls (via `<label for>` or `aria-labelledby`) so screen reader users also receive the information. Required fields should be identified either by the word "required" in the label or by a convention that is explained (e.g., "Fields marked with * are required").

## How To Test

1. Review each form field on the page and confirm it has a visible, persistent label that is not solely placeholder text.
2. Check that any required fields are clearly identified as required (by text in the label, not colour alone).
3. Review all fields that expect a specific format (dates, phone numbers, postal codes) and confirm the expected format is displayed as visible text near the field.
4. Inspect the HTML to verify that labels are programmatically associated with their controls using `<label for="...">` or `aria-labelledby`.
5. Test with a screen reader (e.g., NVDA or VoiceOver): navigate to each field in forms mode and confirm the field's label and any instructions are announced.
6. Confirm that instructions are available before the user needs to enter data, not only after a submission error.
7. Check that group-level instructions (such as "Select all that apply") are provided for checkbox groups and radio groups via `<fieldset>` and `<legend>`.

## Notes

Placeholder text can supplement a proper label but must never be used as a replacement for one; this is a very common anti-pattern. This criterion focuses on the presence and availability of labels and instructions, while 3.3.1 Error Identification covers what happens after an error has occurred.
