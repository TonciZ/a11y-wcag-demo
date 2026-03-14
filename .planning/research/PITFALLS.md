# Pitfalls Research

**Domain:** WCAG 2.2 educational demo site — interactive fail/pass checkpoint pages
**Researched:** 2026-03-10
**Confidence:** HIGH (all findings grounded in direct codebase inspection; no external search tools available)

---

## Critical Pitfalls

### Pitfall 1: The Site Chrome Itself Fails the Criteria It Teaches

**What goes wrong:**
A WCAG demo page teaching "2.4.7 Focus Visible" has a focus outline that disappears on certain states. A page teaching "4.1.2 Name, Role, Value" has a toggle button whose `aria-pressed` state is not announced by the screen reader because the button label doesn't update on toggle. An a11y professional opens DevTools and immediately finds the very issue the page claims to demonstrate as a failure — but it's in the site chrome, not the demo.

**Why it happens:**
Demo pages are built quickly, with attention concentrated on the `demo-stage` content inside the `.demo-container`. The surrounding chrome — site header, navigation, skip link, theme toggle, footer — is treated as "infrastructure" and not tested with the same rigor. Authors assume the chrome is already correct because it was implemented once and reused. In practice, refactoring CSS or JS often breaks previously-passing chrome without anyone noticing.

**How to avoid:**
- Run a keyboard tabbing test on every completed checkpoint page (not just the demo), confirming: skip link appears on focus, nav links are reachable, demo toggle button announces `aria-pressed` state, theme toggle button announces its state, footer links are reachable.
- Use `axe-core` in the browser console on the full page before marking a checkpoint done.
- Treat the site chrome as a first-class accessibility surface, not scaffolding.

**Warning signs:**
- Theme toggle button (`aria-pressed="false"` at load) label text is "Dark mode" and does not update visually or semantically when pressed — the label never changes in observed HTML. A screen reader user gets no confirmation that dark mode activated.
- `base.css` applies a `transition` to all elements globally; `demo.css` overrides this with `transition: none !important` inside `.demo-container` — but the theme-icon keyframe animation in `base.css` (`@keyframes theme-icon-in`) uses `transform: scale` and `rotate`, which can be a motion concern for `prefers-reduced-motion` users on the chrome elements outside demo containers.

**Phase to address:**
Site chrome accessibility audit — should be a blocking gate before any checkpoint page is marked complete. Establish a per-page completion checklist that includes chrome verification.

---

### Pitfall 2: Screen Reader Announcements That Teach Bad Practice

**What goes wrong:**
The live region announcement fired on demo toggle is the most-listened-to accessibility feedback in the entire site. If the announcement says "Showing fail example. Form controls have a border at 4.5 to 1 contrast ratio" — a screen reader user learns that screen readers describe CSS values. They do not. Teaching technical implementation details via the announcement reinforces a false mental model of what screen readers say and what WCAG actually measures.

**Why it happens:**
Authors write announcements from the perspective of an implementation checklist ("the border is now 4.5:1") rather than from the perspective of a user experience impact statement. The pattern is understandable — the author just changed a CSS value, so they describe the CSS value. The project has explicitly identified this as a known pattern to fix (39/44 files still pending as of last session).

**How to avoid:**
- Enforce the rule: announcements describe functional impact, never CSS properties, hex codes, contrast ratios, or ARIA attribute names.
- Correct pattern: "Form controls have clearly visible boundaries" — describes what a user experiences.
- Wrong pattern: "Form controls now use border: 2px solid #767676 at 4.54:1 contrast" — describes what a developer sees.
- Add this as a linting check: `grep -r "contrast ratio\|to 1\|#[0-9a-f]\{6\}\|border.*solid" checkpoints/*.html | grep "data-announce"` — any match is a failure.
- Build the check into the per-checkpoint implementation template so the correct frame is applied from the start, not retrofitted.

