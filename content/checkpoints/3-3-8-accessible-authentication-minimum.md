---
id: 3.3.8
title: Accessible Authentication (Minimum)
level: AA
wcag_url: https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html
---

## Description

Cognitive function tests must not be required at any step of an authentication process, unless the test provides at least one of the following: an alternative authentication method that does not rely on a cognitive function test; a mechanism to assist the user in completing the cognitive function test; or the cognitive function test involves recognising objects or identifying non-text content the user previously provided to the website. A cognitive function test is anything that requires the user to remember, transcribe, or solve something — including traditional text-based CAPTCHA, knowledge-based security questions, or mathematical puzzles. This new WCAG 2.2 criterion directly addresses authentication barriers for users with cognitive disabilities.

## Fail Explanation

A login page that requires users to solve a distorted text CAPTCHA with no accessible alternative (such as an audio CAPTCHA or a simple "I'm not a robot" checkbox backed by behaviour analysis) fails this criterion. Similarly, a security checkpoint that asks users to recall which city they were born in, their mother's maiden name, or any other memorised fact — without offering an alternative path — presents a barrier to users with cognitive impairments, amnesia, or brain injuries. Traditional knowledge-based authentication questions are a particularly common source of failure.

## Pass Explanation

An authentication process passes when it does not require any cognitive function test, or when any such test is accompanied by at least one accessible alternative. Acceptable approaches include: password manager-compatible password fields (which support copy-paste and autofill, avoiding the need to memorise); email or SMS one-time codes (which are sent to the user rather than requiring recall); passkeys and biometric authentication; and object-recognition tasks that use images the user previously uploaded themselves. A compliant CAPTCHA must offer a non-cognitive alternative such as an audio challenge or a behaviour-based check.

## How To Test

1. Identify all steps in the site's authentication and account recovery flows (login, two-factor authentication, password reset, account unlock).
2. For each step, determine whether a cognitive function test is required: CAPTCHA, knowledge question, memorised PIN, or puzzle.
3. If a cognitive function test is present, check whether an alternative method that does not require cognitive function is available.
4. Test that password fields support copy-paste and browser autofill (do not block the clipboard or disable autocomplete for the password field).
5. Check whether the site supports a password manager-friendly login flow (standard `<input type="password">` with appropriate `autocomplete` attribute values).
6. If a CAPTCHA is used, verify that an audio or non-text alternative is offered alongside it.
7. For account recovery flows, check that users are not required to answer knowledge-based questions as the sole recovery method.

## Notes

This criterion is at Level AA; WCAG 2.2 also includes 3.3.9 Accessible Authentication (Enhanced) at Level AAA which removes all cognitive test exceptions. Importantly, this criterion does not prohibit passwords — it prohibits requiring users to memorise or transcribe credentials without any accessible alternative or support mechanism.
