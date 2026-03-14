# Research Summary: WCAG 2.2 Demo Site v2.0 Features

**Project:** WCAG 2.2 Accessibility Demo Site — v2.0 Feature Expansion
**Domain:** Static educational site with interactive accessibility demonstrations
**Researched:** 2026-03-10 to 2026-03-13
**Confidence:** HIGH (direct codebase analysis + established patterns for all five features)

---

## Executive Summary

The WCAG 2.2 demo site is a mature static HTML/CSS/vanilla JS project on GitHub Pages that needs five specific v2.0 features to improve usability and site quality. The recommended approach is a phased, dependency-aware implementation: start with client-side search and mobile navigation (lowest complexity, highest UX impact), then add site infrastructure (component playground, axe auditing), and finally tool guidance. All five features respect the core architectural constraint (static site, no frameworks, no build tools, no backend) — no architectural risk.

The four research domains (stack, features, architecture, pitfalls) reveal clear implementation sequencing based on dependencies and complexity. The primary risk is not technical but quality-control: the site chrome (header, navigation, theme toggle) must be verified on every page to ensure it doesn't fail the criteria it teaches. This requires establishing a hardened completion checklist before shipping any phase.

The existing codebase has documented technical debt (39 files with visual-property-language announcements, potential dark-mode issues in contrast demos) that should be addressed as Phase 1 infrastructure work rather than deferred — these issues span the entire site and scale better when addressed early.

---

## Key Findings

### Recommended Stack

The existing production stack (HTML5 + CSS3 + ES5 JavaScript, no dependencies, GitHub Pages hosting) does not change for v2.0. Development tooling is new: `@axe-core/cli` and `pa11y` for batch auditing, `http-server` for local serving, optionally `@playwright/test` for keyboard automation. All tools are dev-only (never shipped), installed as npm devDependencies. Create minimal `package.json` with `"private": true`.

**Core technologies (unchanged):**
- **HTML5**: Semantic markup; native ARIA eliminates framework requirement
- **CSS3 with custom properties**: Token system enables dark/light mode without preprocessor
- **ES5 JavaScript (IIFE pattern)**: No transpilation; works in all target browsers without module bundler
- **GitHub Pages**: Zero-config static hosting, HTTPS included

**Development toolchain (new):**
- **`@axe-core/cli ^4.9`**: Industry-standard WCAG 2.2 AA auditor; ~57% automatic issue coverage; JSON output feeds audit results page
- **`pa11y ^6.2`**: Second-pass auditor using HTML CodeSniffer; different rule engine catches issues axe misses
- **`http-server ^14.1`**: Zero-config local server (both auditors require real HTTP, not `file://`)
- **`@playwright/test ^1.44`** (optional): Keyboard navigation and focus trap testing; only add if regression testing prioritized
- **Node.js 20 LTS**: Minimum version for all above packages

**Confidence:** MEDIUM on package versions (training data cutoff August 2025); HIGH on tooling choices and patterns. Version numbers should be verified at npmjs.com before `package.json` commit.

### Expected Features

Five new features proposed for v2.0. Research defines table-stakes baseline for each and clarifies what to defer.

**Must have (table stakes):**
1. **Client-side search + filtering** — Full-text search by checkpoint title, filter by WCAG pillar (Perceivable, Operable, Understandable, Robust) and level (A/AA), live results as user types, keyboard + screen-reader accessible. Zero dependencies or use optional Fuse.js for fuzzy matching.
2. **Mobile navigation (hamburger)** — Sidebar collapses at <768px; hamburger button toggles off-canvas menu; ESC to close; semantic HTML with focus trap management
3. **Tool links + setup guides** — Download links for axe DevTools, NVDA, VoiceOver, JAWS trial, Lighthouse, etc.; 1–2 sentence setup per tool; maintain in `.planning/tool-versions.md`
4. **Axe audit (internal)** — Batch scan all 44 checkpoints in light + dark mode; store JSON snapshots; optional: generate static audit results page

