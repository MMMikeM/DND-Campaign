// world/relations.ts
import { relations } from "drizzle-orm"
import { conflicts } from "../conflict/tables"
import { factions } from "../factions/tables"
import { narrativeDestinations } from "../narrative-destinations/tables"
import { npcs } from "../npc/tables"
import { questStages, quests, stageDecisions } from "../quests/tables"
import { areas, regions, sites } from "../regions/tables"
import { consequences, narrativeEvents } from "./tables"

export const narrativeEventsRelations = relations(narrativeEvents, ({ one }) => ({
	questStage: one(questStages, {
		fields: [narrativeEvents.questStageId],
		references: [questStages.id],
		relationName: "stageEvents",
	}),

	triggeringDecision: one(stageDecisions, {
		fields: [narrativeEvents.triggeringDecisionId],
		references: [stageDecisions.id],
		relationName: "decisionTriggeredEvents",
	}),
	relatedQuest: one(quests, {
		fields: [narrativeEvents.relatedQuestId],
		references: [quests.id],
		relationName: "questEvents",
	}),
}))

export const consequencesRelations = relations(consequences, ({ one }) => ({
	triggerQuest: one(quests, {
		fields: [consequences.triggerQuestId],
		references: [quests.id],
		relationName: "consequencesByQuest",
	}),
	triggerDecision: one(stageDecisions, {
		fields: [consequences.triggerDecisionId],
		references: [stageDecisions.id],
		relationName: "consequencesByDecision",
	}),
	triggerConflict: one(conflicts, {
		fields: [consequences.triggerConflictId],
		references: [conflicts.id],
		relationName: "consequencesByConflict",
	}),

	affectedDestination: one(narrativeDestinations, {
		fields: [consequences.affectedDestinationId],
		references: [narrativeDestinations.id],
		relationName: "consequencesForDestination",
	}),
	affectedFaction: one(factions, {
		fields: [consequences.affectedFactionId],
		references: [factions.id],
		relationName: "consequencesAffectingFaction",
	}),
	affectedRegion: one(regions, {
		fields: [consequences.affectedRegionId],
		references: [regions.id],
		relationName: "consequencesInRegion",
	}),
	affectedArea: one(areas, {
		fields: [consequences.affectedAreaId],
		references: [areas.id],
		relationName: "consequencesInArea",
	}),
	affectedSite: one(sites, {
		fields: [consequences.affectedSiteId],
		references: [sites.id],
		relationName: "consequencesAtSite",
	}),
	affectedNpc: one(npcs, {
		fields: [consequences.affectedNpcId],
		references: [npcs.id],
		relationName: "consequencesAffectingNpc",
	}),
	affectedConflict: one(conflicts, {
		fields: [consequences.affectedConflictId],
		references: [conflicts.id],
		relationName: "consequencesAffectingConflict",
	}),

	futureQuest: one(quests, {
		fields: [consequences.futureQuestId],
		references: [quests.id],
		relationName: "consequenceLeadsToQuest",
	}),
}))
