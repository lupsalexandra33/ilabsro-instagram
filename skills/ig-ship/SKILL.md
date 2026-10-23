---
name: ig-ship
description: Take one Innovation Labs idea or source all the way to a review-ready Instagram post - format, scored hooks, brief, the branded asset (Reel MP4 or carousel via ilabsro-design), human-pass, caption and cover - in one run. Use when the user says "make a post/Reel about X", "ship this to Instagram", "turn this into a Reel", or names a planned slot ("write Tuesday").
version: 0.1.0
---

# ig-ship

The orchestrator. It connects the two plugins:

- **`ilabsro-instagram`** (this plugin) decides *what* to say on Instagram: angle, hook, caption, timing. It also keeps the log.
- **`ilabsro-design`** decides *how it looks*: `content-planner` writes the brief, `reels-maker` / `insta-post-maker` build the asset, the lenses set the voice and `human-pass` checks the copy.

This plugin never draws, lays out or animates anything itself, and never restates brand rules. If `ilabsro-design` is not installed in this session, stop and say so. Don't produce off-brand visuals as a substitute.

## Read first

1. `../../voice/il-instagram-voice.md`
2. `~/.claude/ilabs/instagram/plan.md`, `swipe.md` and `log.md` if they exist (written by `ig-plan`, `ig-viral` and this skill).
3. `~/.claude/ilabs/reels-log.md` if the output may be a Reel (written by `reels-maker`).

## The run

**1. Ground the source.** Every post needs one specific true thing from approved material: a document, an event, a program fact, a real question from a founder. If the user gives only a topic, ask once for the source or the real detail. With a longer source, run `ilabsro-design:content-planner` in PLAN mode and let the human pick. A direct request with a usable, approved idea can skip PLAN.

**2. Pick the format and say why in one line.**
- Reel: the idea has a reveal, a correction, a conversation or a process that changes over time. It is also how IL reaches non-followers.
- Carousel: the idea has steps or parts people will re-read or save.
- Single post: one statement or one strong photo.
- Stories: daily, depth with existing followers (hand to `ig-story`).

**3. Hooks.** Run `ig-hooks`: three candidates from three *different* IL-allowed formulas, scored with `../../tools/hookscore.py`. Show the ranking and pick one. The score is a filter for weak hooks, not a predictor (see `ig-hooks`). A human preference outranks it.

**4. Brief.** Build a compact brief for the maker: goal, audience, key message, the chosen hook (on-screen line), content requirements, content boundaries, caveat visibility class, CTA constraint, and any approved photos or footage. For PLAN output, use `content-planner` BRIEF mode. For a direct request, write the same fields yourself and keep the source excerpt attached.

**5. Make the asset with `ilabsro-design`.**
- Reel → `ilabsro-design:reels-maker`. It uses the IL Reel Kit (`production/`), renders the MP4 and runs its own quality gate. Pass the hook as the opening frame text, and mention the recent family/ending from the Reels log so it varies.
- Carousel / single / static story → `ilabsro-design:insta-post-maker` (plus `brand-image-maker` when a drawing replaces copy).
- Choose the lens (`friendly-lens`, `formal-lens`, `jokey-lens`) from the voice file defaults.

**6. Human pass.** `ilabsro-design:human-pass` on the on-screen copy (`<name>.onscreen.txt` for Reels) and on the caption draft. Rewrite every flag by hand. Run its `design_tells.py` on the asset's HTML (`reel.html` / the carousel page) for the visual AI tells in `design-system/AI_TELLS.md`.

**7. Caption.** Run `ig-caption`. For a Reel, the video already carries the hook (Job A). For a carousel, the cover does it, so the caption is mostly Job A too. For a single image, it's Job B. Lint with `../../tools/caption.py`.

**8. Cover.** For a Reel, check `<name>.cover-4x5.jpg`: the grid crop must show the hook. For a carousel, frame 1 is the cover.

**9. Ship block.** Publish the live Artifact preview (`reels-maker` → `export-artifact.mjs`, or the carousel page from `insta-post-maker`) so the team can review and comment, print the summary below, deliver the files, and stop. Never post, schedule or message anything.

```
READY FOR REVIEW
format:     Reel, 1080x1920, 27.0s, silent (add audio in-app if wanted)
source:     <document / brief and section>
hook:       #18 Cold Open Demo, "I'll just ask AI for the plan." (score 64 OK)
asset:      <name>.mp4 · lint clean · reels-maker gate passed
cover:      <name>.cover-4x5.jpg (hook readable in grid crop)
preview:    live Artifact link (review / share; the MP4 is what gets posted)
copy:       human-pass: 0 lexicon hits, 0 open flags · design_tells: clean
caption:    Job A · 118/125 visible · one ask · 2 tags · caption.py READY
check:      <facts / CTAs / names a human must confirm>

Reply "approved" to log it, or tell me what to change.
```

**10. On approval**, append one line to `~/.claude/ilabs/instagram/log.md` (create the folder if missing):

```
- 2026-10-23 | reel | #18 Cold Open Demo | "I'll just ask AI for the plan." | source: test-my-thinking | file: test-thinking.mp4
```

`reels-maker` appends its own visual entry to `~/.claude/ilabs/reels-log.md`. `ig-audit` later joins the log with real insights.

## Rules

- One idea per post. If the source has two, that's two posts. Say so and plan the second.
- Never fabricate to fill a template: no numbers, quotes, names, dates or outcomes the source doesn't support. Illustrative examples are labelled as illustrative.
- The design plugin owns every visual decision. Don't override `reels-maker` or `insta-post-maker` on layout, color or motion. Pass constraints, not designs.
- Ask at most one batched question at the start. After that, decide and note the decision in the ship block.
