# Feature Landscape: WCAG 2.2 Demo Site v2.0 New Features

**Domain:** Static educational/documentation site for accessibility testing
**Researched:** 2026-03-13
**Research scope:** Five new features proposed for v2.0 release
**Overall confidence:** HIGH (patterns verified across multiple sources + live-site examples)

---

## Overview

This research analyzes five new features proposed for v2.0 of the WCAG 2.2 demo site. Each feature has been evaluated for:
- **Table stakes** — Expected baseline functionality on educational sites
- **Differentiators** — Value-adds that distinguish the site from competitors
- **Anti-features** — Intentional exclusions to preserve static-site simplicity
- **Complexity** — Implementation cost vs. benefit
- **Dependencies** — How each feature relates to existing site infrastructure

---

## Feature 1: Component Playground

A gitignored `/components.html` page showcasing all reusable UI elements (buttons, dropdowns, form fields, badges, etc.) styled and axe-compliant, for internal keyboard and screen reader testing.

### Table Stakes

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Visual showcase of all components in one place | Developers need quick reference to available elements | Low | Grid or list layout showing each component with label |
| Live interactive states (default, hover, focus, active, disabled, error) | Testers must see how components behave | Medium | CSS pseudo-classes + minimal JS for state toggles |
| Copy-pasteable HTML code for each component | Developers should be able to grab code without hunting | Low | `<pre><code>` blocks, no syntax highlighting needed initially |
| Responsive layout (mobile-friendly) | Site must be testable on all devices | Low | Flexbox grid; scales down gracefully |
| Keyboard navigation between components | Internal testing requires full keyboard access | Low | Native `<tab>` order, no special JS needed |
| Screen reader announcements for component purposes | Developers testing SR experience need realistic components | Low | Semantic HTML (e.g., `<button>`, `<label>`) + ARIA where needed |

### Differentiators

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Dark mode toggle on playground | Visual testing in both themes matches actual site usage | Medium | Use existing dark mode infrastructure (if added) or localStorage-based theme switch |
| Accessibility audit results per component | Shows which components pass/fail axe checks | High | Requires running axe-core headless, storing JSON results, rendering per-component status |
| WCAG criteria mapping | Shows which checkpoints each component addresses | Low | Data attributes or comment annotations; rendered as badges |
| Interactive state explorer (click/arrow keys to cycle) | Demonstrates keyboard-accessible state management | Medium | Tab to component, arrow keys cycle states, announces via `aria-live` |
| Export as design tokens or CSS variables | Designers can pull tokens for their own projects | Medium | Generate `.json` or `.css` file on demand; gitignore prevents git bloat |

### Anti-Features

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Interactive Storybook-like component variations | Requires build tool (Webpack, Rollup, etc.); contradicts static-only philosophy | Document variants in HTML markup; use CSS classes to show different configurations |
| Real-time component compilation/rendering | Introduces runtime complexity and build dependencies | Pre-generate all variations at HTML authoring time |
| Component download/installation instructions | Out of scope — site is educational, not a package distribution | Link to relevant documentation if components are reused elsewhere |
| Visual design system generator (Figma integration) | Requires backend sync; too complex for static site | Keep Figma and HTML separate; sync manually as needed |

### Typical Implementation Pattern

On educational documentation sites, component playgrounds follow this pattern:
1. Single HTML page with all components listed
2. Each component in a `.component-preview` container with:
   - Visual rendering
   - HTML source code (copyable)
   - Interactive state buttons/toggles
   - WCAG audit badge/status
3. No build tool needed — components are pre-coded in HTML
4. Keyboard navigation and SR testing happens naturally
5. Gitignore prevents accidental commits of large audit JSON files

**Confidence:** HIGH — Pattern is standard across static design systems (MDN, W3C documentation sites, Shoelace).

---

## Feature 2: Axe Accessibility Audit

