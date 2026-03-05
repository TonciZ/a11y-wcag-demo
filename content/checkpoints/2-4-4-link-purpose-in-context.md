---
id: 2.4.4
title: Link Purpose (In Context)
level: A
wcag_url: https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context.html
---

## Description

The purpose of each link must be determinable either from the link text alone or from the link text together with its programmatically determined context. Context includes the sentence, paragraph, list item, or table cell that contains the link, as well as an associated label provided through ARIA. This criterion enables screen reader users and users with cognitive disabilities to understand where a link will take them without needing to follow every link to find out its purpose.

## Fail Explanation

A failure occurs when multiple links on the same page share the same visible link text but point to different destinations - for example, several "Read more" or "Click here" links in a list of articles, each pointing to a different article page. Screen reader users who browse links out of context (using a links list or navigating by Tab) will hear only the repeated text "Read more" for each link and have no way to determine which article each link leads to. This is a significant barrier to efficient navigation.

## Pass Explanation

A passing implementation ensures each link's text is descriptive enough to convey its purpose on its own - for example, "Read more about the 2024 Annual Report" instead of just "Read more." When the surrounding context already makes the link purpose clear (e.g., a link within a paragraph that discusses a specific topic), the link text may be shorter, but the context must be programmatically associated. ARIA techniques such as `aria-label`, `aria-labelledby`, or visually hidden text within the link element are also acceptable solutions.

## How To Test

1. Open a screen reader's links list (NVDA: Insert+F7, JAWS: Insert+F7, VoiceOver: VO+U then navigate to Links) and read through all link labels.
2. Identify any links with identical or ambiguous text such as "click here," "read more," "learn more," or "details."
3. For each ambiguous link, check the surrounding context (the containing sentence, paragraph, or table cell) to see if the purpose becomes clear from context alone.
4. Inspect ambiguous links for `aria-label` or `aria-labelledby` attributes that provide a more descriptive accessible name.
5. Confirm that any added accessible name accurately describes the link destination and matches the visible label where possible.
6. Manually navigate by pressing Tab and confirm each focused link's announced name conveys its purpose.

## Notes

The related but stricter criterion 2.4.9 (Link Purpose - Link Only, Level AAA) requires each link to be understandable from its link text alone, with no reliance on context. At Level A, relying on programmatic context is acceptable, but designing descriptive link text by default is the most robust approach and reduces reliance on context-reading behavior across different assistive technologies.
