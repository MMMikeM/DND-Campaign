---
name: rulebook-voice
description: Enforce Mike's prose voice in the rulebook and de-slop AI-generated rules text. Use when writing, editing, or reviewing anything in project/rules/ or any player-facing text.
use_when: User wants to draft, revise, de-slop, or review rulebook prose, section intros, class writeups, essence descriptions, spell flavour, or examples of play. Also use before committing any generated rules text.
tools: [Read, Edit, Write, Grep, Bash]
---

<objective>
Make rulebook prose sound like a specific person with specific opinions who has
actually run this game, not like marketing copy generated to sell any RPG.

Two failure modes to catch. Prose that reads like a pitch deck, all energy and no
information. Prose that reads like a spec sheet nobody finishes. The fix for both
is the same: make the specifics do the work the adjectives were doing.

This skill combines a voice standard with a fact-check gate, because rulebook
prose makes numeric claims and those claims go stale.
</objective>

<scope>
Applies to `project/rules/` and anything else a player or GM reads at the table.

Campaign notes, session prep, and internal planning docs are exempt.

Related docs, do not duplicate them:

- `project/writing/writing.md` covers story craft, plot structure, character
- `project/philosophy.md` covers campaign DNA, tone mix, foreshadowing
- This skill covers sentences
</scope>

<fix_mode>
**Direct Edit Mode (default)**

This skill is an EDITOR, not a critic.

1. Verify every number in the passage against the rules files first
2. Apply fixes directly with Edit
3. Report changes with before and after
4. Flag anything needing an authorial decision rather than guessing

**Audit-only mode:** if the user says "audit only" or "don't edit", report
without editing.

**Never silently change a mechanic.** If prose contradicts the rules, fix the
prose and tell the user which one you trusted and why. If it's genuinely
ambiguous which is correct, stop and ask.
</fix_mode>

<verification_gate>
Rulebook prose that quotes numbers must be checked before it ships. Run these
against `project/rules/` rather than trusting memory or an earlier draft.

```bash
rg -c '^#### [A-Z].* - Basic Effect' project/rules/5-spells.md   # core spell count
rg -c '^\| \*\*[A-Z]' project/rules/4-essences.md                 # essence count
rg -c '^#### \*\*3\.2\.' project/rules/3-classes.md               # class count
rg -c '^### Mode:' project/rules/7-enhancements.md                # mode count
rg -c '^\| [A-Z][^|]*\| \+?[0-9]+ SP' project/rules/7-enhancements.md  # priced enhancements
```

Baseline at time of writing: 18 Spells, 12 Essences, 6 classes, 4 known Spells at
1st level, 53 Modes, roughly 213 priced Enhancements. Treat these as stale until
re-counted.

**Named mechanics must exist.** Before writing "the Forceful enhancement", grep
for it. The real name is `Forceful Blast` and it costs +1 SP
(`7-enhancements.md`). An example citing a mode that doesn't exist, like
"standard Blast" when the modes are Cone, Orb and Lancing, is a bug in the book.

**Examples must add up.** Mode cost plus enhancement costs equals the SP spent.
One Essence per cast, never two. Damage dice must match the mode, not the basic
effect.
</verification_gate>

<register_ladder>
Four kinds of text, four settings. Confusing them is what makes a book feel
tonally broken.

**Pitch.** Section openers, back-cover copy, the first paragraph of a chapter.
Loud is allowed. One exclamation mark per page maximum. Every burst of enthusiasm
lands on a named thing, never on an abstraction. "Downtime projects, because the
weeks between adventures should also be fun" works. "Unleash your creativity"
does not, because there is nothing in it to disagree with.

**Rules.** Tables, costs, effects, durations. Flat, precise, present tense,
second person. No jokes, they cost the reader a re-read. A caveat gets its own
sentence rather than a parenthetical buried in a clause.

**Examples.** Named characters, specific actions, real numbers. Legal under the
rules as written, citing actual mode and enhancement names, arithmetic correct.
An example that contradicts its own chapter is worse than no example.

