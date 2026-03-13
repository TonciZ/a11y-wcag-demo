# Stack Research

**Domain:** Static WCAG 2.2 educational demo site (accessibility testing toolchain)
**Researched:** 2026-03-10
**Confidence:** MEDIUM — core runtime stack is confirmed from live codebase; version numbers for dev-only tools are based on training data (August 2025 cutoff) and flagged for verification

---

## Context: What Already Exists

The production stack is locked and working. This research addresses only the **supporting toolchain** — tools used during development to verify the site itself meets WCAG 2.2 AA. Nothing here touches the deployed site.

**Existing production stack (no changes needed):**
- HTML5 + CSS3 + ES5 JavaScript, zero dependencies
- GitHub Pages hosting, no build process
- Three JS modules (IIFE): `demo-toggle.js`, `checkpoint-nav.js`, `theme-toggle.js`
- Three CSS layers: `base.css` (tokens), `layout.css` (structure), `demo.css` (demos)

**Current testing gap:** Zero automated checks. All verification is manual. With 44 checkpoint pages to build and the site itself under accessibility scrutiny by domain experts, that gap needs to close.

---

## Recommended Stack

### Core Technologies (Production)

These are confirmed from the codebase and do not change.

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| HTML5 | — | Page markup and document structure | Native semantics eliminate the need for ARIA workarounds; screen readers understand HTML natively |
| CSS3 with custom properties | — | Styling, theming, layout | Token system enables consistent dark/light mode; no preprocessor needed at this scale |
| ES5 JavaScript | — | Demo toggle, navigation injection, theme persistence | ES5 syntax works in all target browsers without transpilation; IIFE pattern avoids module bundler requirement |
| GitHub Pages | — | Static hosting | Zero-config deployment from `master` branch; HTTPS included; no server runtime |

### Development Toolchain (New Additions)

These are installed as `devDependencies` only — they never ship to users.

| Tool | Version | Purpose | Why |
|------|---------|---------|-----|
| axe-core (via `@axe-core/cli`) | `^4.9` | Automated WCAG 2.2 AA audit against each of the 44 pages | Industry standard; covers ~57% of WCAG issues automatically; rules map directly to WCAG success criteria; Deque maintains it; output is machine-readable JSON. Confidence: MEDIUM — version based on training data, verify at npmjs.com/package/@axe-core/cli |
| pa11y | `^6.2` | Second-pass WCAG audit using a different rule engine (HTML CodeSniffer) | Different engine from axe catches different issues; useful as a cross-check; simpler CLI for batch-running all 44 URLs. Confidence: MEDIUM — verify current version at npmjs.com/package/pa11y |
| http-server | `^14.1` | Serve the static site locally for automated testing | axe-core and pa11y require a real HTTP server (not `file://` protocol); `http-server` is zero-config and the lightest option that works. Confidence: MEDIUM — verify version |
| Playwright | `^1.44` | Keyboard navigation testing and browser automation | Verifies things axe cannot: tab order, focus trap detection, live region announcement timing, keyboard operability of demos. Only add if keyboard automation testing is prioritised in roadmap. Confidence: MEDIUM — verify version |

> **Note on Playwright:** It is optional and adds weight. If the project remains low-volume (one developer, no CI), skip it and rely on manual keyboard testing. Add it when regressions start occurring or when multiple contributors are involved.

### Supporting Utilities

| Tool | Version | Purpose | When to Use |
|------|---------|---------|-------------|
| npm (package.json) | `^10` | Manage devDependencies and run scripts | Required the moment any devDependency is added. Create a minimal `package.json` with `"private": true` and no public publish config. |
| HTML validator (Nu Validator via CLI `vnu-jar`) | latest | Check HTML5 validity across all 44 pages | Catches malformed ARIA patterns and misused elements that accessibility tree audits do not flag. Run as batch check. Confidence: LOW — verify current distribution method at validator.w3.org/nu |

---

## Installation

```bash
# Create package.json (minimal — private project, no publish)
npm init -y
# Then edit: set "private": true, remove "main", "scripts" stubbed below

# Dev dependencies only — nothing ships to users
npm install -D @axe-core/cli pa11y http-server

# Optional: keyboard automation testing
npm install -D @playwright/test
npx playwright install chromium
```

**Minimal `package.json` scripts block:**

```json
{
  "private": true,
  "scripts": {
    "serve": "http-server . -p 8080 -c-1 --silent",
    "audit:axe": "axe http://localhost:8080/checkpoints/ --dir checkpoints",
    "audit:pa11y": "pa11y http://localhost:8080/index.html",
    "audit": "npm run serve & sleep 2 && npm run audit:axe && npm run audit:pa11y"
  },
  "devDependencies": {
    "@axe-core/cli": "^4.9.0",
    "http-server": "^14.1.1",
    "pa11y": "^6.2.3"
  }
}
```

