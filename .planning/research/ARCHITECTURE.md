# Architecture Research

**Domain:** Static educational site — WCAG 2.2 demo pages
**Researched:** 2026-03-10
**Confidence:** HIGH (based on direct codebase analysis, no inference required)

---

## Standard Architecture

### System Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                         BROWSER (no server)                       │
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  Page Layer  (44 x .html files + index.html)                │  │
│  │                                                              │  │
│  │   index.html           checkpoints/[id].html                │  │
│  │   (hub / nav)  ──→     (one per checkpoint, 44 total)       │  │
│  └──────────────────────────────┬───────────────────────────── ┘  │
│                                 │ loads                            │
│  ┌──────────────────────────────▼───────────────────────────── ┐  │
│  │  Shared JS Layer  (assets/js/)                               │  │
│  │                                                              │  │
│  │   checkpoint-nav.js    demo-toggle.js    theme-toggle.js    │  │
│  │   (injects sidebar,    (fail/pass        (dark mode,         │  │
│  │    marks active page)   toggle + SR       localStorage)      │  │
│  │                         announcements)                       │  │
│  └──────────────────────────────┬───────────────────────────── ┘  │
│                                 │ reads / writes                   │
│  ┌──────────────────────────────▼───────────────────────────── ┐  │
│  │  Shared CSS Layer  (assets/css/)                             │  │
│  │                                                              │  │
│  │   base.css             layout.css        demo.css            │  │
│  │   (tokens, reset,      (structure,        (demo-container,   │  │
│  │    typography,          nav, hero,         toggle button,     │  │
│  │    dark mode vars)      badges, cards)     fail/pass states)  │  │
│  └───────────────────────────────────────────────────────────── ┘  │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────── ┐  │
│  │  Content Layer  (content/checkpoints/*.md)                   │  │
│  │  Author-facing research files. Not loaded at runtime.        │  │
│  │  Read by the implementer to write the .html checkpoint page. │  │
│  └──────────────────────────────────────────────────────────── ┘  │
└──────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `index.html` | Hub: lists all 44 checkpoints as cards; owns its own static sidebar nav | Static only; links out to `checkpoints/*.html` |
| `checkpoints/[id].html` | One checkpoint page: page-header, content sections, demo container | Imports all 3 CSS files + 3 shared JS files |
| `checkpoint-nav.js` | Reads `window.location.pathname` to determine current page; injects sidebar HTML into DOM; sets `aria-current="page"` and auto-scrolls | Depends on `body.checkpoint-page` class guard; wraps `#main-content` in `.index-layout` |
| `demo-toggle.js` | Listens for `.demo-toggle` button clicks; swaps `data-mode` on `.demo-container`; toggles `hidden` on demo state panels; writes to `[data-demo-announcement]` live region | Data contract: `data-announce-fail` / `data-announce-pass` attributes on `.demo-container` |
| `theme-toggle.js` | Reads/writes `localStorage` key `"theme"`; sets/removes `data-theme="dark"` on `<html>`; syncs `aria-pressed` on `.theme-toggle` button | Inline `<head>` script handles FOCT prevention; `base.css` + `demo.css` react to `[data-theme="dark"]` |
| `base.css` | CSS custom properties (tokens), reset, typography, dark mode variable overrides | Consumed by all pages; `demo.css` overrides its tokens inside `.demo-stage` |
| `layout.css` | Page structure (hero, skip link, sidebar, index layout, cards, badges, responsive breakpoints) | Depends on tokens from `base.css` |
| `demo.css` | `.demo-container` chrome, toggle button states, fail/pass color strips, demo-stage light-mode lock, demo placeholder | Data contract: `[data-mode="fail|pass"]` on `.demo-container` |
| `content/checkpoints/*.md` | Research + implementation notes per checkpoint; human-authored; not served at runtime | Read by implementer before writing `.html` checkpoint page |

---

## Recommended Project Structure

```
a11y-wcag-demo/
├── index.html                     # Hub page — static sidebar, 44 checkpoint cards
├── checkpoints/                   # One .html file per checkpoint (44 total)
│   ├── 1-1-1-non-text-content.html
│   ├── 1-4-11-non-text-contrast.html
│   └── [42 more, named {sc-id}-{slug}.html]
├── assets/
│   ├── css/
│   │   ├── base.css               # Tokens, reset, typography, dark mode vars
│   │   ├── layout.css             # Structure, nav, hero, cards, badges
│   │   └── demo.css               # Demo container, toggle, fail/pass states
│   └── js/
│       ├── checkpoint-nav.js      # Sidebar injection + active-page highlighting
│       ├── demo-toggle.js         # Fail/pass toggle + screen reader announcements
│       └── theme-toggle.js        # Dark mode persistence
└── content/
    └── checkpoints/               # Research .md files, one per checkpoint
        ├── 4-1-2-name-role-value.md   # Complete — used as implementation source
        └── [43 more .md stubs]
```

### Structure Rationale

- **`checkpoints/` flat directory:** No subdirectories. All 44 pages at the same depth means relative paths to `../assets/` are always identical — one less thing to get wrong per page.
- **`assets/css/` three-file split:** `base.css` provides tokens; `layout.css` consumes tokens for chrome; `demo.css` consumes tokens for demos and selectively overrides them inside `.demo-stage`. This ordering matters — load order is `base → layout → demo`.
- **`assets/js/` three-file split:** Each file has a single, narrow contract. `demo-toggle.js` reads no globals and injects no DOM beyond its own live region write. `checkpoint-nav.js` guards against running on non-checkpoint pages via the `body.checkpoint-page` class.
- **`content/checkpoints/` as authoring layer:** These `.md` files never ship to the browser. They are the human-readable specification that drives `.html` implementation. Keeping them in the repo lets the two-phase workflow (research → implement) be tracked in version control.

---

## Architectural Patterns

### Pattern 1: Data-attribute state machine on `.demo-container`

**What:** Each demo container holds its entire state in a single `data-mode` attribute (`"fail"` or `"pass"`). CSS selectors key off this attribute to show/hide elements and apply colour strips. JS only writes to this one attribute plus the live region — it never manipulates styles directly.

**When to use:** Any demo that needs a binary toggle. Apply the same pattern to every new checkpoint page.

**Trade-offs:** Simple and reliable. All state visible in the DOM (useful when users inspect with browser tools). Cannot express more than two states (fail/pass) without extending the pattern.

**Data contract:**
```html
<!-- Container: carries state + announcement strings -->
<div class="demo-container"
     data-mode="fail"
     role="region"
     aria-labelledby="{label-id}"
     data-announce-fail="Showing fail example. {functional impact}"
     data-announce-pass="Showing pass example. {functional impact}">

  <!-- Toolbar: label + toggle button -->
  <div class="demo-container__toolbar">
    <span id="{label-id}" class="demo-container__label">{Demo title}</span>
    <button class="demo-toggle" type="button" aria-pressed="false">
      <span class="demo-toggle__label--fail">Show passing example</span>
      <span class="demo-toggle__label--pass" hidden>Show failing example</span>
    </button>
  </div>

  <!-- Fail/pass colour strip (aria-hidden — purely decorative) -->
  <div class="demo-status" aria-hidden="true">
    <span class="demo-status__text--fail">Fail</span>
    <span class="demo-status__text--pass">Pass</span>
  </div>

  <!-- Screen reader live region — gets text written on every toggle -->
  <div class="visually-hidden" aria-live="polite" aria-atomic="true"
       data-demo-announcement></div>

  <!-- Demo stage: contains fail + pass panels -->
  <div class="demo-stage">
    <div data-demo-state="fail">{fail content}</div>
    <div data-demo-state="pass" hidden>{pass content}</div>
  </div>
</div>
```

---

### Pattern 2: Code snippet display alongside live demo

**What:** The planned enhancement adds a `<pre><code>` block for each demo state panel, showing the exact HTML that produces the fail or pass behaviour. The code block lives inside the same `data-demo-state` panel as the live demo, so toggling the demo automatically swaps the visible code.

**When to use:** Every fully-implemented checkpoint page should show code. Place the code block below the live interactive element inside the same `data-demo-state` panel.

**Recommended structure (extending Pattern 1):**
```html
<div data-demo-state="fail">
  <!-- Live rendered example -->
  <div class="demo-live">
    {fail HTML rendered here}
  </div>

  <!-- Code shown beneath the live example -->
  <pre><code class="demo-code">{escaped HTML source for fail example}</code></pre>
</div>

<div data-demo-state="pass" hidden>
  <div class="demo-live">
    {pass HTML rendered here}
  </div>
  <pre><code class="demo-code">{escaped HTML source for pass example}</code></pre>
</div>
```

**Trade-offs:** Zero JS required — the existing toggle already hides/shows the parent panel. The only cost is authoring: HTML entities in code blocks must be manually escaped (`<` → `&lt;`, `>` → `&gt;`). This is acceptable for a static site with 44 pages and a two-phase authoring workflow.

**Why not a `<template>` or JS-rendered approach:** Avoiding JS for code rendering keeps the page inspectable and screen-reader-testable without running scripts. It also means the code block is in the DOM for users who inspect source — consistent with the educational purpose.

---

### Pattern 3: Shared JS via script injection, not module bundling

**What:** Each checkpoint page ends with three `<script src>` tags in DOM order. Scripts are IIFEs — they run immediately on load, read the existing DOM, and attach event listeners. No module system, no imports, no build step.

**When to use:** Every checkpoint page. Script load order: `checkpoint-nav.js` first (modifies DOM structure by wrapping `#main-content`), then `demo-toggle.js` (queries `.demo-toggle` inside that DOM), then `theme-toggle.js` (independent, queries `.theme-toggle`).

**Why this order matters:** `checkpoint-nav.js` wraps `#main-content` in `.index-layout`. If `demo-toggle.js` ran first, its `document.querySelectorAll('.demo-toggle')` would still work (it doesn't depend on the wrapper), but the load order documents the structural dependency clearly.

**Trade-offs:** Requires `DOMContentLoaded` guard in each script (already in place). Cannot share state between scripts at runtime — each is self-contained, which is a feature not a bug.

---

### Pattern 4: Checkpoint page fixed section order

**What:** Every implemented checkpoint page follows the same section sequence inside `<main>`:

1. `.page-header` — checkpoint ID, title, level badge
2. `#description-heading` section — what the criterion requires
3. `#testing-heading` section — how to test manually (ordered list)
4. `#demo-heading` section — the `.demo-container` (one or more)
5. `#fail-heading` section — prose explanation of the failure
6. `#pass-heading` section — prose explanation of the pass
7. `#notes-heading` section — implementation notes, edge cases

**Why enforce this:** Screen reader users navigating by headings will encounter the same landmark order on every page. This is a direct application of 3.2.3 Consistent Navigation and 2.4.6 Headings and Labels — the site must model the criteria it teaches.

---

### Pattern 5: Screen reader announcement strings — functional language only

**What:** `data-announce-fail` and `data-announce-pass` attribute values describe what the user will experience functionally, not what CSS properties are applied visually.

**Correct:**
```
data-announce-fail="Showing fail example. Custom div control has no accessible name, role, or state."
data-announce-pass="Showing pass example. Native checkbox provides name, role, and state automatically."
```

**Incorrect (existing pattern to fix in 39 files):**
```
data-announce-fail="Showing fail example. Form border has 1.5:1 contrast ratio against background."
data-announce-pass="Showing pass example. Form border now has 4.5:1 contrast with #8a8a8a border color."
```

**Why:** Screen readers read these strings aloud. Contrast ratios and hex codes are meaningless audio. Functional impact ("border is not visible enough to identify the field") serves the learning objective.

---

## Data Flow

### Demo Toggle Flow

```
User clicks .demo-toggle button
    ↓
demo-toggle.js: initDemoToggle(button) click handler
    ↓
Reads current aria-pressed on button
    ↓
Determines nextMode ("fail" or "pass")
    ├── Sets data-mode on .demo-container
    ├── Sets aria-pressed on button
    ├── Toggles hidden on .demo-toggle__label--fail / --pass spans
    ├── Toggles hidden on [data-demo-state="fail"] / [data-demo-state="pass"] panels
    └── Writes announcement string to [data-demo-announcement] text content
            ↓
        aria-live="polite" region fires to screen reader
```

### Page Load Flow (Checkpoint Pages)

```
Browser requests checkpoints/[id].html
    ↓
<head>: inline script reads localStorage["theme"] → sets data-theme on <html> (FOCT prevention)
    ↓
CSS loads: base.css → layout.css → demo.css
    ↓
DOMContentLoaded:
    ├── checkpoint-nav.js: checks body.checkpoint-page →
    │     injects nav HTML → wraps #main-content in .index-layout →
    │     extracts checkpoint ID from URL → sets aria-current + active class → scrollIntoView
    ├── demo-toggle.js: querySelectorAll('.demo-toggle') →
    │     attaches click listener to each button
    └── theme-toggle.js: reads localStorage → applies theme → syncs button state
```

### Authoring / Build Flow

```
User: deep research for checkpoint X
    ↓
User: writes content/checkpoints/[id].md
    ↓
Implementer (Claude): reads [id].md
    ↓
Implementer: writes checkpoints/[id].html
    (copies page structure from existing checkpoint,
     replaces description/testing/demo/explanation content,
     updates data-announce-* strings to functional language,
     gives demo IDs a page-unique suffix e.g. "412", "111")
    ↓
No build step — file is immediately live on GitHub Pages
```

---

## Scaling Considerations

This site does not scale in the traditional sense — it is a static set of files with a known, fixed maximum of 44 checkpoint pages. "Scale" here means maintainability as all 44 pages are implemented.

| Concern | Current (2/44 implemented) | At 44/44 implemented |
|---------|---------------------------|----------------------|
| Navigation duplication | `checkpoint-nav.js` has nav HTML hardcoded; `index.html` also has nav hardcoded (static) | Two copies to keep in sync if a checkpoint is renamed. Acceptable — renames are very rare for WCAG SCs |
| Announcement string consistency | Addressed one-at-a-time | 39 remaining files need `data-announce-*` audit; can be scripted with grep |
| Demo ID uniqueness | Each page uses a suffix (e.g. `demo-label-412`) scoped to that page | Must be enforced by convention — no namespace enforcement in vanilla JS |
| CSS for checkpoint-specific demos | `demo.css` has a growing "checkpoint-specific" section | If this section becomes unwieldy, split into `demo-overrides.css` (optional, low priority) |
| Adding a checkpoint | Create `content/checkpoints/[id].md`, implement `checkpoints/[id].html` — no other changes | No architecture changes required, as designed |

### What would break architecture constraints

- Converting navigation to a JS-rendered component (SPA anti-pattern — would break no-JS usage)
- Adding a build step that generates pages from `.md` files (CMS anti-pattern — adds runtime dependency)
- Importing an external syntax-highlighting library for code blocks (violates no-libraries constraint)
- Storing demo state in JS variables rather than data attributes (breaks inspectability, which is a core educational goal)

---

## Anti-Patterns

### Anti-Pattern 1: Inline styles on demo content elements

**What people do:** Write `style="color: red; font-size: 1.2em"` directly on elements inside `data-demo-state` panels.

**Why it's wrong:** Existing checkpoint pages already do this in some demo content (the 4.1.2 fake checkbox has inline `style`). It works, but it bypasses the token system, makes dark-mode testing unreliable, and cannot be overridden by `demo.css`. The `demo-stage` dark-mode lock in `demo.css` mitigates FOCT on tokens but not arbitrary inline colours.

**Do this instead:** Add scoped classes in `demo.css` for demo-specific styles. For truly one-off demo styles, use a `<style>` block scoped to that checkpoint page — acceptable for static pages.

---

### Anti-Pattern 2: Using visual-property language in announcement strings

**What people do:** Set `data-announce-pass="Showing pass example. Contrast is now 4.5:1 with border color #767676."`

**Why it's wrong:** Screen readers announce these strings verbatim. The audience hears a string of meaningless numbers and CSS syntax. It fails the educational goal and arguably fails 1.3.3 (Sensory Characteristics) — communicating information only via a visual property value.

**Do this instead:** Describe the functional impact: what changes for the user, what a screen reader will now announce, what a sighted low-vision user will now be able to perceive. Example: `"Showing pass example. Input field now has a clearly visible border that distinguishes it from the surrounding page."`.

---

### Anti-Pattern 3: Demo IDs that are not page-scoped

**What people do:** Copy a checkpoint page and forget to rename IDs like `demo-label-1`, `terms-pass`, `form-fail-input`.

**Why it's wrong:** `aria-labelledby` and `for`/`id` associations silently break when IDs are duplicated within a page. Since multiple demos may share a page (multi-demo pages are planned), collisions are a real risk.

**Do this instead:** Suffix all IDs with the checkpoint number and a demo index: `demo-label-412`, `terms-412-pass`, `form-412-input`. The checkpoint number is unique and stable; adding a demo index (`-1`, `-2`) handles multi-demo pages.

---

### Anti-Pattern 4: Adding a `<section>` for code snippets outside the demo container

**What people do:** Create a separate "Code" section below the demo container that shows static, non-toggled HTML.

**Why it's wrong:** Separates the code from the state it describes. When the user toggles to pass, they have to scroll down to see the pass code — breaking the immediate comparison that is the whole point of the toggle.

**Do this instead:** Place `<pre><code>` inside the same `data-demo-state` panel as the live example (Pattern 2). The toggle already handles visibility — no extra JS required.

---

### Anti-Pattern 5: Multiple `.demo-toggle` scripts or ad-hoc toggle JS per page

**What people do:** Write a custom `onclick` or `addEventListener` in a `<script>` block at the bottom of a specific checkpoint page.

**Why it's wrong:** `demo-toggle.js` already handles all `.demo-toggle` buttons site-wide via `querySelectorAll`. Per-page scripts create parallel state management, risk conflicting with the shared toggle logic, and require maintenance in 44 separate files.

**Do this instead:** If a demo needs custom behaviour beyond the standard toggle (e.g. a keyboard trap demo needs to temporarily trap focus), add it as a standalone named function in a `<script>` block on that page, triggered by a separate mechanism — not by replacing or augmenting the `.demo-toggle` click handler.

---

## Integration Points

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|--------------|-------|
| HTML page ↔ `demo-toggle.js` | Data attributes: `data-mode`, `data-announce-fail`, `data-announce-pass`, `data-demo-announcement`, `data-demo-state` | Attribute contract is documented at the top of `demo-toggle.js` — must be preserved |
| HTML page ↔ `checkpoint-nav.js` | `body.checkpoint-page` class (guard), `#main-content` ID (injection target), URL pattern `/checkpoints/[id].html` (active detection), `data-checkpoint` attributes on nav links | Changing the checkpoint filename convention would break the active-detection regex |
| HTML page ↔ `theme-toggle.js` | `.theme-toggle` class on `<button>`, `localStorage["theme"]`, `[data-theme="dark"]` on `<html>` | Inline `<head>` script handles FOCT — both scripts must agree on the storage key and attribute name |
| `base.css` ↔ `demo.css` | CSS custom properties; `demo.css` shadows tokens inside `[data-theme="dark"] .demo-stage` to lock demos to light-mode colours | Load order dependency: `base.css` must load before `demo.css` |
| `content/*.md` ↔ `checkpoints/*.html` | Authoring convention — no runtime link | The `.md` file is the source of truth for copy; the implementer manually translates it to HTML |

### Build Order Implications for Roadmap Phases

The architecture creates a natural sequencing constraint:

1. **CSS tokens (`base.css`) must be stable before any new CSS is added.** Token additions (e.g. new semantic variables for code blocks) are cheap but must not break existing consumers. Do this early.

2. **`demo-toggle.js` contract must not change.** It is already consumed by all 44 pages. Any extension (e.g. support for multi-demo pages) must be additive — new optional attributes — not breaking changes.

3. **`checkpoint-nav.js` has a hardcoded checkpoint list.** It does not need to change unless a checkpoint is added or renamed. It is stable — do not refactor it for the sake of "elegance" without a concrete need.

4. **Announcement string cleanup (39 files) is independent.** No code changes — only attribute value changes. Can be done in any order, batched, or scripted. No dependency on other work.

5. **Per-checkpoint `.html` implementation is fully independent between checkpoints.** Each page can be implemented in any order. The only shared constraint is the ID naming convention (suffix with checkpoint number).

6. **Code snippet addition to demo pages is structural only.** Adding `<pre><code>` inside existing `data-demo-state` panels requires no JS changes. It is a pure HTML authoring task.

---

## Sources

- Direct analysis of codebase: `assets/js/demo-toggle.js`, `assets/js/checkpoint-nav.js`, `assets/js/theme-toggle.js`
- Direct analysis of: `assets/css/base.css`, `assets/css/layout.css`, `assets/css/demo.css`
- Representative checkpoint pages: `checkpoints/4-1-2-name-role-value.html`, `checkpoints/1-4-11-non-text-contrast.html`
- Project specification: `.planning/PROJECT.md`, `CLAUDE.md`
- Confidence: HIGH — all findings are from first-party source inspection, not inference

---
*Architecture research for: WCAG 2.2 static educational demo site*
*Researched: 2026-03-10*
