---
id: 1-3-1
title: Info and Relationships
level: A
wcag_url: https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html
---

## Description

Information, structure, and relationships conveyed through visual presentation must also be programmatically determinable - or available in text. Screen readers and assistive technologies cannot infer meaning from visual layout alone. Structure must be expressed in the HTML itself.

## Fail Explanation

When a table uses only `<td>` elements for all cells - including the header row - screen readers announce every cell as plain data with no column context. A user navigating by table cell hears values like "Name", "Score", "Rank" with no indication that these are column headers. The relationship between the header and data cells is invisible to assistive technology.

## Pass Explanation

Using `<th>` elements for header cells, with an appropriate `scope` attribute (`scope="col"` for column headers, `scope="row"` for row headers), allows screen readers to announce context. When a user navigates to a data cell, the screen reader can say "Score column, Alice: 92" - conveying the structural relationship programmatically.

## How To Test

1. Open the page in a browser.
2. Inspect the table markup using browser DevTools.
3. Look for `<th>` elements in header rows/columns. If all cells use `<td>`, this is a failure.
4. Check that `<th>` elements have a `scope` attribute where the table has both row and column headers.
5. Use a screen reader (NVDA + Firefox, JAWS + Chrome, or VoiceOver + Safari):
   - Navigate into the table using the table navigation key (T in NVDA browse mode).
   - Move through cells with arrow keys.
   - Listen for whether the screen reader announces the column or row header along with each data cell.
6. If no header context is announced, the criterion fails.

## Notes

This is one of the most commonly failed WCAG criteria. It applies beyond tables - heading levels (`<h1>`–`<h6>`), list markup (`<ul>`, `<ol>`, `<li>`), and landmark roles are all part of 1.3.1. A visually styled bold paragraph that functions as a heading but uses `<p><strong>` instead of an `<h>` element also fails this criterion.
