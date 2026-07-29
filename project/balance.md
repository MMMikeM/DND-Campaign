# Balancing the Attack Spells

Working notes on how `Strike`, `Bolt` and `Blast` were priced against each other,
what we measured, and which measurements turned out to be misleading.

This is a design document, not a rule. Nothing here is player-facing.

## The grid

Areas are measured in feet on a **hex grid**, one hex to 5 feet. This is a rules
decision, not a table preference, because square grids distort small bursts badly:

| Radius | Hexes | Squares | Hex advantage |
|:-------|------:|--------:|--------------:|
| 5 ft   | 7     | 4       | 1.75x |
| 10 ft  | 19    | 12      | 1.58x |
| 15 ft  | 37    | 32      | 1.16x |
| 20 ft  | 61    | 52      | 1.17x |

The discrepancy is worst at the small end, which is exactly where the cheapest
area effects live. Leaving the grid unspecified would have meant a 75% swing in
the value of a 2 SP purchase depending on what someone had on the table.

Useful formulas, with `r` = radius in hexes:

- **Burst:** `1 + 3r(r+1)` hexes. So 7, 19, 37, 61 for radii of 5, 10, 15, 20 ft.
- **Cone** (60 degree wedge): 5, 9, 14, 27 hexes at 10, 15, 20, 30 ft.
- **Line:** one hex per 5 ft.

## Three different questions

Most of the early analysis was wrong because it answered the wrong one.

**Coverage** is how many hexes a shape touches. It is the easiest thing to
compute and the least useful, because it assumes every hex holds an enemy.

**Expected hits** is how many creatures you actually catch. Get this by
simulation: scatter N enemies in a cluster, try every legal placement and
orientation of the shape, take the best. It is dramatically lower than coverage
and it does not scale with it.

**Concentration** is damage delivered to a single creature. This is what decides
whether something dies this turn, and it is the metric on which single-target
spells must win.

A spell can lead on total damage and still be the wrong tool, because damage
spread across four creatures kills none of them.

## What the simulation found

Five enemies clustered within 20 ft of each other. Best placement out of every
legal option, averaged over 1200 trials.

| Shape | Hexes | Hits, enemies adjacent | Hits, enemies 30 ft away |
|:------|------:|-----------------------:|-------------------------:|
| Cone 15 ft | 9 | 1.55 | 0.31 |
| Cone 30 ft | 27 | 2.81 | 1.69 |
| Line 25 ft | 5 | 0.99 | 0.30 |
| Line 25 ft, doubled | 10 | 1.43 | 0.30 |
| Burst r10 | 19 | 3.16 | 3.17 |
| Burst r15 | 37 | 4.20 | 4.20 |

**Area saturates.** Doubling a burst from 19 hexes to 37 gains **one** extra
enemy, because there are five enemies on the map and not thirty-seven. Any model
that prices area linearly against coverage will badly overvalue the large end.

**Lines barely hit anything.** Five enemies standing collinear essentially never
happens, so a 25-ft line lands 0.99 creatures. Length is almost irrelevant: 15,
20 and 25 ft lines land 0.84, 0.96 and 0.99. Enemies cluster near you, so a
3-hex line already covers everything reachable and further length points into
empty ground.

**Self-origin shapes collapse at range.** Cone drops from 1.55 hits to 0.31 when
the enemies are 30 ft out. Bursts are unaffected because you aim them. This is
the risk-reward on Cone and Lance working as intended, and it is why they are
cheaper.

## Structural facts that drive pricing

**Saving throws beat attack rolls.** Save-for-half returns 75% of listed damage
(half the time full, half the time half). A 65% attack roll returns 65%. Every
save-based Mode carries a 15% efficiency edge before anything else is priced.

**Area multiplies damage, so flat-priced damage compounds.** An enhancement that
adds +1d8 to everyone in the area is worth 1d8 on a single target and 19d8 on a
big burst. Priced flat, the marginal point is always the best point you have
spent, and efficiency rises with investment. That is backwards. Every other
resource in the book has flat or diminishing returns.

