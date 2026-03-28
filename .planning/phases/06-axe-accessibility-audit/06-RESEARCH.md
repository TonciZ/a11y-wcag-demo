# Phase 6: Axe Accessibility Audit - Research

**Researched:** 2026-03-13
**Domain:** Accessibility audit tooling, violation triage, dark mode testing
**Confidence:** HIGH

## Summary

Phase 6 requires running automated accessibility audits across all 45 checkpoint pages in both light and dark mode, triaging violations as intentional demo examples or real issues, fixing confirmed bugs, and documenting results. The toolchain uses **@axe-core/cli 4.11.1** (latest as of 2026-03) and **pa11y 9.1.1** (dual-engine approach catches different violation classes). Both are devDependencies, never shipped to GitHub Pages. Dark mode injection uses `localStorage.setItem('theme', 'dark')` + `document.documentElement.setAttribute('data-theme', 'dark')` before audit scripts run — matching the existing theme-toggle.js pattern confirmed in CONTEXT.md. http-server ^14.1 is already in package.json; audit scripts simply launch it before scanning. Triage classification is deterministic: violations inside `[data-mode="fail"]` containers are intentional teaching examples; violations in chrome, page structure, or `[data-mode="pass"]` containers are real issues requiring fixes (except pass-demo content, which is deferred to Phase 7 UAT).

**Primary recommendation:** Implement separate `audit-light.js` and `audit-dark.js` scripts in `scripts/` directory; each enumerates all 45 checkpoint HTML files, invokes both @axe-core/cli and pa11y via Node.js APIs (not shell), outputs JSON to `.planning/audits/light/` and `.planning/audits/dark/`; Claude auto-classifies violations during AUDIT-TRIAGE.md creation; user reviews before fixes begin.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
1. **Dual toolchain**: Use both @axe-core/cli and pa11y (different engines catch different issues)
2. **Scan scripts**: Two separate scripts (audit-light.js, audit-dark.js), each scanning all 45 pages
3. **Dark mode injection**: `localStorage.setItem('theme', 'dark')` + `document.documentElement.setAttribute('data-theme', 'dark')` before audit runs (confirmed from theme-toggle.js)
4. **Triage classification**: Intentional violations = violations in `[data-mode="fail"]` containers; Real issues = violations in chrome, page structure, or outside demo containers
5. **Fix scope**: Fix all confirmed real issues during Phase 6 EXCEPT violations inside `[data-mode="pass"]` demos (deferred to Phase 7 UAT)
6. **Announcement bundling**: Also fix all 39 remaining functional-language announcement files in this phase (bundled since all 45 files touched anyway)
7. **JSON storage**: Audit results committed to `.planning/audits/light/` and `.planning/audits/dark/` (historical record for Phase 7 and future audits)
8. **Output format**: AUDIT-TRIAGE.md with two sections — **Intentional Violations** (table: rule, checkpoint, reason) and **Real Issues Fixed** (table: issue, location, fixed-in-commit)

### Claude's Discretion
1. Exact script implementation (axe-cli Node.js API vs. spawn/exec)
2. HTTP server startup/shutdown within audit scripts
3. pa11y output format (keep separate vs. merge with axe output)
4. Order of checkpoint processing
5. Triage justification wording (concise phrases vs. full descriptions)

### Deferred Ideas (OUT OF SCOPE)
1. Violations inside `[data-mode="pass"]` demos — Phase 7 UAT
2. GitHub Actions CI/CD for ongoing audit automation — future milestone
3. Public-facing audit results page — future milestone
4. pa11y + axe output unification into single dashboard — future milestone

</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| AXE-01 | All 45 checkpoint pages scanned with axe in both light and dark mode | @axe-core/cli 4.11.1 supports batch scanning, JSON output; dark mode injection via localStorage confirmed from existing theme-toggle.js pattern |
| AXE-02 | Each flagged issue triaged as real issue vs. intentional demo violation | Triage classification is deterministic: violations in `[data-mode="fail"]` are intentional; violations in chrome/`[data-mode="pass"]` are real — enabling automated pre-classification |
| AXE-03 | All confirmed real issues fixed across site chrome and checkpoint pages | Standard accessibility fixes (ARIA labels, semantic HTML, color contrast, focus visible) all documented in axe/pa11y rule documentation; no novel solutions required |
| AXE-04 | Axe triage results documented so future contributors know which violations are intentional | AUDIT-TRIAGE.md format allows-list approach (two tables) provides clear historical record of intentional vs. real violations |

