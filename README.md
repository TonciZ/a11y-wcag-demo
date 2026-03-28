# WCAG 2.2 Demo Site

> **Work in progress.** All 45 checkpoints have interactive demos but extensive testing is still needed across browsers, screen readers, and zoom levels.

Interactive accessibility demos showing WCAG 2.2 failures and how to fix them. Built for testers and developers learning accessibility testing.

**Live site:** https://tonciz.github.io/a11y-wcag-demo/

## What it is

45 checkpoint pages covering all WCAG 2.2 Level A and AA success criteria. Each page includes:

- Description of the criterion
- Manual testing instructions with recommended tools
- 3-5 toggleable FAIL / PASS interactive demos per checkpoint
- Fail and pass explanations
- Collapsible code sections showing the source for each demo
- Suggested solutions and references from real-world audit findings
- Links to official WCAG Understanding docs and techniques

## Features

- **Search and filtering** on the homepage by keyword, level, or category
- **Dark and light themes** with verified contrast ratios in both
- **Sidebar navigation** with all 45 checkpoints grouped by principle
- **Tool setup guides** for axe DevTools, Lighthouse, CCA, NVDA, and more
- **Real-world examples** enriched from 930 accessibility audit findings

## Current status

A small number of criteria that require media playback (live captions, audio descriptions) show static demonstrations with "Coming soon" tags for future enhancement.

## Accessibility

The site itself is built to be accessible:
- Skip to content link
- Semantic landmark structure
- Logical heading hierarchy
- Visible focus indicators on all interactive elements
- All interactive elements are native HTML (no div buttons)
- Screen reader live regions for demo state changes
- Keyboard-reachable demo content
- Dark mode with verified contrast ratios in both themes

## Tech

Static HTML, CSS, and minimal vanilla JS. No frameworks, no dependencies. Deploys to GitHub Pages.

## Branch strategy

- `master` — stable, live on GitHub Pages
- `dev` — active development, merged to master periodically