The fix is banding the damage enhancement by the Mode's footprint:

| Footprint | Amplify cost |
|:----------|:-------------|
| Single target | +1 SP |
| Small area, 2 to 20 hexes | +2 SP |
| Large area, 21+ hexes | +3 SP |

With that in place, damage per SP stays roughly flat from level 1 to 20 instead
of accelerating, and Bolt and Strike win on concentration at every budget while
Blast keeps winning on total output. Which is the point: each spell is best at
one question.

**Everything should sit near 6 to 7 hexes per SP.** That band emerged from
pricing the shapes against each other and is now the yardstick for anything new:

| Option | SP | Hexes | hex/SP |
|:-------|---:|------:|-------:|
| Cone Blast, 20 ft | 2 | 14 | 7.00 |
| Cone + Mega Cone, 30 ft | 4 | 27 | 6.75 |
| Orb Blast, r10 | 3 | 19 | 6.33 |
| Orb + Large Orb, r15 | 6 | 37 | 6.17 |
| Lancing Blast, 25 ft | 2 | 5 | 2.50 |

Every line declines or holds as you invest. Lance is the deliberate exception:
it buys persistence rather than area.

**Pay for safety.** Ranged versions of a shape cost more than self-origin ones,
because standing in the middle of a group is a real cost for a d6 hit die. Orb
is 3 SP against Cone's 2 for a smaller footprint. `Distant Lance` costs +1 SP and
adds no area at all, it only moves the origin.

## Spell identities

- **Blast targets the ground.** Cone is cheapest and most dangerous, Orb is the
  area option and the safe one, Lance is control and a wall.
- **Bolt targets an entity.** Single target only. Its edge is `Channeled`, which
  pays out over several rounds for a one-time cost, and accuracy for classes
  whose Key Ability is not Strength or Dexterity.
- **Strike is a weapon attack that spreads from its target.** Free weapon damage
  rides along, so it beats Bolt at concentration for a martial and ties it for
  everyone else.

## Decisions and why

**Deleted `Area Bolt`.** It duplicated `Orb Blast` exactly, same range and shape,
and `Expand Area Bolt` was priced at +1 SP per ring on an effect that grows
quadratically, making it the strongest area option in the book by a factor of
1.8 at 7 SP.

**Promoted `Seeking Bolt` from an enhancement to a Mode.** It already cost a
total of 3 SP, matching the other Modes, and the change removed all three
"cannot combine with" clauses, since the attack-roll and saving-throw paths
became separate Modes rather than mutually exclusive add-ons.

**Deleted `Mega Orb` and `Piercing Lance`.** Mega Orb pushed a burst to 40 ft
across. Piercing Lance bought a single extra hex for +1 SP, nine times worse than
any other expander, once the Lance base moved to 25 ft.

**`Twin Lance` doubles the Amplify cost.** It is a control purchase, not a damage
one. On dice alone it now loses to not buying it, and that is accepted: you take
it to hold ten hexes instead of five.

**Rejected: weakening the Lance linger.** The linger's job is to force movement,
and it only does that while the damage is frightening. Freezing it while the
initial hit scales would turn a control tool into a damage tool and then break
the control.

## Modelling mistakes worth not repeating

**Theoretical maximum coverage.** Multiplying hexes by damage assumes every hex
is occupied. It overstated every area option and produced a table where a line
was the best damage build in the game.

**Assuming a lingering effect always lands.** A 1.5x multiplier was applied to
Lance for its second tick. Enemies simply step out, so the real figure is close
to 1.0 and the value is denial rather than damage. That single wrong constant
made Lance look dominant and led to two proposed nerfs it did not need.

**Comparing across different durations.** `Harmful Zone` holds 61 hexes for ten
rounds; `Lancing Blast` holds 10 hexes for one. Setting their per-tick damage
side by side made Lance look like it was out-competing a spell it is not remotely
close to. Compare hex-rounds, not ticks.

**Fixing the wrong end.** `Expand Area Bolt` was noted early as scaling better
than `Large Orb`, and the response was to make Orb cheaper to match. Orb was
correctly priced and Expand was the outlier. Model before matching.

