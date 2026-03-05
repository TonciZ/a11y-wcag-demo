---
id: 3.3.3
title: Error Suggestion
level: AA
wcag_url: https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion.html
---

## Description

If an input error is automatically detected and suggestions for correction are known, the suggestions must be provided to the user, unless doing so would jeopardise the security or purpose of the content. This criterion builds on 3.3.1 Error Identification by going a step further: it is not enough to tell users what went wrong - where the system can determine how to fix the problem, it must tell users that too. For example, if a required field is left blank, the error should say "Email address is required" and not merely flag the field as incorrect.

## Fail Explanation

A form that identifies an error but offers no guidance on how to resolve it fails this criterion when a suggestion is knowable. For instance, a password field that rejects an entry because it does not contain an uppercase letter, but only displays "Invalid password" without explaining the requirement, leaves users - especially those with cognitive disabilities or those relying on screen readers - unable to determine the correct course of action. Providing only a red border or a generic "Error" label with no instructive text is also a failure at this level.

## Pass Explanation

A form passes when each error message not only identifies the problem but also provides an actionable suggestion. For example, "Date of birth must be in DD/MM/YYYY format" or "Username must be between 3 and 20 characters" or "This email address is already registered - try logging in instead." The suggestion must be conveyed in text and programmatically associated with the relevant field so that screen reader users receive it when focusing the erroneous control.

## How To Test

1. Submit the form with various invalid inputs (wrong format, out-of-range value, empty required field) and review the error messages displayed.
2. For each error, check whether the message includes a corrective suggestion (not just identification of the problem).
3. Verify that suggestions are conveyed in text rather than solely through colour or icons.
4. Confirm that suggestions are programmatically associated with their fields (via `aria-describedby` or adjacent text within the label structure).
5. Test with a screen reader (e.g., JAWS or NVDA) by submitting with errors and navigating to each erroneous field to confirm the suggestion text is read aloud.
6. For constrained fields (date, phone, postal code, password), check that the suggestion specifies the accepted format or constraints.
7. Verify that suggestions for security-sensitive fields (e.g., "Incorrect password") do not inadvertently expose information that would compromise security.

## Notes

This criterion only applies when the system can programmatically determine a correct suggestion; if the input is ambiguous or the cause of failure is genuinely unknown to the system, a suggestion is not required. This criterion is closely paired with 3.3.1 (Error Identification) and together they form a comprehensive error-handling pattern for accessible forms.
