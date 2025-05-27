// worldbuilding/relations.ts
import { relations } from "drizzle-orm"
import { majorConflicts } from "../conflict/tables"
import { embeddings } from "../embeddings/tables"
import { factions } from "../factions/tables"
import { itemRelationships } from "../items/tables"
import { npcs } from "../npc/tables"
import { quests } from "../quests/tables"
import { regions } from "../regions/tables"
import { conceptRelationships, worldConceptLinks, worldConcepts } from "./tables"

export const worldConceptsRelations = relations(worldConcepts, ({ one, many }) => ({
	embedding: one(embeddings, {
		fields: [worldConcepts.embeddingId],
		references: [embeddings.id],
	}),

	sourceOfConceptRelationships: many(conceptRelationships, {
		relationName: "sourceConceptInRelationship",
	}),
	targetInConceptRelationships: many(conceptRelationships, {
		relationName: "targetConceptInRelationship",
	}),
	links: many(worldConceptLinks, {
		relationName: "worldConceptLinks",
	}),
	itemRelationships: many(itemRelationships, { relationName: "worldConceptItemRelationships" }),
}))

export const conceptRelationshipsRelations = relations(conceptRelationships, ({ one }) => ({
	sourceConcept: one(worldConcepts, {
		fields: [conceptRelationships.sourceConceptId],
		references: [worldConcepts.id],
		relationName: "sourceConceptInRelationship",
	}),
	targetConcept: one(worldConcepts, {
		fields: [conceptRelationships.targetConceptId],
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

	// Polymorphic relations to different entity types
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
	linkedConflict: one(majorConflicts, {
		fields: [worldConceptLinks.conflictId],
		references: [majorConflicts.id],
		relationName: "conflictWorldConceptLinks",
	}),
}))
