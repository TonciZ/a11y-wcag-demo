# WCAG 2.2 Demo Site

Interactive accessibility demos showing WCAG 2.2 failures and how to fix them. Built for testers and developers.

**Live site:** https://tonciz.github.io/a11y-wcag-demo/

## What it is

Each checkpoint page includes:
- Description of the criterion
- Manual testing instructions
- A toggleable FAIL / PASS interactive demo
- Fail and pass explanations
- Notes

## Current status

All 44 WCAG 2.2 Level A and AA checkpoints are fully implemented with interactive demos.

A small number of criteria that cannot be demonstrated on a static site (live captions, audio description tracks, etc.) are documented with an explanation of why and link to the official Understanding doc.

## Accessibility

The site itself is built to be accessible:
- Skip to content link
- Semantic landmark structure
- Logical heading hierarchy
- Visible focus indicators on all interactive elements
- No `outline: none`
- All interactive elements are native HTML
- Screen reader live regions for demo state changes
- Keyboard-reachable demo content
- Dark mode with verified contrast ratios in both themes

## Tech

Static HTML, CSS, and minimal vanilla JS. No frameworks, no dependencies. Deploys to GitHub Pages.

## Branch strategy

- `main` — stable, live on GitHub Pages
- `dev` — active development, merged to main periodically
