# Innovation Labs: Instagram voice

Every skill in `ilabsro-instagram` reads this file before writing. It translates the voice rules of the Innovation Labs design system (`ilabsro-design/design-system/INNOVATION_LABS_DESIGN_SYSTEM.md`, "Voice and content") to Instagram. If the two ever disagree, the design system wins. Update this file instead of working around it.

## Fixed rules (from the design system)

- Plain, confident, short sentences. No hype words, no exclamation marks, no emoji.
- Headlines state the point, often in two beats: "Wording helps. *It's only part of it.*"
- Sentence case everywhere. Mono uppercase only for short labels (three words or fewer).
- "We" for Innovation Labs. "Founders" or "teams" for participants.
- Say what the evidence is. Proposals stay proposals, estimates stay estimates, practitioner guidance is not research.
- Never invent figures, quotes, names, outcomes or events. If a number is needed and unknown, leave `{{number}}` and flag it.
- Calls to action name the destination ("Applications open · link in bio"), and there is only one per post.
- Nothing that looks AI-generated: follow `ilabsro-design/design-system/AI_TELLS.md` (no emoji, em dashes, sparkles, "it's not X, it's Y", glow orbs, glassmorphism, bento or three-card filler, fake stats) in captions, comments, DMs, stories and every visual.

## Pages and artifacts this plugin produces

Plans, audits, swipe files, profile reviews, review blocks: whenever an `ilabsro-instagram` output is a page or an Artifact, not just chat text, it is still Innovation Labs material. Build it with `ilabsro-design`'s visual system, not a look chosen for the occasion:
- colors only from `ilabsro-design/design-system/TOKENS.css` (teal-led Light; purple `ax` only as a semantic accent); type only Poppins, IBM Plex Mono and Caveat (one note at most);
- a working document gets the utilitarian treatment (`website-maker`'s reading-surface rules), with no hero and no decoration;
- no coloured left borders, glass, gradients behind text or any other pattern in `ilabsro-design/design-system/AI_TELLS.md`;
- run `ilabsro-design:human-pass` → `design_tells.py` on the page before publishing.
These brand rules take precedence over any general "pick distinctive fonts" design guidance.

## Instagram translation

- **Language:** English.
- **Who we're talking to:** student teams (bachelor's and master's, under 27), university spin-off and researcher teams, and mixed teams of students and early-stage founders building tech startups in Romania, plus the mentors, universities and partners around them. Narrow this per post from the brief. Don't invent a narrower audience.
- **Lens defaults** (from `ilabsro-design`): `friendly-lens` for teaching and founder-to-founder posts, `formal-lens` for applications, deadlines, partners and logistics, `jokey-lens` only as a light, occasional twist.
- **What IL posts are for:** teaching a useful founder or innovation concept, or communicating a real IL update (program, event, application, recap). Not personal-brand growth content.
- **Hooks:** write only from `tools/il-hooks.json` formulas marked `il_use: yes`, or `adapt` ones when their condition is met. No "steal this", no insider secrets, no superlatives.
- **Hashtags:** 0–3 specific topic labels, below the fold. The platform cap is 5.
- **Asks:** one per post. Prefer save, comment a real question, or go to a named destination. No follow/tag bait.

## Fill in with real material (do this once, then keep it current)

The rules above are fixed. This section is what makes drafts sound like IL rather than like "a brand". Fill it from real, published IL posts. Never fill it with guesses.

- **Handle:** @ilabsro
- **3–5 IL captions or Reel scripts that sound most like us** (paste them verbatim from @ilabsro; still to fill, this is the part that sets the voice):
  1.
  2.
  3.
- **Words we actually use:** (to fill from the posts above)
- **Words we never use** (besides the global hype list in `human-pass`): (to fill)
- **Public facts we may use** (from press coverage, Oct 2026; confirm with the team before posting, and update each edition):
  - Innovation Labs is a pre-acceleration program for tech startups, organised by Asociația Tech Lounge, running since 2013. 2026 was the 14th edition. *(the same article also says "13 years"; confirm which one to use)*
  - 2026 format: one national 30-hour hackathon in Bucharest (21–22 March 2026, at UNSTPB), then a 10-week pre-acceleration program in Bucharest, ending in Demo Day.
  - 2026 numbers: 221 projects registered, 127 teams qualified, 41 admitted to mentorship; 27 at the Startups' Fair, 17 in the Demo Day final.
  - Demo Day 2026: 25 May 2026, Opera Națională București. Winners: AICoustic (Grand Prize), DistriOS (Best Emerging Start-up), Intrudify (Best Product), Nabu (Public Vote).
  - Early Game Ventures allocated €500,000 for investment. One finalist received a preliminary term sheet; no final agreement had been announced at the time.
  - Who can apply (2026): teams of up to 4 or individuals. Student-only teams (under 27; one PhD under 30 allowed), university spin-offs, or mixed teams with at least one active student. Verticals: Agriculture, Consumer Tech, Cybersecurity, DevTools, Digital Health, Digital Infrastructure, Retail & E-Commerce, Sustainability.
  - Program parts: bootcamps, mentoring, hybrid workshops, "Unplugged" sessions, the Innovation Labs Academy platform, AI Validation Bootcamps.
  - Universities: 24–25 partner universities in 12–13 cities *(sources differ; confirm)*.
  - Strategic partners (2026): Romanian-American Foundation, UNSTPB, Early Game Ventures. Main: BRD, Orange Romania, Eviden, eMAG. Institutional: UEFISCDI.
  - Sources: spotmedia.ro (Demo Day 2026 final), startupcafe.ro (2026 registrations).
- **Things we never post about, or names and numbers that can't be public:** (to fill with the team: e.g. term-sheet details, team results without consent)

If this section is empty when a skill needs it, ask the user once for 3 real IL posts, then propose the filled section for approval. Don't write it silently.
