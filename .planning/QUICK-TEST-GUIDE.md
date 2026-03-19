# Quick Testing Guide — Phase 12 Manual UAT

**Print this page** and use it as a checklist during testing.

---

## Setup (5 minutes)

- [ ] Chrome browser open
- [ ] NVDA installed (https://www.nvaccess.org)
- [ ] Local site open: `file:///D:/Documents/Projects/a11y-wcag-demo/index.html`
- [ ] UAT-RESULTS.md open in text editor
- [ ] CHECKLIST.md open as reference

---

## Per Checkpoint (2–4 minutes each × 45)

### **Item 1: Demo Toggle**
- [ ] Click FAIL button → Demo shows fail example
- [ ] Click PASS button → Demo shows pass example
- **Result:** P[ ] or F[ ]

### **Item 2: Code Blocks Sync**
- [ ] Switch to FAIL mode → Scroll down → Code shows fail code
- [ ] Switch to PASS mode → Scroll down → Code shows pass code
- **Result:** P[ ] or F[ ]

### **Item 3: Announcements**
- [ ] Start NVDA
- [ ] Click FAIL button → NVDA announces "FAIL mode. [message]"
- [ ] Click PASS button → NVDA announces "PASS mode. [message]"
- [ ] Verify message is functional (no hex codes, contrast ratios, CSS properties)
- **Result:** P[ ] or F[ ]

### **Item 4: WCAG Codes**
- [ ] Scroll to "How to Pass" section
- [ ] See at least 2–3 technique codes (G80, H32, etc.)
- [ ] Click one → Opens W3C page without error
- **Result:** P[ ] or F[ ]

### **Item 5: Keyboard Navigation**
- [ ] Press Tab from top of page → Focus moves through all controls
- [ ] Focus order is logical (left→right, top→bottom)
- [ ] Tab to FAIL button → Press Enter → Fails
- [ ] Tab to PASS button → Press Enter → Passes
- [ ] All buttons have visible focus outline (blue or high-contrast)
- [ ] No keyboard traps (Tab always moves forward, Shift+Tab moves backward)
- **Result:** P[ ] or F[ ]

### **SR Announce: State Changes**
- [ ] NVDA focus mode enabled
- [ ] Tab to Fail button → Enter → NVDA says "FAIL mode. [message]"
- [ ] Tab to Pass button → Enter → NVDA says "PASS mode. [message]"
- **Result:** P[ ] or F[ ]

### **SR Headings: Page Structure**
- [ ] Press H (NVDA) → Jump to first heading
- [ ] Press H repeatedly → All headings in order (H1 > H2 > H3)
- [ ] No skipped levels
- **Result:** P[ ] or F[ ]

### **SR Controls: Form Labels**
- [ ] Press F (NVDA) → Jump to first control
- [ ] Press F repeatedly → Each control announced with label
- [ ] No "unlabeled" controls
- **Result:** P[ ] or F[ ]

### **SR Live Region: Dynamic Updates**
- [ ] If demo has dynamic content, trigger it
- [ ] NVDA announces update immediately (no Tab needed)
- [ ] N/A if no dynamic content
- **Result:** P[ ] or F[ ]

---

## Failure Reporting

**When Item Fails:**

1. Note the checkpoint ID (e.g., "1.1.1")
2. Note the failed item (1, 2, 3, 4, 5, or SR check name)
3. Describe what failed (e.g., "Focus outline invisible on button")
4. Report to Claude with: Checkpoint ID + Item # + Failure description

**Claude will:** Fix code → Push to dev → You pull → Re-test

---

## Checkpoint Testing Order

Print checkpoints in order (helps track progress):

**Perceivable (17):** 1.1.1 → 1.2.1 → 1.2.2 → 1.3.1 → 1.3.2 → 1.3.3 → 1.3.4 → 1.3.5 → 1.4.1 → 1.4.2 → 1.4.3 → 1.4.4 → 1.4.5 → 1.4.10 → 1.4.11 → 1.4.12 → 1.4.13

**Operable (16):** 2.1.1 → 2.1.2 → 2.1.4 → 2.2.2 → 2.4.1 → 2.4.2 → 2.4.3 → 2.4.4 → 2.4.6 → 2.4.7 → 2.4.11 → 2.4.13 → 2.5.2 → 2.5.3 → 2.5.7 → 2.5.8

**Understandable (10):** 3.1.1 → 3.1.2 → 3.2.1 → 3.2.2 → 3.2.6 → 3.3.1 → 3.3.2 → 3.3.3 → 3.3.7 → 3.3.8

**Robust (2):** 4.1.2 → 4.1.3

---

## Time Tracking

- **Start Time:** \_\_\_\_\_\_\_\_\_\_\_
- **Checkpoints Tested:** \_\_\_\_ / 45
- **Failures Found:** \_\_\_\_
- **Current Checkpoint:** \_\_\_\_\_\_\_\_\_\_\_
- **Next Checkpoint:** \_\_\_\_\_\_\_\_\_\_\_

---

## Tips

1. **Keyboard Testing:** If a button doesn't respond to Enter, it's probably not a real `<button>` element. Mark as FAIL (Item 5).

2. **Focus Outlines:** Look for a blue or high-contrast border around the focused element. If invisible, mark as FAIL (Item 5).

3. **NVDA Announcements:** Don't expect perfect English. NVDA may say "Button FAIL mode..." which is acceptable. Just verify the announcement is heard.

4. **Live Regions:** Some checkpoints may not have dynamic content. Mark as N/A (not applicable) for SR Live Region if no dynamic content exists.

5. **Code Sync:** If code doesn't visually change between FAIL and PASS, that's a FAIL (Item 2).

6. **Tab Order:** After pressing Tab through all controls, press Tab one more time. Focus should cycle to first control (or stay on page, not jump to next page).

---

## Commit Naming

When Claude fixes issues, commits will follow this pattern:

```
fix([checkpoint-code]): description of fix
docs(phase-12): add/update testing notes
```

Example:
```
fix(2-1-1): improve focus outline visibility for button
fix(1-1-1): sync code blocks between fail/pass modes
```

---

## Questions?

Refer to:
- `.planning/12-01-PLAN.md` — Full testing procedure
- `.planning/CHECKLIST.md` — Item definitions
- `CLAUDE.md` — Project rules and accessibility standards

---

**Page Created:** 2026-03-19
**Last Updated:** 2026-03-19
