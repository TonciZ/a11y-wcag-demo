---
id: 1.4.2
title: Audio Control
level: A
wcag_url: https://www.w3.org/WAI/WCAG22/Understanding/audio-control.html
---

## Description

If any audio on a web page plays automatically for more than three seconds, the user must be able to pause or stop the audio, or control the audio volume independently of the overall system volume. Audio that starts playing without user initiation can interfere with screen readers, which are also audio-based, making it very difficult for blind and low-vision users to hear and operate the page. It can also cause significant distress to users with cognitive disabilities or sensory sensitivities.

## Fail Explanation

A failure occurs when audio begins playing automatically on page load and continues for more than three seconds without providing the user a mechanism to stop, pause, or mute it. A common example is a homepage with a background music track or an auto-playing promotional video with audio. When a screen reader user lands on such a page, the auto-playing audio overlaps with the screen reader's speech output, making it nearly impossible to navigate the page and find the stop control.

## Pass Explanation

A passing implementation either avoids auto-playing audio entirely, or provides a mechanism at the very beginning of the page (before any auto-playing content) that allows the user to pause, stop, or mute the audio. Placing the control early in the page ensures screen reader users can find and operate it before the auto-playing audio makes navigation impossible. Alternatively, the audio can be limited to three seconds or less.

## How To Test

1. Load the page and listen for any audio that begins playing automatically.
2. If audio auto-plays, check whether it stops on its own within three seconds.
3. If audio continues beyond three seconds, look for a mechanism to pause, stop, or mute it.
4. Verify the audio control mechanism appears near the top of the page and is reachable via keyboard before the audio source.
5. Use a screen reader and attempt to navigate to the audio control while audio is playing, to verify the control is findable and operable.
6. Test that the control actually stops or mutes the audio when activated.

## Notes

Screen reader users are the most severely impacted by auto-playing audio, as audio output from the page can mask the screen reader's own speech. Best practice is simply to not auto-play audio unless the user has clearly initiated it. Where auto-play is used, ensuring the stop or mute control is the first focusable element on the page is a practical approach.
