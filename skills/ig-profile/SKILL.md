---
name: ig-profile
description: Score the Innovation Labs Instagram profile out of 100 against a 12-part rubric (name field, bio, link, highlights, pinned three, grid) and rewrite the parts that lose points, in IL voice. Use when the user says "optimize our profile", "fix the bio", "score our Instagram", or audits show views without follows.
version: 0.1.0
---

# ig-profile

The profile is a decision screen. Someone arrives from one Reel and gives it about three seconds to answer: *is there more of this, and is it for me?*

## Input

A screenshot or paste of: the name field, handle, bio, link destination, highlight names, pinned posts and the first nine grid covers. Never log in on the user's behalf.

## Score it

Read `../../tools/rubric.json` (adapted from Jake Schincariol's MIT-licensed `instagram-agent-skill`, Innovation Labs edition for an organisation profile). Score all 12 items, show the table and give the total. Be honest. First passes usually land in the 30s–40s, and a generous score is useless.

## Rewrite in order of points lost

1. **Name field (30 chars).** It's searchable. `Innovation Labs | {what IL is, in words founders search}`. Give three options using only claims IL can stand behind.
2. **Bio line one.** Who it's for and what changes for them. No pipes, no adjectives, no emoji (IL voice).
3. **Pinned three.** What IL is and who it's for · the strongest real proof (a recap with approved people and outcomes) · the current call to action (applications or next event).
4. **Highlights (4–6).** Named for what founders and partners ask: Program, Apply, Events, Stories, FAQ, Partners. Covers made with `ilabsro-design:insta-post-maker` (consistent IL treatment, official logo rules).
5. **Link.** One destination that matches the bio promise.
6. **Grid covers.** Reel covers chosen deliberately (`reels-maker` exports `cover-4x5.jpg`, which is exactly the grid crop). A short readable line on the cover helps the grid read at a glance.

Run every rewrite through `ilabsro-design:human-pass` and give copy-ready blocks.

## Output

Score table, the fix-first rewrites, then a re-score with an honest delta. If the rewrite reaches 82 and not 98, say 82 and what the rest needs (usually pinned posts that don't exist yet, a grid habit and a story habit, none of which is a rewrite).

Nothing is changed on Instagram by this skill. The team edits each field.
