---
id: 3.3.7
title: Redundant Entry
level: A
wcag_url: https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html
---

## Description

Information that has already been entered by the user in a previous step of the same process must not be requested again, unless re-entering the information is essential for security reasons, the information may no longer be valid, or it is critical that the information is intentionally confirmed. This new WCAG 2.2 criterion reduces unnecessary cognitive and motor burden on users by ensuring they do not have to recall and re-type data they have already provided within the same multi-step workflow.

## Fail Explanation

A checkout process that asks users to enter their billing address on one screen and then asks them to enter their shipping address on the next screen — without offering a "same as billing" option or auto-populating the fields — is a failure when both addresses are the same workflow. Similarly, a multi-step registration form that asks for a user's name on step one and then asks for the same name again on step three, without pre-filling it, forces users with cognitive disabilities, motor impairments, or anyone relying on assistive technology to perform unnecessary repetitive work.

## Pass Explanation

A process passes when it either auto-populates previously entered information into fields that require it again, or provides a mechanism (such as a checkbox labelled "Shipping address is the same as billing address") that allows users to indicate the data is the same without re-typing it. Previously submitted data that is still valid within the current session and context should be surfaced for the user, reducing the total number of manual input steps required to complete the process.

## How To Test

1. Identify all multi-step processes on the site (checkout flows, registration wizards, multi-page forms).
2. Progress through each process and note every piece of information you are asked to enter.
3. Identify any step that requests information you already provided earlier in the same process.
4. Check whether the form auto-populates the repeated field with the previously entered value.
5. If not auto-populated, check whether a user-selectable option (such as a "same as above" checkbox) is offered to copy the earlier data.
6. Confirm that any re-entry requirement is justified by security, data validity, or an intentional confirmation need.
7. Verify the solution works correctly with keyboard-only navigation and a screen reader.

## Notes

This criterion applies within a single process or session; it does not require sites to remember data across separate visits. The exceptions (security, expired data, intentional confirmation) are intentionally narrow — the default expectation is that users should not have to re-enter data they have already provided in the current workflow.
