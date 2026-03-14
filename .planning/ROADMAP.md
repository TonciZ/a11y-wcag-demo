# Roadmap: WCAG 2.2 A11y Demo Site

## Overview

v1.0 is complete: all 45 checkpoints have interactive demos, functional-language announcements, and polished code blocks. The site chrome is accessible, quality gates are in place, and site architecture is locked.

v2.0 focuses on quality assurance, discoverability, and mobile usability. This roadmap adds five discrete features that enhance the educational value and user experience without architectural changes. All features respect the static-site constraint (no backend, no build runtime, no frameworks).

## Phases

**Phase Numbering:**
- Integer phases (5, 6, 7, 8, 9, 10): Planned milestone work
- Decimal phases (5.1, 5.2, etc.): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 5: Component Playground** - Build internal-only component showcase for testing reusable UI elements in isolation
- [x] **Phase 6: Axe Accessibility Audit** - Establish audit infrastructure, scan all checkpoints, triage violations, fix confirmed issues (Plan 3 of 3 COMPLETE)
- [x] **Phase 7: Manual UAT** - Verify all checkpoints against quality gate, test in browsers/screen readers, fix issues
  - **MERGE GATE** — Phase 7 completion triggers merge to live
- [ ] **Phase 8: Search & Filtering** - Implement full-text search, pillar/level filtering, keyboard navigation, screen reader announcements
- [ ] **Phase 9: Mobile Chrome** - Responsive navigation with hamburger menu, mobile-friendly demo containers, axe verification at mobile breakpoints
- [ ] **Phase 10: Tool Links & Setup Guides** - Add tool download links and setup instructions to each checkpoint

## Phase Details

### Phase 5: Component Playground
**Goal**: Developers have an isolated, gitignored testing environment to verify all reusable UI components work correctly in all variants
**Depends on**: Nothing (can start immediately, runs parallel to Phase 6)
**Requirements**: COMP-01, COMP-02, COMP-03, COMP-04
**Success Criteria** (what must be TRUE):
  1. A `/components.html` file exists locally (gitignored, never shipped to GitHub Pages)
  2. Every UI component variant used across all 45 checkpoint pages is rendered and testable in isolation
  3. Component page passes axe scan in both light and dark mode with zero violations
  4. Keyboard navigation (Tab, Enter, Space, arrow keys) works on all interactive component instances
**Plans**: 1 plan

Plans:
- [x] 05-01-PLAN.md — Create /components.html with all 13 UI components and 30+ variants; verify gitignored; test axe compliance and keyboard navigation

---

### Phase 6: Axe Accessibility Audit
**Goal**: The site has an auditable, documented list of all accessibility violations and confirmed issues are fixed before merge to live
**Depends on**: Phase 5 (component playground must exist and pass audit)
**Requirements**: AXE-01, AXE-02, AXE-03, AXE-04
**Success Criteria** (what must be TRUE):
  1. All 44 checkpoint pages have been scanned with axe-core in both light and dark mode; audit JSON results stored in `.planning/audits/`
  2. Each flagged issue has been triaged: confirmed real issue OR documented as intentional demo violation
  3. All confirmed real issues across site chrome and checkpoint pages have been fixed
  4. A triage document (`.planning/AUDIT-TRIAGE.md`) exists documenting which violations are intentional (teaching examples) vs. real bugs
**Plans**: 3 plans

Plans:
- [x] 06-01-PLAN.md — Install @axe-core/cli and pa11y; create audit-light.js and audit-dark.js scripts; scan all 44 pages in both modes; generate JSON results (2026-03-12)
- [x] 06-02-PLAN.md — Parse audit JSON; pre-classify violations as intentional (in [data-mode="fail"]) or real (chrome/structure/outside demo); create AUDIT-TRIAGE.md; update functional-language announcements (2026-03-13)
- [x] 06-03-PLAN.md — Fix all confirmed real issues in site chrome and page structure; add aria-labels to nav (60 links), remove color overrides for contrast, add focus-visible to theme toggle (2026-03-13)