Automated scanning of all 44 checkpoint pages in light + dark mode, triaging 115 flagged issues.

### Table Stakes

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Automated axe-core scanning of all pages | Best-in-class standard for accessibility validation | Medium | Use axe-core CLI or headless browser integration |
| Results report: passes, violations, needs review | Stakeholders need clear pass/fail metrics | Medium | JSON report with counts, URLs affected, severity levels |
| Issue triage/prioritization (critical, major, minor) | Not all issues are equal; focus on worst first | Low | axe-core provides built-in `impact` level (critical, serious, moderate, minor) |
| Light AND dark mode scanning | Site must be accessible in both themes | High | Run audit twice per page (toggle theme programmatically) |
| Links to remediation guidance | Developers need to know how to fix issues | Low | axe-core includes `help` and `helpUrl` per issue; link directly to Deque docs |
| Trend tracking: audit before/after (optional baseline) | Track improvement over time | Low | Store JSON snapshots in `.planning/audits/` with timestamps |

### Differentiators

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| CI/CD integration (GitHub Actions audit on every PR) | Catches regressions before merge | High | Requires GitHub Actions workflow, headless browser, artifact storage |
| Interactive audit results page on site | Visitors can see real-time compliance status | Medium | Pre-generate audit results as JSON, render with vanilla JS |
| Per-checkpoint audit results (not just site-wide) | Teachers can show students which demos pass/fail axe | Low | Store audit results keyed by checkpoint URL |
| Accessibility scoring by checkpoint | Gamification: show which checkpoints are most problematic | Low | Calculate pass rate per checkpoint, render as percentage |
| Screen reader audit for SR-specific issues (ARIA, labels, announcements) | axe-core catches many SR issues, but manual testing adds value | High | Pair automated axe results with manual NVDA/VoiceOver testing notes |

### Anti-Features

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Real-time browser-based auditing for visitors | Runs axe in visitor's browser on-demand; adds significant JS payload | Pre-audit all pages, serve static audit results |
| Detailed issue categorization beyond axe's impact levels | Requires custom triage database | Use axe's built-in `impact` + `tags` fields (e.g., `wcag2a`, `wcag2aa`, `best-practice`) |
| Visitor-submitted accessibility reports (citizen science) | Requires backend, database, moderation | Out of scope; focus on automated + team manual testing |
| Continuous monitoring (24/7 audit, alerts on changes) | Requires server, cron jobs, notification service | Run audits on-demand in CI/CD pipeline |
| Remediation automation (auto-fix issues) | Risk of introducing new accessibility problems; needs review | Focus on identifying issues; let developers fix manually |

### Typical Implementation Pattern

On static educational sites, axe integration looks like:
1. Audit runs in CI/CD (GitHub Actions, GitLab CI) on every commit
2. Results stored as JSON snapshot in `.planning/audits/[date].json`
3. Optional: Pre-generate static report page (`/audit-results.html`) from latest snapshot
4. Report includes:
   - Pass/violation/needs-review counts
   - Issues grouped by checkpoint + severity
   - Links to Deque remediation guidance
   - Before/after comparison (if baseline exists)
5. No backend required — all reporting is static HTML

**Confidence:** HIGH — axe-core is industry-standard; CI/CD integration is common in modern workflows.

---

## Feature 3: Client-Side Search + Filtering

Search checkpoint titles/content, filter by WCAG pillar (Perceivable, Operable, Understandable, Robust) and level (A/AA).

### Table Stakes

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Full-text search of checkpoint titles | Users must find checkpoints by keyword | Low | Build search index at authoring time; store in JSON |
| Filter by WCAG pillar (4 categories) | Organize by spec structure; users expect this grouping | Low | Data attributes on checkpoint pages; filter with vanilla JS |
| Filter by level (A vs AA) | WCAG has two levels; both are important | Low | Data attributes; filter on load and on input |
| Live results update as user types | Immediate feedback; UX best practice | Low | Vanilla JS event listener on input; filter JSON index on-the-fly |
| Keyboard navigable search UI | Testers use keyboard; must work with Tab | Low | Native HTML `<input>`, `<button>`, semantic results list |
| Screen reader friendly | Announce search results count, no visual-only feedback | Low | Use `aria-live="polite"` on results container |
| Mobile-friendly search layout | Search must work on small screens | Low | `<input>` scales; stack filters vertically on mobile |