**Warning signs:**
The grep query `grep -r "contrast ratio\|to 1\|#[0-9a-f]\{6\}\|border.*solid" checkpoints/*.html` finds 190 matches across 38 files — these are in the demo stage `<p>` text (intentionally present for educational context), not in announcements currently. Verified: no announcements currently contain contrast ratios. However, the risk reappears every time a new checkpoint is implemented if the author is not prompted to follow the functional-language rule.

**Phase to address:**
Per-checkpoint implementation phase. Add rule to the implementation prompt template: "Write announcements describing user experience impact, not CSS/ARIA implementation details."

---

### Pitfall 3: The Fail Example Is Itself Inaccessible in a Harmful Way

**What goes wrong:**
A demo teaching "2.1.2 No Keyboard Trap" implements a live keyboard trap in the fail example — the user cannot escape. A demo teaching "2.1.1 Keyboard" places a mouse-only `onclick` handler that a keyboard user can't bypass to get back to the site. The fail example causes the actual failure it demonstrates, making the page inaccessible to the very audience testing it.

**Why it happens:**
This is the central tension of WCAG demo sites: to show a real failure, you have to create the failure. Authors reasonably try to make the most authentic demonstration possible. The result is that demos for keyboard/focus/trap criteria are inherently dangerous to implement naively.

**How to avoid:**
- Distinguish between "structural failures" (safe to show: missing labels, wrong roles, poor contrast) and "functional failures" (dangerous to show: keyboard traps, focus loss, no keyboard access).
- For functional failures, use the code-display approach (as already done in `2-1-2-no-keyboard-trap.html`): show the failing markup as a `<pre><code>` block rather than live interactive content. This is observed and correct in the existing codebase.
- For contrast/color failures, a live visual demonstration is safe because it affects perception only — the user can still navigate the page.
- Document the decision rule explicitly: "If the fail example would block keyboard users from leaving the demo container, render it as code, not as live interactive content."

**Warning signs:**
- Any checkpoint whose fail state involves `tabindex`, `addEventListener('keydown')`, focus management, or pointer events on non-interactive elements needs review before implementation.
- Checkpoints to audit carefully: 2.1.1 Keyboard, 2.1.2 No Keyboard Trap, 2.4.3 Focus Order (currently shows live `tabindex` positive values — acceptable risk because the page continues to be traversable), 2.5.2 Pointer Cancellation, 2.5.7 Dragging Movements.
- In `2-4-3-focus-order.html`, the fail example uses `tabindex="3"`, `tabindex="1"`, `tabindex="2"` — this is live and creates a real focus order disruption in the demo stage. Tab order within the demo stage is affected. This is acceptable only if the demo stage is contained and users can Tab out afterward, which requires verification.

**Phase to address:**
Per-checkpoint research/planning phase. Before implementing each checkpoint, classify whether its fail example is a structural or functional failure and choose the appropriate demo strategy.

---

### Pitfall 4: Pass Example Teaches an Incomplete or Misleading Fix

**What goes wrong:**
The pass example for "1.4.1 Use of Color" shows required fields with `aria-required="true"` on `<input>` elements and `<strong aria-hidden="true">*</strong>` in the label. This is largely correct but incomplete: the asterisk is hidden from assistive technology, so screen reader users get no redundant indicator — yet the whole point of the criterion is redundancy. A developer copies the pass example thinking they've handled both the visual and programmatic requirements, when in fact they've only handled the visual part.

**Why it happens:**
Pass examples optimize for "visually shows the fix" rather than "fully models the correct implementation." Authors focus on what toggles the visual appearance between fail and pass, not on whether the pass example is a complete, production-ready solution.

**How to avoid:**
- For every pass example, ask: "If a developer copies this HTML exactly, will they have implemented the criterion correctly and completely?"
- When the answer is no, add explanatory text in the demo stage that names what else is required beyond what the demo shows.
- In the `1.4.1` case specifically: the `<strong aria-hidden="true">*</strong>` should be paired with visible text explaining the legend ("* Required field"), AND the screen reader should receive the "required" signal either via `required`/`aria-required` (which is done) or by including the word "required" in the label text.

