---
id: 1.4.11
title: Non-text Contrast
level: AA
wcag_url: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
---

## Description

The visual presentation of user interface components and graphical objects must have a contrast ratio of at least 3:1 against adjacent colors. This applies to the visual boundaries and states of interactive elements such as buttons, form inputs, checkboxes, radio buttons, and focus indicators, as well as to meaningful parts of icons and charts. Low-vision users who do not rely on screen readers need sufficient contrast to see and identify interactive elements and understand data visualizations.

## Fail Explanation

A failure occurs when a user interface component or graphical object does not achieve a 3:1 contrast ratio against its adjacent background. Common failures include text input borders that are too light against a white background (such as a very light grey border), custom checkboxes or radio buttons styled without sufficient contrast, icons used as controls whose graphical parts do not meet the threshold, and chart data elements (such as bars or lines) that do not contrast sufficiently against the chart background. Focus indicators - the visible outline shown when a component has keyboard focus - are also covered and frequently fail.

## Pass Explanation

A passing implementation ensures that the visual boundaries of interactive components, their states (default, hover, focus, error), and meaningful graphical objects all meet the 3:1 contrast ratio requirement. Form fields have borders or other boundary indicators that are clearly distinguishable from the page background. Custom controls are designed with contrast-aware colors. Icons that convey information are checked against their backgrounds. Focus indicators are sufficiently thick and high-contrast to be visible.

## How To Test

1. Identify all user interface components: buttons, text inputs, checkboxes, radio buttons, select menus, sliders, and custom controls.
2. For each component, identify the visual boundary or indicator that marks its presence (e.g., border, background, icon).
3. Use a contrast checking tool to measure the contrast ratio of that boundary against its adjacent color.
4. Verify the ratio meets or exceeds 3:1.
5. Check each interactive state: default, hover, focus, active, and error - all states must independently meet the threshold.
6. Identify meaningful graphical objects such as chart segments, graph lines, and informational icons, and check their contrast.
7. Pay specific attention to focus indicators, which are required to meet 3:1 under this criterion (and have additional requirements under 2.4.11 Focus Appearance in WCAG 2.2).

## Notes

This criterion was added in WCAG 2.1. It does not apply to disabled components, logos, or graphical elements that are purely decorative. The 3:1 threshold for non-text elements is lower than the 4.5:1 minimum for normal text, reflecting the generally larger size and simpler shapes of UI components compared to text glyphs.