### Differentiators

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Fuzzy search (match "color" to "colour" or "contrast ratio") | More forgiving; finds results even with typos | Medium | Use Fuse.js library (~13KB gzipped, no dependencies); test bundle impact |
| Search highlighting in results (show matching terms) | Visual feedback on why result matched | Low | Wrap matched text in `<mark>` tag in results display |
| Recent searches (localStorage) | Return users skip re-typing common searches | Low | Store last 5 searches; render as suggestions above results |
| "Did you mean?" for common misspellings | Help users find similar checkpoints if exact match fails | Medium | Pre-build synonyms list ("CR" → "contrast ratio", "KBD" → "keyboard") |
| Search across demo code (not just titles/content) | Find checkpoints by code pattern (e.g., "aria-label") | Medium | Index code snippets; requires build step to extract |
| Save/share search results (URL with query param) | Teachers can link to "show me all AA checkpoints" | Low | `?search=term&pillar=Operable&level=AA`; read on page load |

### Anti-Features

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Server-side search with backend database | Breaks GitHub Pages hosting; adds complexity | Build index once at authoring; serve as static JSON |
| Real-time search as-you-type with network requests | No backend to request from | Use pre-built, client-side index |
| Ranked search results based on popularity/engagement | Requires analytics backend | Rank by WCAG pillar order + level (A before AA) |
| Advanced search syntax (e.g., `pillar:Operable AND level:AA`) | Steep learning curve; most users won't use | Simple checkbox/dropdown filters for common queries |
| Search analytics (what users search for) | Requires backend; not educational value | Skip analytics; focus on search quality |

### Typical Implementation Pattern

On static documentation sites, search works like:
1. Build time: Extract checkpoint titles + content from HTML, store in `data/search-index.json`
2. Page load: Fetch index JSON; fuzzy-search with Fuse.js
3. User types: Filter index in real-time; render results
4. Results: Show title + snippet + WCAG pillar + level
5. Click result: Navigate to checkpoint page

**Data structure:**
```json
{
  "checkpoints": [
    {
      "id": "1-1-1",
      "title": "Non-text Content",
      "url": "/checkpoints/1-1-1-non-text-content.html",
      "pillar": "Perceivable",
      "level": "A",
      "content": "Ensure all images have alt text...",
      "tags": ["images", "alt-text", "captions"]
    }
  ]
}
```

**Confidence:** HIGH — Fuse.js + static JSON index is industry pattern widely used on static doc sites.

---

## Feature 4: Hamburger Navigation + Mobile Chrome

Responsive sidebar collapse at mobile breakpoints; sidebar hides on mobile, replaced with hamburger menu.

### Table Stakes

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Responsive navigation (collapse sidebar on mobile) | Mobile is primary device for 70%+ users | Medium | CSS media queries + minimal JS for toggle |
| Hamburger button at mobile breakpoint (<768px) | Standard mobile UX pattern | Low | Three horizontal lines icon; semantic `<button>` |
| Full-screen or off-canvas menu overlay | Menu must be readable at mobile size | Medium | Slide in from left; semi-transparent backdrop |
| Touch-friendly target size (48x48px minimum) | Mobile users need big tap targets | Low | CSS padding/sizing; no accessibility issues |
| Keyboard close button (ESC) | Keyboard users must close menu without mouse | Low | Vanilla JS event listener on `keydown` |
| Focus trap in menu (modal behavior) | Tab should stay within menu when open | Medium | Manage focus on open/close; return to trigger button |
| Semantic HTML (`<nav>`, `<button>`, ARIA attributes) | Menu must be screen-reader accessible | Low | Use proper roles and labels; test with NVDA/VO |
| Menu closes when user clicks a link | UX best practice; avoid manual close step | Low | Listen for `click` on `<a>` tags; close menu |

