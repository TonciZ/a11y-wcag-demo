---
id: 1.4.10
title: Reflow
level: AA
wcag_url: https://www.w3.org/WAI/WCAG22/Understanding/reflow.html
---

## Description

Content must be presentable without loss of information or functionality, and without requiring scrolling in two dimensions, when displayed at a width equivalent to 320 CSS pixels. This corresponds to a viewport set to 1280 CSS pixels wide and zoomed to 400%. Users with low vision commonly use high zoom levels to read content, and requiring horizontal scrolling in addition to vertical scrolling when zoomed creates a significant cognitive and motor burden.

## Fail Explanation

A failure occurs when zooming to 400% (or viewing at a 320px-wide viewport) causes the page to require horizontal scrolling to access content, or when content becomes hidden or lost at that zoom level. Common failures include fixed-width layouts that do not adapt responsively, tables that do not scroll or collapse at small viewports, navigation bars that overflow their containers, and side-by-side column layouts that do not reflow to a single column. Data visualizations rendered at a fixed size that cannot be scrolled within a container can also fail.

## Pass Explanation

A passing implementation uses responsive design so that at a 320px viewport width, all content reflows into a single column that can be read by scrolling vertically only. This is typically achieved using CSS media queries, flexible grid layouts, and relative units. Content that requires two-dimensional scrolling by nature — such as data tables, maps, diagrams, or media players — is exempt from this requirement, provided the rest of the page still reflows correctly.

## How To Test

1. Open the page in a desktop browser at a viewport width of 1280px.
2. Zoom the browser to 400% using Ctrl/Cmd + + or browser zoom settings.
3. Check whether horizontal scrolling is required to read any content.
4. Scroll vertically through the entire page and verify all content remains visible and readable without horizontal scrolling.
5. Alternatively, use browser developer tools to simulate a 320px-wide viewport and test the same conditions.
6. Identify any content that is lost, hidden, or overlapping at this zoom level.
7. Note whether any two-dimensional scrolling content (tables, maps) is contained in a scrollable region with appropriate labels.

## Notes

This criterion was added in WCAG 2.1 and is closely related to responsive web design practices. The 320 CSS pixel threshold was chosen because it corresponds to 1280px at 400% zoom, which is a common zoom level for low-vision users. Content that inherently requires two-dimensional layout — such as complex spreadsheets or video players — is explicitly excluded.
