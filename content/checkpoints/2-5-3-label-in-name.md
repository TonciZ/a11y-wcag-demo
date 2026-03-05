---
id: 2.5.3
title: Label in Name
level: A
wcag_url: https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html
---

## Description

For user interface components that have labels that include text or images of text, the accessible name must contain the visible label text. This criterion ensures that when a user sees a button that says "Submit Order" and uses speech recognition software to activate it by speaking "click Submit Order," the spoken command will match the accessible name of the control. Accessible names that differ from visible labels break the connection between what the user sees and what their assistive technology recognizes.

## Fail Explanation

A failure occurs when the accessible name of a control (set via `aria-label`, `aria-labelledby`, or the element's content) does not include the visible text of the control. For example, a button that visually reads "Submit" but has `aria-label="Confirm and place order"` will fail because a speech recognition user saying "click Submit" will not find a match. Similarly, a button labelled visually as "Next" but overridden with `aria-label="Go to next step in the wizard"` breaks the label-in-name requirement unless the visible text "Next" appears somewhere within the accessible name.

## Pass Explanation

A passing implementation ensures the accessible name either exactly matches the visible label text or begins with or includes the visible label text. The accessible name may contain additional information beyond the visible text (e.g., "Submit - Place your order now") as long as it starts with or contains the visible text "Submit." The safest approach is to use native HTML labeling mechanisms (`<label>` for form controls, button text content for `<button>` elements) which automatically derive the accessible name from visible text, avoiding mismatches entirely.

## How To Test

1. Identify all interactive components with visible text labels: buttons, links, form inputs with visible labels, and custom controls.
2. Inspect each component's accessible name using browser DevTools Accessibility panel, or an accessibility inspector tool.
3. Compare the accessible name to the visible label text of the component.
4. Verify that the visible label text is contained within the accessible name (the accessible name may include additional words, but must include the visible label).
5. Test with a speech recognition tool such as Dragon NaturallySpeaking: say "click [visible label text]" and verify the correct control is activated.
6. Look for `aria-label` attributes that completely replace visible text with different wording - these are common sources of failures.

## Notes

This criterion is particularly important for speech recognition users, who activate controls by speaking their visible labels. It does not prohibit accessible names that are longer than the visible label - augmenting the accessible name with additional context is fine as long as the visible text is present within it. Acronyms and abbreviations should be treated carefully: if the visible label says "CTA" and the accessible name says "Call to Action," neither contains the other verbatim.