### Differentiators

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Smooth slide-in animation (CSS transition) | Polish; feels responsive | Low | Use CSS `transform` + `transition` for 0.3s slide |
| Persistent scroll position (don't scroll to top on menu open) | Reduce disorientation on mobile | Low | Prevent body scroll while menu open (`overflow: hidden`); restore on close |
| Active checkpoint highlighted in mobile menu | Same as desktop — show where user is | Low | Add `.active` class to current page link (already in checkpoint-nav.js) |
| Swipe-to-close gesture (drag from left edge to close) | Advanced mobile UX; not essential | High | Requires touch event listeners; adds JS complexity; test on various devices |
| Menu includes search filter (on mobile) | Combine search + navigation for mobile | Medium | Move search input into menu; show below checkpoint list |

### Anti-Features

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Multiple levels of nested menus | Mobile screens are small; nested menus = deep tapping | Keep single-level list; use search for filtering |
| Animated hamburger icon (rotate to X) | Animation can distract from content; accessibility risk | Simple static icon; button has clear `:focus` outline |
| Full-page overlay when menu opens (sticky nav bar) | Scrolling content becomes hard; confusing on mobile | Off-canvas: menu slides in from left; content stays behind |
| Gesture-based navigation (swipe right to go back) | Conflicts with browser back swipe; user confusion | Stick to standard button/link navigation |
| Accordion-style pillar grouping in mobile menu | Adds complexity; defeats purpose of collapsible nav | Keep as flat list; use search to filter |

### Typical Implementation Pattern

On static sites with responsive nav:
1. Desktop (>768px): Sidebar always visible
2. Mobile (<768px):
   - Sidebar hidden by default
   - Hamburger button visible in top-left
   - Click button: sidebar slides in from left as off-canvas menu
   - Backdrop dims content; click to close
   - ESC key closes menu
   - Tab trap keeps focus in menu
3. Existing checkpoint-nav.js logic works in both views
4. Menu closes automatically when user clicks a checkpoint link

**CSS breakpoint:** 768px is standard for tablet cutoff

**Confidence:** HIGH — Mobile-first responsive nav is table stakes for all sites in 2026.

---

## Feature 5: Tool Links + Setup Guides

"How to test" sections get links to axe, NVDA, VoiceOver, etc. with short setup steps.

### Table Stakes

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|-----------|
| Links to testing tool downloads (axe, NVDA, VoiceOver, JAWS trial) | Users must know where to find tools | Low | List with direct links; keep updated as tool versions change |
| Brief setup instructions (1-2 steps per tool) | Users shouldn't have to hunt documentation | Low | Inline markdown + screenshots (optional); plain text acceptable |
| Which tool to use for which checkpoint | Not all tools detect all issues | Low | Add table: checkpoint → recommended tools |
| Screen reader testing notes (NVDA, VoiceOver, JAWS) | Demos must be testable with readers | Medium | Link to each screen reader; note platform (Windows/Mac) |
| Keyboard testing tips (no mouse testing) | Core a11y skill; site should model this | Low | Link to WCAG keyboard testing guide; mention Tab/Shift+Tab |
| Browser extension links (axe DevTools, WAVE, Lighthouse) | Most accessible way to test live pages | Low | Direct links to Chrome/Firefox stores |
| Mobile testing guidance (touch + screen reader on phone) | Mobile is in-scope for v2.0 (eventually) | Low | Link to VoiceOver (Mac) / TalkBack (Android) docs |

### Differentiators

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Interactive tool decision tree ("I want to test X → use Y") | Guide users to right tool for their goal | Medium | Flow chart or simple decision widget; vanilla JS |
| Tool version tracking (keep links up-to-date) | Tools update frequently; outdated links frustrate users | Low | Document in `.planning/tool-versions.md`; update quarterly |
| Pre-configured NVDA/VO test scripts per checkpoint | Testers have a checklist of what to listen for | Medium | Link to per-checkpoint test script (e.g., "Test 1.1.1: Does NVDA announce alt text?") |
| Guided walk-through videos (optional - screencasts of testing each checkpoint with a tool) | Video learning; shows exact steps | High | Requires recording, editing, hosting; scope creep risk |
| Accessibility of the tool links page itself | Practice what you preach | Low | Semantic HTML, sufficient color contrast, keyboard/SR testable |
| Integration with GitHub Issues (report bugs you find) | Community contribution path | Low | Link to GitHub issue template for accessibility bugs found on site |

### Anti-Features

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Embedded tool installers or package managers | Can't bundle tools on static site; storage bloat | Link to official download pages; let users install themselves |
| Custom testing framework (site-specific testing checklist) | Overkill; WCAG spec + tool documentation is enough | Use existing WCAG testing procedures; link to them |
| A/B testing tool comparison ("use X instead of Y") | Creates maintenance burden; tools change | Link all major tools; let users choose; document pros/cons once |
| Paid tool recommendations (JAWS, etc.) | Educational site should prioritize free tools | Mention paid tools exist; link to them; emphasize free alternatives (NVDA, VoiceOver) |
| Tool usage analytics (track which tools visitors use) | Requires backend; not educational value | Skip analytics; focus on content |

### Typical Implementation Pattern

On accessibility education sites, tool guidance looks like:
1. Dedicated page: `/how-to-test.html` or section in checkpoint intro
2. Layout:
   - **Automated Testing** section: Links to axe DevTools, Lighthouse, WAVE
   - **Screen Reader Testing** section: NVDA (Windows), VoiceOver (Mac), Guidepup (automation)
   - **Keyboard Testing** section: Tips + link to WCAG guide
   - **Per-checkpoint** section (optional): "For this demo, try: [tool links + what to listen for]"
3. Format: Plain links + 1-2 sentence description; no long tutorials (link to official docs for deep dives)

**Table stakes:** Links + setup (download, install, open). Tools vary by platform; list all.

**Differentiators:** Pre-written test steps per checkpoint. Video tutorials (high effort, high value, but scope risk).

**Confidence:** MEDIUM-HIGH — Pattern is standard on a11y education sites.

---

## Cross-Feature Dependencies

### Feature Interactions

```
Component Playground
  ├─ Uses: Site chrome (navigation, typography, colors)
  ├─ Supports: Axe Audit (audit shows component compliance)
  └─ Feeds: Search (components searchable by name/type)

Axe Audit
  ├─ Scans: All 44 checkpoints + component playground
  ├─ Informs: Tool Links + Setup Guides (which tools to use)
  └─ Supports: Feature 3 (audit results may surface new issues)

Search + Filtering
  ├─ Indexes: Checkpoint titles + content + WCAG pillar/level
  ├─ Works with: Mobile nav (search in mobile menu is differentiator)
  └─ Independent: Can be built without other features

Mobile Navigation
  ├─ Depends on: Existing checkpoint-nav.js (reuse active-state logic)
  ├─ Integrates: Search (optional: move search into mobile menu)
  └─ Independent: CSS + vanilla JS; no external libraries

Tool Links + Setup Guides
  ├─ Supports: All checkpoints (links how to test each)
  ├─ Independent: Content-driven; no code dependencies
  └─ Enhances: Axe Audit (guides users to tools that feed audit)
```

### Implementation Order

1. **Search + Filtering** (least dependencies; improves UX quickly)
2. **Mobile Navigation** (pairs with search; completes v2.0 responsive design)
3. **Tool Links + Setup Guides** (content-driven; no blocking dependencies)
4. **Component Playground** (internal resource; can be built in parallel)
5. **Axe Audit** (integrates findings from all above; runs last)

---

## Complexity Summary

| Feature | Implementation Complexity | Maintenance Burden | Risk Level |
|---------|---------------------------|-------------------|------------|
| Component Playground | Medium | Low | Low (isolated to one page) |
| Axe Audit | High (setup) / Low (ongoing) | Medium (tool updates, version tracking) | Medium (results may surface new work) |
| Search + Filtering | Medium | Low | Low (static index; no runtime issues) |
| Mobile Navigation | Medium | Low | Low (standard patterns; well-tested) |
| Tool Links + Setup Guides | Low | Medium (tool versions change) | Low (content-only) |

---

## Summary: Table Stakes vs Differentiators

### Table Stakes (Must-Have)
- **Search**: Full-text title search + pillar/level filters
- **Mobile nav**: Hamburger at <768px breakpoint, off-canvas menu
- **Tool links**: Download links + 1-sentence setup for axe, NVDA, VoiceOver
- **Axe audit**: Automated scanning of all pages (internal; not published)

### Differentiators (Nice-to-Have)
- **Search**: Fuzzy matching, recent searches, URL-shareable results
- **Mobile nav**: Smooth animations, persistent scroll, search in menu
- **Tool links**: Per-checkpoint test scripts, decision tree, video guides
- **Component playground**: Interactive state explorer, dark mode, audit badges
- **Axe audit**: CI/CD integration, public audit results page, trend tracking

### Anti-Features (Don't Build)
- Server-side search or backend database (static site only)
- Real-time tool monitoring or analytics
- Animated hamburger icons or gesture navigation
- Multiple levels of nested menus
- Auto-remediation of accessibility issues
- Custom testing frameworks (use WCAG instead)

---

## Sources

- [Adding client side search to a static site](https://tomhazledine.com/client-side-search-static-site/)
- [How to add fast, client-side search to Astro static sites](https://evilmartians.com/chronicles/how-to-add-fast-client-side-search-to-astro-static-sites)
- [Automating Accessibility Testing in Your CI/CD Pipelines with Axe](https://blog.magicpod.com/automating-accessibility-testing-in-your-ci/cd-pipelines-with-axe)
- [Web Accessibility Evaluation Tools List](https://www.w3.org/WAI/test-evaluate/tools/list/)
- [NVDA Screen Reader Tutorial](https://birdeatsbug.com/blog/nvda-screen-reader-tutorial)
- [Let's build a simple, responsive navigation bar](https://medium.com/@adamwojnicki/lets-build-a-simple-responsive-navigation-bar-with-html-css-and-a-little-bit-of-vanilla-js-5abba28da32e)
- [How To Create a Responsive Top Navigation Menu](https://www.w3schools.com/howto/howto_js_topnav_responsive.asp)
- [Accessibility Testing Automation — Integrating axe, Pa11y, and Lighthouse CI](https://www.accesify.io/blog/accessibility-testing-automation-axe-pa11y-lighthouse-ci/)
- [Top 10 Accessibility Testing Tools for Developers](https://apidog.com/blog/top-10-accessibility-testing-tools/)
- [How to Make Your UI Accessible: A Practical Checklist for 2026](https://muz.li/blog/how-to-make-your-ui-accessible-a-practical-checklist-for-2026/)
- [Simply Navigation - Responsive Mobile Navigation](https://github.com/obscuredetour/simply-nav)
- [InfiSearch - Client-side search for static sites](https://github.com/ang-zeyu/infisearch)
- [Fuse.js - Lightweight fuzzy-search library](https://github.com/krisk/Fuse)

---

*Feature landscape for v2.0 new features: WCAG 2.2 educational demo site*
*Researched: 2026-03-13*