**Should have (differentiators):**
1. **Component playground** — Single `/components.html` (gitignored) showcasing reusable UI elements with interactive state toggles; internal testing resource; optional: dark mode toggle + axe audit badges
2. **Search enhancements** — Fuzzy matching (Fuse.js ~13KB), recent searches (localStorage), shareable results URL (`?search=term&pillar=X&level=AA`)
3. **Audit enhancements** — GitHub Actions CI/CD, public audit results page, trend tracking, per-checkpoint status
4. **Mobile nav polish** — Smooth CSS transitions, persistent scroll position, active checkpoint highlighted, optional: search in mobile menu

**Defer to v2+:**
- Video walkthroughs (high effort, scope risk)
- Real-time in-browser auditing for visitors (JS payload concern)
- Visitor-submitted accessibility reports (backend requirement)
- Animated hamburger icon or advanced gestures (accessibility risk)

**Complexity summary:** Search: MEDIUM | Mobile nav: MEDIUM | Tool links: LOW | Component playground: MEDIUM | Axe audit: HIGH (setup) / LOW (ongoing). No feature violates static-site constraint.

### Architecture Approach

The site uses a four-layer architecture: page layer (44 checkpoint HTML + index), shared JS layer (3 IIFE modules), shared CSS layer (3-file token system), and content layer (markdown research files). This architecture is stable and fully documented. No architectural changes needed for v2.0 features.

**Core patterns:**
1. **Data-attribute state machine** — Demo container holds state in single `data-mode` attribute ("fail" or "pass"); CSS selectors key off this; JS writes to attribute + live region only
2. **Code snippet display** — HTML source code placed inside `data-demo-state` panel; toggle visibility automatic
3. **Shared JS via script injection** — Three IIFE modules load in sequence; each has narrow contract; no shared state
4. **Checkpoint page section order** — Fixed sequence (header, description, testing, demo, fail explanation, pass explanation, notes); ensures consistent screen reader experience
5. **Functional-language announcements** — Screen reader text describes user experience impact, not CSS properties/hex codes/contrast ratios; currently needs remediation in 39 files

**Integration points:**
- HTML ↔ `demo-toggle.js`: Data attributes (`data-mode`, `data-announce-fail/pass`, `data-demo-announcement`, `data-demo-state`)
- HTML ↔ `checkpoint-nav.js`: `body.checkpoint-page` class guard; `#main-content` ID; `/checkpoints/[id].html` URL pattern
- `base.css` ↔ `demo.css`: CSS custom properties; `demo.css` shadows tokens in `[data-theme="dark"] .demo-stage` to preserve contrast demo integrity
- Content `.md` files ↔ Checkpoint `.html` files: No runtime link; authoring workflow only

**Confidence:** HIGH — all from direct codebase inspection.

### Critical Pitfalls

1. **Site chrome fails the criteria it teaches.** Demo page for "2.4.7 Focus Visible" has focus outline that breaks; page for "4.1.2 Name, Role, Value" has theme toggle button whose `aria-pressed` state isn't announced. **Avoid:** Run keyboard tabbing test + axe-core on full page (not just demo stage) before marking checkpoint done.

2. **Screen reader announcements teach bad practice.** 39/44 files contain visual-property language in announcements ("form controls have border at 4.5:1 contrast"). Screen readers announce these verbatim; users learn CSS jargon instead of functional impact. **Avoid:** Enforce rule: announcements describe user experience, never CSS/ARIA/hex codes. Add lint: `grep data-announce [file] | grep -E "contrast ratio|to 1|#[0-9a-f]{6}|border.*solid"`.

3. **Fail example is itself inaccessible in harmful way.** Demo showing "2.1.2 No Keyboard Trap" that creates live, inescapable trap makes page inaccessible to keyboard users. **Avoid:** Distinguish structural failures (safe to live-demo) from functional failures (must use code-display). Classify fail type in content research phase before implementation.

4. **Pass example teaches incomplete or misleading fix.** Pass examples optimize for visual appearance, not completeness. **Avoid:** For every pass example, ask "If developer copies this HTML exactly, do they have complete, production-ready implementation?" Document completeness requirements in content `.md` files.

5. **Dark mode corrupts contrast demos.** Demo stage colors inherit dark-mode tokens; white background becomes dark, inverting contrast values being demonstrated. **Avoid:** Existing code correctly solves with `[data-theme="dark"] .demo-stage { color-scheme: light; }` in `demo.css`. Preserve this; document so future editors don't remove as "redundant."

---

## Implications for Roadmap

