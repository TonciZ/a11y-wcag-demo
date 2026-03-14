# Phase 6: Axe Accessibility Audit - Context

**Gathered:** 2026-03-13
**Status:** Ready for planning

<domain>
## Phase Boundary

Run automated axe-core + pa11y scans across all 45 checkpoint pages in both light and dark mode, triage all violations (intentional demo violation vs. real issue), fix all confirmed real issues except broken pass-demo content (deferred to Phase 7 UAT), and document results in `.planning/AUDIT-TRIAGE.md` with JSON snapshots in `.planning/audits/`. Also bundle the 39 remaining functional-language announcement fixes into this phase since we're touching all 45 files.

No new UI features. No search. No mobile nav. Phase 7 UAT follows.

</domain>

<decisions>
## Implementation Decisions

### Toolchain
- Use **both** axe-core CLI and pa11y (dual-engine). pa11y's HTML CodeSniffer catches different issues than axe.
- No Playwright — manual keyboard testing in Phase 7 UAT covers regression testing.
- Both tools installed as devDependencies in `package.json` (never shipped to GitHub Pages).
- `npm run audit` added to package.json scripts to invoke the full scan pipeline.

### Scan scripts
- Two **separate** scripts: `scripts/audit-light.js` and `scripts/audit-dark.js`
- Each script scans all 45 pages, outputs JSON to `.planning/audits/light/` and `.planning/audits/dark/`
- Dark mode injection: set `localStorage.setItem('theme', 'dark')` + `document.documentElement.setAttribute('data-theme', 'dark')` before axe/pa11y run (key confirmed from `theme-toggle.js` line 20: `var STORAGE_KEY = 'theme'`)
- http-server must be running before scripts execute (auditors require real HTTP, not `file://`)

### Audit output storage
- JSON results stored in `.planning/audits/light/` and `.planning/audits/dark/`
- Files committed to git (audit snapshots = historical record, useful for Phase 7 and future audits)

### Triage classification logic
- **Intentional violation**: any axe/pa11y violation on an element inside a `[data-mode="fail"]` container — these are the teaching examples
- **Real issue**: violations in site chrome, page structure, `[data-mode="pass"]` containers, or outside any demo container
- Claude auto-classifies during triage; user reviews AUDIT-TRIAGE.md before fixes begin

### AUDIT-TRIAGE.md format
- Allow-list format: two sections — **Intentional Violations** (table: rule, checkpoint, reason) and **Real Issues Fixed** (table: issue, location, fixed-in-commit)
- Lives at `.planning/AUDIT-TRIAGE.md`

### Fix scope
- Fix all real issues (chrome + demo content) during Phase 6 — except violations inside `[data-mode="pass"]` demos (those are documented in AUDIT-TRIAGE.md and deferred to Phase 7 UAT)
- Broken pass-demo content is actively misleading but addressed in Phase 7 for clean scope separation
- Also fix all 39 remaining functional-language announcement files in this phase (bundled since we're touching all 45 files anyway)

### Claude's Discretion
- Exact script implementation (axe-cli API vs. @axe-core/cli CLI invocation)
- http-server startup/shutdown within the audit scripts
- pa11y output format (whether to unify axe + pa11y output or keep separate)
- Order in which checkpoint files are processed

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `assets/js/theme-toggle.js`: `STORAGE_KEY = 'theme'`; dark mode applied via `document.documentElement.setAttribute('data-theme', 'dark')`. Scan scripts replicate this injection.
- `package.json`: Already exists with `http-server ^14.1` as devDependency. Axe/pa11y tools add alongside it.
- `checkpoints/` directory: 45 `.html` files. Scan scripts need to enumerate these.

### Established Patterns
- Demo state machine: `[data-mode="fail"]` / `[data-mode="pass"]` containers. Triage logic keys off this attribute.
- IIFE JS modules: No global state; no side effects outside explicit API. Scan script injection is safe.
- Three-layer CSS (`base.css`, `layout.css`, `demo.css`): `demo.css` pins demo stage to light color-scheme in dark mode — dark mode scan should still catch real issues outside demo containers.

### Integration Points
- `scripts/` directory: New, created in this phase. Referenced from `package.json` scripts.
- `.planning/audits/`: New, created in this phase. Committed to git.
- `.planning/AUDIT-TRIAGE.md`: New, created in this phase.
- `checkpoints/*.html`: All 45 files scanned and potentially edited for announcement fixes.

</code_context>

<specifics>
## Specific Ideas

- Announcement fix pattern: grep-detectable violations (`contrast ratio`, `to 1`, `#[0-9a-f]{6}`, `border.*solid` in `data-announce-*` attributes) are the 39 remaining files. Pattern from CLAUDE.md: replace visual-property language with functional-impact language.
- AUDIT-TRIAGE.md intentional violation reasoning should be terse (one phrase): "Intentional low-contrast demo", "Teaching missing ARIA label", etc. — not full sentences.

</specifics>

<deferred>
## Deferred Ideas

- Violations inside `[data-mode="pass"]` demos (broken pass examples) — Phase 7 UAT
- GitHub Actions CI/CD for ongoing audit automation — future milestone
- Public-facing audit results page — future milestone
- pa11y + axe output unification into a single dashboard — future milestone

</deferred>

---

*Phase: 06-axe-accessibility-audit*
*Context gathered: 2026-03-13*
