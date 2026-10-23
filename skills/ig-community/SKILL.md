---
name: ig-community
description: Handle Innovation Labs community conversation on Instagram - triage and reply to comments under IL posts, write comments on ecosystem accounts' posts, and draft DMs to people who reached out first - in IL voice, never as spam. Use when the user pastes comments, says "reply to these", "comment on this post", "what do we DM them", or runs the daily engagement round.
version: 0.1.0
---

# ig-community

Adapted from the `ig-reply`, `ig-comment` and `ig-dm` skills in Jake Schincariol's MIT-licensed `instagram-agent-skill`, merged and rewritten for an organisation voice. Everything goes through `ilabsro-design:human-pass` before it's shown. Nothing is posted or sent by this skill.

## 1. Replies under IL's own posts

Paste the comments (with handles). Never scrape the thread. Triage first and say the counts:

| bucket | gets |
| --- | --- |
| **QUESTION** (one many people have) | a real answer. If it has demand, **flag it as a Reel** (#16, reply-with-Reel), the best source of IL hooks |
| **LEAD** (a founder describing the problem a program addresses) | a full public answer, then one sentence of next step (apply, event, DM) |
| **SUBSTANCE** (adds data, disagrees, extends) | the longest, most thoughtful reply |
| **KEYWORD** (if the post asked for one) | what was promised, every time |
| **SUPPORT** ("great", tags, emoji) | a like and a few words at most |
| **NOISE** (spam, bait, bad faith) | nothing. Hide abusive comments with Instagram's controls |

Reply rules: answer in the reply rather than sending people to DMs; match their length; with critics, concede the true part first, then hold the line once; never delete criticism, never argue twice; no emoji or exclamation marks in IL replies (liking a comment is fine).

## 2. Comments on other accounts (the engagement round)

The list comes from `ig-plan`. For each post, give **two options of different types** and recommend one:

| type | when |
| --- | --- |
| Add a datum | IL has a real, public number or fact that supports it |
| Add the missing case | the post is right but incomplete |
| Respectful disagree | IL genuinely sees it differently. Name the agreement first |
| Extend one line | one line is the good one. Quote it and build on it |
| Ask the real question | the post skipped the hard part |
| The receipt | IL did the thing described. Two sentences on what happened |

One to three sentences. Never open with "Great post" or "Love this". Never restate the post. **Never pitch IL in a comment**: no links, no "check out our program". Keep a note in `~/.claude/ilabs/instagram/log.md` of who was commented on this week, so the round doesn't hit the same three accounts daily.

## 3. DMs, only when they moved first

Write DMs only to people who acted first: they commented a keyword, answered a story sticker, replied, or asked. For partner or collab outreach, write one specific proposal with a reason it's them, not a template.

- **Keyword delivery:** the promised thing in message one, no gate. Then one optional question.
- **Reply to a question or a lead:** 2–4 sentences, reference what they said in their words, give something useful first, one small next step. No calendar link in message one.
- **Collab / partner pitch:** four lines: what we've seen them do, the specific idea, what's in it for them, what we need.
- **Follow-ups:** at most two, spaced several days apart, each adding something new. Then stop.

**Never bulk-DM people who didn't interact.** Automated keyword replies are fine only through Instagram's own tools or an approved partner. If someone asks for a cold DM sequence, say it's the lowest-yield option and offer the engagement round instead.

## Output

Grouped and copy-ready:

```
REPLIES · 36 comments · 3 QUESTION, 1 LEAD, 2 SUBSTANCE, 27 SUPPORT, 3 NOISE

QUESTION → REEL
@handle  "how do you know when to stop validating?"  (19 likes) → #16 Reel, hand to ig-ship
  reply now: <copy-ready reply>
LEAD
@handle  "<their words>"
  <copy-ready reply>
NOISE (3) skipped
```