**Warning signs:**
- Pass examples that use `aria-hidden="true"` on meaningful content without a compensating programmatic equivalent.
- Pass examples where ARIA is added but native HTML semantics would be sufficient and preferable.
- Pass examples where the visual fix is clear but the programmatic association is missing (e.g., error message present but no `aria-describedby`).

**Phase to address:**
Content research phase (`.md` files). The research file for each checkpoint should explicitly document "what makes the pass example complete" before implementation begins. Implementation should be validated against this checklist.

---

### Pitfall 5: Demo Stage Colors Controlled by Dark Mode Create False Failures

**What goes wrong:**
The demo for "1.4.3 Contrast (Minimum)" shows failing text as `color: #aaaaaa` on white, and passing text as `color: #595959` on white. If dark mode were applied to the demo stage, the white background token would become dark, turning the "2.32:1 fail" example into a high-contrast example and inverting the entire lesson. The same risk affects every contrast-based checkpoint.

**Why it happens:**
Dark mode is a site-wide feature that overrides CSS custom properties. Without explicit scoping, all demo stage colors inherit dark mode tokens, which corrupts the contrast values being demonstrated.

**How to avoid:**
The existing codebase has already solved this correctly in `demo.css`: `[data-theme="dark"] .demo-stage` explicitly resets all color tokens to their light-mode values and sets `color-scheme: light`. This must be preserved without modification. The pitfall is that future editors may not understand why these overrides exist and might remove them as "redundant" during a CSS cleanup.

**Warning signs:**
- Any PR that modifies `demo.css` and removes or weakens the `[data-theme="dark"] .demo-stage` block.
- Demo stages whose fail examples use absolute hex colors in inline `style=""` attributes (as many current demos do) — these are immune to token overrides but could conflict with `color-scheme: light` in some contexts.
- Checkpoints where the contrast difference between fail and pass is subtle — these need explicit dark mode testing.

**Phase to address:**
Ongoing — add to the per-checkpoint completion checklist: "Toggle dark mode. Verify fail example still looks like a failure and pass example still looks like a pass."

---

### Pitfall 6: Demos That Show the Symptom, Not the Cause

**What goes wrong:**
A demo for "4.1.2 Name, Role, Value" shows a `<div>` styled as a checkbox that cannot be focused. The user sees a non-focusable element and thinks the failure is about missing `tabindex`. The actual failure is the missing role and accessible name. By framing the failure around keyboard access (already covered by 2.1.1 Keyboard), the demo teaches the wrong criterion. The learner leaves with a mental model: "4.1.2 means I forgot to add `tabindex`."

**Why it happens:**
Complex criteria have multiple failure modes, and the most visually obvious mode is not always the most instructive. Authors choose demonstrations that are easy to see and understand, but "easy to see" often means "the visible symptom" rather than "the root cause the criterion is targeting."

**How to avoid:**
- In the content research phase, explicitly identify: "What is the primary concept this criterion teaches?" and "What is the minimum demo that isolates that concept without introducing confounding issues?"
- For `4.1.2`, the current demo is actually good at the role/name dimension (the `<div>` has no role and no accessible name, which is the correct failure to show) — but the description text leads with "it is also not keyboard focusable," blending 2.1.1 into 4.1.2.
- The demo description text inside `data-demo-state="fail"` panels must be precise about which specific criterion failure is being shown and must not attribute the problem to a different criterion.

**Warning signs:**
- Demo description text inside the stage that mentions keyboard navigation when the checkpoint is not a keyboard criterion.
- A pass example that introduces multiple improvements at once — only the improvement relevant to the specific criterion should be the delta between fail and pass.
- Any demo where the "fix" in the pass example changes both the structure being demonstrated (e.g., role) AND an unrelated property (e.g., also adds `tabindex`, also adds a label).

**Phase to address:**
Content research phase (`.md` files) — the proposed demo scenario in the research file should explicitly state: "The only change between fail and pass is [X]."

---

### Pitfall 7: Inline Styles in Demo Stages Become a Maintenance Trap

