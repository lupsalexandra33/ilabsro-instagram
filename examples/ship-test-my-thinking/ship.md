# ig-ship run: "Test your thinking"

End-to-end test of `ilabsro-instagram` + `ilabsro-design` (2026-10-23). Every step is reproducible from the files in this folder.

| step | skill | result |
| --- | --- | --- |
| 1 source | `ig-ship` | approved IL idea from `ilabsro-design/generated-examples/visuals/test-my-thinking/prompt.md` |
| 2 format | `ig-ship` | Reel: a correction with a before/after, reaches non-followers |
| 3 hooks | `ig-hooks` | round 1 (`hooks.txt`): #18 chat cold open scored **34 WEAK** and was dropped; #2 81.4, #22 81.4. Round 2 (`hooks-round2.txt`): source-faithful two-beat #2 = **80.1** → chosen |
| 4 brief | `ig-ship` | `brief.md`: boundaries, caveat class, family/ending chosen against `~/.claude/ilabs/reels-log.md` (last: handwritten + pig) |
| 5 asset | `ilabsro-design:reels-maker` | `reel/reel.html` → `out/test-your-thinking.mp4`, chat → checklist → contrast, logo-on-teal ending; FORMAT ok, LINT clean |
| 6 copy | `ilabsro-design:human-pass` | on-screen (`out/*.onscreen.txt`): 0 lexicon hits, 0 flags |
| 7 caption | `ig-caption` | `caption.txt`, Job A; `caption-lint.txt` READY; `caption-detect.txt` 40.9 FLAGGED on SPECIFICITY 0 only (source has no concrete detail; none invented) |
| 8 cover | `reels-maker` | `out/*.cover-4x5.jpg`: hook fully inside the grid crop |
| 9 share | `reels-maker` export | `reel/artifact/` published as a live Artifact (playable, scrubbable, shareable); MP4 stays the posting file |
| 10 tells | `human-pass` `design_tells.py` | `reel.html`: clean |

## What the test caught (and what changed because of it)

1. **The hook scorer changed the decision.** The chat-led cold open felt natural but scored 34. The two-beat Negative Command took the opening frame, and the chat became the illustration.
2. **Cover crop.** The first layout put the hook at y = 260. The 4:5 grid crop starts at 285, so the cover cut the first line. `reels-maker` lint now has a `cover-crop` check for anything labelled `hook`.
3. **Chat scroll edge.** Scrolled bubbles were cut with a hard line under the headline. The kit's `chat()` now fades the top edge once the thread scrolls.
4. **Caption search terms.** `caption.py` failed the first draft (0/2 search terms). The revised caption carries "startup strategy" and "founders" in normal sentences.
5. **Marks bleeding into the next scene (found in human review).** The S3 strike and circle stayed on top of the teal outro while it faded in, because scenes weren't their own stacking contexts. The kit now isolates every scene. Re-rendered and checked frame by frame at every boundary.
6. **Detector calibration.** With no concrete detail in the source, `detect.py` can't reach PASS without invention. The exception is now written into `human-pass` and `ig-caption`.

## Review block

```
READY FOR REVIEW
format:     Reel, 1080x1920, 26.9s, silent (add audio in-app if wanted)
source:     ilabsro-design/generated-examples/visuals/test-my-thinking (approved IL idea)
hook:       #2 Negative Command, "Don't ask AI to think for you. / Ask it to test your thinking." (80.1 STRONG)
asset:      test-your-thinking.mp4 · lint clean · family chat · ending logo on teal
cover:      test-your-thinking.cover-4x5.jpg (hook inside grid crop)
copy:       human-pass: 0 lexicon hits, 0 open flags
caption:    Job A · 80/125 visible · one ask (save) · 2 tags · caption.py READY
check:      confirm the idea is cleared for public posting; the chat and questions are illustrative and labelled
```

Not logged to `~/.claude/ilabs/instagram/log.md` yet. That happens on human approval.
