---
id: 2.4.1
title: Bypass Blocks
level: A
wcag_url: https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html
---

## Description

A mechanism must be available to allow users to skip blocks of content that are repeated on multiple pages, such as navigation menus, headers, and advertising sidebars. This criterion primarily benefits keyboard-only users and screen reader users, who must otherwise tab through every link in a navigation bar on every page before reaching the main content. The most common and recommended technique is a "skip to main content" link as the first focusable element on the page.

## Fail Explanation

A failure occurs when a page that shares repeated blocks of content with other pages (such as a global navigation with 30 links) provides no skip mechanism. Keyboard-only users must press Tab dozens of times to reach the first piece of main content on every page load. For screen reader users, this means hearing the entire navigation read aloud before reaching the relevant content, which is extremely inefficient and fatiguing over repeated use.

## Pass Explanation

A passing implementation includes a "Skip to main content" link that is the first focusable element in the DOM and points to a valid in-page anchor on the main content region. This link may be visually hidden until it receives keyboard focus (using a CSS off-screen technique), provided it becomes visible when focused. Alternatively, a proper heading hierarchy or landmark structure (using `<main>`, `<nav>`, etc.) may serve as a bypass mechanism in some browser/screen reader combinations, but a skip link is the most universally supported approach.

## How To Test

1. Load the page and press Tab once — the very first focusable item should be a "Skip to main content" link (it may only appear visually when focused).
2. Press Enter to activate the skip link and verify that keyboard focus moves to the main content area.
3. Confirm focus lands in or immediately before the main content, not back at the top of the page.
4. Inspect the page with a screen reader (NVDA + Firefox or JAWS + Chrome) and use the H key to navigate by headings; verify there is a clear heading structure that also enables efficient navigation.
5. Check that the main content region uses a `<main>` landmark or `role="main"` so screen reader users can jump directly using landmark navigation.

## Notes

The skip link target must be a real focusable element or have `tabindex="-1"` applied to receive programmatic focus — simply linking to an anchor on a non-focusable element like a `<div>` or `<h1>` may not move focus in all browsers. Testing with actual keyboard navigation is essential because automated tools often cannot verify whether a skip link functions correctly.