> **Important:** The `npm run audit` script above uses a background process (`&`). On Windows with Git Bash this works; on PowerShell the syntax differs. The recommended approach is two separate terminal windows: `npm run serve` in one, then `npm run audit:axe` and `npm run audit:pa11y` in the other.

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| `@axe-core/cli` | `axe-playwright` (axe integrated into Playwright) | Use `axe-playwright` only if Playwright is already adopted for keyboard testing — avoids maintaining two audit mechanisms |
| `@axe-core/cli` | Lighthouse CLI | Lighthouse is broader (performance, SEO) but its accessibility audits are a subset of axe rules. Use Lighthouse when you want a single report covering multiple dimensions; use axe when you want maximum accessibility coverage |
| `pa11y` | `pa11y-ci` | `pa11y-ci` is the CI/batch version; use it when adding GitHub Actions. `pa11y` CLI is sufficient for local development |
| `http-server` | `live-server` | `live-server` has hot reload which is useful during active development but adds a watcher process. `http-server` is simpler for one-shot audit runs |
| `http-server` | Python `http.server` | Works without npm, useful if avoiding a `package.json`. Acceptable fallback with no installation required: `python -m http.server 8080` |
| Playwright | Cypress | Cypress has a better DX for UI interaction tests but its bundle is much larger (~1GB). Playwright is lighter and axe integration is first-class. Both are overkill unless keyboard regression testing is a roadmap priority |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Jest + jsdom for accessibility testing | jsdom does not render a real accessibility tree; axe checks against jsdom are unreliable for ARIA state and focus testing | `@axe-core/cli` against a real browser (Chromium via Playwright or system Chrome) |
| Deque's browser extension (axe DevTools) as the only audit tool | Manual, not scriptable, does not scale to 44 pages | `@axe-core/cli` for batch; browser extension for deep investigation of individual violations |
| React/Vue/Angular component testing libraries | The site has no components — it is static HTML. These libraries add massive overhead for zero gain | Plain `@axe-core/cli` + `pa11y` |
| Lighthouse CI (lhci) | Adds CI server infrastructure requirements. Disproportionate for a single-developer project with no CI pipeline yet | Lighthouse CLI (`lighthouse http://localhost:8080`) as a one-off check when needed |
| WAVE API | Paid, requires registration, cloud-dependent. For a static educational site, axe-core provides comparable or better coverage offline | `@axe-core/cli` |
| `eslint-plugin-jsx-a11y` | JSX-specific — completely irrelevant to a vanilla HTML site | HTML Validator (Nu) for HTML-level checks |
| Automated screen reader testing (e.g., `guidepup`) | Emerging, brittle, OS/browser/screen-reader version dependent. The site's primary audience are professionals who will test with real screen readers themselves | Manual screen reader testing per checkpoint |

---

## Stack Patterns by Variant

**If no `package.json` is desired (keep the project purely file-based):**
- Use `python -m http.server 8080` for local serving
- Run axe-core via the browser extension (Deque axe DevTools) page-by-page
- No npm, no devDependencies
- Trade-off: loses batch auditing across all 44 pages; acceptable if checkpoints are built one at a time anyway

**If GitHub Actions CI is added later:**
- Replace `pa11y` with `pa11y-ci` and a `pa11y-ci.json` config listing all 44 URLs
- Add `lhci autorun` for a high-level score gate
- Use `@axe-core/cli` with `--reporter json` to post results as PR comments

**If Playwright is added for keyboard testing:**
- Use `@axe-core/playwright` instead of `@axe-core/cli` to avoid running two separate Chromium instances
- Write one Playwright test per demo toggle: tab to button, activate, assert `aria-pressed` flips and live region fires

---

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| `@axe-core/cli@^4.9` | Node.js 18+ | axe 4.x requires Node 18 minimum as of axe-core 4.7+. Verify: check `engines` field in package. MEDIUM confidence |
| `pa11y@^6.2` | Node.js 18+, Chromium | pa11y v6 uses Puppeteer internally; Puppeteer downloads its own Chromium. No conflict with Playwright. MEDIUM confidence |
| `http-server@^14.1` | Node.js 14+ | No known compatibility issues with other devDeps |
| `@playwright/test@^1.44` | Node.js 18+, conflicts with older `@playwright/test` versions | Run `npx playwright install` after installing to download browser binaries |

> **Node.js version:** Use Node.js 20 LTS (current LTS as of 2025). All packages above support it. Confidence: HIGH.

---

## Confidence Assessment

| Tool | Confidence | Basis |
|------|-----------|-------|
| axe-core as primary audit tool | HIGH | Industry standard, confirmed widely used, official docs at deque.com/axe |
| `@axe-core/cli` package exists | HIGH | Confirmed in Deque's axe-core-npm monorepo |
| axe-core version `^4.9` | MEDIUM | Based on training data (Aug 2025); verify at npmjs.com/package/@axe-core/cli |
| pa11y as secondary audit tool | HIGH | Well-established, maintained by Financial Times accessibility team |
| pa11y version `^6.2` | MEDIUM | Based on training data; verify at npmjs.com/package/pa11y |
| http-server version `^14.1` | MEDIUM | Based on training data; verify at npmjs.com/package/http-server |
| Playwright version `^1.44` | MEDIUM | Based on training data; verify at playwright.dev |
| Node.js 20 LTS recommendation | HIGH | 20 was confirmed LTS at training cutoff; check nodejs.org for current LTS |
| Python fallback for serving | HIGH | Python 3 standard library, no version concerns |

---

## Sources

- Deque axe-core GitHub: https://github.com/dequelabs/axe-core — axe-core rule engine, authoritativeness confirmed
- axe-core-npm CLI package: https://github.com/dequelabs/axe-core-npm/tree/develop/packages/cli — CLI wrapper for axe-core
- pa11y GitHub: https://github.com/pa11y/pa11y — HTML CodeSniffer-based CLI auditor
- Playwright docs: https://playwright.dev — keyboard/browser automation
- W3C Nu HTML Checker: https://validator.w3.org/nu — HTML5 validity
- Codebase analysis: `.planning/codebase/TESTING.md` — confirmed zero automated testing currently
- Codebase analysis: `.planning/codebase/CONCERNS.md` — confirmed no linter/formatter configured

> Version numbers marked MEDIUM confidence should be verified against npm before committing to a `package.json`. Command to check latest: `npm show @axe-core/cli version` and `npm show pa11y version`.

---

*Stack research for: WCAG 2.2 A11y Demo — development toolchain*
*Researched: 2026-03-10*
