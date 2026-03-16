---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: Roadmap
status: planning
last_updated: "2026-03-16T21:59:26.689Z"
progress:
  total_phases: 8
  completed_phases: 6
  total_plans: 10
  completed_plans: 9
  percent: 50
---

---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: Roadmap
status: planning
last_updated: "2026-03-14T12:42:37.260Z"
progress:
  total_phases: 8
  completed_phases: 4
  total_plans: 6
  completed_plans: 6
  percent: 33
---

---
gsd_state_version: 1.0
milestone: v2.0
milestone_name: Feature Expansion & Quality Assurance
status: in-progress
last_updated: "2026-03-16T15:30:00Z"
progress:
  total_phases: 12
  completed_phases: 8
  total_plans: 24
  completed_plans: 11
  percent: 46
---

# Project State — v2.0 Roadmap

## Project Reference

See: `.planning/PROJECT.md` (updated 2026-03-10)

**Core value:** Users can toggle any checkpoint between a failing and passing demo, see real HTML behave incorrectly then correctly, and read the code that makes the difference — learning by doing, not reading.

**Current focus:** v2.0 feature expansion — enhance discoverability, mobile usability, and site quality through six independent phases: component playground, axe audit, manual UAT, search/filtering, mobile chrome, tool links.

---

## Current Position

**Milestone:** v2.0
**Phase:** 10 of 12 (Tool Links) — IN PROGRESS (Plan 02 of 02 complete)
**Status:** Plan 02 complete (all 45 checkpoints updated with tool links)
**Progress:** [===============> ] 58% (14/24 plans complete: Phases 5-10 all done, Phase 11 gap closure done)

---

## Phase Breakdown

### Phase 5: Component Playground
**Goal:** Internal-only component showcase for UI testing
**Requirements:** COMP-01, COMP-02, COMP-03, COMP-04
**Depends on:** Nothing (can start immediately)
**Status:** COMPLETE - `/components.html` created, gitignored, axe verified (0 violations light mode), keyboard navigation working

### Phase 6: Axe Audit
**Goal:** Audit all checkpoints, triage violations, fix confirmed issues
**Requirements:** AXE-01, AXE-02, AXE-03, AXE-04
**Depends on:** Phase 5
**Status:** COMPLETE
- Plan 1: Run audits on all 45 checkpoints (light + dark) — COMPLETE (2026-03-12)
- Plan 2: Triage violations and update announcements — COMPLETE (2026-03-13)
- Plan 3: Implement real issue fixes — COMPLETE (2026-03-13)

### Phase 7: Manual UAT
**Goal:** Verify all checkpoints against quality gate; **MERGE GATE**
**Requirements:** UAT-01, UAT-02, UAT-03
**Depends on:** Phase 6
**Status:** COMPLETE (merged to origin/master 2026-03-13)
**Note:** Phase 7 completion triggered merge to live (origin/master); all 45 checkpoints pass CHECKLIST.md items 1-4

### Phase 8: Search & Filtering
**Goal:** Full-text search, pillar/level filtering, keyboard/screen-reader accessible
**Requirements:** SRCH-01, SRCH-02, SRCH-03, SRCH-04, SRCH-05
**Depends on:** Phase 7
**Status:** COMPLETE (2026-03-16)
- Plan 1: Implement search index, CSS, JS module, integrate on all pages — COMPLETE (2026-03-14)
- **Artifacts:** search-index.json (45 checkpoints), search.css, search-filter.js
- **Integration:** index.html + all 45 checkpoint pages updated
- **Commits:** 6 (5 tasks + 1 summary)

### Phase 9: Mobile Chrome
**Goal:** Responsive sidebar (hamburger menu), mobile-friendly demos, axe verification
**Requirements:** MOB-01, MOB-02, MOB-03, MOB-04
**Depends on:** Phase 8
**Status:** COMPLETE (2026-03-16)
- Plan 1: Hamburger navigation at ≤768px using native `<details>` — COMPLETE (2026-03-16)
- Plan 2: Mobile-responsive search widget and demo containers, axe verification — COMPLETE (2026-03-16)
- **Artifacts:**
  - Mobile viewport detection in checkpoint-nav.js, 768px media query in layout.css
  - Search widget: 768px breakpoint with flex-wrap on filter buttons, full-width input
  - Demo containers: overflow-x: auto at 640px breakpoint (verified compliant)
- **Commits:** 3 (hamburger injection + hamburger styling + search widget mobile update)