**What goes wrong:**
Most demo stages use heavy inline `style=""` attributes to control the visual appearance of fail/pass content (observed in nearly all 44 checkpoint files). When a decision is made to change the demo stage background color, add dark mode support, or fix a contrast issue in the demo itself, every inline style on every affected element must be hunted down manually across 44 files. A single global CSS change that would take 5 minutes instead requires auditing 44 HTML files.

**Why it happens:**
Inline styles are the path of least resistance when building isolated demo examples. Each demo has unique visual requirements that don't map to shared classes. Authors reach for `style=""` to keep CSS files simple and avoid naming classes for one-off demo elements.

**How to avoid:**
- For structural one-off demo elements (a form, a button, a blockquote) that exist only to demonstrate the criterion, inline styles are acceptable and are the current standard pattern.
- For any visual property that should be consistent across demos (e.g., the background of a card used in multiple demos, the styling of a simulated error state), create a shared utility class in `demo.css`.
- The rule: one-off demo element = inline style acceptable; repeated demo pattern = extract to `demo.css`.
- Document this decision rule so future contributors follow the same standard.

**Warning signs:**
- A visual bug that appears in more than 3 checkpoint demos simultaneously — this means the shared pattern was not extracted to CSS and will require manual fixes across many files.
- Any inline style that contains a color token value (e.g., `color: #b91c1c`) rather than a CSS variable — this is a divergence from the token system that won't respond to dark mode or theme changes.

**Phase to address:**
Ongoing — evaluate after the first 5-10 checkpoint implementations whether shared demo patterns have emerged that warrant extraction to `demo.css`.

---

### Pitfall 8: The "Code Block" Pattern Teaches Incomplete HTML

**What goes wrong:**
Several checkpoint demos (e.g., `2.1.2 No Keyboard Trap`, `2.1.4 Character Key Shortcuts`) display fail/pass examples as `<pre><code>` blocks of HTML and JavaScript. These are the correct approach for functional failures that cannot be safely live-demonstrated. However, the code blocks often show snippets only — no surrounding context, no `<!DOCTYPE>`, no indication that the pattern is incomplete. A developer copying the pattern verbatim will have a script fragment, not a working example.

**Why it happens:**
Code snippets are written for illustration, not for copy-paste use. Authors truncate to show only the relevant part. But the audience — developers — evaluates code examples as implementation models.

