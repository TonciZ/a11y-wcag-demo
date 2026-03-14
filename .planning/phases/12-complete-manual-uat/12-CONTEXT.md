# Phase 12: Complete Manual UAT - Context

**Gathered:** 2026-03-14
**Status:** Ready for planning

<domain>
## Phase Boundary

All 44 checkpoint pages are manually tested by a human tester in a real browser (Chrome) and with NVDA screen reader, passing the full 5-item CHECKLIST.md quality gate plus 4 NVDA verification checks. Any real issues found are fixed. UAT-RESULTS.md is replaced with human-verified results. This closes the gap from Phase 7 where testing was code-inspection only and item 5 (keyboard navigation) was untested.

No new features. No structural changes. Fix-only scope driven by failures discovered during human testing.

</domain>

<decisions>
## Implementation Decisions

### Testing scope
- All 44 checkpoints tested fresh from scratch — no reliance on Phase 7 code-inspection results
- Full 5-item CHECKLIST.md quality gate per checkpoint (items 1-5)
- Human tester performs all testing in a real browser — no automated browser testing
- CHECKLIST.md is sufficient as the testing guide — no per-checkpoint testing scripts needed
- Results reported one checkpoint at a time via chat; Claude and user discuss fixes per checkpoint

### Browser & screen reader coverage
- Primary browser: Chrome (only browser for this phase)
- Full NVDA screen reader pass on all 44 checkpoints
- NVDA checks per checkpoint:
  1. Announcements fire on toggle (data-announce-fail/pass text spoken)
  2. Heading structure read correctly (NVDA H-key navigation)
  3. Interactive elements announced with correct roles/names
  4. Live region updates announce state changes without manual navigation

### Results tracking
- Replace existing UAT-RESULTS.md in-place — Phase 7 code-inspection results superseded
- Pre-populated table with all 44 checkpoints and empty `[ ]` checkboxes
- Columns: Checkpoint | Item 1 | Item 2 | Item 3 | Item 4 | Item 5 | SR Announce | SR Headings | SR Controls | SR Live | Notes
- Symbols: `[x]` = pass, `[!]` = fail (needs fix), `[ ]` = not yet tested
- NVDA results tracked in separate columns (SR Announce, SR Headings, SR Controls, SR Live)
- Human tester updates the results file directly after re-testing

### Issue workflow
- User reports failures via chat message per issue, describing the problem
- Claude and user discuss the fix or demo changes per checkpoint
- All fixes committed at the end after the entire testing phase is complete — no atomic commits during testing
- Fix all real issues in site chrome and pass-mode demos (keyboard traps, focus order, NVDA problems)
- Fail-mode demos are intentionally broken for educational purposes — excluded from fixes
- Same approach for NVDA issues — fix all real bugs, fail-mode demos excluded

### Claude's Discretion
- Order of checkpoint listing in UAT-RESULTS.md (by section or alphabetical)
- Exact commit strategy at the end (single commit vs. grouped by issue type)
- How to note Phase 7 supersession in the results document header

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `CHECKLIST.md` (root): Authoritative 5-item quality gate — testing criteria fully defined
- `.planning/UAT-RESULTS.md`: Existing Phase 7 results to be replaced with human-verified results
- `assets/js/demo-toggle.js`: Toggle behavior — fires announcements via aria-live region
- `.planning/AUDIT-TRIAGE.md`: Documents which axe violations are intentional demo violations

### Established Patterns
- `data-mode="fail" | "pass"` containers: All demo state driven by this attribute
- `data-announce-fail` / `data-announce-pass` attributes: Screen reader announcement text
- Structural failure demos use code-display-only approach (no live broken interactions)
- Three-layer CSS (base/layout/demo) — any style fixes follow this pattern

### Integration Points
- `checkpoints/*.html`: 44 files — edited only when failures found
- `.planning/UAT-RESULTS.md`: Replaced with human-verified results
- `assets/js/demo-toggle.js`: May need fixes if NVDA testing reveals announcement issues

</code_context>

<specifics>
## Specific Ideas

- UAT-RESULTS.md should use `[ ]` checkbox format so tester can quickly mark `[x]` without removing placeholder text
- Header should note that Phase 7 code-inspection results have been superseded by Phase 12 human browser testing
- Testing workflow: tester opens checkpoint in Chrome, runs through items 1-5 visually/keyboard, then activates NVDA for the 4 SR checks, reports to Claude via chat

</specifics>

<deferred>
## Deferred Ideas

- Firefox/Edge cross-browser testing — future UAT cycle
- Automated Playwright regression tests for items 1-4 — future CI/CD milestone
- VoiceOver (macOS) and JAWS testing — future phase if needed

</deferred>

---

*Phase: 12-complete-manual-uat*
*Context gathered: 2026-03-14*
