---
id: 1.2.2
title: Captions (Prerecorded)
level: A
wcag_url: https://www.w3.org/WAI/WCAG22/Understanding/captions-prerecorded.html
---

## Description

Captions must be provided for all prerecorded audio content in synchronized media. Synchronized media refers to audio paired with video, such as a film, webinar recording, or instructional video. Captions are a text version of the audio that is synchronized with the video, allowing deaf and hard-of-hearing users to follow both the spoken content and relevant non-speech audio information.

## Fail Explanation

A failure occurs when a video that contains speech or meaningful audio is published without synchronized captions. Auto-generated captions that have not been reviewed and corrected are generally not sufficient, as they often contain errors that make them unusable or misleading. A video with no captions at all leaves deaf and hard-of-hearing users with no way to access the spoken dialogue or audio cues.

## Pass Explanation

A passing implementation provides accurate, synchronized captions that include all spoken dialogue, identify speakers when more than one person is speaking, and convey relevant non-speech audio such as "[music]" or "[phone ringing]". Captions must be synchronized closely enough with the audio that they do not cause confusion, and they must be presented in a format that can be enabled by the user.

## How To Test

1. Locate all synchronized media (video with audio) on the page.
2. Check whether a captions option is available in the media player controls.
3. Enable captions and play a portion of the video to verify they are synchronized with the audio.
4. Check that all spoken dialogue is accurately represented in the captions.
5. Verify that speaker identification is included when multiple speakers are present.
6. Confirm that meaningful non-speech audio (e.g., sound effects, music cues) is described in the captions.
7. Check whether the captions are open (always visible) or closed (user-controlled); both are acceptable, but closed captions must be easy to enable.

## Notes

Auto-generated captions from platforms such as YouTube are not automatically compliant; they must be reviewed and corrected for accuracy before they can be considered sufficient. This criterion does not apply to media that is itself a text alternative for other content, such as a video version of a text document.