Clear implementation order based on dependencies and complexity. All five features compatible with static-site constraint; no architectural risk.

### Phase 1: Foundation & Chrome Remediation
**Rationale:** Address existing technical debt before new features. Site chrome failures undermine all v2.0 work. Announcement cleanup scales better early.

**Deliverables:**
- Audit all 44 checkpoint + index.html with axe-core and keyboard test
- Fix critical chrome a11y failures (theme toggle state announcement, focus outlines, skip link, nav reachability)
- Clean 39 files: remove visual-property language from `data-announce-fail/pass` attributes
- Add per-checkpoint completion checklist (includes chrome audit + dark mode testing)

**Addresses:** Pitfalls #1 (chrome failures), #2 (announcement language), #5 (dark mode integrity)
**Time:** 1–2 weeks (scripted cleanup, manual fixes + testing)
**Research flag:** None — established pattern

### Phase 2: Search & Mobile Navigation
**Rationale:** Table-stakes features with lowest complexity and highest UX impact. Operate independently of other features. Mobile nav pairs naturally with search (search in mobile menu as optional enhancement).

**Deliverables:**
- Build static search index from 44 checkpoints: extract ID, title, pillar, level, content snippet
- Implement client-side search: `<input>` + optional Fuse.js + vanilla JS; live results with badges
- Implement responsive mobile nav: CSS media query at 768px; hamburger toggle; off-canvas menu; ESC close; focus trap
- Keyboard + screen reader testing

**Features:** Search + filtering (table stakes); mobile nav (table stakes); optional: fuzzy match, recent searches, shareable URLs, search in mobile menu
**No new patterns:** Reuses existing checkpoint-nav.js + demo-toggle.js models
**Time:** 2–3 weeks
**Research flag:** None — standard patterns

### Phase 3: Tool Links & Setup Guides
**Rationale:** Content-driven feature, zero code dependencies. Can run parallel with Phase 2 or after. Improves checkpoint pages without architectural changes.

**Deliverables:**
- Create `/how-to-test.html` or integrate into checkpoints: automated tools, screen reader testing, keyboard testing
- Per-tool cards: download link, 1–2 sentence setup, platform notes, link to official docs
- Optional: per-checkpoint "For this demo, try: [tools + what to listen for]"
- Maintain `.planning/tool-versions.md`; establish quarterly review

**Complexity:** LOW
**Time:** 1 week
**Research flag:** None — content-driven

### Phase 4: Component Playground
**Rationale:** Internal testing resource, can build in parallel with other phases. Isolated from main site; enables UI testing without cluttering checkpoints. Optional audit badges depend on Phase 5 output.

**Deliverables:**
- Create `/components.html` (gitignored): showcase reusable UI elements
- Each component in `.component-preview`: visual rendering + HTML code + interactive state toggles
- Dark mode toggle on playground (reuses theme infrastructure)
- Optional: axe audit badges per component; optional: WCAG criteria mapping

**Complexity:** MEDIUM
**Time:** 1 week (markup) + 3 days (polish)
**Research flag:** None — isolated, standard pattern

### Phase 5: Axe Audit & Results Page
**Rationale:** Integrates findings from all phases. Requires npm setup + audit tooling. Highest complexity but unlocks audit-driven improvements and feeds component playground badges. Local on-demand initially; CI/CD (GitHub Actions) optional.

**Deliverables:**
- Set up `package.json`: axe-core CLI, pa11y, http-server as devDependencies
- Create audit script: serve locally, run axe on all 44 URLs in light + dark mode, store JSON snapshots in `.planning/audits/[date].json`
- Parse audit JSON; generate static audit results page: pass/violation/needs-review counts, issues grouped by checkpoint + severity, links to Deque guidance
- Optional: trend comparison; optional: GitHub Actions CI/CD

**Complexity:** HIGH (setup) / LOW (ongoing)
**Uses stack:** `@axe-core/cli`, `pa11y`, `http-server` (versions need verification)
**Time:** 1.5 weeks (setup + results page + testing)
**Research flag:** Version verification needed before `package.json`; Playwright integration (if keyboard testing added) needs planning-phase research

### Phase Ordering Rationale

