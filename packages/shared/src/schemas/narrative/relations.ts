import { relations } from "drizzle-orm"
import { majorConflicts } from "../conflict/tables"
import { embeddings } from "../embeddings/tables"
import { consequences } from "../events/tables"
import { factions } from "../factions/tables"
import { npcs } from "../npc/tables"
import { questStages, quests } from "../quests/tables"
import { regions, sites } from "../regions/tables"
import {
	destinationFactionInvolvement,
	destinationForeshadowing,
	destinationNpcInvolvement,
	destinationQuestRoles,
	destinationRelationships,
	narrativeDestinations,
} from "./tables"

export const narrativeDestinationsRelations = relations(narrativeDestinations, ({ many, one }) => ({
	questsInDestination: many(destinationQuestRoles, {
		relationName: "destinationOfQuestRole",
	}),
	consequences: many(consequences, {
		relationName: "consequencesForDestination",
	}),
	embedding: one(embeddings, {
		fields: [narrativeDestinations.embeddingId],
		references: [embeddings.id],
	}),
	primaryRegion: one(regions, {
		fields: [narrativeDestinations.primaryRegionId],
		references: [regions.id],
		relationName: "regionNarrativeDestinations",
	}),
	relatedConflict: one(majorConflicts, {
		fields: [narrativeDestinations.relatedConflictId],
		references: [majorConflicts.id],
		relationName: "conflictNarrativeDestinations",
	}),
	sourceOfRelationships: many(destinationRelationships, {
		relationName: "sourceDestinationInRelationship",
	}),
	targetInRelationships: many(destinationRelationships, {
		relationName: "relatedDestinationInRelationship",
	}),
	foreshadowingEntries: many(destinationForeshadowing, {
		relationName: "destinationForeshadowed",
	}),
	npcInvolvements: many(destinationNpcInvolvement, {
		relationName: "destinationForNpcInvolvement",
	}),
	factionInvolvements: many(destinationFactionInvolvement, {
		relationName: "destinationForFactionInvolvement",
	}),
}))

export const destinationRelationshipsRelations = relations(destinationRelationships, ({ one }) => ({
	sourceDestination: one(narrativeDestinations, {
		fields: [destinationRelationships.sourceDestinationId],
		references: [narrativeDestinations.id],
		relationName: "sourceDestinationInRelationship",
	}),
	relatedDestination: one(narrativeDestinations, {
		fields: [destinationRelationships.relatedDestinationId],
		references: [narrativeDestinations.id],
		relationName: "relatedDestinationInRelationship",
	}),
}))

export const destinationQuestRolesRelations = relations(destinationQuestRoles, ({ one }) => ({
	destination: one(narrativeDestinations, {
		fields: [destinationQuestRoles.destinationId],
		references: [narrativeDestinations.id],
		relationName: "destinationOfQuestRole",
	}),
	quest: one(quests, {
		fields: [destinationQuestRoles.questId],
		references: [quests.id],
		relationName: "questDestinationContributions",
	}),
}))

export const destinationForeshadowingRelations = relations(destinationForeshadowing, ({ one }) => ({
	destination: one(narrativeDestinations, {
		fields: [destinationForeshadowing.destinationId],
		references: [narrativeDestinations.id],
		relationName: "destinationForeshadowed",
	}),
	questStage: one(questStages, {
		fields: [destinationForeshadowing.questStageId],
		references: [questStages.id],
		relationName: "stageForeshadowing",
	}),
	site: one(sites, {
		fields: [destinationForeshadowing.siteId],
		references: [sites.id],
		relationName: "siteForeshadowing",
	}),
	npc: one(npcs, {
		fields: [destinationForeshadowing.npcId],
		references: [npcs.id],
		relationName: "npcDeliversForeshadowing",
	}),
	embedding: one(embeddings, {
		fields: [destinationForeshadowing.embeddingId],
		references: [embeddings.id],
	}),
}))

export const destinationNpcInvolvementRelations = relations(destinationNpcInvolvement, ({ one }) => ({
	destination: one(narrativeDestinations, {
		fields: [destinationNpcInvolvement.destinationId],
		references: [narrativeDestinations.id],
		relationName: "destinationForNpcInvolvement",
	}),
	npc: one(npcs, {
		fields: [destinationNpcInvolvement.npcId],
		references: [npcs.id],
		relationName: "npcInvolvementInDestination",
	}),
}))

export const destinationFactionInvolvementRelations = relations(destinationFactionInvolvement, ({ one }) => ({
	destination: one(narrativeDestinations, {
		fields: [destinationFactionInvolvement.destinationId],
		references: [narrativeDestinations.id],
		relationName: "destinationForFactionInvolvement",
	}),
	faction: one(factions, {
		fields: [destinationFactionInvolvement.factionId],
		references: [factions.id],
		relationName: "factionInvolvementInDestination",
	}),
}))
