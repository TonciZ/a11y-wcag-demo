---
id: 1.3.5
title: Identify Input Purpose
level: AA
wcag_url: https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html
---

## Description

For input fields that collect information about the user, the purpose of each field must be programmatically determinable using HTML autocomplete attributes. This allows browsers and assistive technologies to identify the type of personal data being requested and to offer autofill, custom icons, or other adaptations that help users with cognitive disabilities, memory impairments, or motor difficulties complete forms more easily.

## Fail Explanation

A failure occurs when form inputs that collect common personal information — such as name, email, phone number, address, or credit card details — do not have the appropriate `autocomplete` attribute. Without this attribute, browsers cannot offer autofill assistance, and tools that replace form labels with familiar icons (an aid for users with cognitive disabilities) cannot identify the field's purpose. Users who rely on autofill to avoid repeated data entry are also disadvantaged.

## Pass Explanation

A passing implementation adds the correct `autocomplete` attribute value from the HTML specification's list of input purposes to each relevant form field. For example, a field collecting a user's first name should have `autocomplete="given-name"`, an email field should have `autocomplete="email"`, and a field for a street address should have `autocomplete="street-address"`. The `autocomplete` attribute value must match the actual purpose of the field.

## How To Test

1. Identify all form inputs on the page that collect personal information about the user.
2. Inspect each such input element and check whether an `autocomplete` attribute is present.
3. Verify the `autocomplete` value matches an appropriate value from the WCAG list of input purposes (e.g., `name`, `email`, `tel`, `bday`, `street-address`).
4. Confirm the `autocomplete` attribute value accurately reflects the actual data being collected by the field.
5. Check that the `autocomplete` attribute is not set to `off` for fields where autofill would benefit the user.
6. Use a browser with autofill capability to test that the browser correctly identifies and offers to fill each field.

## Notes

This criterion applies only to fields that collect information about the user themselves, not arbitrary data entry fields such as a search box or a message composition field. The complete list of valid `autocomplete` values for this criterion is defined in the WCAG 2.1/2.2 Success Criterion 1.3.5 normative content and the HTML Living Standard.
