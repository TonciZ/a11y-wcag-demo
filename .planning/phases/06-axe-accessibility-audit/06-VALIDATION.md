---
phase: 6
slug: axe-accessibility-audit
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-13
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node.js scripts + @axe-core/cli + pa11y (no test framework — audit output is data) |
| **Config file** | `package.json` (scripts.audit-light, scripts.audit-dark) |
| **Quick run command** | `node scripts/audit-light.js` |
| **Full suite command** | `node scripts/audit-light.js && node scripts/audit-dark.js` |
| **Estimated runtime** | ~120 seconds (45 pages × 2 tools × 2 modes) |

---

## Sampling Rate

- **After every task commit:** Run `node scripts/audit-light.js` (quick scan of changed files)
- **After every plan wave:** Run `node scripts/audit-light.js && node scripts/audit-dark.js`
- **Before `/gsd:verify-work`:** Full suite must complete with JSON output in `.planning/audits/`
- **Max feedback latency:** ~120 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 6-01-01 | 01 | 1 | AXE-01 | script | `node scripts/audit-light.js` | ❌ W0 | ⬜ pending |
| 6-01-02 | 01 | 1 | AXE-01 | script | `node scripts/audit-dark.js` | ❌ W0 | ⬜ pending |
| 6-02-01 | 02 | 2 | AXE-02 | manual | Review `.planning/audits/` JSON output | ✅ | ⬜ pending |
| 6-02-02 | 02 | 2 | AXE-04 | manual | Verify `AUDIT-TRIAGE.md` has both tables | ❌ W0 | ⬜ pending |
| 6-03-01 | 03 | 3 | AXE-03 | script | Re-run full audit suite; zero new violations | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `scripts/audit-light.js` — scan all 45 pages in light mode with axe + pa11y; output JSON to `.planning/audits/light/`
- [ ] `scripts/audit-dark.js` — scan all 45 pages in dark mode with axe + pa11y; output JSON to `.planning/audits/dark/`
- [ ] `.planning/audits/light/` and `.planning/audits/dark/` directories created
- [ ] `@axe-core/cli` and `pa11y` added as devDependencies in `package.json`

*Wave 0 installs toolchain and creates audit scripts before any scanning begins.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Triage classification accuracy | AXE-02 | Requires human judgment on edge cases (e.g., violations near but not inside `[data-mode="fail"]`) | Review 10% sample of auto-classified intentional violations; confirm each is inside a fail container |
| Announcement language quality | AXE-03 | Functional-language correctness is semantic, not syntactic | Read each updated `data-announce-*` value; confirm it describes user impact, not visual properties |
| AUDIT-TRIAGE.md completeness | AXE-04 | Requires confirming every axe violation is represented | Cross-reference JSON totals against TRIAGE.md row count |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 120s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