### Phase 10: Tool Links & Setup Guides
**Goal:** Tool download links and setup guides per checkpoint
**Requirements:** TOOLS-01, TOOLS-02, TOOLS-03
**Depends on:** Phase 9
**Status:** COMPLETE (2026-03-16)
- Plan 1: Create five tool setup guide pages (NVDA, axe, CCA, Lighthouse, VoiceOver) — COMPLETE (2026-03-16)
  - **Artifacts:** 5 HTML pages in `tools/` directory with external tool links and step-by-step setup instructions
  - **Commits:** 1 (feat: create five tool setup guide pages)
- Plan 2: Add tool links to checkpoint pages — COMPLETE (2026-03-16)
  - **Artifacts:** All 45 checkpoints updated with Testing Tools subsections (3 tools per checkpoint, category-specific)
  - **Commits:** 2 (feat: add tool subsections; docs: summary + audit)
  - **Status:** TOOLS-01 and TOOLS-03 satisfied (45/45 checkpoints have ≥3 tool links, all verified)

### Phase 11: Branch Sync & Metadata Reconciliation (Gap Closure)
**Goal:** Resolve dev/master branch desync, create missing verification artifacts
**Requirements:** COMP-01–04, AXE-01–04 (verification/traceability)
**Depends on:** Phases 5-7 (all complete)
**Status:** COMPLETE (2026-03-14)
- Plan 1: Sync dev with master, create Phase 5-6 VERIFICATION.md, update REQUIREMENTS.md — COMPLETE
**Note:** Closes gap introduced when phases 5-7 executed across dev/master branches

### Phase 12: Complete Manual UAT (Gap Closure)
**Goal:** Full human browser testing of all checkpoints (Item 5: keyboard navigation)
**Requirements:** UAT-01, UAT-02, UAT-03 (human verification)
**Depends on:** Phase 11
**Status:** Pending planning
**Note:** Phase 7 UAT was code inspection only; Phase 12 adds human manual testing in real browser

---

## Performance Metrics

### By Phase

| Phase | Status | Requirements | Success Criteria |
|-------|--------|--------------|------------------|
| 5. Component Playground | ✓ Complete | 4 | 4 |
| 6. Axe Audit | ✓ Complete | 4 | 4 |
| 7. Manual UAT | ✓ Complete | 3 | 4 |
| 8. Search & Filtering | ✓ Complete | 5 | 5 |
| 9. Mobile Chrome | ✓ Complete | 4 | 4 |
| 10. Tool Links | ✓ Complete (2 of 2 plans) | 3 | 3 |
| 11. Branch Sync & Metadata | ✓ Complete (gap closure) | 8 | 8 |
| 12. Complete Manual UAT | Ready to plan (gap closure) | 3 | 4 |

### Coverage

- **Total v2.0 requirements:** 23
- **Completed:** 13 (COMP-01–04, AXE-01–04, SRCH-01–05, MOB-01–04, TOOLS-01–03 via Phases 5-6, 8-10, 11)
- **Pending:** 10 (UAT-01–03 via Phase 12, plus 7 others)
- **All mapped:** Yes ✓
- **Unmapped:** 0 ✓

---

## Accumulated Context

### Key Architectural Constraints (from v1.0)

1. **Static site, no backend** — GitHub Pages compatible; no server-side code
2. **No frameworks, no libraries** — Pure HTML/CSS/vanilla JS; no npm packages shipped to GitHub Pages
3. **Data-attribute state machines** — `.demo-container[data-mode="fail"|"pass"]` drives all demo behavior
4. **Functional-language announcements** — All screen reader text describes user behavior, not CSS values
5. **Content-driven architecture** — Markdown research files precede implementation; no CMS

### v2.0-Specific Constraints

1. **Component playground must be gitignored** — Never ships to GitHub Pages; internal testing only
2. **Hamburger nav must use native `<details>` element** — Avoids JavaScript focus trap issues (research finding in SUMMARY.md)
3. **Search uses vanilla Array.filter()** — No external search library; optional Fuse.js for fuzzy matching (trade-off decision pending)
4. **Audit triage required** — 115+ axe flags expected; many are intentional demo violations (research finding)
5. **Phase 7 is merge gate** — No merge to origin/master until UAT complete

### Decisions from v1.0 (Still Applicable)

