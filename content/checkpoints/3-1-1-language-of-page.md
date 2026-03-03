---
id: 3.1.1
title: Language of Page
level: A
wcag_url: https://www.w3.org/WAI/WCAG22/Understanding/language-of-page.html
---

## Description

The default human language of each web page must be programmatically determinable. This is achieved by setting the `lang` attribute on the `<html>` element using a valid BCP 47 language tag (e.g., `lang="en"` for English or `lang="fr"` for French). Screen readers and other assistive technologies rely on this attribute to select the correct language profile for speech synthesis, Braille output, and other language-specific rendering.

## Fail Explanation

A page that is missing the `lang` attribute on the `<html>` element, or that has an incorrect or empty `lang` value, will cause screen readers to default to whatever language the user has configured as their system default. If that language differs from the page's actual language, the screen reader will mispronounce words, apply incorrect phonetic rules, and deliver content that is unintelligible to users who rely on audio output.

## Pass Explanation

A page passes when its `<html>` element carries a valid BCP 47 language tag that accurately reflects the primary language of the page content (e.g., `<html lang="en">`). This allows screen readers to automatically switch to the correct speech synthesizer voice and pronunciation rules, ensuring the content is rendered accurately for users of assistive technology.

## How To Test

1. View the page source or use browser developer tools to inspect the opening `<html>` tag.
2. Confirm that a `lang` attribute is present on the `<html>` element.
3. Verify that the `lang` value is a valid BCP 47 language tag that matches the primary language of the page content.
4. Check that the `lang` value is not empty (e.g., `lang=""` is a failure).
5. If using a screen reader (e.g., NVDA or JAWS), navigate through body text and listen for correct pronunciation consistent with the page language.
6. Use an automated tool such as axe or WAVE to flag missing or invalid `lang` attributes.

## Notes

The `lang` attribute must reflect the primary language of the page; pages that contain mixed-language content may also need to satisfy 3.1.2 Language of Parts for the secondary-language passages. A region subtag (e.g., `lang="en-US"`) is optional but acceptable as long as the primary language subtag is correct.
