// foreshadowing/relations.ts
import { relations } from "drizzle-orm"
import { narrativeEvents } from "../events/tables.js"
import { factions } from "../factions/tables.js"
import { narrativeDestinations } from "../narrative/tables.js"
import { npcs } from "../npc/tables.js"
import { questStages, quests } from "../quests/tables.js"
import { sites } from "../regions/tables.js"
import { narrativeForeshadowing } from "./tables.js"

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
}))
