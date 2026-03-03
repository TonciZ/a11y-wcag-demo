---
id: 3.2.6
title: Consistent Help
level: A
wcag_url: https://www.w3.org/WAI/WCAG22/Understanding/consistent-help.html
---

## Description

If a web page provides any of the following help mechanisms — human contact details, a human contact mechanism (such as a chat widget), a self-help option (such as an FAQ), or a fully automated contact mechanism (such as a chatbot) — and that mechanism is repeated across multiple pages of a website, it must appear in the same relative order in the page layout on each page. This new WCAG 2.2 criterion helps users with cognitive disabilities locate help reliably without needing to search for it each time they visit a new page.

## Fail Explanation

A failure occurs when help mechanisms are present across multiple pages but appear in different positions relative to other page content. For example, if a live chat button appears in the top-right corner on the homepage but in the footer on the contact page and in a sidebar on the product page, users with cognitive disabilities or memory impairments may be unable to find assistance when they need it most. Inconsistent placement adds unnecessary cognitive load and may effectively deny help to users who struggle to adapt to changing layouts.

## Pass Explanation

A page passes when any help mechanism that appears across the site is consistently placed in the same relative location within the page template — for example, always appearing as the last item in the primary navigation, or always positioned in the site footer before the copyright notice. The specific position does not matter as long as it remains predictable and consistent across all pages where it appears.

## How To Test

1. Identify whether the page provides any help mechanism: human contact details, a chat widget, a helpdesk email, an FAQ link, or an automated chatbot.
2. Navigate to several other pages within the same website that include the same help mechanism.
3. On each page, note the relative position of the help mechanism in relation to surrounding landmark regions and content blocks (e.g., header, nav, main, footer).
4. Verify that the help mechanism appears in the same relative order and location across all pages reviewed.
5. Check that changes in page content, length, or layout do not cause the help mechanism to shift its relative position in the page structure.
6. If user-initiated changes (such as expanding menus) temporarily alter the position, confirm that the mechanism returns to its standard location.

## Notes

This criterion applies only to help mechanisms that are repeated across multiple pages; a help section unique to a single page (such as a dedicated support page) is not in scope. The requirement is about relative order within the page, not pixel-precise positioning, so responsive layout reflows that maintain structural order are acceptable.
