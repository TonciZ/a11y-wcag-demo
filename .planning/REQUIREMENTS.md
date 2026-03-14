# Requirements: WCAG 2.2 A11y Demo Site

**Defined:** 2026-03-10
**Core Value:** Users can toggle any checkpoint between a failing and passing demo, see real HTML behave incorrectly then correctly, and read the code that makes the difference — learning by doing, not reading.

## v1 Requirements

Requirements for the proof-of-concept milestone: solid infrastructure, quality gates, and a polished reference implementation.

### Site Quality

- [x] **QUAL-01**: Per-checkpoint completion checklist exists and is used as a quality gate before any checkpoint is considered done
- [x] **QUAL-02**: All 44 checkpoint pages use functional-language screen reader announcements (no visual properties, contrast ratios, hex codes, or CSS values in `data-announce-*` attributes)
- [ ] **QUAL-03**: Theme toggle button label updates programmatically when dark mode is activated (aria-pressed or equivalent pattern)

### Demo Features

- [x] **DEMO-01**: Each polished checkpoint page shows the fail/pass HTML code in a `<pre><code>` block beneath the live demo, toggling in sync with the demo state
- [x] **DEMO-02**: Checkpoint pages support multiple independent demo containers per page, each demonstrating a distinct failure pattern for the same criterion
- [x] **DEMO-03**: Each checkpoint page displays the relevant WCAG technique codes (e.g. H44, ARIA14, F65) for both the failure and the fix

### Content Workflow

- [x] **CONT-01**: A standardized research `.md` template exists for checkpoint content files, including a required "fail type" field (structural vs. functional) that determines the safe demo strategy
- [ ] **CONT-02**: 2-3 checkpoint pages (starting with 4.1.2 and 2.4.3, which have complete research) are fully implemented as polished reference implementations that validate the complete demo template before scaling to all 44

## v2.0 Requirements

### COMP — Component Playground

- [ ] **COMP-01**: Developer can open `/components.html` locally and see all reusable UI elements (buttons, dropdowns, inputs, badges, etc.) rendered in one page
- [ ] **COMP-02**: Component page passes axe scan and keyboard navigation (Tab, Enter, Space, arrow keys work on all interactive elements)
- [ ] **COMP-03**: Component page is gitignored — never ships to GitHub Pages
- [ ] **COMP-04**: Every component variant that exists in demo pages is represented (no undocumented variants)

### AXE — Accessibility Audit

- [ ] **AXE-01**: All 44 checkpoint pages scanned with axe in both light and dark mode
- [ ] **AXE-02**: Each flagged issue is triaged as real issue vs. intentional demo violation
- [ ] **AXE-03**: All confirmed real issues are fixed across the site chrome and checkpoint pages
- [ ] **AXE-04**: Axe triage results documented so future contributors know which violations are intentional

### UAT — Manual Testing

- [ ] **UAT-01**: All 44 checkpoint pages reviewed in browser (automated pattern scan first, then manual walkthrough)
- [ ] **UAT-02**: Each checkpoint page passes the CHECKLIST.md 5-item quality gate
- [ ] **UAT-03**: Issues found during UAT are fixed before merge to live

### SRCH — Search & Filtering

- [ ] **SRCH-01**: User can search checkpoints by title and find results as they type
- [ ] **SRCH-02**: User can filter checkpoints by WCAG pillar (Perceivable / Operable / Understandable / Robust)
- [ ] **SRCH-03**: User can filter by conformance level (A / AA)
- [ ] **SRCH-04**: Search results are announced to screen readers via aria-live region
- [ ] **SRCH-05**: Search is navigable by keyboard (arrow keys through results, Enter to open)

### MOB — Mobile Chrome

- [ ] **MOB-01**: Sidebar nav collapses into a hamburger menu at mobile breakpoints (≤768px)
- [ ] **MOB-02**: Hamburger menu is keyboard accessible and does not trap focus
- [ ] **MOB-03**: Demo containers, code blocks, and toggle buttons are usable on mobile viewport
- [ ] **MOB-04**: Site passes axe at mobile breakpoints (no new violations introduced by responsive layout)

### TOOLS — Tool Links & Setup Guides

- [ ] **TOOLS-01**: Each checkpoint "How to test" section includes links to relevant tools (axe DevTools, NVDA, VoiceOver, etc.)
- [ ] **TOOLS-02**: Each tool link includes a 2–3 step setup guide so testers can replicate the test immediately
- [ ] **TOOLS-03**: Tool links are verified working at time of implementation

## v3 Requirements

Deferred to future milestone.

- **SCALE-01**: Mobile-specific WCAG demo content (demos showing mobile-only failure patterns)
- **ENHN-01**: Simulated screen reader output panel per demo state
- **ENHN-02**: Focus tracker overlay for keyboard-related demos

## Out of Scope

| Feature | Reason |
|---------|--------|
| Backend / server-side search | GitHub Pages is static hosting only |
| Real-time axe scanning for visitors | Adds ~300KB payload to every page; audit is a dev tool |
| Live code editor | Violates static constraint; no runtime, no eval |
| Progress tracking / scoring | Reference tool, not a course |
| User accounts / saved progress | No backend, educational tool not SaaS |
| SPA routing | No architecture changes for content expansion |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| QUAL-01 | Phase 1 | Complete |
| QUAL-02 | Phase 2 | Complete |
| QUAL-03 | Phase 1 | Complete |
| DEMO-01 | Phase 3 | Complete |
| DEMO-02 | Phase 3 | Complete |
| DEMO-03 | Phase 3 | Complete |
| CONT-01 | Phase 1 | Complete |
| CONT-02 | Phase 4 | Complete |
| COMP-01 | Phase 5 → 11 | Pending |
| COMP-02 | Phase 5 → 11 | Pending |
| COMP-03 | Phase 5 → 11 | Pending |
| COMP-04 | Phase 5 → 11 | Pending |
| AXE-01 | Phase 6 → 11 | Pending |
| AXE-02 | Phase 6 → 11 | Pending |
| AXE-03 | Phase 6 → 11 | Pending |
| AXE-04 | Phase 6 → 11 | Pending |
| UAT-01 | Phase 7 → 12 | Pending |
| UAT-02 | Phase 7 → 12 | Pending |
| UAT-03 | Phase 7 → 12 | Pending |
| SRCH-01 | Phase 8 | Pending |
| SRCH-02 | Phase 8 | Pending |
| SRCH-03 | Phase 8 | Pending |
| SRCH-04 | Phase 8 | Pending |
| SRCH-05 | Phase 8 | Pending |
| MOB-01 | Phase 9 | Pending |
| MOB-02 | Phase 9 | Pending |
| MOB-03 | Phase 9 | Pending |
| MOB-04 | Phase 9 | Pending |
| TOOLS-01 | Phase 10 | Pending |
| TOOLS-02 | Phase 10 | Pending |
| TOOLS-03 | Phase 10 | Pending |

**Coverage:**
- v1.0 requirements: 8 total — all Complete
- v2.0 requirements: 23 total — 0 Complete, 23 Pending (11 reassigned to gap closure phases)
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-10*
*Last updated: 2026-03-13 — v2.0 requirements added after milestone initialization*
