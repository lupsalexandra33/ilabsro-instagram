---
name: ig-repurpose
description: Turn one long Innovation Labs asset - a strategy document, talk, workshop recording, newsletter, report or event script - into a set of standalone Instagram posts, each traced to the source. Use when the user says "repurpose this", "turn this into posts/Reels", or shares something long for Instagram.
version: 0.1.0
---

# ig-repurpose

One good long source usually holds three to six posts. Repurposing is **extraction with traceability**, not summarising.

## Step 1: run the planner, don't skip it

Run `ilabsro-design:content-planner` in **PLAN** mode on the source. It extracts candidates, applies the source-fidelity and distinctness gates, scores them and returns at most five opportunities, each with a verbatim excerpt. That output is the raw material. Don't re-extract by hand in parallel.

If the source is a recording IL owns, ask for the file as well: real footage of the moment beats a re-staged graphic. Put it in the Reel's `media/` folder for `reels-maker`.

## Step 2: add the Instagram layer to each opportunity

For each gate-passing opportunity, add:

| field | rule |
| --- | --- |
| **format** | Reel for a claim, correction, conversation or process that changes over time. Carousel for steps, a framework or anything worth saving. A story frame for a single quotable line |
| **hook formula** | one IL-allowed id from `../../tools/il-hooks.json`, with different formulas across the set |
| **visual family** (Reels) | handwritten / chat / process / footage-led / direct announcement, rotated against `~/.claude/ilabs/reels-log.md` |
| **standalone check** | the viewer has never seen the source. Never write "as we said in our talk" |

If the planner returns fewer than three, the source is thin. Say so instead of stretching it.

## Step 3: order the set

Strongest, clearest idea first. A story or recap mid-week. The deepest framework last, when the earlier posts have built interest.

## Output

```
SOURCE: <name> (<length>) · planner: 4 opportunities passed both gates

TUE  REEL      #22 Contrarian Flip   <angle>   src §2 "<excerpt start…>"   family: handwritten
WED  CAROUSEL  Job A caption         <angle>   src §4                     7 frames
FRI  REEL      #18 Cold Open Demo    <angle>   src §5                     family: chat
SUN  STORY     quote frame           "<exact line>"  src §1

Say "ship Tuesday" and I'll run ig-ship on it.
```

Then make them one at a time through `ig-ship`, after the human selects. Don't produce four finished assets at once: they'd blur together and none would get proper review.
