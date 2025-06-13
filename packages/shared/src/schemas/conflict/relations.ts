// conflict/relations.ts
import { relations } from "drizzle-orm"
import { factions } from "../factions/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { itemRelationships } from "../items/tables"
import { narrativeDestinations } from "../narrative-destinations/tables"
import { consequences } from "../narrative-events/tables"
import { npcs } from "../npc/tables"
import { regions } from "../regions/tables"
import { worldConceptLinks } from "../worldbuilding/tables"
import { conflictParticipants, conflicts } from "./tables"

/**
 * ## `conflictsRelations`
 *
 * This defines the relationships for the `conflicts` table.
 *
 * ### Key Relationships
 *
 * - **`consequences`**: Represents consequences that are **triggered by** this conflict.
 *   - It joins on `consequences.triggerConflictId` -> `conflicts.id`.
 *   - The `relationName` "consequencesByConflict" links to the corresponding relation on the `consequences` table.
 *
 * - **`affectedByConsequences`**: Represents consequences from other events that **affect** this conflict.
 *   - It joins on `consequences.affectedConflictId` -> `conflicts.id`.
 *   - The `relationName` "consequencesAffectingConflict" provides the distinction from the above.
 *
 * Drizzle ORM uses the `relationName` to distinguish between multiple relationships to the same table.
 *
 * ### Other Relations
 * - `primaryRegion`: The main geographical location of the conflict.
 * - `participants`: Links to the factions and NPCs involved in the conflict via the `conflictParticipants` join table.
 * - Other relations connect the conflict to broader narrative and world-building elements.
 */
export const conflictsRelations = relations(conflicts, ({ one, many }) => ({
	primaryRegion: one(regions, {
		fields: [conflicts.regionId],
		references: [regions.id],
		relationName: "regionConflicts",
	}),
	participants: many(conflictParticipants, { relationName: "conflictParticipants" }),
	consequences: many(consequences, { relationName: "consequencesByConflict" }),
	affectedByConsequences: many(consequences, { relationName: "consequencesAffectingConflict" }),
	narrativeDestinations: many(narrativeDestinations, { relationName: "conflictNarrativeDestinations" }),
	foreshadowingSeeds: many(foreshadowing, { relationName: "foreshadowedConflict" }),
	itemRelationships: many(itemRelationships, { relationName: "conflictItemRelationships" }),
	worldConceptLinks: many(worldConceptLinks, { relationName: "conflictWorldConceptLinks" }),
}))

/**
 * ## `conflictParticipantsRelations`
 *
 * This defines the relationships for the `conflictParticipants` join table, linking a conflict
 * to the factions and NPCs participating in it.
 *
 * Each relation here is a many-to-one, connecting the participant entry back to the core entities.
 */
export const conflictParticipantsRelations = relations(conflictParticipants, ({ one }) => ({
	conflict: one(conflicts, {
		fields: [conflictParticipants.conflictId],
		references: [conflicts.id],
		relationName: "conflictParticipants",
	}),
	faction: one(factions, {
		fields: [conflictParticipants.factionId],
		references: [factions.id],
		relationName: "factionConflicts",
	}),
	npc: one(npcs, {
		fields: [conflictParticipants.npcId],
		references: [npcs.id],
		relationName: "npcConflicts",
	}),
}))
