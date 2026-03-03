---
id: 2.2.2
title: Pause, Stop, Hide
level: A
wcag_url: https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html
---

## Description

For any moving, blinking, or scrolling content that starts automatically, lasts more than five seconds, and is presented alongside other content, users must be provided a mechanism to pause, stop, or hide it. Similarly, for any content that auto-updates, users must be able to pause, stop, hide, or control the frequency of updates. This criterion protects users who are distracted or disoriented by motion, and users who need extra time to read static content.

## Fail Explanation

A failure occurs when animated banners, carousels, scrolling tickers, auto-playing video, or live-updating feeds start without user initiation and run indefinitely with no pause, stop, or hide control available. Users with attention deficit disorders, cognitive disabilities, or vestibular disorders may be unable to focus on or read any other content on the page while the animation is active. Screen reader users may also find that auto-updating regions interrupt or conflict with their reading flow.

## Pass Explanation

A passing implementation provides a clearly labeled, keyboard-accessible Pause or Stop button adjacent to the animated content. Alternatively, the animation may be set not to start automatically, or the content may be designed to stop within five seconds. Auto-updating live regions (such as a news ticker or score feed) must offer a control to pause updates or allow the user to choose a slower refresh interval.

## How To Test

1. Load the page and observe whether any content moves, blinks, scrolls, or auto-updates on its own.
2. Measure approximately how long the motion lasts — if it exceeds five seconds and runs alongside other content, a control is required.
3. Look for a Pause, Stop, or Hide button near the animated content and verify it is keyboard accessible (Tab to it and press Enter or Space).
4. Activate the pause control and confirm the animation actually stops or freezes.
5. If a Stop control is present, confirm it permanently halts the animation (unlike Pause, which is temporary).
6. For auto-updating content (news feeds, live scores), check whether a control allows the user to pause updates or change the update frequency.
7. Verify that hiding or stopping the content does not remove other essential information from the page.

## Notes

This criterion does not apply to animations that are essential to the content — for example, a progress indicator that must move to convey status, or an animation that is the only means of conveying information. Prefers-reduced-motion CSS support is a good complementary technique but does not on its own satisfy this criterion.