1. **Phase 1 first:** Chrome failures undermine all features. Announcement cleanup scales better early. Establishes completion checklist all phases must pass.
2. **Phase 2 next:** Table-stakes features, highest UX impact. No dependencies on later phases. Build momentum with visible features.
3. **Phase 3 parallel or after Phase 2:** Content-driven, zero code dependencies. Can run simultaneously with Phases 4–5 without blocking.
4. **Phase 4 parallel (optional):** Isolated from main site. Can build simultaneously as "between-phase" work.
5. **Phase 5 last:** Integrates findings from all phases. Audit depends on Phases 1–4 being complete.

**Critical dependency:** Phase 5 audit results depend on Phases 1–4 done (no sense auditing before chrome fixed + announcements clean). Phases 2, 3, 4 largely independent.

### Research Flags

**Phases needing deeper research during planning:**
- **Phase 5 (Axe Audit):** Package versions marked MEDIUM confidence. Verify before `package.json`: `npm show @axe-core/cli version && npm show pa11y version`. Playwright integration (if keyboard testing added) needs detailed planning-phase research.

**Phases with standard patterns (skip research):**
- **Phase 2:** Established patterns documented. Fuse.js decision (include vs. regex) already made as trade-off.
- **Phase 3:** Content-driven; validate tool links against W3C WAI list during planning.
- **Phase 4:** Pattern documented; no architectural novelty.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|-----------|-------|
| **Stack** | HIGH (tools) / MEDIUM (versions) | Tools are industry-standard; version numbers based on training data (Aug 2025). Recommend verification before npm install. Core production stack confirmed from live codebase. |
| **Features** | HIGH | All five features researched against established patterns (static doc sites, WCAG education sites, GitHub Pages projects). Table-stakes/differentiator split validated. No external dependencies. |
| **Architecture** | HIGH | Direct codebase analysis. All patterns documented. Integration points explicitly mapped. Five-year stability record (site in production). |
| **Pitfalls** | HIGH | Grounded in direct inspection of 44 checkpoint files + project memory. Seven critical pitfalls identified with prevention strategies. |
| **Overall** | HIGH | Strong consensus across four research domains. No gaps blocking roadmap. Ready for planning. |

### Gaps to Address

1. **Exact package versions:** `@axe-core/cli`, `pa11y`, `@playwright/test` marked MEDIUM. Verify at npmjs.com and playwright.dev during Phase 1 planning. Decide on version lock strategy (exact pin vs. semver ranges).

2. **Fuse.js trade-off decision:** Search feature assumes Fuse.js inclusion for fuzzy matching, but explicit trade-off needed (13KB gzipped vs. simpler regex). Decide during Phase 2 planning based on priorities.

3. **Keyboard automation testing priority:** Playwright optional; clarity needed on whether regression detection is v2.0 goal or deferred. If included, needs setup research during Phase 5 planning.

4. **Dark mode scope for future contrast demos:** Current architecture locks demo stages to light mode. If dark-mode-specific contrast demos ever needed, this is documented limitation requiring architecture extension.

5. **CI/CD for audit:** GitHub Actions integration flagged as optional, not mandatory v2.0. Confirm during roadmap planning whether this belongs in Phase 5 or deferred to v2.1.

---

## Sources

### Primary (HIGH confidence)
- **STACK.md:** Development toolchain research; Deque axe-core GitHub, pa11y GitHub, Playwright docs
- **FEATURES.md:** Pattern validation across static doc sites (MDN, W3C, Shoelace); Fuse.js analysis; WCAG education site patterns
- **ARCHITECTURE.md:** Direct codebase analysis of 44 checkpoint HTML files, 3 JS modules, 3 CSS files
- **PITFALLS.md:** Direct inspection of all checkpoint HTML, CSS, JS; project memory (CLAUDE.md, SESSION_DIARY.md)

### Secondary (MEDIUM confidence)
- WCAG 2.2 Understanding documents for criteria referenced in pitfalls
- Screen reader behavior patterns (NVDA + Chrome, VoiceOver + Safari)
- Competitor knowledge (W3C, a11yproject.com, WebAIM, Deque University)

### Documentation
- Project specification (CLAUDE.md, .planning/PROJECT.md)
- Session diary (SESSION_DIARY.md) for current state context

---

*Research synthesis completed: 2026-03-13*
*Four research documents analyzed and integrated*
*Ready for roadmap creation*
