// worldbuilding/relations.ts
import { relations } from "drizzle-orm"
import { conflicts } from "../conflict/tables"
import { factions } from "../factions/tables"
import { itemRelationships } from "../items/tables"
import { npcs } from "../npc/tables"
import { quests } from "../quests/tables"
import { regions } from "../regions/tables"
import { worldConceptLinks, worldConceptRelationships, worldConcepts } from "./tables"

export const worldConceptsRelations = relations(worldConcepts, ({ many }) => ({
	sourceOfConceptRelationships: many(worldConceptRelationships, {
		relationName: "sourceConceptInRelationship",
	}),
	targetInConceptRelationships: many(worldConceptRelationships, {
		relationName: "targetConceptInRelationship",
	}),
	links: many(worldConceptLinks, {
		relationName: "worldConceptLinks",
	}),
	itemRelationships: many(itemRelationships, { relationName: "worldConceptItemRelationships" }),
}))

export const worldConceptRelationshipsRelations = relations(worldConceptRelationships, ({ one }) => ({
	sourceConcept: one(worldConcepts, {
		fields: [worldConceptRelationships.sourceConceptId],
		references: [worldConcepts.id],
		relationName: "sourceConceptInRelationship",
	}),
	targetConcept: one(worldConcepts, {
		fields: [worldConceptRelationships.targetConceptId],
		references: [worldConcepts.id],
		relationName: "targetConceptInRelationship",
	}),
}))

export const worldConceptLinksRelations = relations(worldConceptLinks, ({ one }) => ({
	worldConcept: one(worldConcepts, {
		fields: [worldConceptLinks.conceptId],
		references: [worldConcepts.id],
		relationName: "worldConceptLinks",
	}),

	linkedRegion: one(regions, {
		fields: [worldConceptLinks.regionId],
		references: [regions.id],
		relationName: "regionWorldConceptLinks",
	}),
	linkedNpc: one(npcs, {
		fields: [worldConceptLinks.npcId],
		references: [npcs.id],
		relationName: "npcWorldConceptLinks",
	}),
	linkedFaction: one(factions, {
		fields: [worldConceptLinks.factionId],
		references: [factions.id],
		relationName: "factionWorldConceptLinks",
	}),
	linkedQuest: one(quests, {
		fields: [worldConceptLinks.questId],
		references: [quests.id],
		relationName: "questWorldConceptLinks",
	}),
	linkedConflict: one(conflicts, {
		fields: [worldConceptLinks.conflictId],
		references: [conflicts.id],
		relationName: "conflictWorldConceptLinks",
	}),
}))
