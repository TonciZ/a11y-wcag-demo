---
id: 2.4.2
title: Page Titled
level: A
wcag_url: https://www.w3.org/WAI/WCAG22/Understanding/page-titled.html
---

## Description

Web pages must have titles that describe their topic or purpose. The page title is the text in the HTML `<title>` element, which browsers display in tabs and window title bars and which screen readers announce immediately when a page loads or when a user switches tabs. A descriptive title allows users to quickly identify the content of a page without reading any of the page body.

## Fail Explanation

A failure occurs when a page has a missing, empty, or generic title — such as "Untitled Document," "Page 1," or a title that is identical across every page of a multi-page site. Screen reader users who have multiple browser tabs open rely on page titles to identify each tab without switching to it; identical or meaningless titles make this impossible. Users with cognitive disabilities and short-term memory challenges also depend on descriptive titles to re-orient themselves when returning to a tab.

## Pass Explanation

A passing implementation provides a unique, descriptive `<title>` element for every page that clearly communicates both the specific page topic and the site name — for example, "Contact Us — Acme Corporation" or "Product Details: Blue Widget — ShopExample." The most specific information should appear first in the title so it is announced first by screen readers and visible in truncated browser tabs.

## How To Test

1. View the page source or inspect the `<head>` element and locate the `<title>` tag.
2. Verify that the title text is not empty and is not a placeholder like "Untitled" or "New Page."
3. Confirm the title meaningfully describes the specific page's topic or purpose.
4. If the site has multiple pages, compare the titles across several pages to confirm each is unique.
5. Use a screen reader (NVDA, JAWS, or VoiceOver) and navigate to the page — confirm the title is announced when the page loads.
6. Check browser tabs to confirm the title is readable and distinguishable from other open tabs.

## Notes

Single-page applications (SPAs) that update content dynamically without a full page reload must update the `<title>` element programmatically as the view changes, and should use an ARIA live region or focus management technique to announce the new title to screen reader users. Automated accessibility checkers can detect missing or empty titles but cannot judge whether a title is meaningful.