**Flavour.** Epigraphs, essence descriptions, class writeups. Sensory and
concrete. Say what it looks like, not how impressive it is.
</register_ladder>

<voice_reference>
The target for anything that is not a table:

> Our environment variables came from four places: Serverless Dashboard, GitLab
> CI/CD variables set via the GUI, GitLab CI files in the repo, and .env files.
> Four places to set a value is also four places to check, or to forget. We had
> outages, painfully plural there.

What to copy:

- **A real count, then its consequence.** "Four places" is checkable. The next
  sentence turns the count into a problem without raising its voice.
- **Understatement carries the weight.** "Painfully plural there" lands harder
  than "we had a lot of outages". Trust the reader.
- **Commas, not dashes.** The rhythm comes from clause order.
- **No adjective is load bearing.** Strip every adjective from that passage and
  the argument survives intact.

Energy comes from stakes and specificity. It does not come from intensifiers.
</voice_reference>

<rules>
1. **Every claim about the system cites the system.** "Lightweight" is not a
   claim. "Roll a d20, add a modifier that never exceeds +3, compare to a DC" is.
   If you can't name the number, cut the sentence.

2. **Numbers must be true and freshly checked.** See `<verification_gate>`.

3. **Commas over dashes.** Em dashes and en dashes get replaced with a comma, a
   full stop, or a restructured clause. Everywhere, including tables.

4. **Negate only what the reader already believes.** "Your character grows more
   powerful over the course of the battle, not less" earns its negation, because
   readers arrive expecting depletion. "Forget dense rulebooks filled with
   exceptions" does not, because it invents an opponent and says nothing about
   this game. If the thing being negated isn't a convention the reader has
   personally suffered, cut it.

5. **Second person, present tense, active.** "You spend 2 SP", not "the character
   may elect to expend 2 SP".

6. **Say it once.** The "unlike traditional systems with sprawling spell lists"
   move appears in both `1-introduction.md` and `5-spells.md`. Pick the stronger
   location, delete the other. Same goes for any pitch line that migrates.

7. **Vary the weight of sections.** Not every principle deserves equal space. If
   eight bullets are all the same length, at least four aren't saying anything.

8. **Prose by default, bullets when the content is genuinely a list.** What you
   need to play is a list. A design philosophy is an argument, and arguments need
   connective tissue.
</rules>

<ban_list>
| Pattern | Example from this book | Fix |
|:---|:---|:---|
| Comparator sentence | "This isn't a spell list. It's a toolkit." | State what it is, once |
| Rhetorical triad plus payoff | "Want fire? Want lightning? Want frost? You can build that." | One example, specific and legal |
| Closing tricolon | "weave stories, face challenges, unleash creativity" | Say the one thing you mean |
| Minted aphorism | "exactly the breathing room Lyra needed" | State the outcome, "out of reach for a round" |
| Empty intensifier | breathtaking, incredible, epic, seamless, robust | Delete, or replace with the number |
| Paired adjectives | "dynamic, imaginative play" | Keep whichever is true, usually neither |
| Template scaffolding | "built from the ground up with one goal", "get ready to" | Delete the wrapper, keep the claim |
| Universal flattery | "Imagination: the most crucial component!" | Every RPG says this, so it distinguishes nothing |
| Staccato fragment spam | "Fast. Modular. Fun." | One sentence with commas |
| Clinical formality | "the character may elect to utilize" | "you use" |

Inherited from the general slop list and still banned here: delve, moreover,
furthermore, it's worth noting, game-changing, revolutionary, leverage as a verb,
unlock your potential, "Here's the thing:", emoji section headers.

The ✨ on the Golden Rule callout is grandfathered. Don't add more.
</ban_list>

<audit_process>
**Step 1.** Read the passage. Ask whether it could appear in any other fantasy
RPG unchanged. If yes, it fails, and the fix is specifics rather than better
adjectives.

**Step 2.** Identify the register from `<register_ladder>`. Pitch text and rules
text fail differently, so judge them differently.

