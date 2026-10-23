# Innovation Labs Instagram (`ilabsro-instagram`)

Strategy and operations for Innovation Labs on Instagram. It decides **what** to say, **when**, and **with which hook**, and it keeps the record of what was posted and what worked.

It does **not** design anything. Every visual, Reel, color, font and logo decision belongs to **`ilabsro-design`**, which must be installed alongside this plugin:

| layer | plugin | skills |
| --- | --- | --- |
| what to say, when, hook, caption, log | `ilabsro-instagram` | `ig-ship`, `ig-hooks`, `ig-caption`, `ig-plan`, `ig-repurpose`, `ig-story`, `ig-viral`, `ig-audit`, `ig-profile`, `ig-community` |
| brief, visuals, Reels, voice, copy check | `ilabsro-design` (v0.7.0+) | `content-planner`, `reels-maker`, `insta-post-maker`, `brand-image-maker`, lenses, `human-pass` |

## Start here

- **"Make a Reel about X" / "ship Tuesday"** → `ig-ship`: source → format → scored hooks → brief → `reels-maker` / `insta-post-maker` → `human-pass` → caption → cover → review block. Nothing is posted.
- **"Plan the week"** → `ig-plan` · **"Repurpose this document"** → `ig-repurpose` · **"What's working?"** → `ig-viral` (other accounts) or `ig-audit` (IL's own insights).

First run: fill the "Fill in with real material" section of `voice/il-instagram-voice.md` from 3–5 real IL posts.

## Shared files

```
voice/il-instagram-voice.md   IL voice rules for Instagram (derived from the ilabsro-design design system)
tools/il-hooks.json           27 hook formulas, each with il_use (yes / adapt / no) + il_note; #27 added for IL
tools/hooks.py                browse IL-allowed formulas, classify a hook
tools/hookscore.py            hook filter (catches weak hooks; not a performance predictor)
tools/caption.py              caption linter + IL house rules (≤3 tags, no exclamation marks, no emoji)
tools/swipe.py                rank captured Reels by outlier multiple, classify hook formulas
tools/rubric.json             12-part profile rubric, organisation edition
```

Python 3 standard library only. No network, no API keys, nothing uploaded.

## State (per user, outside the plugin)

```
~/.claude/ilabs/instagram/plan.md    ig-plan
~/.claude/ilabs/instagram/swipe.md   ig-viral (+ ig-audit "IL's own evidence")
~/.claude/ilabs/instagram/log.md     ig-ship (one line per approved post), ig-community notes
~/.claude/ilabs/reels-log.md         written by ilabsro-design:reels-maker
```

## What this plugin never does

It never posts, schedules, likes, follows, comments or DMs, never logs into Instagram, and never scrapes. It never invents numbers, quotes, names, dates or outcomes. Research is reading at human speed with the user present.

## Credits

The scripts in `tools/` and parts of the skill guidance are adapted from [instagram-agent-skill](https://github.com/Jakeschincariol/instagram-agent-skill) by Jake Schincariol (MIT, see `LICENSE-instagram-agent-skill.txt`). Changes: an Innovation Labs voice layer, `il_use`/`il_note` on every hook formula plus formula #27, an organisation profile rubric, IL house checks in `caption.py`, and merged community skills. Reel scripting and humanizing moved to `ilabsro-design` (`reels-maker`, `human-pass`).

## Validated example

`examples/ship-test-my-thinking/` is a full `ig-ship` run through both plugins: scored hooks (round 1 rejected a weak hook), brief, a rendered Reel (`out/test-your-thinking.mp4`), human-pass, a caption linted READY, the cover check, and the review block. `ship.md` lists what the test caught and what changed in the plugins because of it.
