# Relationship patterns

How linking tables are modelled in this schema, and why. Written 2026-08-08.

## The pattern: reified relationships with exclusive arcs

Three tables share one shape:

| Table | Source end | Target end | Payload |
|---|---|---|---|
| `foreshadowing` | 6 FKs (quest, questStage, site, npc, lore, item) | 10 FKs (quest, npc, conflict, item, lore, faction, consequence, site, region, area) | subtlety, narrativeWeight, suggestedDeliveryMethods, … |
| `consequences` | 2 FKs (quest, questStageDecision) | 8 FKs (faction, region, area, site, npc, consequence, conflict, quest) | severity, visibility, timeframe, playerImpactFeel, … |
| `lore_links` | `loreId` | 8 FKs (region, faction, npc, conflict, quest, foreshadowing, relatedLore, item) | linkStrength, linkRoleOrTypeText, linkDetailsText |

Two named concepts are at work:

**Reified relationship** (a.k.a. *associative entity*) — a relationship promoted to a first-class
row so it can carry attributes. A graph database would call this an edge with properties.

**Exclusive arc** — the polymorphic endpoint. Instead of one FK, there are N nullable FKs plus a
`CHECK` constraint that exactly one is non-null. See `chk_single_affected_entity`,
`chk_single_trigger`, `single_fk_check`.

Together: *a reified relationship with exclusive arcs at both ends.*

## Why exclusive arcs, and not the alternatives

| Approach | Referential integrity | Cost |
|---|---|---|
| **Exclusive arc** (chosen) | Real FKs, enforced by the DB | A column per target type; reads join all N; a new entity type means a migration and touching every consumer |
| Type + ID pair (`targetType`/`targetId`) | **None** — no FK is possible | Cheap and flexible, but permits orphans and cannot cascade |
| Supertype table (one `entities` row per entity) | Real FKs, a single column | One extra join to resolve name/type; every entity needs a supertype row; large migration |
| A join table per pair | Perfect | Combinatorial explosion |

The type+ID pair (Rails-style polymorphic association) is rejected on principle: this schema uses
`cascadeFk`/`nullableFk` throughout, so referential integrity is already a paid-for property. Don't
trade it away to save a column.

The supertype table is the strongest alternative and the one to reach for if the exclusive arc
starts failing. It is not worth the migration today — see "When to revisit".

## The rendering rule

Because each row has **exactly one source and exactly one target**, the two ends want different
views. This applies to all three tables, not just consequences:

- **The source renders all of them, and links out.** A quest lists every consequence it triggers.
  A lore entry lists every link it owns. `/consequences/:slug` and `/foreshadowing/:slug` are the
  canonical full records.
- **The target renders only the relevant bit, and links back.** A conflict shows *why this
  consequence matters to this conflict*, then links to the consequence and to whatever triggered it.
  It does not repeat creative prompts, escalation details, or the chain — that is the source's job.

`conflictImpactDescription` is this rule encoded as a constraint: it is the only target-specific
column, and `chk_conflict_impact_description_required` makes it mandatory *only* when the target is
a conflict. The schema is deliberately storing "the relevant bit, framed for this target".

Corollary for the app layer: each pattern wants one shared query fragment per direction and one
shared component handling both directions. `foreshadowingWithSources` / `foreshadowingWithTargets`
in `packages/react/app/lib/entities/index.ts` and `~/components/ForeshadowingList` are the
reference implementation. Consequences and lore links should follow it.

## When to revisit

The exclusive arc holds as long as the payload is genuinely shared across all target types.

**The tell is a second target-specific column.** One (`conflictImpactDescription`) is fine and
useful. If `npcImpactDescription`, `factionImpactDescription`, `regionImpactDescription` start
appearing, the edge has real subtypes and the arc is failing. At that point choose between a
supertype table and per-target subtype tables — do not keep widening the shared table.

Secondary signals:

- A fourth table adopts the same shape.
- "Show me everything linked to X" becomes a common query. Under exclusive arcs that is an N-way
  union; under a supertype table it is one join.

## Prerequisite for any future migration

Consolidate the app layer first. While each entity renders consequences and lore links its own way,
a schema migration has to be applied in a dozen places. Once every consumer goes through one
fragment and one component per pattern, the migration surface is three fragments, three components,
and the schema itself.

The consolidation is worth doing on its own merits, and it makes the supertype decision cheap in
either direction. Do it before deciding, not after.