---

### Phase 7: Manual UAT
**Goal**: Every checkpoint has been reviewed for quality, tested for keyboard/screen reader accessibility, and meets the completion checklist before shipping to live
**Depends on**: Phase 6 (axe audit complete, confirmed issues fixed)
**Requirements**: UAT-01, UAT-02, UAT-03
**Success Criteria** (what must be TRUE):
  1. All 44 checkpoints reviewed in browser; automated pattern scan (grep, axe-cli) passed first, then manual walkthrough completed
  2. Each checkpoint page passes CHECKLIST.md 5-item quality gate: toggle works, code blocks sync, announcements are functional, technique codes present, no live structural failures
  3. Any issues found during UAT have been fixed and verified closed
  4. UAT results documented in `.planning/UAT-RESULTS.md` with pass/fail count per checkpoint
**Plans**: 1 plan

Plans:
- [x] 07-01-PLAN.md — Audit all 45 checkpoints against CHECKLIST.md items 1-4; add technique codes; merge dev→master (2026-03-13)

---

### Phase 8: Search & Filtering
**Goal**: Users can discover checkpoints by searching titles and filtering by WCAG pillar or conformance level; search is keyboard and screen-reader accessible
**Depends on**: Phase 7 (UAT complete, site is stable)
**Requirements**: SRCH-01, SRCH-02, SRCH-03, SRCH-04, SRCH-05
**Success Criteria** (what must be TRUE):
  1. User can type in search box and see matching checkpoint results appear in real-time (no page reload)
  2. User can filter results by WCAG pillar (Perceivable / Operable / Understandable / Robust) and conformance level (A / AA)
  3. All search results are announced to screen readers via aria-live region as results update
  4. Keyboard user can navigate search input, results list, and filter buttons using Tab, arrow keys, and Enter
  5. Clicking/tapping a result or pressing Enter opens the checkpoint page
**Plans**: TBD

---

### Phase 9: Mobile Chrome
**Goal**: The site is fully usable on mobile viewports; sidebar nav becomes hamburger menu, demos scale responsively, keyboard/screen reader functionality preserved
**Depends on**: Phase 8 (search complete, full feature set stable)
**Requirements**: MOB-01, MOB-02, MOB-03, MOB-04
**Success Criteria** (what must be TRUE):
  1. Sidebar navigation collapses at viewport width ≤ 768px and is replaced by hamburger button
  2. Hamburger menu is keyboard accessible: Enter/Space open, ESC closes; focus management prevents trap
  3. Demo containers, code blocks, and toggle buttons remain usable on mobile without horizontal scroll
  4. Site passes axe scan at mobile breakpoints (375px, 768px) with zero new violations introduced by responsive layout
**Plans**: TBD

---

### Phase 10: Tool Links & Setup Guides
**Goal**: Each checkpoint includes links to testing tools and quick setup guides so testers can immediately verify the demo
**Depends on**: Phase 9 (mobile complete, all UI patterns locked)
**Requirements**: TOOLS-01, TOOLS-02, TOOLS-03
**Success Criteria** (what must be TRUE):
  1. Each checkpoint "How to test" section includes direct download/access links for at least 3 relevant tools (axe DevTools, NVDA, VoiceOver, JAWS, Lighthouse, etc.)
  2. Each tool link includes 2–3 sentence setup guide (browser install, keyboard shortcut, how to activate for this demo)
  3. All tool links verified working at time of implementation; broken links will be caught by future maintenance audits
**Plans**: TBD

---