- Functional-language announcements — adopted, locked in
- Two-phase workflow (research → implementation) — adopted for content
- Structural failure pattern (code-display-only) — adopted for keyboard/focus demos
- Three-layer CSS (base/layout/demo) — locked, working well
- Demo toggle pattern shared across all 45 checkpoints — working well

### Decisions Pending for v2.0

1. **Search dependencies** — Vanilla Array.filter() vs. Fuse.js (~13KB gzipped). Trade-off: simplicity vs. fuzzy matching UX. Decision needed during Phase 8 planning.
2. **Audit toolchain** — `@axe-core/cli` + `pa11y` + `http-server` as devDependencies. Package versions marked MEDIUM confidence in research; verify at npmjs.com before Phase 6 planning.
3. **CI/CD for audit** — GitHub Actions optional for v2.0; confirm scope during Phase 6 planning.
4. **Playwright keyboard testing** — Flagged as optional; confirm if regression testing needed during Phase 6 planning.

### Research Flags

**From SUMMARY.md research:**
- **Phase 5 (Component Playground):** No blockers; standard pattern. Skip additional research.
- **Phase 6 (Axe Audit):** Package version verification needed (`@axe-core/cli`, `pa11y`, `@playwright/test`). Verify before Phase 6 planning.
- **Phase 7 (Manual UAT):** Use existing CHECKLIST.md; no new research needed.
- **Phase 8 (Search):** Fuse.js trade-off decision pending. Research is complete; decision can be made during planning.
- **Phase 9 (Mobile):** `<details>` element pattern documented in research; no additional research needed.
- **Phase 10 (Tool Links):** Content-driven; verify tool links exist during planning.

### Completed Tasks

**v1.0 closure:**
1. ✓ All 45 checkpoints implemented with demos
2. ✓ All announcements converted to functional language
3. ✓ Quality gate checklist created and enforced
4. ✓ UAT 22/22 tests passed
5. ✓ Ready for merge and tag

**v2.0 kickoff:**
1. ✓ Requirements defined (23 total, 6 phases)
2. ✓ Research completed (SUMMARY.md comprehensive)
3. ✓ Roadmap created with all phases and dependencies
4. ✓ STATE.md initialized

**v2.0 Phase 5 (Complete - 2026-03-13):**
1. ✓ Plan 05-01 executed (all 3 tasks)
2. ✓ `/components.html` created with all 13 components and 30+ variants
3. ✓ Added to .gitignore, never ships to GitHub Pages
4. ✓ Axe-core scan: 0 violations (WCAG 2 AA, light mode)
5. ✓ Dark mode toggle working, colors preserved
6. ✓ Keyboard navigation verified (Tab, Space, Enter, Arrow keys)
7. ✓ All ARIA attributes functional (aria-pressed, aria-selected, aria-expanded)
8. ✓ Created package.json with http-server devDependency
9. ✓ SUMMARY.md created with full audit trail

### Pending Todos

**v1.0 release (before starting v2.0):**
1. Commit v1.0 work (if not already done)
2. Merge to master
3. Tag v1.0.0
4. Push to origin

**v2.0 Phase 6 (Planning):**
1. Set up axe-core CLI scanning infrastructure
2. Scan all 45 checkpoint pages in light + dark mode
3. Triage violations (real issue vs. intentional demo violation)
4. Fix confirmed real issues
5. Document audit results in `.planning/audits/`

### Blockers / Concerns

**None.**

Research is complete; roadmap is locked; all requirements traced; Phase 5 can begin immediately after v1.0 release.

---

## Session Continuity

**Last completed:** Phase 10 Plan 02 — Add Tool Links to Checkpoint Pages (2026-03-16)
**Last updated:** STATE.md updated with Phase 10 Plan 02 completion (2026-03-16)
**Current session focus:** Phase 10 Plan 02 executed; Phase 10 now COMPLETE (both plans done)
**Next session focus:** Phase 11 planning or Phase 12 (Complete Manual UAT gap closure)

---

## Reference Files

- `.planning/ROADMAP.md` — v2.0 roadmap with 6 phases, 23 requirements, success criteria
- `.planning/REQUIREMENTS.md` — All v1.0 and v2.0 requirements with traceability
- `.planning/research/SUMMARY.md` — Complete research for all five v2.0 features
- `.planning/PROJECT.md` — Project specification and constraints

---

*State updated: 2026-03-14T12:38:25Z*
*Milestone: v2.0*
*Status: Phase 11 complete; Phase 8 ready for planning*
*Last executor: Claude (gsd-executor)*