**How to avoid:**
- Every code block should be complete enough to be understood in isolation.
- If the snippet is intentionally partial, add a comment or caption: "Simplified excerpt — see the full implementation pattern in the Understanding document."
- Ensure code blocks in the pass example show production-appropriate patterns, not oversimplified illustrations (e.g., don't use `onclick="..."` inline handlers in pass examples for JavaScript-behavior criteria).

**Warning signs:**
- Pass example code blocks that use `onclick=""` inline handlers — these look like correct patterns to beginners but are not.
- Code blocks where the fail and pass examples differ only in a comment (e.g., `// Missing: if (e.key === 'Escape')`) — the delta is invisible to developers who skim.
- Code blocks that show closing tags without opening context.

**Phase to address:**
Content research phase — the `.md` file for each checkpoint should specify whether the demo should use live interactive HTML or a code-display pattern, and should draft the code examples if using the code-display approach.

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Inline `style=""` for all demo elements | No class naming overhead, demo is self-contained | Mass find-replace when shared patterns need updating; hex colors bypass token system | Acceptable for one-off demo elements; not acceptable for repeated patterns |
| Hardcoded nav HTML string in `checkpoint-nav.js` | Simple, no build tool required | Updating navigation requires editing a multi-hundred-line JS string manually; easy to introduce mismatched `href` and `data-checkpoint` values | Acceptable given static site constraint; mitigate with comments and consistent patterns |
| All 44 checkpoint pages share identical chrome by copy-paste | Each file is self-contained, no include system needed | A chrome bug (e.g., missing `aria-label` on theme toggle) requires 44 manual fixes | Acceptable given static site constraint; mitigate with automated grep checks |
| Screen reader announcements as `data-` attributes on the container | Simple, no JS configuration needed | Author must remember to write functional-language announcements; no lint enforcement exists | Acceptable; add lint script to verify announcement content quality |
| Demo stage locked to light tokens in dark mode | Correct preservation of contrast demos | If dark-mode-specific contrast demos are ever needed (e.g., testing dark mode contrast failures), the current architecture cannot support them | Acceptable for current scope; note as limitation |

---

## Integration Gotchas

This is a static site with no external service integrations. The relevant "integration" points are browser/AT compatibility concerns.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| NVDA + Chrome `aria-pressed` toggle button | `aria-pressed` state is announced, but only if the button label is stable — if the label text changes AND `aria-pressed` changes simultaneously, some AT combos only announce one | In the current codebase, label text swaps via `.hidden` toggle AND `aria-pressed` updates — verify both work in NVDA+Chrome and VoiceOver+Safari |
| `aria-live="polite"` announcement timing | Setting `textContent` immediately may not fire in some AT if the element is newly inserted into the DOM | The existing pattern (element present in DOM on load, text changed on toggle) is correct and avoids this issue |
| CSS `visibility: hidden` vs `hidden` attribute for demo state switching | `visibility: hidden` removes visual presence but keeps element in accessibility tree | The existing code correctly uses the `hidden` attribute (`hidden` removes from both visual and a11y tree) |
| `color-scheme: light` on demo stage | Forces light rendering of browser-native form controls inside the demo stage, which may cause system UI controls (checkboxes, selects) to appear in light mode even in an otherwise dark page | This is intentional and correct — document it so future editors don't remove it |

---

## Performance Traps

Static site on GitHub Pages. Performance at scale is not a meaningful concern. The relevant "performance" considerations are authoring efficiency.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| 44-file manual updates | A shared pattern change (e.g., adding `role="contentinfo"` to all footers) requires editing every checkpoint file | Automate multi-file updates with a grep/sed script or a small Node script; document the command in project notes | Every shared change |
| No lint gate on announcement content | Visual-property language creeps back into announcements over time | Add a pre-implementation check: `grep -n "data-announce" [file] | grep -E "contrast ratio|to 1|#[0-9a-f]{6}|border.*solid"` | Each new checkpoint implementation |

---

## UX Pitfalls

Mistakes that make the educational experience confusing or counterproductive.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Fail and pass examples that look nearly identical | User cannot perceive what changed; demo fails to teach | Make the difference stark; the fail should be clearly broken, not subtly broken |
| No explanation of what to look for before the demo | User interacts with demo but doesn't know what failure to search for | Add a brief one-sentence "What to watch for:" note before or at the top of the demo stage |
| Demo toggle button text is ambiguous after toggle | User presses "Show passing example," it flips to "Show failing example" — the label now describes what was just left, not what clicking will do | The current implementation is correct: label describes the *action* (what you will see next), not the current state. This is the `aria-pressed` + label convention used correctly. Preserve it. |
| Code examples use contrived values | User thinks the rule only applies to the exact hex value shown | Contrast examples should note the general principle alongside specific values |
| Fail example is too extreme | User thinks only egregious failures count; misses the real-world "almost passing" failures | Show a realistic failure, not a cartoon failure (e.g., for contrast: `#aaaaaa` on white is real-world common; `#eeeeee` on white is more extreme) |

---

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Demo container structure:** Has `role="region"`, `aria-labelledby`, `data-announce-fail`, `data-announce-pass` — verify all four are present on every `.demo-container`
- [ ] **Toggle button:** Has `aria-pressed="false"` on initial load, both `span` label children present, one hidden — verify both label children exist and have correct `hidden` initial state
- [ ] **Live region:** `data-demo-announcement` element present inside container, is `aria-live="polite"` with `aria-atomic="true"` and `class="visually-hidden"` — verify not accidentally `display:none` (which would suppress announcements in some AT)
- [ ] **Demo state panels:** Both `data-demo-state="fail"` and `data-demo-state="pass"` present; pass panel has `hidden` attribute on initial load
- [ ] **Screen reader announcement language:** Does not contain contrast ratios, hex codes, CSS property names, or ARIA attribute names — describes functional impact only
- [ ] **Fail example safety:** Does not create a live keyboard trap, does not block Tab from leaving the demo stage, does not fire uncontrolled events on the surrounding page
- [ ] **Pass example completeness:** Would a developer copying the pass HTML have a correct, complete implementation of the criterion?
- [ ] **Dark mode integrity:** With `data-theme="dark"` active, does the fail example still look like a failure? Does the pass example still look like a pass?
- [ ] **Inline style colors:** Any inline hex color in the demo stage — is it in a contrast demo (acceptable) or a structural demo (should use CSS variable)?
- [ ] **Heading structure:** Each checkpoint page has exactly one `<h1>` (the checkpoint title); sections use `<h2>` with unique IDs; no heading levels are skipped

---

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Chrome a11y failure discovered post-publish | LOW–MEDIUM | Fix in the shared pattern (layout.css, checkpoint-nav.js, or the chrome HTML block), then propagate across all affected files with a targeted grep/replace |
| Wrong announcement language across many files | LOW | Grep for offending patterns, sed/replace with correct functional language — the pattern is systematic and scriptable |
| Fail example creates actual keyboard trap in live demo | HIGH | Remove live interactive trap immediately; replace with code-display pattern; requires content rethink (what does a safe but instructive fail demo look like for this criterion?) |
| Pass example teaches incomplete fix | MEDIUM | Add clarifying text to the demo stage paragraph; may also require updating the `.md` research file if the content was incorrect at the research stage |
| Dark mode breaks contrast demos (token override removed) | LOW | Restore `[data-theme="dark"] .demo-stage` block in `demo.css` — recovery is a single CSS change |
| Inline style inconsistency at scale | MEDIUM | Audit all demo stages for the shared pattern, extract to `demo.css`, find/replace inline occurrences — scriptable but time-consuming |

---

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Site chrome fails its own criteria | Chrome audit phase — before any checkpoint marked complete | Axe-core clean + keyboard tabbing test on every page |
| Announcements teach bad practice | Per-checkpoint implementation | `grep data-announce [file]` shows no CSS values, hex codes, or ARIA attribute names |
| Fail example harms actual users | Content research phase — classify fail type before implementation | Demo stage passes keyboard navigation test (Tab out of demo stage reaches next page element) |
| Pass example is incomplete | Content research phase — `.md` file documents complete pass requirements | Implementation reviewer checks pass example against WCAG Understanding document |
| Dark mode corrupts contrast demos | Ongoing — demo.css token lock preservation | Toggle dark mode on every contrast checkpoint during review |
| Demo teaches wrong criterion | Content research phase — `.md` file specifies the single delta between fail and pass | Demo reviewer confirms exactly one WCAG-relevant change separates fail from pass states |
| Inline style maintenance burden | Ongoing — after first 5-10 implementations | Review for shared patterns after batch; extract to demo.css if pattern appears 3+ times |
| Code examples teach bad patterns | Content research phase — draft code examples in `.md` | Pass example code blocks reviewed against ARIA APG and MDN best practices |

---

## Sources

- Direct inspection of all 44 checkpoint HTML files in `/checkpoints/*.html`
- `assets/js/demo-toggle.js` — toggle mechanism and live region pattern
- `assets/js/checkpoint-nav.js` — navigation injection and active state
- `assets/css/base.css` — token definitions and global transitions
- `assets/css/demo.css` — demo container styles, dark mode token lock, demo state switching
- `assets/css/layout.css` — chrome structure, skip link, sticky header
- `CLAUDE.md` — project memory including known issues (announcement cleanup backlog, in-progress items)
- `.planning/PROJECT.md` — validated requirements, out-of-scope constraints, self-referential constraint statement

---
*Pitfalls research for: WCAG 2.2 educational demo site (interactive fail/pass checkpoint pages)*
*Researched: 2026-03-10*
