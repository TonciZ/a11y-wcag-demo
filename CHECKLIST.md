# Checkpoint Implementation Checklist

**Usage:** During Phase 3 implementation, the developer self-checks all five items before marking a checkpoint task done. `/gsd:verify-work` then confirms each item independently before closing the task.

This checklist does not apply to research files — only to completed HTML checkpoint pages.

---

## Item 1 — Demo Toggle Works

**What to check:**

1. Click the toggle button on the checkpoint page.
2. Confirm the demo area switches from fail state to pass state (and back).
3. Confirm the `aria-pressed` attribute on the toggle button updates to `"true"` when showing the pass state, and `"false"` when showing the fail state.
4. Confirm the correct demo panel is visible and the other is hidden after each toggle.
5. Confirm the button label updates to reflect the current action (e.g., "Show pass example" / "Show fail example").
6. Open the browser console and confirm no JavaScript errors are thrown.

**Pass condition:** All steps complete without errors.

---

## Item 2 — Code Block Syncs with Demo State

**What to check:**

1. Confirm a code block is present adjacent to or within the demo area.
2. Toggle the demo between fail and pass states.
3. Confirm the code block text changes synchronously with each toggle — fail state shows failing code, pass state shows corrected code.
4. Confirm the code block remains readable: monospace font, no text overflow, sufficient contrast.

**Pass condition:** Code block text changes synchronously with mode toggle; is readable (monospace font, sufficient contrast).

---

## Item 3 — Screen Reader Announcements Use Functional Language

**What to check:**

1. Locate the `data-announce-fail` and `data-announce-pass` attribute values on the demo container.
2. Check each value for visual property language. The following are NOT allowed:
   - Color names (e.g., "red", "grey", "blue")
   - Hex codes (e.g., `#FFFFFF`, `#333`)
   - Contrast ratios or "to 1" phrases (e.g., "3.5 to 1", "4.5:1")
   - CSS property names (e.g., "border", "background", "color", "font-weight")
3. Confirm the announcement describes the behavior or user impact instead.

Example of a passing announcement:
- `data-announce-fail="Form controls are difficult to locate against the background"`
- `data-announce-pass="Form controls have clearly visible boundaries"`

**Pass condition:** No visual properties found in announcement text; both announcements describe functional impact on the user.

---

## Item 4 — WCAG Technique Codes Displayed

**What to check:**

1. Locate the technique codes section on the checkpoint page (H-series, F-series, or ARIA-series).
2. Confirm at least one technique code is visible in rendered page content.
3. Confirm the codes are human-readable — they must not be hidden inside HTML comments or `display: none` elements.

**Pass condition:** Technique codes are present and visible to a sighted user reading the page.

---

## Item 5 — Keyboard Navigation — No Trap, Logical Order

**What to check:**

1. Place keyboard focus before the demo area and Tab through all interactive elements.
2. Confirm Tab reaches every button, link, and form control in the demo.
3. Confirm Tab can exit the demo area and continue to the next section without getting stuck.
4. Confirm the tab order is logical — follows the visual reading order of the page.

**Special case — structural failure demos:** A demo that demonstrates a keyboard trap (2.1.2) or broken focus order (2.4.3) must use a code-display-only approach. Show the broken HTML in a `<pre><code>` block. Do not implement the live broken interaction — doing so would harm keyboard users visiting the page.

**Pass condition:** No focus trap; logical tab order throughout the full page.
