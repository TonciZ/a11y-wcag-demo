---
id: 1.3.3
title: Sensory Characteristics
level: A
wcag_url: https://www.w3.org/WAI/WCAG22/Understanding/sensory-characteristics.html
---

## Description

Instructions provided for understanding and operating content must not rely solely on sensory characteristics of components such as shape, color, size, visual location, orientation, or sound. When instructions depend entirely on one sensory property, users who cannot perceive that property — such as blind users, colorblind users, or users who are deaf — cannot follow the instruction. Additional non-sensory identifiers such as a label or text name must accompany any sensory reference.

## Fail Explanation

A failure occurs when an instruction requires the user to perceive a specific sensory characteristic in order to act. Examples include instructions such as "click the round button", "use the blue link on the right", "see the form below", or "press the button that makes a chime sound". A screen reader user cannot determine which button is "round", a colorblind user cannot identify "the blue link", and a deaf user cannot hear "the chime sound", making these instructions inaccessible.

## Pass Explanation

A passing implementation supplements sensory references with non-sensory identifiers. For example, "click the Submit button (the round button at the bottom of the form)" provides both a text label and a sensory description, so any user can locate the control regardless of their ability to perceive shape or position. The instruction "select your preferred color using the color picker labeled 'Theme color'" passes because the label is provided as a non-sensory identifier.

## How To Test

1. Read through all instructions and help text on the page for references to shape, color, size, position, or sound.
2. For each sensory reference found, check whether a non-sensory identifier (such as a text label, name, or heading) is also provided.
3. Test with a screen reader to verify that elements referenced by shape or position can be located based on the provided alternative identifiers.
4. Check whether any instructions rely on sound alone (e.g., "when you hear the beep") and verify a non-auditory cue is also described.
5. Review error messages, tooltips, and contextual help text for sensory-only references.

## Notes

This criterion is often overlooked in instructional content and onboarding flows where authors assume visual context. It is distinct from 1.4.1 Use of Color, which specifically addresses when color alone is used to convey information; this criterion covers all sensory modalities.
