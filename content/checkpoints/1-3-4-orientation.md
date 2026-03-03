---
id: 1.3.4
title: Orientation
level: AA
wcag_url: https://www.w3.org/WAI/WCAG22/Understanding/orientation.html
---

## Description

Content must not restrict its view and operation to a single display orientation, such as portrait or landscape, unless a specific orientation is essential for the content. Many users with physical disabilities mount their devices in a fixed orientation and cannot rotate them. Restricting a page or application to only one orientation prevents these users from accessing and using the content.

## Fail Explanation

A failure occurs when a web page or application forces a specific orientation using CSS or JavaScript and does not provide a way to use the content in the user's preferred orientation. For example, a banking application that locks to landscape mode, or a form that locks to portrait mode, prevents wheelchair users or others who have fixed their device in a particular orientation from completing the task. The restriction typically occurs through the CSS `orientation` media query combined with hiding content, or through the JavaScript Screen Orientation API.

## Pass Explanation

A passing implementation allows content to reflow and function correctly in both portrait and landscape orientations. The layout adapts using responsive design techniques so that all features remain usable regardless of how the device is held. If an orientation restriction is genuinely essential — such as for a piano keyboard application or a specific game mechanic — the restriction is permissible, but such exceptions are rare.

## How To Test

1. Open the page on a mobile device or use browser developer tools to simulate a mobile device.
2. Switch between portrait and landscape orientations and verify the page content remains accessible and functional in both.
3. Check that no content is hidden or made inoperable when orientation changes.
4. Inspect the CSS for `@media (orientation: portrait)` or `@media (orientation: landscape)` rules that hide or disable content.
5. Check for JavaScript that uses the Screen Orientation API to lock orientation.
6. If an orientation lock is found, assess whether the specific orientation is truly essential to the functionality.

## Notes

This criterion was added in WCAG 2.1 and is particularly important for users who have mounted tablets or phones in fixed positions due to physical disabilities. The "essential" exception is intended for genuinely content-specific needs, not developer convenience.
