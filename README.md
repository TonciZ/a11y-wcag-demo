# WCAG 2.2 Demo Site

Interactive accessibility demos showing WCAG 2.2 failures and how to fix them. Built for testers and developers.

**Live site:** https://tonciz.github.io/a11y-wcag-demo/

## What it is

Each checkpoint includes:
- A toggleable FAIL / PASS demo
- Explanation of why the failure occurs
- Manual testing instructions

## Current checkpoints

| ID | Title | Level | Status |
|----|-------|-------|--------|
| 1.3.1 | Info and Relationships | A | Demo ready |

All other WCAG 2.2 Level A and AA checkpoints are scaffolded with full content (description, fail/pass explanations, testing instructions) and are awaiting demo implementation.

## Accessibility

The site itself is built to be accessible:
- Skip to content link
- Semantic landmark structure
- Logical heading hierarchy
- Visible focus indicators
- No `outline: none`
- All interactive elements are native HTML
- Screen reader live regions for demo state changes
- Keyboard-reachable demo content

## Tech

Static HTML, CSS, and minimal vanilla JS. No frameworks, no dependencies. Deploys to GitHub Pages.

## Branch strategy

- `main` — stable, live on GitHub Pages
- `dev` — active development, merged to main periodically
