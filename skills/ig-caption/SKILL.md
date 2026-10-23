---
name: ig-caption
description: Write and lint the Instagram caption for an Innovation Labs post or Reel - the ~125 visible characters, the body, one ask, search terms and at most three hashtags - in IL voice. Use when a Reel or carousel is ready and needs its caption, or the user asks about captions or hashtags.
version: 0.1.0
---

# ig-caption

```bash
python3 ../../tools/caption.py caption.txt --keywords "startup validation,founder program"
```

It prints what the feed shows before "... more" and checks length, the first line, concreteness, hashtags (platform cap 5, **IL cap 3**), tag placement, dead links, one ask, emoji, search terms, and IL house rules (no exclamation marks, no emoji). The linter is adapted from Jake Schincariol's MIT-licensed `instagram-agent-skill`.

## Decide the job first

- **Job A: the asset already hooked them.** Reels and carousels carry their own hook on screen. The caption doesn't repeat it. It gives context, the one ask, the search phrases and, where it belongs, the quiet evidence note.
- **Job B: the caption is the content.** A single photo or a recap image. Line one is the hook, written like an on-screen hook, concrete and complete inside ~125 characters.

Say which job you're writing, and why.

## Shape

```
Line 1     ≤ ~125 characters. Job A: the point or the ask, plainly. Job B: the hook.
           Never a greeting, a hashtag, a mention or an emoji first.
Body       2–5 short paragraphs, a blank line between them. The search phrases live here,
           written as a person would type them.
Source     when relevant: one quiet line, e.g. "Based on practitioner guidance, not a formal study."
Ask        one. Save it, comment a real question, or go to a named destination.
Tags       0–3 specific topic labels on the last line. Never #viral, #fyp, #explore.
```

Most IL captions need 300–700 characters, not 2,200.

## Facts behind the rules

- Instagram capped hashtags at five per post in December 2025. Hashtags are topic labels, not a reach lever. IL uses three at most.
- Caption text is read by Instagram search, so the phrase IL wants to be found for goes in a normal sentence.
- Links in captions aren't clickable. Use the bio or a story link sticker, and say that in the ask.

## The loop

1. Read `../../voice/il-instagram-voice.md` and the asset's brief. Keep every boundary and caveat class from the brief.
2. Draft it in the right lens (`friendly-lens` by default, `formal-lens` for applications, deadlines and partners).
3. Run `ilabsro-design:human-pass` on it. Captions are prose, so `detect.py` is meaningful here: aim for PASS. If only SPECIFICITY fails because the source has no concrete detail, follow the exception in `human-pass` and say so. Never invent a detail.
4. Run `caption.py` with 2–3 search phrases. Fix every FAIL. Decide on every WARN out loud. "HOOK IS CONCRETE" may stay WARN for Job A when the source has no number, but never invent one.
5. Print the caption in a copy-ready block, then:

```
CAPTION READY
job:        A, the Reel carries the hook
visible:    112 of 125 characters before the cut
ask:        one, save it
tags:       2
search:     "AI for founders" in line 2, "startup strategy" in line 4
human-pass: 0 lexicon hits · detect PASS 74
linter:     READY
```

Alt text: for carousels and photos, write one plain sentence describing what the image shows.

Nothing is posted. The human pastes it.
