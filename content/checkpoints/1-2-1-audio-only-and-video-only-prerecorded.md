---
id: 1.2.1
title: Audio-only and Video-only (Prerecorded)
level: A
wcag_url: https://www.w3.org/WAI/WCAG22/Understanding/audio-only-and-video-only-prerecorded.html
---

## Description

For prerecorded audio-only content, a text transcript must be provided that presents the same information as the audio. For prerecorded video-only content (no audio track), either a text alternative or an audio track must be provided that presents equivalent information. This criterion ensures that people who are deaf, hard of hearing, or blind can access the content of standalone audio and video media.

## Fail Explanation

A failure occurs when a podcast episode, audio clip, or silent video is published without an equivalent alternative. For example, a podcast page with no transcript means deaf and hard-of-hearing users have no access to the spoken content. A silent product demonstration video with no text description or narration track means blind users cannot understand what the video shows.

## Pass Explanation

A passing implementation for audio-only content provides a full transcript - not just a summary - that includes all spoken dialogue and relevant non-speech sounds. For video-only content, the author either provides a text description of what occurs in the video (including actions, scene changes, and on-screen text) or adds an audio description track that narrates the visual content.

## How To Test

1. Identify all audio-only and video-only media on the page.
2. For audio-only content, check that a text transcript is available on the page or linked from the page.
3. Verify the transcript includes all spoken words and relevant non-speech sounds (e.g., "[applause]", "[alarm sounds]").
4. For video-only content, check whether a text description or audio description track is provided.
5. Verify the text description covers all visual information including actions, on-screen text, and scene context.
6. Confirm the alternative is clearly labeled and easy to find in proximity to the media player.

## Notes

This criterion applies only to prerecorded content; live audio-only and live video-only are covered separately. If a video has both audio and video tracks, it falls under the captions and audio description criteria rather than this one.
