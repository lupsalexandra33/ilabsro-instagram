# Changelog

## 0.1.0 (2026-10-23)

First version. Requires **`ilabsro-design` 0.7.0+** to be installed alongside.

### Skills
`ig-ship` (orchestrator across both plugins), `ig-hooks`, `ig-caption`, `ig-plan`, `ig-repurpose`, `ig-story`, `ig-viral`, `ig-audit`, `ig-profile`, `ig-community`.

### Adapted from `instagram-agent-skill` (Jake Schincariol, MIT, license included)
- `tools/hookscore.py`, `tools/swipe.py`, `tools/rubric.json` (organisation edition), `tools/caption.py` (with IL house checks: ≤3 tags, no exclamation marks, no emoji), `tools/il-hooks.json`. Every one of the 26 formulas carries `il_use` (yes / adapt / no) and `il_note`. Formula #27 "The Habit Check" was added.
- New: `tools/hooks.py` (browse IL-allowed formulas, classify a hook).
- **Not taken over:** `ig-reel` and `ig-carousel`, which `ilabsro-design`'s `reels-maker` / `insta-post-maker` replace, and `ig-human`, which became `ilabsro-design:human-pass`. `ig-comment`, `ig-reply` and `ig-dm` were merged into `ig-community`.

### Voice
`voice/il-instagram-voice.md`: IL design-system voice translated for Instagram, plus the `AI_TELLS.md` rule. **To do before real use:** fill the "Fill in with real material" section (handle, 3–5 real IL posts).

### Validated example
`examples/ship-test-my-thinking/`: a full `ig-ship` run with hooks (round 1 rejected a weak hook), brief, a rendered Reel, human-pass, a READY caption, the cover check, the live Artifact and the review block. `ship.md` lists what the run caught.

## How to validate

```bash
python3 tools/hooks.py                                    # IL-allowed formulas
python3 tools/hookscore.py examples/ship-test-my-thinking/hooks.txt
python3 tools/caption.py examples/ship-test-my-thinking/caption.txt --keywords "startup strategy,founders"   # expect READY
```

Then, in Claude with both plugins installed: "ship a Reel about <approved IL idea>" should run `ig-ship` and stop at the review block without posting anything.