### Phase 11: Branch Sync & Metadata Reconciliation
**Goal**: Dev branch is synchronized with master, all completed phases have proper verification artifacts, and REQUIREMENTS.md accurately reflects completion status
**Depends on**: Nothing (prerequisite for further work)
**Requirements**: COMP-01, COMP-02, COMP-03, COMP-04, AXE-01, AXE-02, AXE-03, AXE-04
**Gap Closure:** Closes orphaned/partial gaps from v2.0 audit
**Success Criteria** (what must be TRUE):
  1. Dev branch contains all commits from master (60+ commit desync resolved)
  2. Phase 5 has VERIFICATION.md confirming all 4 COMP requirements satisfied
  3. Phase 6 has VERIFICATION.md and missing SUMMARY.md files for plans 01/02
  4. REQUIREMENTS.md checkboxes updated for all 8 requirements (COMP-01–04, AXE-01–04)
**Plans**: 1 plan

Plans:
- [ ] 11-01-PLAN.md — Sync dev branch with master, create Phase 5-6 VERIFICATION.md files, update REQUIREMENTS.md traceability

---

### Phase 12: Complete Manual UAT
**Goal**: All checkpoint demos are manually tested in a real browser by a human tester, passing the full 5-item quality gate including keyboard navigation (Item 5)
**Depends on**: Phase 11 (branch sync complete, dev has all artifacts)
**Requirements**: UAT-01, UAT-02, UAT-03
**Gap Closure:** Closes partial UAT gaps — prior Phase 7 UAT was code inspection only; 22/44 checkpoints manually reviewed by human
**Success Criteria** (what must be TRUE):
  1. All 44 checkpoint pages manually tested in browser by human tester (not code inspection)
  2. Each checkpoint passes CHECKLIST.md 5-item quality gate including Item 5 (keyboard navigation)
  3. Any issues found during manual review are fixed with atomic commits
  4. UAT-RESULTS.md updated with real human test results replacing code-inspection-only results
**Plans**: TBD

---

## Progress

**Execution Order:**
Phases execute in numeric order: 5 → 6 → 7 (merge gate) → 8 → 9 → 10 → 11 → 12

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 5. Component Playground | 1/1 | Complete | 2026-03-13 |
| 6. Axe Audit | 3/3 | Complete | 2026-03-13 |
| 7. Manual UAT | 1/1 | Complete (code inspection) | 2026-03-13 |
| 8. Search & Filtering | 0/TBD | Not started | — |
| 9. Mobile Chrome | 0/TBD | Not started | — |
| 10. Tool Links | 0/TBD | Not started | — |
| 11. Branch Sync & Metadata | 1/1 | Complete    | 2026-03-14 |
| 12. Complete Manual UAT | 0/TBD | Not started | — |

**Next:**
Execute Phase 8 (Search & Filtering) planning. Phase 11 gap closure complete; all verification artifacts present; REQUIREMENTS.md current.

---

## v1.0 Roadmap (Historical Record)

v1.0 completed 2026-03-12 with 4 phases and 30 plans executed.

| Phase | Goal | Status | Completed |
|-------|------|--------|-----------|
| 1. Quality Infrastructure | Site chrome accessible, quality gate checklist, research template | Complete | 2026-03-12 |
| 2. Announcement Cleanup | All 45 checkpoints use functional-language announcements | Complete | 2026-03-12 |
| 3. Checkpoint Research | All 45 A/AA checkpoints researched with proposed demos | Complete | 2026-03-12 |
| 4. Demo Implementation | All 45 checkpoints with interactive demos, code blocks, WCAG technique codes | Complete | 2026-03-12 |

See `.planning/ROADMAP.md` (v1.0) in git history for detailed phase breakdowns.

---

*Roadmap created: 2026-03-13*
*Updated: 2026-03-14 after Phase 11 execution complete*
*v2.0 feature set defined: 6 phases + 2 gap closure phases = 8 total*
*Phase 5 complete: 1/1 plans; VERIFICATION.md created*
*Phase 6 complete: 3/3 plans; VERIFICATION.md verified*
*Phase 7 complete: 1/1 plans; merged dev→master*
*Phase 11 complete: 1/1 plans; gap closure done; ready for Phase 8*
