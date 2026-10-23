---
name: ig-story
description: Plan the day's Innovation Labs Instagram Stories - the frame sequence, which sticker goes where, and what to do with the answers - and hand static frames to insta-post-maker or motion frames to reels-maker. Use when the user says "stories", "what do we put on our story", "poll / question box idea".
version: 0.1.0
---

# ig-story

Stories go to people who already follow IL. Their job is depth and conversation, not reach.

## Daily shape (3–6 frames)

```
1     OPEN     something happening today: a real photo, a hand, a room, a screen. Not text on a flat color.
2–3   MIDDLE   the content: a moment from the session, a step, a mistake, a decision.
4     ASK      one sticker.
5     CLOSE    the answer, the outcome, or tomorrow's setup.
```

Put the ask on frame 4, not at the end, because fewer people are still watching by then.

## Stickers and what they're for

| sticker | use when |
| --- | --- |
| **Question box** | you want founders' exact words: future Reel hooks (#16), FAQ and objections. The most valuable one |
| **Poll** | a quick read on a choice ("Which session next week?") |
| **Quiz** | a common misconception IL's source actually corrects |
| **Link** | there's a real destination: applications, event page |
| **Countdown** | a real date: application close, event start |

## Rules

- Real photos and footage first. Only use approved images, and don't infer names, roles or outcomes from them (same rule as `insta-post-maker`).
- One idea per frame, large type, inside the safe area (on 1080×1920, nothing critical above ~250 px or below ~1550–1600 px).
- Never repost a feed post with no comment. Say why it's worth going back to.
- Conversations start when the follower acts first (they answer, vote or reply). Never bulk-DM people who didn't interact.

## Making the frames

- Static frames → `ilabsro-design:insta-post-maker` (static Stories), with the frame list below as the brief.
- A moving frame (a chat reveal, a countdown moment) → `ilabsro-design:reels-maker` with Story delivery constraints.
- Copy through `ilabsro-design:human-pass`.

## Output

```
STORIES · <day> · 5 frames

1  [photo: workshop room, approved]   "Day two. The whiteboard got messy."
2  [photo: sticky notes close-up]     "{{one real moment from the session notes}}"
3  [text on tint]                     "The question we heard most:"
4  [QUESTION BOX]                     "What would you test first?"
5  [text]                             "We'll answer the top three tomorrow."

After: collect the answers → next week's #16 Reel in ig-plan.
```

Nothing is posted.