## Zone

Zone is not competing with Blast and should not be measured the same way. Blast
buys a moment; Zone buys a place for a while. The right unit is **hex-rounds**,
footprint multiplied by how long it holds.

| Option | SP | Hexes | Rounds | hex-rounds/SP |
|:-------|---:|------:|-------:|--------------:|
| Hindering Zone | 3 | 61 | 10 | **203** |
| Harmful Zone | 4 | 61 | 10 | **153** |
| Cone Blast | 2 | 14 | 1 | 7 |
| Lancing Blast | 2 | 5 | 2 | 5 |

Thirty times the persistent presence per point. That is not a mistake, it is the
whole difference between the two spells, and it is why comparing their per-tick
damage is meaningless. What Zone pays for it: Concentration, a much smaller die
(2d6 against 2d8), damage only when a creature enters or starts its turn inside,
and a Choice Spell slot.

On raw footprint Zone is also far ahead, 61 hexes at 3 SP against Blast's 19 at
3 SP. Again defensible, because a zone that nobody walks into does nothing, while
a Blast lands the moment you cast it.

### Where it breaks

**`Expand Zone` is the `Expand Area Bolt` bug, larger.** It charges +1 SP per
+5 ft of radius on an effect that grows quadratically:

| Step | Hexes gained | Cost |
|:-----|-------------:|-----:|
| 20 -> 25 ft | +30 | 1 SP |
| 25 -> 30 ft | +36 | 1 SP |
| 30 -> 35 ft | +42 | 1 SP |

Compare `Large Orb`, which buys +18 hexes for 3 SP. `Expand Zone` is five times
more efficient at the first step and gets better with every purchase. This is
exactly the pricing that made `Area Bolt` the strongest area option in the book
before it was deleted. A ring costs more than the last ring, so the price has to
rise with it.

**Damage compounds on the time axis.** `Increase Dmg/Debuff DC` adds +1d6 for a
flat +1 SP, and that die is rolled on every tick for up to ten rounds across 61
hexes. It is the same compounding that forced the `Amplify Blast` bands, rotated
from area onto duration. Blast pays for the multiplier now; Zone does not.

**`Sustain Zone` plus `Persistent Zone` leaves combat entirely.** Three steps of
Sustain takes the duration to an hour, then `Persistent Zone` at +3 SP makes it
eight hours with no Concentration. Around 8 SP total buys a 61-hex effect that
holds for a working day. That may be fine, it is a fair use of a whole spell and
most of a level's points, but it is an exploration and siege tool rather than a
combat one and should be priced with that in mind rather than by combat maths.

### The general rule

Any enhancement that **multiplies** rather than adds has to be priced against
what it multiplies. Area multiplies damage, so `Amplify Blast` is banded by
footprint. Duration multiplies ticks, so Zone's damage enhancement should be
banded by how long the zone lasts. Radius grows quadratically, so any per-5-ft
expander must cost more at each step, not the same.

Flat pricing on a multiplying effect always produces the same failure: the
marginal point is the best point you have spent, and efficiency climbs with
investment instead of falling.

## Open

- Zone's three expanders (`Expand Zone`, `Increase Dmg/Debuff DC`, `Sustain
  Zone`) are all flat-priced on multiplying effects and all need the banding
  treatment. Nothing has been changed yet.
- `Cleaving Strike` and `Piercing Strike` are capped at four targets, so extra SP
  buys damage they can only apply to four creatures. Their hex/SP is frozen at
  1.33 regardless of price. Cutting both and leaving `Bursting Strike` as Strike's
  only area option is the obvious move.
- `Chain Bolt` still uses the original halving text. The specced replacement is
  +1 SP per 15 ft of leap reach, damage dropping 1d8 per leap, with the target
  count capped by the decay rather than by SP.
- Weapon damage is never defined anywhere in the book. `Strike` says "normal
  weapon damage" and inherits an assumed table. Deliberately weakening bows to
  balance Strike against Bolt requires that table to exist first.
