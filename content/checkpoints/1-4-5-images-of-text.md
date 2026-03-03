---
id: 1.4.5
title: Images of Text
level: AA
wcag_url: https://www.w3.org/WAI/WCAG22/Understanding/images-of-text.html
---

## Description

If the same visual presentation can be achieved using text, images of text must not be used to convey information. Text rendered as an image cannot be resized cleanly by the browser, cannot be styled by user stylesheets, cannot be translated by browser translation tools, and is often not accessible to screen readers unless a text alternative is provided. Actual text is always preferable because it is flexible, scalable, and adaptable to user needs.

## Fail Explanation

A failure occurs when text content is embedded in an image file (such as a JPEG, PNG, or GIF) when that same text could have been rendered as HTML text with CSS styling. Common examples include marketing banners with stylized text, infographic headings, navigational links rendered as image files, and promotional section headers saved as images for a particular font or effect. Because the text is rasterized into the image, it becomes pixelated when zoomed and cannot adapt to user preferences for font size, color, or contrast.

## Pass Explanation

A passing implementation renders all informational text using HTML text elements styled with CSS. Web fonts such as those available through Google Fonts or self-hosted font files can achieve virtually any typographic style without requiring text to be saved as an image. If an image of text is used for a logo or brand mark, it is considered essential and is exempt from this requirement. Text that is part of an image where the specific visual appearance is essential to the content — such as a historical document photograph — is also exempt.

## How To Test

1. Identify all images on the page using browser developer tools or an accessibility inspector.
2. For each image, check whether it contains text.
3. For images containing text, assess whether that text could reasonably have been rendered as HTML text styled with CSS.
4. If the image text could be replaced with real text, this constitutes a failure.
5. Check whether the image has an appropriate `alt` attribute providing the same text as a fallback — this mitigates screen reader impact but does not make the implementation pass this criterion.
6. Review banner images, promotional images, and decorative headers as common areas of failure.

## Notes

This criterion does not apply to logos, wordmarks, or situations where a particular visual presentation of the text is essential. The advancement of web fonts and CSS text effects has significantly reduced the need to use images of text; most typographic effects achievable in Photoshop can now be reproduced using CSS.