**Step 3.** Verify every number and every named mechanic against
`project/rules/`. Broken examples outrank prose problems, fix those first.

**Step 4.** Scan the ban list.

**Step 5.** Read the closing line aloud. If it scans like a slide title or a
t-shirt, and you invented it for this document, rewrite it plainly.

**Step 6.** Strip every adjective mentally. If the paragraph stops making sense,
the adjectives were load bearing, which means the sentence had no content.

**Step 7.** Apply fixes, then report.
</audit_process>

<output_format>
```text
## Voice Pass: [file or section]

**Register:** [pitch / rules / example / flavour]
**Mechanical errors:** [count, or none]

### Mechanics fixed
- [what was wrong] at [file:line], verified against [source file]

### Prose fixed
| Line | Before | After |
|------|--------|-------|
| ... | ... | ... |

### Left for you
- [anything needing an authorial decision]
```
</output_format>

<examples>
<example name="pitch_opener">
**Before:**

> Welcome to a tabletop roleplaying game built from the ground up with one goal:
> Empower you to do cool shit with as little friction as possible. Forget dense
> rulebooks filled with exceptions and edge cases. This system is designed for
> dynamic, imaginative play where your character's unique abilities and your
> clever ideas take center stage.

**Findings:** template scaffolding ("built from the ground up with one goal"),
strawman negation ("forget dense rulebooks"), paired adjectives ("dynamic,
imaginative"), universal flattery ("clever ideas take center stage"). Nothing in
five lines is checkable.

**After:**

> This TTRPG has one job: let you do cool shit with as little friction as
> possible.
>
> Your hero knows four Spells. Levelling up gives you options to shape those
> four, not more spells. You decide what your magic actually does at the moment
> you cast it, out loud, in the middle of a fight.

The tagline survives because it's a real promise. Everything around it was
scaffolding. Three abstract sentences become one checkable fact and its
consequence.
</example>

<example name="broken_example_of_play">
**Before:**

> She spends 2 SP for a standard Blast, adds Fire essence, and the Forceful
> enhancement (+1 SP). The goblins fail their saves and are pushed back by the
> wave of molten stone erupting from the ground, exactly the breathing room Lyra
> needed.

**Findings:** three mechanical errors and one prose error.

- "standard Blast" is not a mode. Modes are Cone, Orb, Lancing, all 2 SP
- She narrates earth energy then spends Fire. One Essence per cast
- "the Forceful enhancement" is really `Forceful Blast`
- "exactly the breathing room Lyra needed" is a minted punchline

**After:**

> She spends 2 SP for a Cone Blast and 1 SP for Forceful Blast, casting through
> her Earth Essence. All three fail the Dex save, take 2d8 damage as a slab of
> stone heaves up under them, and get thrown 10 feet back down the corridor, out
> of reach for a round.

Mode named correctly, one Essence, real enhancement name, arithmetic shown, and
the payoff states a mechanical outcome instead of drumming.
</example>

<example name="philosophy_list">
**Before:** eight bullets titled Narrative First, Clarity, Simplicity,
Versatility, Fun, Creativity, Balance, Clean Design, each three lines long.

**Findings:** over-balanced sections. Seven of the eight make the same claim,
that the game is good but easy. No bullet names a tradeoff, so no reader can
disagree with any of them.

**After:** four bullets, each naming a decision that cost something. "The
complexity sits in Section 7, not in the core loop." "Describe first, price it
after." "The rule loses." "No trap options."

A design philosophy the reader can argue with is a design philosophy.
</example>
</examples>

<success_criteria>
- Register identified and judged on its own terms
- Every number re-counted against `project/rules/` this session
- Every named mode, spell and enhancement confirmed to exist
- Example arithmetic checked
- Ban list swept
- Closing lines read aloud
- Fixes applied, authorial decisions surfaced rather than guessed
</success_criteria>

<core_principle>
Specificity is the voice. A sentence a reader can check, disagree with, or be
annoyed by belongs to a person. A sentence that could sell any RPG belongs to
nobody.
</core_principle>
