---
name: ig-viral
description: Research what is working right now for accounts in Innovation Labs' space - rank their Reels by how far each beat its own account's median, name the hook formula, and write a swipe file IL can build from. Use when the user asks "what's working", "find viral Reels in our niche", "build a swipe file", or "reverse engineer this account".
version: 0.1.0
---

# ig-viral

The research skill. Run it monthly, not daily.

```bash
python3 ../../tools/swipe.py captured.tsv --out ~/.claude/ilabs/instagram/swipe.md
```

`swipe.py` (adapted from Jake Schincariol's MIT-licensed `instagram-agent-skill`) computes each Reel's **outlier multiple** (views ÷ that account's own median), names the hook formula using all 27 formulas in `../../tools/il-hooks.json`, scores the hooks and compares the top third with the bottom third.

## Why the outlier multiple

Raw views mostly measure follower count. A 4k-follower account doing 400k views found something. A 2M account doing 400k had a quiet day. Above **3×** is a signal. Below **1.5×** teaches nothing.

## Step 1: pick accounts (6–12, approved by the human)

- **4 direct**: accelerators, incubators, university innovation programs and founder communities slightly ahead of IL.
- **4 adjacent**: different field, same audience (founder education, product, research communication). This is where formats come from before the niche has them.
- **2–4 outsized**: much larger accounts, studied for format only, never for tone or cadence.

Also ask the team to open IL's **Saved** collection. It's already filtered by taste.

## Step 2: read, at human speed

Use whatever browser tool this session has, with the user present and already logged in. **Never log in on their behalf or ask for a password.** This is reading, not scraping: ~10 accounts, about a dozen Reels each. Never build a crawler, use a scraping service or loop it in the background, because automated collection breaks Instagram's terms and gets accounts blocked.

Capture per Reel: `account  followers  median  views  hook` (the hook is the first on-screen or spoken line, verbatim), plus length and CTA if visible. Median = eyeball the last 12 Reels and take the middle.

**Copy the formula, never the content.** The structure, hook shape and pacing, not their script, visuals or footage. Attribute every row.

## Step 3: rank it

Write a TSV with the header `account	followers	median	views	hook`, then run `swipe.py`.

## Step 4: report carefully (three things, no more)

1. **Which formulas over-index in the top third**, with counts. Something that appears four or more times across several accounts is a finding. Twice is not.
2. **What the top third share structurally**: hook length, visual vs. spoken payoff, motion in the first frame, where the ask sits.
3. **The unclassified hooks.** Read them by hand. They're either noise or a formula `il-hooks.json` doesn't have yet. If it's a new formula, propose an entry with an honest `il_use`.

State the sample size and the confidence plainly. 40 Reels across 6 accounts supports a claim. 12 doesn't.

## Step 5: make it usable

For the top formulas that are IL-allowed (`yes`/`adapt`), write **IL's version**: a hook from IL's own approved material, in the shape that's working. Hand it to `ig-hooks` / `ig-ship`. A formula that's working but marked `no` stays a note, not a plan.

`ig-hooks`, `ig-plan` and `ig-ship` read `swipe.md`. After one run, the rest of the plugin works from evidence instead of defaults.

Nothing is posted, followed, liked or messaged by this skill.
