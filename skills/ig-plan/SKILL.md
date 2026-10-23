---
name: ig-plan
description: Plan the Innovation Labs Instagram week - which posts, which format, which source each comes from, when, and who to engage with - grounded in approved material and past results. Use when the user says "plan the week", "what should we post", "content calendar", or "we have nothing to post".
version: 0.1.0
---

# ig-plan

This skill decides what gets made. `ig-ship` makes it. Run it once a week.

## Inputs

Read, if they exist:
- `../../voice/il-instagram-voice.md`
- `~/.claude/ilabs/instagram/log.md`, so the plan doesn't repeat a theme or a hook formula from the last two weeks;
- `~/.claude/ilabs/instagram/swipe.md` (from `ig-viral`) and the last `ig-audit` conclusions. IL's own evidence outranks every default in this file;
- `~/.claude/ilabs/reels-log.md`, so Reel families and endings rotate.

Then ask once, in one batched question, for what is actually available this week:
1. **Approved sources**: strategy or program documents, research notes, event scripts.
2. **What happened**: an event, a session, a founder question, a decision, a deadline, photos or footage.
3. **What's coming up**: applications, events, dates (only ones that may be public).

Posts come from those three. If they're thin, plan fewer posts rather than inventing angles. Run `ilabsro-design:content-planner` PLAN on any longer source to get gate-passing opportunities.

## The mix

Three to five feed posts a week, plus stories. Never two of the same type back to back.

| type | how often | job | usual format |
| --- | --- | --- | --- |
| **Teach** | 1–2 / week | one founder or innovation concept someone can use today | Reel (handwritten / process) or carousel |
| **Update** | when real | program, application, event, deadline. Facts only | Reel (direct announcement / chat) or single post |
| **Recap** | after events | real people and moments, photo- or footage-led | carousel or Reel from footage |
| **Question** | 1 / fortnight | a real founder question, answered | Reel (#16) |
| **Position** | 1 / fortnight | a point of view the source actually supports | Reel or carousel |

For each slot, give: type, the **angle** (not just a topic), the source and section, format, the hook formula id from `../../tools/il-hooks.json`, and for Reels the intended visual family (rotate them).

## When

Post when the audience is reachable: founders and builders are usually reachable early morning or early evening in their timezone. But say plainly that **timing matters far less than the first frame**. If hooks aren't working yet, posting-time tweaks are polishing the wrong thing.

## The engagement round

About 20 minutes on posting days, before posting. A list of ~10 accounts:
- **5 ecosystem**: accelerators, universities, communities and media whose audience overlaps IL's;
- **3 peers / partners**: organisations IL works with or alongside;
- **2 founders or mentors** who interact with IL.

Hand the list to `ig-community` for comments. Never pitch in comments.

## Output

```
WEEK OF <date>

TUE  08:30  REEL      TEACH     #13 Before/After    "thin input vs real material" · src: strategy §3 · family: handwritten
THU  18:00  CAROUSEL  RECAP     Job A caption       demo night photos (approved set) · 7 frames
FRI  08:30  REEL      UPDATE    #19 The Deadline    applications close <date from source> · family: direct announcement · formal-lens
STORIES     daily, 3–5 frames · question box on Wednesday (feeds next week's #16)
ENGAGE      5 ecosystem / 3 peers / 2 founders: <handles>

Say "ship Tuesday" and I'll run ig-ship on it.
```

Write it to `~/.claude/ilabs/instagram/plan.md`. Nothing is scheduled or posted. This is a plan the team runs.
