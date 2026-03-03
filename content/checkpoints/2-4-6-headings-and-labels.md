---
id: 2.4.6
title: Headings and Labels
level: AA
wcag_url: https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels.html
---

## Description

Headings and labels must describe the topic or purpose of the content they introduce or identify. This criterion does not require that headings or labels be present — that is covered by other criteria — but when they are present, they must be meaningful and accurately reflect the content they relate to. Descriptive headings help screen reader users navigate directly to relevant sections, while descriptive labels help all users understand what information a form field requires.

## Fail Explanation

A failure occurs when headings use vague or placeholder text — such as "Section 1," "Content," or "Info" — that does not describe the content of the section they introduce. Similarly, form field labels that say only "Field 1" or "Input" fail this criterion. A screen reader user relying on heading navigation to scan a long page, or a user with cognitive disabilities trying to understand what to enter in a form, cannot make effective use of meaningless labels or headings.

## Pass Explanation

A passing implementation uses headings that accurately and uniquely describe the content of each major section — for example, "Shipping Address," "Payment Information," and "Order Summary" in a checkout flow. Form labels should name the specific information required: "Email address," "Date of birth (DD/MM/YYYY)," or "Search products." Labels and headings do not need to be exhaustively detailed, but they must be specific enough that a user navigating by headings or scanning form labels can understand the purpose of each element.

## How To Test

1. Navigate the page using a screen reader's heading navigation (H key in NVDA/JAWS, VO+Command+H in VoiceOver) and listen to each heading.
2. For each heading, assess whether the text describes the content of the section that follows it.
3. Inspect all form fields and confirm each has an associated label (via `<label>`, `aria-label`, or `aria-labelledby`) that describes the expected input.
4. Check for any headings that are generic (e.g., "More Information," "Details") without enough specificity to differentiate sections.
5. Generate a headings outline using a browser extension (such as HeadingsMap) and review it for clarity and meaningful structure.

## Notes

This criterion is about the quality of headings and labels that exist, not whether headings and labels are present at all — presence of headings is addressed by 1.3.1 (Info and Relationships) and presence of form labels is addressed by 1.3.1 and 3.3.2. Common failures include CMSs with default section titles that developers forget to update, and form labels copied from internal field names.
