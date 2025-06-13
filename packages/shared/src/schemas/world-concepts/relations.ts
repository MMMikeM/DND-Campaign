// worldbuilding/relations.ts
import { relations } from "drizzle-orm"
import { conflicts } from "../conflicts/tables"
import { factions } from "../factions/tables"
import { itemRelationships } from "../items/tables"
import { npcs } from "../npcs/tables"
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
	sourceWorldConcept: one(worldConcepts, {
		fields: [worldConceptRelationships.sourceWorldConceptId],
		references: [worldConcepts.id],
		relationName: "sourceWorldConceptInRelationship",
	}),
	targetWorldConcept: one(worldConcepts, {
		fields: [worldConceptRelationships.targetWorldConceptId],
		references: [worldConcepts.id],
		relationName: "targetWorldConceptInRelationship",
	}),
}))

export const worldConceptLinksRelations = relations(worldConceptLinks, ({ one }) => ({
	worldConcept: one(worldConcepts, {
		fields: [worldConceptLinks.worldConceptId],
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
