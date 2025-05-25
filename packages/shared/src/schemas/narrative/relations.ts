// narrative/relations.ts
import { relations } from "drizzle-orm"
import { embeddings } from "../embeddings/tables"
import { narrativeEvents, worldStateChanges } from "../events/tables"
import { factions } from "../factions/tables"
import { npcs } from "../npc/tables"
import { questStages, quests } from "../quests/tables"
import { sites } from "../regions/tables"
import { destinationContribution, narrativeDestinations, narrativeForeshadowing } from "./tables"

export const narrativeForeshadowingRelations = relations(narrativeForeshadowing, ({ one }) => ({
	sourceStage: one(questStages, {
		fields: [narrativeForeshadowing.questStageId],
		references: [questStages.id],
		relationName: "stageForeshadowing",
	}),
	sourceSite: one(sites, {
		fields: [narrativeForeshadowing.siteId],
		references: [sites.id],
		relationName: "siteForeshadowing",
	}),
	sourceNpc: one(npcs, {
		fields: [narrativeForeshadowing.npcId],
		references: [npcs.id],
		relationName: "npcForeshadowingSource",
	}),
	sourceFaction: one(factions, {
		fields: [narrativeForeshadowing.factionId],
		references: [factions.id],
		relationName: "factionForeshadowingSource",
	}),

	foreshadowsQuest: one(quests, {
		fields: [narrativeForeshadowing.foreshadowsQuestId],
		references: [quests.id],
		relationName: "foreshadowsQuest",
	}),
	foreshadowsEvent: one(narrativeEvents, {
		fields: [narrativeForeshadowing.foreshadowsEventId],
		references: [narrativeEvents.id],
		relationName: "foreshadowsEvent",
	}),
	foreshadowsNpc: one(npcs, {
		fields: [narrativeForeshadowing.foreshadowsNpcId],
		references: [npcs.id],
		relationName: "foreshadowsNpc",
	}),
	foreshadowedDestination: one(narrativeDestinations, {
		fields: [narrativeForeshadowing.foreshadowsDestinationId],
		references: [narrativeDestinations.id],
		relationName: "foreshadowedDestination",
	}),
	embedding: one(embeddings, {
		fields: [narrativeForeshadowing.embeddingId],
		references: [embeddings.id],
	}),
}))

export const narrativeRelations = relations(narrativeDestinations, ({ many, one }) => ({
	destinationContributions: many(destinationContribution),
	worldStateChanges: many(worldStateChanges, {
		relationName: "worldChangesForDestination",
	}),
	foreshadowing: many(narrativeForeshadowing, {
		relationName: "foreshadowingEntries",
	}),
	embedding: one(embeddings, {
		fields: [narrativeDestinations.embeddingId],
		references: [embeddings.id],
	}),
}))

export const destinationContributionRelations = relations(destinationContribution, ({ one }) => ({
	destination: one(narrativeDestinations, {
		fields: [destinationContribution.destinationId],
		references: [narrativeDestinations.id],
	}),
	quest: one(quests, {
		fields: [destinationContribution.questId],
		references: [quests.id],
	}),
}))
