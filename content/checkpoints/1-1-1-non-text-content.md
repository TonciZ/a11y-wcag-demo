---
id: 1.1.1
title: Non-text Content
level: A
wcag_url: https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html
---

## Description

All non-text content that is presented to the user must have a text alternative that serves the equivalent purpose. This applies to images, icons, charts, graphs, audio, video, controls, and other non-text elements. The text alternative allows assistive technologies such as screen readers to convey the meaning of non-text content to users who cannot perceive it visually or aurally.

## Fail Explanation

A failure occurs when an image, icon, or other non-text element has no accessible name, an empty alt attribute where one is needed, or a meaningless description such as "image" or a file name like "img0042.jpg". Screen reader users will either hear nothing, hear the file name, or hear a generic label that provides no useful information about the content or purpose of the element.

## Pass Explanation

A passing implementation provides a concise, meaningful text alternative that conveys the same information or function as the non-text content. Decorative images that add no information use an empty alt attribute (`alt=""`) so screen readers skip them entirely. Complex images such as charts include either a descriptive long-form text alternative nearby or are linked to a full description.

## How To Test

1. Identify all non-text content on the page: images, icons, buttons with images, charts, graphs, and multimedia.
2. Inspect each image element and check whether an `alt` attribute is present.
3. For informative images, verify the `alt` text accurately describes the content or function of the image.
4. For decorative images, verify `alt=""` is used so screen readers skip them.
5. For functional images (such as a logo linking to the home page or an icon button), verify the `alt` text describes the function, not just the appearance.
6. Use a screen reader (such as NVDA with Firefox or JAWS with Chrome) to navigate to each image and confirm what is announced matches the expected text alternative.
7. For complex images such as charts, confirm a full text description is available either in the alt attribute, in surrounding content, or via a linked description.

## Notes

Images used purely for layout or decoration must use `alt=""` rather than being omitted entirely; omitting the `alt` attribute causes some screen readers to read out the file name. ARIA attributes such as `aria-label` and `aria-labelledby` can also provide text alternatives for non-image non-text elements such as SVGs and custom controls.
