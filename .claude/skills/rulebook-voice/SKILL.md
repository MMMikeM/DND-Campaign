---
name: rulebook-voice
description: Enforce Mike's prose voice in the rulebook and de-slop AI-generated rules text. Use when writing, editing, or reviewing anything in project/rules/ or any player-facing text.
use_when: User wants to draft, revise, de-slop, or review rulebook prose, section intros, class writeups, essence descriptions, spell flavour, or examples of play. Also use before committing any generated rules text.
tools: [Read, Edit, Write, Grep, Bash]
---

<objective>
Make rulebook prose sound like a specific person with specific opinions who has
actually run this game, not like marketing copy generated to sell any RPG.

Three failure modes to catch.

**Pitch deck.** All energy, no information. Fix with specifics.

**Spec sheet.** Accurate, complete, and nobody finishes it. Fix with an image and
a human stake.

**Over-corrected.** The one this skill causes if you let it. Every adjective
stripped, every image cut, every sentence audit-proof, and the result reads like
release notes for a person's imagination. A passage that survives every check in
this file and inspires nobody has failed. Specificity is the floor, not the
ceiling.

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
3. Report changes with before and after, quoted in full
4. Flag anything needing an authorial decision rather than guessing

Editing here means rewriting, and rewriting includes writing more. If a section
is thin, thicken it. If an Essence gets one clinical line, give it three good
ones. The word count is not a budget you are spending down.

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
grep -c '^#### Basic Effect' project/rules/spells/*.md | grep -vc ':0'  # spell count
grep -c '^| \*\*[A-Z]' project/rules/4-essences.md                      # essence count
grep -c '^#### \*\*3\.2\.' project/rules/3-classes.md                   # class count
grep -c '^#### Mode' project/rules/spells/*.md                          # modes, sum the per-file counts
grep -hEc '^\| [A-Za-z][^|]*\| *\+?[0-9]+ SP' project/rules/spells/*.md # priced enhancements
```

`rg` is not installed here, use `grep`. Each spell now lives in its own file
under `project/rules/spells/`, and `7-enhancements.md` is gone: Modes and
Enhancements sit inside the spell file they belong to. `7-feats.md` is Feats,
which is a different thing.

Baseline re-counted 2026-07-29: 18 Spells, 12 Essences, 6 classes, 4 known Spells
at 1st level, 50 Modes, roughly 206 priced Enhancements. SP pool is
`(level + 1) * 5` and the per-cast cap is `2 + ceil(level / 2)`, both in
`5-spells.md`. Treat all of this as stale until re-counted.

**Named mechanics must exist.** Before writing "the Forceful enhancement", grep
for it. The real name is `Forceful Blast` and it costs +1 SP
(`spells/6-04-blast.md`). An example citing a mode that doesn't exist, like
"standard Blast" when the modes are Cone, Orb and Lancing, is a bug in the book.

**Prerequisites are part of the arithmetic.** `Chain Bolt` is +2 SP, but it hangs
off `Standard Bolt`, so the cheapest legal cast using it is 4 SP, which a
character cannot afford until 3rd level. An example that quotes the enhancement
price alone is wrong even though the number is right.

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

**Flavour.** Epigraphs, essence descriptions, class writeups, the second half of
a good example. This is where the book is allowed to be a book. Metaphor, rhythm,
a held image, a line with some blood in it. The only constraint is that the image
be *this game's* image: Frozen means speed 5, so write cold that stops a person
where they stand, not cold that is "bone-chilling". Say what it looks like, not
how impressive it is, and then let it land before moving on.
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

What this reference does **not** license is flatness. That passage has a joke in
it ("painfully plural there"). It has rhythm, a long sentence then a short one.
It has a voice you could pick out of a lineup. Copy that, not just the counts.

It is also technical blog prose, and half this book is not. For the other half,
the reference is `1-introduction.md`:

> Say you took `Blast`. It's free to cast as a 10-foot cone for 1d8. Spend two
> spell points and you could enhance it into a 15-foot cone, a sphere you drop 60
> feet downrange, or a lance that skewers a whole line. One more point on
> **Forceful Blast** and everything that fails the save gets thrown 10 feet back.

Note how much room that spends. Four sentences on one spell, three concrete
images, and the numbers are threaded through the picture rather than listed
before it. That is the length a real explanation takes, and shortening it would
not improve it.
</voice_reference>

<poetic_license>
The rules below say what to cut. This section says what to protect, and it wins
ties.

**One image per passage is not decoration, it's the job.** A player has to
picture what their character does before they will care what it costs. "A slab of
stone heaves up under them" is doing work that "the target is pushed 10 feet"
cannot do, and the passage wants both.

**Rhythm is content.** Vary sentence length on purpose. A short one after two
long ones is a beat, and beats are how a reader knows what mattered. Prose that is
all medium-length declaratives reads as machine output no matter how true it is.

**Some words carry the world, not the mechanic.** Thorne is *haunted* by the
shrine he brought down. That adjective is not an intensifier and does not get
stripped. The test in Step 6 is for adjectives propping up empty claims, not for
adjectives doing character work.

**A concept sentence is allowed to be beautiful.** Section openers, Essence
descriptions and Hindrance writeups are the places the book earns affection.
Spend a real sentence there. You get roughly one per section, so make it count
rather than sprinkling half-flourishes through the rules text.

**Voice may be warm.** Addressing the reader as a person at a table, with
opinions and mild humour, is the house style. "Take the -1" is fine. What's
banned is enthusiasm about nothing, not enthusiasm.

**When cutting slop, ask what the sentence was trying to do before you delete
it.** If it was trying to say "your magic is yours", that's a real intention and
the fix is a better version of it. Not its absence. An edit that removes a claim
without replacing the intention is a failed edit, and if that intention only fits
as prose, keep it as prose rather than converting it to a count.
</poetic_license>

<rules>
1. **Every claim about the system cites the system.** "Lightweight" is not a
   claim. "Roll a d20, add a modifier that never exceeds +3, compare to a DC" is.
   If you can't name the number, cut the sentence. This governs claims about how
   the game plays. It does not govern description of what magic looks like, what
   a character wants, or how a moment feels, and applying it there is how you get
   a spec sheet.

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

6. **Say it once, across sections.** The "unlike traditional systems with
   sprawling spell lists" move appears in both `1-introduction.md` and
   `5-spells.md`. Pick the stronger location, delete the other. Same goes for any
   pitch line that migrates. This is about the same *pitch* recurring in two
   chapters. Inside one passage, restating a thing in a sharper way is
   craft, not repetition.

7. **Vary the weight of sections.** Not every principle deserves equal space. If
   eight bullets are all the same length, at least four aren't saying anything.
   The same holds inside a paragraph: uniform sentence length is the tell.

8. **Prose by default, bullets when the content is genuinely a list.** What you
   need to play is a list. A design philosophy is an argument, and arguments need
   connective tissue. A character concept is neither, it's an invitation, so
   don't convert one into an inventory of steps.

9. **Never replace a feeling with a count.** "Ten decisions, twenty minutes" is
   checkable, true, and worse than what it replaced, because nobody opens a
   character chapter wanting a time estimate. If the original was reaching for
   something human, the replacement reaches for the same thing with better aim.
</rules>

<ban_list>
| Pattern | Example from this book | Fix |
|:---|:---|:---|
| Comparator sentence | "This isn't a spell list. It's a toolkit." | Describe what it is and what that gets you |
| Rhetorical triad plus payoff | "Want fire? Want lightning? Want frost? You can build that." | One example, specific and legal, told properly |
| Closing tricolon | "weave stories, face challenges, unleash creativity" | The one thing you actually mean, given room |
| Minted aphorism | "exactly the breathing room Lyra needed" | The outcome, "out of reach for a round" |
| Empty intensifier | breathtaking, incredible, epic, seamless, robust | Replace with what the reader would have seen |
| Paired adjectives | "dynamic, imaginative play" | Keep whichever is true, or write the thing itself |
| Template scaffolding | "built from the ground up with one goal", "get ready to" | Drop the wrapper, keep and develop the claim |
| Universal flattery | "Imagination: the most crucial component!" | Every RPG says this, so it distinguishes nothing |
| Staccato fragment spam | "Fast. Modular. Fun." | One sentence with commas |
| Clinical formality | "the character may elect to utilize" | "you use" |

Every fix in that right-hand column is a *replacement*, not a deletion. Deleting
a slop sentence and moving on leaves a hole where an intention was. The passage
should end up as long as it needs to be, which is sometimes longer than the slop
version it replaces.

Inherited from the general slop list and still banned here: delve, moreover,
furthermore, it's worth noting, game-changing, revolutionary, leverage as a verb,
unlock your potential, "Here's the thing:", emoji section headers.

The ✨ on the Golden Rule callout is grandfathered. Don't add more.

**Not on this list, and don't treat them as if they were:** metaphor, a sentence
with a rhythm to it, second-person warmth, dry humour, a sensory verb, an image
that lasts a whole clause, saying something twice for emphasis when the second
time earns it. Those are the book working.
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
t-shirt, and you invented it for this document, replace it with something that
says what you meant. Plain is a fallback, not the goal, and a closing line is
allowed to land.

**Step 6.** Strip every adjective mentally. If the *argument* stops making sense,
the adjectives were propping up an empty claim. If only the *picture* goes, the
adjectives were doing character work and they stay.

**Step 7.** Read your replacement against the original, both aloud. Three
questions, and a no to any one of them means the edit isn't finished:

- Is the new version more interesting to read, or only more defensible?
- Did the original reach for something human that the new version dropped?
- Would a player who read only your version still want to make a character?

**Step 8.** Apply fixes, then report.
</audit_process>

<output_format>
```text
## Voice Pass: [file or section]

**Register:** [pitch / rules / example / flavour]
**Mechanical errors:** [count, or none]

### Mechanics fixed
- [what was wrong] at [file:line], verified against [source file]

### Prose fixed
For each change, quote the before and after in full, as block quotes, not table
cells:

> **[file:line], [what was wrong]**
>
> Before: [the original, complete]
>
> After: [the replacement, complete]
>
> [one line on what the replacement keeps that the original was reaching for]

Never report prose edits in a table. A table cell cannot hold a paragraph, so
reporting in one silently pressures every rewrite to fit on a line, and that is
how a rulebook turns into a spec sheet. If a fix is three sentences long, the
report shows three sentences.

### Left for you
- [anything needing an authorial decision]
```

**On length.** Nothing in this skill asks for brevity. Cut what is empty, not
what is long. A section opener may run two paragraphs, an Essence description may
run four sentences, and an example may spend a full line on what the spell looked
like before it says what it cost. Shorter is only better when the words removed
were doing nothing.

**On session modes.** If the conversation is running in a compressed or terse
reply mode, that governs chat only. Rulebook prose is the product. It gets full
sentences regardless of how the surrounding conversation is being written.
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

<example name="over_correction">
This is the failure this skill causes. Learn it.

**Before,** the original opener of Section 2:

> Welcome to a world where your magical identity is shaped not by rigid spell
> lists, but by your character's unique story and style. This guide walks you
> through creating someone you're excited to play, focusing on narrative first,
> with mechanics that support your vision.

Real problems: "Welcome to a world where" is scaffolding, "someone you're excited
to play" is universal flattery, "support your vision" says nothing. Fine.

**The over-corrected fix:**

> Character creation takes ten decisions: a concept, a class, six ability
> modifiers, two skills, two Essences, four Spells, a Hindrance, and five lines
> of detail at the end. Work top to bottom and you'll finish in twenty minutes.

Every word of that is verifiable and it is a worse opener. It answers a question
nobody asked, promises a chore in ten parts, and throws away the only thing the
original was actually about, which is that your magic comes from who your
character is. Rule 9 exists because of this paragraph.

**The fix that keeps the intention:**

> You start with a person, not a stat line. Who they were before any of this,
> what they want badly enough to go looking for trouble, and the thing about them
> that gets in the way.
>
> Everything after that, the class, the modifiers, the two Essences, exists to
> put that person on the table and let them act.

The negation survives because readers have personally suffered stat-line-first
character creation. "The thing about them that gets in the way" is the Hindrance,
seeded four sections early without naming a rule. Nothing here is a number and
nothing here is slop.
</example>
</examples>

<success_criteria>
- Register identified and judged on its own terms
- Every number re-counted against `project/rules/` this session
- Every named mode, spell and enhancement confirmed to exist
- Example arithmetic checked
- Ban list swept
- Closing lines read aloud
- Every cut passage's *intention* either preserved or consciously dropped
- At least one image or human stake left standing in any non-table passage
- The edited version is more interesting to read, not merely more defensible
- Fixes applied, authorial decisions surfaced rather than guessed
</success_criteria>

<core_principle>
Specificity is the voice, but specificity is not the point. A sentence a reader
can check, disagree with, or be annoyed by belongs to a person. A sentence that
could sell any RPG belongs to nobody. And a sentence nobody wants to read belongs
in a manual, which this is not.

Write like someone who loves this game and has run it for people they like.
</core_principle>
