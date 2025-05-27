// worldbuilding/relations.ts
import { relations } from "drizzle-orm"
import { majorConflicts } from "../conflict/tables"
import { embeddings } from "../embeddings/tables"
import { factions } from "../factions/tables"
import { foreshadowingSeeds } from "../foreshadowing/tables"
import { itemRelationships } from "../items/tables"
import { narrativeDestinations } from "../narrative/tables"
import { npcs } from "../npc/tables"
import { quests } from "../quests/tables"
import { areas, regions, sites } from "../regions/tables"
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
		fields: [worldConceptLinks.worldConceptId],
		references: [worldConcepts.id],
		relationName: "worldConceptLinks",
	}),

	// Polymorphic relations to different entity types
	linkedRegion: one(regions, {
		fields: [worldConceptLinks.linkedRegionId],
		references: [regions.id],
		relationName: "regionWorldConceptLinks",
	}),
	linkedArea: one(areas, {
		fields: [worldConceptLinks.linkedAreaId],
		references: [areas.id],
		relationName: "areaWorldConceptLinks",
	}),
	linkedSite: one(sites, {
		fields: [worldConceptLinks.linkedSiteId],
		references: [sites.id],
		relationName: "siteWorldConceptLinks",
	}),
	linkedNpc: one(npcs, {
		fields: [worldConceptLinks.linkedNpcId],
		references: [npcs.id],
		relationName: "npcWorldConceptLinks",
	}),
	linkedFaction: one(factions, {
		fields: [worldConceptLinks.linkedFactionId],
		references: [factions.id],
		relationName: "factionWorldConceptLinks",
	}),
	linkedQuest: one(quests, {
		fields: [worldConceptLinks.linkedQuestId],
		references: [quests.id],
		relationName: "questWorldConceptLinks",
	}),
	linkedConflict: one(majorConflicts, {
		fields: [worldConceptLinks.linkedConflictId],
		references: [majorConflicts.id],
		relationName: "conflictWorldConceptLinks",
	}),
	linkedNarrativeDestination: one(narrativeDestinations, {
		fields: [worldConceptLinks.linkedNarrativeDestinationId],
		references: [narrativeDestinations.id],
		relationName: "narrativeDestinationWorldConceptLinks",
	}),
	linkedForeshadowingSeed: one(foreshadowingSeeds, {
		fields: [worldConceptLinks.linkedForeshadowingSeedId],
		references: [foreshadowingSeeds.id],
		relationName: "foreshadowingSeedWorldConceptLinks",
	}),
}))
