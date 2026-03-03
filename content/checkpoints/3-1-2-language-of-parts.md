---
id: 3.1.2
title: Language of Parts
level: AA
wcag_url: https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts.html
---

## Description

When a web page contains passages of text in a language different from the page's primary language, each such passage must have its language programmatically identified using the `lang` attribute on the containing element. This applies to any phrase, sentence, or block of content written in a secondary language, allowing assistive technologies to apply the correct pronunciation rules for that passage. Exceptions include proper names, technical terms, and words that have become part of the surrounding language's vernacular.

## Fail Explanation

If a page includes a French quotation, a Spanish phrase, or any extended foreign-language passage without a `lang` attribute on its container element, a screen reader will read that passage using the phonetic rules of the page's primary language. The result is severely distorted pronunciation that can make the passage incomprehensible to blind or visually impaired users who depend on audio output to understand the content.

## Pass Explanation

A page passes when each foreign-language passage is wrapped in an element (such as `<span>`, `<p>`, `<blockquote>`, or `<section>`) that carries a `lang` attribute with the correct BCP 47 language tag for that passage (e.g., `<span lang="fr">Bonjour le monde</span>`). Screen readers will detect the attribute, switch to the appropriate voice or speech profile, and render the passage with correct pronunciation.

## How To Test

1. Identify all passages on the page that are written in a language different from the primary page language declared on `<html lang="...">`.
2. For each such passage, inspect the surrounding markup in browser developer tools.
3. Verify that an ancestor element (ideally the most immediate wrapper) carries a `lang` attribute with the correct language tag for that passage.
4. Confirm the language tag is a valid BCP 47 code (e.g., `fr`, `es`, `de`, `zh-Hant`).
5. Using a screen reader (e.g., NVDA with an eSpeak or other multi-language synthesizer), navigate to the foreign-language passage and listen for correct language switching.
6. Check that proper nouns, technical terms, and internationalised words used in the primary language context are not incorrectly wrapped.
7. Run an automated audit with axe or similar tool; note that automated tools cannot catch all cases and manual review is essential.

## Notes

This criterion does not apply to proper names, technical terms, words of indeterminate language, or words that have been assimilated into the surrounding language. The key scope is extended passages of human-readable text where pronunciation would meaningfully differ between languages.
