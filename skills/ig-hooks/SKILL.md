---
name: ig-hooks
description: Write and score opening hooks for Innovation Labs Reels, carousel covers and captions, using only IL-appropriate formulas from il-hooks.json and the local hook scorer. Use when the user asks for a hook, a first line, a cover line, or when ig-ship / ig-plan needs one.
version: 0.1.0
---

# ig-hooks

The first frame of a Reel and the cover of a carousel are read before anything else. For IL Reels (text on screen, no voiceover), the hook is the on-screen line at t = 0.

```bash
python3 ../../tools/hooks.py                          # formulas IL writes from (il_use: yes)
python3 ../../tools/hooks.py --use yes,adapt          # plus the conditional ones (read their il_note)
python3 ../../tools/hookscore.py hooks.txt            # rank candidates, one per line
python3 ../../tools/hookscore.py --hook "one line"
python3 ../../tools/hooks.py --classify "a hook you saw elsewhere"
```

The formula library and the scorer are adapted from Jake Schincariol's MIT-licensed `instagram-agent-skill` (`../../LICENSE-instagram-agent-skill.txt`). Each formula has an Innovation Labs `il_use` (yes / adapt / no) and `il_note`. Formula #27 "The Habit Check" was added from the first IL Reel test.

## The loop

1. Read `../../voice/il-instagram-voice.md`. If `~/.claude/ilabs/instagram/swipe.md` exists, read it: formulas that `ig-viral` found working in IL's space rank above the defaults.
2. Pick **three different formulas** that genuinely fit the approved idea. Use `yes` formulas, or `adapt` ones only when the condition in their `il_note` is met by the source. Never `no` formulas.
3. For each one, write the **on-screen line** (six words or fewer works best, sentence case, no exclamation mark) and, for captions or covers, the longer written version.
4. Put the three lines in a file and run `hookscore.py`. Show the ranking.
5. Recommend one in a sentence: why it fits the source, the format and the visual family. If the human prefers another one, theirs wins.

## How to read the score (honestly)

The scorer checks five text properties: length, specificity, stakes, front-loading and address. Its author tested it on 74 real hooks. It separated real hooks from deliberately bad ones well (AUC 0.83). It **could not** tell a creator's hits from their misses (AUC 0.56, close to a coin flip). So:

- **Under 50:** the hook has a real problem (preamble, nothing concrete, too long). Rewrite it.
- **50 and above:** it passes the filter. The choice between two passing hooks is a judgment about the idea and the visual, not about the number.
- Its specificity check rewards numbers. IL hooks often have none, because the source doesn't give one. **Never add an invented number to raise the score.** A clear habit or question in plain words is fine.

## IL hook rules

- The hook must be delivered: the Reel or carousel has to pay off what it promises, from the source.
- No clickbait, no superlatives, no "steal this", no insider-secret framing, no fake urgency.
- Real deadlines (#19) only with a date checked against the source.
- A question from a founder (#16) is quoted exactly as it was asked, from a real question box, comment or session note.
