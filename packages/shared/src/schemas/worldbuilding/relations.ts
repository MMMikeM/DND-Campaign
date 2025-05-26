// worldbuilding/relations.ts
import { relations } from "drizzle-orm"
import { majorConflicts } from "../conflict/tables"
import { embeddings } from "../embeddings/tables"
import { factions } from "../factions/tables"
import { npcs } from "../npc/tables"
import { quests } from "../quests/tables"
import { regions } from "../regions/tables"
import {
	conceptFactions,
	conceptKeyFigures,
	conceptRegions,
	conceptRelationships,
	conceptWorldConnections,
	culturalGroups,
	historicalPeriods,
	socialInstitutions,
	worldConcepts,
} from "./tables"

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

	regionsAssociated: many(conceptRegions, {
		relationName: "conceptLinkedToRegion",
	}),
	factionsAssociated: many(conceptFactions, {
		relationName: "conceptLinkedToFaction",
	}),
	keyFiguresAssociated: many(conceptKeyFigures, {
		relationName: "conceptLinkedToKeyFigure",
	}),
	worldConnections: many(conceptWorldConnections, {
		relationName: "conceptInWorldConnection",
	}),

	culturalGroupDetails: one(culturalGroups, {
		fields: [worldConcepts.id],
		references: [culturalGroups.conceptId],
		relationName: "culturalGroupConcept",
	}),
	historicalPeriodDetails: one(historicalPeriods, {
		fields: [worldConcepts.id],
		references: [historicalPeriods.conceptId],
		relationName: "historicalPeriodConcept",
	}),
	socialInstitutionDetails: one(socialInstitutions, {
		fields: [worldConcepts.id],
		references: [socialInstitutions.conceptId],
		relationName: "socialInstitutionConcept",
	}),
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

export const conceptRegionsRelations = relations(conceptRegions, ({ one }) => ({
	concept: one(worldConcepts, {
		fields: [conceptRegions.conceptId],
		references: [worldConcepts.id],
		relationName: "conceptLinkedToRegion",
	}),
	region: one(regions, {
		fields: [conceptRegions.regionId],
		references: [regions.id],
		relationName: "regionWorldConcepts",
	}),
}))

export const conceptFactionsRelations = relations(conceptFactions, ({ one }) => ({
	concept: one(worldConcepts, {
		fields: [conceptFactions.conceptId],
		references: [worldConcepts.id],
		relationName: "conceptLinkedToFaction",
	}),
	faction: one(factions, {
		fields: [conceptFactions.factionId],
		references: [factions.id],
		relationName: "factionWorldConcepts",
	}),
}))

export const conceptKeyFiguresRelations = relations(conceptKeyFigures, ({ one }) => ({
	concept: one(worldConcepts, {
		fields: [conceptKeyFigures.conceptId],
		references: [worldConcepts.id],
		relationName: "conceptLinkedToKeyFigure",
	}),
	npc: one(npcs, {
		fields: [conceptKeyFigures.npcId],
		references: [npcs.id],
		relationName: "npcWorldConcepts",
	}),
}))

export const conceptWorldConnectionsRelations = relations(conceptWorldConnections, ({ one }) => ({
	concept: one(worldConcepts, {
		fields: [conceptWorldConnections.conceptId],
		references: [worldConcepts.id],
		relationName: "conceptInWorldConnection",
	}),
	conflict: one(majorConflicts, {
		fields: [conceptWorldConnections.conflictId],
		references: [majorConflicts.id],
		relationName: "conflictWorldConcepts",
	}),
	quest: one(quests, {
		fields: [conceptWorldConnections.questId],
		references: [quests.id],
		relationName: "questWorldConcepts",
	}),
}))

export const culturalGroupsRelations = relations(culturalGroups, ({ one }) => ({
	concept: one(worldConcepts, {
		fields: [culturalGroups.conceptId],
		references: [worldConcepts.id],
		relationName: "culturalGroupConcept",
	}),
}))

export const historicalPeriodsRelations = relations(historicalPeriods, ({ one }) => ({
	concept: one(worldConcepts, {
		fields: [historicalPeriods.conceptId],
		references: [worldConcepts.id],
		relationName: "historicalPeriodConcept",
	}),
}))

export const socialInstitutionsRelations = relations(socialInstitutions, ({ one }) => ({
	concept: one(worldConcepts, {
		fields: [socialInstitutions.conceptId],
		references: [worldConcepts.id],
		relationName: "socialInstitutionConcept",
	}),
}))
