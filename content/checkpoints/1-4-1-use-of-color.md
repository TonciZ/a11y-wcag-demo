---
id: 1.4.1
title: Use of Color
level: A
wcag_url: https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html
---

## Description

Color must not be used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element. Users who are colorblind or who use high contrast modes or monochrome displays may not be able to perceive color differences, so any information conveyed through color must also be conveyed through another visual means such as text, pattern, shape, or position.

## Fail Explanation

A failure occurs when color is the sole indicator used to communicate important information. Common examples include form fields outlined in red to indicate an error with no error text or icon, charts that use colored lines to distinguish data series with no legend labels or patterns, and links that are distinguished from surrounding text only by color with no underline or other non-color indicator. Users with red-green color blindness, the most common form, would be unable to distinguish these elements.

## Pass Explanation

A passing implementation ensures that any information communicated through color is also communicated through at least one other visual means. Error fields are marked with both a red border and an error icon or text message. Chart data series are distinguished by both color and pattern or labeled directly. Links in body text are underlined or bold in addition to being a different color. When color is used decoratively and conveys no information, no additional indicator is needed.

## How To Test

1. Identify all instances where color is used to convey information, indicate an action, prompt a response, or distinguish elements.
2. For each instance, determine whether the same information is also conveyed by a non-color visual means (text, icon, shape, pattern, underline, etc.).
3. Use a grayscale filter or browser extension to view the page without color and verify all information is still perceivable.
4. Test with a color blindness simulation tool to check readability for common types such as deuteranopia and protanopia.
5. Review form validation states, charts, graphs, status indicators, and inline links as common areas of failure.
6. Check navigation and interactive elements to ensure their state (active, selected, required) is not conveyed by color alone.

## Notes

This criterion does not prohibit the use of color; it only requires that color not be the only means of conveying information. It is important to note that contrast ratio requirements are covered under SC 1.4.3, not this criterion - 1.4.1 is specifically about redundancy of information, not color luminance.