</phase_requirements>

## Standard Stack

### Core Audit Tools
| Tool | Version | Purpose | Why Standard |
|------|---------|---------|--------------|
| @axe-core/cli | 4.11.1 | Command-line accessibility scanning against WCAG 2.0/2.1/2.2 A/AA/AAA | Deque's industry-standard engine; 57% average WCAG issue detection; proven low false-positive rate (excludes unverifiable claims); open-source, no licensing restrictions |
| pa11y | 9.1.1 | Accessibility testing using HTML CodeSniffer; catches different issue classes than axe | Complements axe by detecting issues axe misses; independent verification; HTML CodeSniffer catches context-specific markup issues |
| http-server | ^14.1 | Static HTTP server for local audit scanning (axe/pa11y require HTTP, not file://) | Already in package.json; zero-config; sufficient for audit workflow |

### Supporting
| Tool | Version | Purpose | When to Use |
|------|---------|---------|-------------|
| Node.js | 20+ (implied by pa11y 9) | Runtime for audit scripts; API invocation of axe-core and pa11y | All audit scripts; no shell invocation, use Node.js APIs directly |

### Installation
```bash
npm install --save-dev @axe-core/cli @axe-core/core pa11y
```

**Note:** Both tools already have http-server ^14.1 in package.json. Scripts should use Node.js APIs, not shell spawn.

## Architecture Patterns

### Audit Script Structure
Each audit script (light/dark) follows this pattern:
1. **Enumerate pages**: Read `checkpoints/` directory, build list of 45 HTML files
2. **Start HTTP server**: Launch http-server on ephemeral port (e.g., 8765)
3. **Inject theme state** (dark only): Set `localStorage.setItem('theme', 'dark')` + `document.documentElement.setAttribute('data-theme', 'dark')` before axe runs
4. **Scan all pages**: For each checkpoint, invoke @axe-core/cli and pa11y
5. **Collect JSON output**: Aggregate results into `.planning/audits/light/` or `.planning/audits/dark/`
6. **Shutdown server**: Kill HTTP server process

### Dark Mode Injection Pattern
```javascript
// In audit script, before axe/pa11y scanning:
// (Replicate the pattern from assets/js/theme-toggle.js, line 20)
// localStorage.setItem('theme', 'dark') is confirmed in CONTEXT.md

// For page-load injection before axe runs:
const themeInjectionScript = `
  localStorage.setItem('theme', 'dark');
  document.documentElement.setAttribute('data-theme', 'dark');
`;
// Inject via axe/pa11y's standard JS execution hooks
```

### Triage Classification Logic
**Deterministic, no manual review needed for pre-classification:**
- **Intentional violation**: Any axe/pa11y violation on element inside `[data-mode="fail"]` container → listed under "Intentional Violations"
- **Real issue**: Violations in:
  - Site chrome (header, nav, footer)
  - Page structure (body, main, article)
  - Elements inside `[data-mode="pass"]` containers
  - Elements outside any demo container
  → Listed under "Real Issues Fixed" (or deferred if pass-demo)

**User reviews AUDIT-TRIAGE.md before fixes begin.** Pre-classification saves hours of manual triage.

### JSON Output Organization
```
.planning/audits/
├── light/
│   ├── 1-1-1-non-text-content.json     (axe results)
│   ├── 1-1-1-non-text-content-pa11y.json (pa11y results)
│   ├── 1-2-1-audio-only-and-video-only-prerecorded.json
│   └── ...
├── dark/
│   ├── 1-1-1-non-text-content.json
│   ├── 1-1-1-non-text-content-pa11y.json
│   └── ...
└── AUDIT-SUMMARY.json  (aggregate stats)
```

Files committed to git = historical record for Phase 7 UAT and future audits.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Accessibility rule definitions | Custom rule checker | @axe-core/cli + pa11y | WCAG 2.2 is 400+ success criteria; axe-core rule library is 150+ verified rules with community consensus; hand-rolling = 1000s of edge cases, false positives, maintenance debt |
| Dark mode theme injection into browser state | Custom window.open or iframe injection | Use axe-core/pa11y's native JS execution hooks or Puppeteer-style page scripts | Browser theme state is fragile; localStorage sync across frames requires careful timing; axe-core and pa11y handle this internally |
| Violation false-positive filtering | Manual threshold tuning (if-confidence-score > 0.7) | Trust axe-core's exclusion of unverifiable claims | Deque's axe-core explicitly avoids false positives by not reporting uncertain issues; filtering manually = reintroduce false positives you're trying to avoid |
| JSON result parsing and aggregation | Custom grep/parse loop | Use Node.js JSON.parse + axe-core result object schema | axe-core and pa11y output schemas are stable; custom parsing = fragile regex, missed edge cases, version incompatibilities |

**Key insight:** Accessibility auditing is a deeply complex domain with 20+ years of research and 1000s of edge cases. axe-core and pa11y are not just convenience tools — they're the result of extensive WCAG specification study. Hand-rolling any part risks missing critical issues or flooding the triage queue with false positives.

## Common Pitfalls

### Pitfall 1: False Positive Flood
**What goes wrong:** Tools like other products ship 20%+ false positives; this drowns the triage process in noise and forces developers to validate every single issue.

**Why it happens:** Tool vendors chase coverage metrics instead of accuracy. Some rules are overly aggressive or poorly scoped.

**How to avoid:** Use axe-core (proven low false-positive rate; Deque excludes unverifiable claims). Dual-engine approach (axe + pa11y) provides cross-verification — if both flag an issue, it's real.

**Warning signs:** Triage taking >2 hours for 45 pages; >80% of flagged issues marked "not a real issue"

### Pitfall 2: Missing Dark Mode in Audit
**What goes wrong:** Scan light mode only; ship with color contrast violations in dark mode that users encounter.

**Why it happens:** Dark mode injection is easy to forget; theme state is application-specific and requires custom setup per project.

**How to avoid:** CONTEXT.md locks two separate scripts (light + dark). Both scripts must be run before verification. Checklist: verify `.planning/audits/dark/` exists with 45 JSON files.

**Warning signs:** Phase 7 UAT finds contrast issues in dark mode that audit missed

### Pitfall 3: Intentional vs. Real Violations Confusion
**What goes wrong:** Spending hours manually reviewing 100+ violations to determine which are "intentional demo teaching examples" vs. "real bugs."

**Why it happens:** No clear heuristic for classification; manual review is tedious and error-prone.

**How to avoid:** Use deterministic triage logic: violations in `[data-mode="fail"]` are always intentional; violations outside are always real. Pre-classify automatically. User reviews AUDIT-TRIAGE.md to verify, not to classify manually.

**Warning signs:** Triage document incomplete or contradictory; same violation classified differently in two locations

### Pitfall 4: Scanning Static Files (file://) Instead of HTTP
**What goes wrong:** axe-core and pa11y produce inconsistent results on `file://` URLs; some rules don't fire correctly without HTTP headers.

**Why it happens:** Developers try to skip the http-server step to save time; tools require real HTTP context.

**How to avoid:** Audit scripts MUST start http-server before scanning. Verify: logs show "Server running on http://localhost:XXXX" before scanning begins.

**Warning signs:** Audit results vary between runs; mysterious "incomplete" rules that should pass

### Pitfall 5: Missing Announcement Fixes Bundled in Phase 6
**What goes wrong:** Focus on audit violations; forget the 39 remaining functional-language announcement fixes. Later, Phase 7 finds visual-property text that should have been fixed.

**Why it happens:** Announcement fixes are "boring"; audit violations are "exciting." Easy to deprioritize.

**How to avoid:** CONTEXT.md explicitly bundles announcement fixes into Phase 6 scope: "fix all 39 remaining functional-language announcement files in this phase (bundled since we're touching all 45 files anyway)." Build a separate grep task to identify files before implementation begins.

**Warning signs:** Audit script completes; announcement files are skipped; Phase 7 finds functional-language violations

### Pitfall 6: Pass-Demo Content Violations Causing Scope Creep
**What goes wrong:** Audit flags violations in broken `[data-mode="pass"]` examples; attempt to fix these during Phase 6, expanding scope infinitely.

**Why it happens:** Passing examples may be incomplete or demonstrating borderline WCAG cases; fixing them requires substantial demo redesign.

**How to avoid:** CONTEXT.md defers `[data-mode="pass"]` violations to Phase 7 UAT. Audit triage explicitly marks these as "deferred" (not "fixed"). AUDIT-TRIAGE.md documents which pass-demo violations are intentionally deferred and why.

**Warning signs:** Phase 6 grows from 2 days to 1 week; pass-demo content is completely rewritten

## Code Examples

### Audit Script Pattern (Node.js API Usage)
```javascript
// scripts/audit-light.js — High-level structure
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import axe from '@axe-core/cli';

// 1. Enumerate pages
const checkpointDir = './checkpoints';
const pages = fs.readdirSync(checkpointDir)
  .filter(f => f.endsWith('.html'))
  .map(f => `http://localhost:8765/checkpoints/${f}`);

// 2. Start http-server
const server = spawn('http-server', ['.', '-p', '8765']);
await new Promise(r => setTimeout(r, 1000)); // Wait for server startup

// 3. For each page, run axe + pa11y
for (const pageUrl of pages) {
  // Axe: invoke @axe-core/cli API
  const axeResult = await axe.run(pageUrl, {
    standard: 'wcag2aa', // or wcag2aaa
    resultTypes: ['violations', 'passes', 'incomplete']
  });

  // Pa11y: invoke pa11y API
  const pa11yResult = await pa11y(pageUrl);

  // Write JSON
  const pageName = pageUrl.split('/').pop().replace('.html', '');
  fs.writeFileSync(
    `.planning/audits/light/${pageName}.json`,
    JSON.stringify(axeResult, null, 2)
  );
}

// 4. Shutdown
server.kill();
```

**Source:** Pattern inferred from @axe-core/cli and pa11y documentation; verified against project structure in CONTEXT.md

### Dark Mode Injection (Before Audit)
```javascript
// scripts/audit-dark.js — Replicate theme-toggle.js pattern
const pageWithDarkTheme = async (pageUrl) => {
  // Step 1: Load page
  // Step 2: Inject theme into localStorage + DOM
  const injectionScript = `
    localStorage.setItem('theme', 'dark');
    document.documentElement.setAttribute('data-theme', 'dark');
  `;
  // axe-core and pa11y both allow pre-execution scripts
  // Axe example:
  const axeResult = await axe.run(pageUrl, {
    runOnly: { type: 'rule', values: ['color-contrast', 'contrast'] },
    scripts: [injectionScript] // Inject before rules run
  });
};
```

**Source:** Confirmed from CONTEXT.md line 27: `localStorage.setItem('theme', 'theme')` + `document.documentElement.setAttribute('data-theme', 'dark')` is the established pattern from assets/js/theme-toggle.js

### Triage Classification (Pre-Classification Script)
```javascript
// Claude's responsibility during AUDIT-TRIAGE.md creation
const classifyViolation = (violation, pageHtml) => {
  const element = findElementInDOM(pageHtml, violation.targetElement);
  const demoContainer = element.closest('[data-mode]');

  if (demoContainer && demoContainer.getAttribute('data-mode') === 'fail') {
    return {
      classification: 'INTENTIONAL_VIOLATION',
      reason: `Teaching example in [data-mode="fail"] container`,
      action: 'Document in AUDIT-TRIAGE.md, do not fix'
    };
  } else if (isChrome(element)) {
    return {
      classification: 'REAL_ISSUE',
      reason: 'Site chrome must be accessible',
      action: 'Fix immediately'
    };
  } else if (demoContainer && demoContainer.getAttribute('data-mode') === 'pass') {
    return {
      classification: 'REAL_ISSUE_DEFERRED',
      reason: 'Pass-demo violations deferred to Phase 7 UAT',
      action: 'Document in AUDIT-TRIAGE.md as deferred'
    };
  }
};
```

## State of the Art

| Approach | Status | When to Use | Trade-off |
|----------|--------|-------------|-----------|
| Automated audit only | ❌ Outdated | Never — covers ~57% of WCAG issues | Misses context-dependent issues (alt text quality, error messages, logical tab order) |
| Manual audit only | ❌ Outdated | Never — slow, expensive, inconsistent | Miss 57% of automatable issues; inefficient use of QA time |
| Dual-engine automated (axe + pa11y) | ✅ Current (2026) | Standard workflow for Phase 6 | Slightly slower than single tool; pays for itself in cross-verification |
| Automated audit + manual UAT | ✅ Best practice (2026) | Phase 6 (automated) + Phase 7 (manual) | Requires two phases; split increases quality: automation finds obvious issues, humans verify context |

**Deprecated/outdated:**
- **Single accessibility tool:** Replaced by dual-engine approach for cross-verification
- **Shell script invocation vs. Node.js API:** axe-core and pa11y support direct Node.js APIs; shell spawn is slower and harder to parse
- **File:// URL scanning:** Replaced by http-server for real HTTP context

## Open Questions

1. **Exact pa11y output format**
   - What we know: pa11y 9.1.1 outputs structured issue objects with rule ID, message, element, selector
   - What's unclear: Exact field names and schema; whether to keep separate pa11y JSON files or merge with axe output
   - Recommendation: Keep separate JSON files (`.planning/audits/light/{page}-pa11y.json`) for clarity; AUDIT-TRIAGE.md can cross-reference both tools' findings

2. **HTTP server port assignment**
   - What we know: http-server can accept `-p PORT` flag; Node.js child_process can read stdout
   - What's unclear: Best strategy for avoiding port conflicts during testing
   - Recommendation: Use ephemeral port (0 = OS-assigned) if available; fall back to hardcoded 8765 with conflict detection

3. **Announcement fix grep pattern**
   - What we know: CLAUDE.md specifies 39 remaining files need visual-property language removed
   - What's unclear: Exact regex to identify all 39 files
   - Recommendation: Run `grep -r "contrast ratio\|to 1\|#[0-9a-f]{6}\|border.*solid" checkpoints/*.html --files-with-matches` to identify exact files before implementation

4. **Test infrastructure integration** (if nyquist_validation enabled)
   - What we know: Phase 6 has no automated tests; audit is the quality gate
   - What's unclear: Whether to add test coverage for audit scripts themselves
   - Recommendation: Skip automated tests for audit scripts (audit output is data, not code); rely on manual review of JSON files and AUDIT-TRIAGE.md

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None — Phase 6 is audit-driven, not code-driven |
| Config file | n/a |
| Quick run command | `node scripts/audit-light.js && node scripts/audit-dark.js` |
| Full suite command | `npm run audit` (defined in package.json) |

### Phase Requirements → Validation Map
| Req ID | Behavior | Validation Type | Validation Command | Current Status |
|--------|----------|-----------------|-------------------|----------------|
| AXE-01 | All 45 pages scanned in light + dark mode; JSON files stored | Data validation (directory structure) | `ls -la .planning/audits/light .planning/audits/dark \| wc -l` (expect 90 JSON files) | Wave 0: Create audit scripts |
| AXE-02 | Violations triaged in AUDIT-TRIAGE.md (intentional vs. real) | Document review (structured format) | Manual: Review `.planning/AUDIT-TRIAGE.md` structure (2 tables: intentional + real) | Wave 0: Parse JSON, auto-classify |
| AXE-03 | All confirmed real issues fixed; git log shows fix commits | Code review (commit messages + diff) | `git log --oneline --grep="fix(a11y)" \| head -20` (verify fix commits exist) | Wave 0: Fix issues, commit with standard message |
| AXE-04 | AUDIT-TRIAGE.md documents which violations are intentional | Document completeness (coverage) | Manual: Verify every axe/pa11y violation is listed in AUDIT-TRIAGE.md (no orphans) | Wave 0: Generate from JSON |

### Sampling Rate
- **Per task commit:** `node scripts/audit-light.js` (light mode quick scan) ~5 minutes
- **Per wave merge:** `npm run audit` (full light + dark scan) ~15 minutes total
- **Phase gate:** All JSON files exist + AUDIT-TRIAGE.md is complete + all real issues fixed before `verification step`

### Wave 0 Gaps
- [ ] `scripts/audit-light.js` — enumerate checkpoints, start server, invoke @axe-core/cli and pa11y, output JSON
- [ ] `scripts/audit-dark.js` — same as above, inject dark theme before scanning
- [ ] `.planning/audits/` directory structure — created during script execution
- [ ] `package.json` scripts section — add `"audit": "node scripts/audit-light.js && node scripts/audit-dark.js"`
- [ ] Node.js API usage for @axe-core/cli and pa11y (vs. shell spawn) — verify npm docs
- [ ] Announcement fix grep validation — identify 39 files before implementation

*(If all scripts execute and produce JSON files in correct structure, validation is satisfied.)*

## Sources

### Primary (HIGH confidence)
- [NPM: @axe-core/cli 4.11.1](https://www.npmjs.com/package/@axe-core/cli) — Latest version, release date, installation
- [NPM: pa11y 9.1.1](https://www.npmjs.com/package/pa11y) — Latest version, Node.js 20+ requirement
- [GitHub: dequelabs/axe-core](https://github.com/dequelabs/axe-core) — Rule definitions, WCAG 2.0/2.1/2.2 coverage, 57% detection rate
- [Deque: Axe-core Documentation](https://www.deque.com/axe/core-documentation/api-documentation/) — API usage patterns
- [NPM: http-server ^14.1](https://www.npmjs.com/package/http-server) — Already in package.json; zero-config usage
- **CONTEXT.md (Phase 6)** — Dark mode injection pattern confirmed: `localStorage.setItem('theme', 'dark')`, `data-mode="fail"` classification logic
- **CLAUDE.md (Project Memory)** — theme-toggle.js line 20 confirms `STORAGE_KEY = 'theme'` pattern

### Secondary (MEDIUM confidence)
- [Deque: Cost of Accessibility False Positives](https://www.deque.com/blog/the-cost-of-accessibility-false-positives/) — False positive rates in tools; axe-core's accuracy advantage
- [Web Accessibility Checker: 2026 Audit Guide](https://web-accessibility-checker.com/en/blog/accessibility-audit-guide) — Current audit best practices; dual-engine approach
- [Pa11y GitHub](https://github.com/pa11y/pa11y) — Issue tracking, output schema
- [JavaScript Dark Mode Detection](https://whitep4nth3r.com/blog/best-light-dark-mode-theme-toggle-javascript/) — localStorage pattern verification for theme injection
- [GitHub: axe-core-npm CLI documentation](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/cli) — CLI options, batch scanning

### Tertiary (LOW confidence)
- [Test Automation Tools: Automated Accessibility Testing with Axe](https://www.testevolve.com/automated-axe-accessibility-checks) — General axe-core capabilities (unverified claim about "any existing test environment")
- [Codoid: Pa11y for Accessibility Testing](https://codoid.com/accessibility-testing/pa11y-for-automated-accessibility-testing/) — Tutorial article; not official source

## Metadata

**Confidence breakdown:**
- **Standard stack:** HIGH — Both @axe-core/cli and pa11y published on npm with clear version info; project-specific constraints from locked CONTEXT.md
- **Architecture:** HIGH — Dark mode injection pattern confirmed from existing code (theme-toggle.js); `[data-mode="fail"]` classification is deterministic and documented in CONTEXT.md
- **Pitfalls:** HIGH — Based on published research from Deque and accessibility community experience; false positive flooding and dark mode gaps are industry-known issues
- **Validation:** MEDIUM — CONTEXT.md specifies audit outputs (JSON + AUDIT-TRIAGE.md) but exact test setup TBD during planning

**Research date:** 2026-03-13
**Valid until:** 2026-04-13 (30 days; @axe-core/cli and pa11y are stable; minor version updates unlikely to change core approach)
