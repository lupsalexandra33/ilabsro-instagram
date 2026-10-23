---
name: ig-audit
description: Post-mortem on what Innovation Labs has already posted - which posts actually worked, why, and what to stop - from Instagram insights joined with the ig-ship log. Use when the user pastes insights or screenshots and asks "what's working", "why did this flop", "audit our Instagram".
version: 0.1.0
---

# ig-audit

IL's own last 20–30 posts are the only real evidence of what works for IL. Every rule in this plugin is a prior until the audit confirms it.

## Inputs

- Insights per post (screenshots are fine): views, reach, % non-follower reach, saves, shares/sends, follows, average watch time, and the retention graph for the best and worst Reels (the most useful single screenshot).
- `~/.claude/ilabs/instagram/log.md` (hook formula, format, source per post) and `~/.claude/ilabs/reels-log.md` (visual family, ending), so results can be joined to the decisions behind them.

## Measure these, not raw views (show the working)

| metric | how | tells you |
| --- | --- | --- |
| **Outlier multiple** | views ÷ IL's median views | a real hit vs. a normal day |
| **Non-follower reach** | % of reach from non-followers | whether it travelled |
| **Hold at ~3s** | retention at 3s | whether the hook / first frame worked |
| **Avg watch time vs. length** | from insights | whether the middle held |
| **Sends per reach** | shares ÷ reach | the strongest signal: someone put their name on it |
| **Saves per reach** | saves ÷ reach | teaching value, key for IL's educational posts |
| **Follows per reach** | follows ÷ reach | whether the profile converted the attention |

Rank by outlier multiple and sends/saves per reach.

## Then find the pattern

Put the top 5 and bottom 5 side by side. Check, in this order: hold at 3s (if top and bottom differ here, it's the hook and nothing else), hook formula, visual family, format, length band (under 15s / 15–30 / 30–45 / over 45), post type (teach / update / recap / question / position), ending treatment. **Check day and time last.** It's rarely the cause.

State each finding as a claim with the evidence and a confidence. With 30 posts you can see a pattern. With 6 you can't, and saying so is the useful answer.

**Views but no follows is a profile problem, not a hook problem.** If non-follower reach is high and follows per reach is low, go to `ig-profile` before rewriting hooks.

## Output

```
AUDIT · 28 posts · <date range> · median views <n>

TOP 5 (outlier multiple)
  6.2x  REEL  #27 Habit Check  handwritten/pig  hold@3s 68%  saves/reach 3.1%  sends 44
  ...
BOTTOM 5
  0.4x  CAROUSEL  #11 Numbered  ...

WHAT THE DATA SAYS
1. <claim> — <evidence>, n=<k>, confidence <low/medium/high>
2. ...

STOP:      <one thing>
DO MORE:   <one thing>
NEXT:      ig-plan gets these; il-hooks/swipe priorities updated
```

Hand the conclusions to `ig-plan`, and add any proven formula preference to `~/.claude/ilabs/instagram/swipe.md` under an "IL's own evidence" heading.
