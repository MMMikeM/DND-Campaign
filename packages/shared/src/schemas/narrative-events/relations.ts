// world/relations.ts
import { relations } from "drizzle-orm"
import { conflicts } from "../conflicts/tables"
import { factions } from "../factions/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { narrativeDestinations } from "../narrative-destinations/tables"
import { npcs } from "../npcs/tables"
import { questStages, quests, stageDecisions } from "../quests/tables"
import { areas, regions, sites } from "../regions/tables"
import { consequences, narrativeEvents } from "./tables"

export const narrativeEventsRelations = relations(narrativeEvents, ({ one, many }) => ({
	questStage: one(questStages, {
		fields: [narrativeEvents.questStageId],
		references: [questStages.id],
	}),

	triggeringStageDecision: one(stageDecisions, {
		fields: [narrativeEvents.triggeringStageDecisionId],
		references: [stageDecisions.id],
	}),
	relatedQuest: one(quests, {
		fields: [narrativeEvents.relatedQuestId],
		references: [quests.id],
	}),
	foreshadowingTarget: many(foreshadowing, { relationName: "foreshadowingForNarrativeEvent" }),
}))

export const consequencesRelations = relations(consequences, ({ one }) => ({
	triggerQuest: one(quests, {
		fields: [consequences.triggerQuestId],
		references: [quests.id],
	}),
	triggerStageDecision: one(stageDecisions, {
		fields: [consequences.triggerStageDecisionId],
		references: [stageDecisions.id],
	}),
	triggerConflict: one(conflicts, {
		fields: [consequences.triggerConflictId],
		references: [conflicts.id],
	}),

	affectedDestination: one(narrativeDestinations, {
		fields: [consequences.affectedDestinationId],
		references: [narrativeDestinations.id],
	}),
	affectedFaction: one(factions, {
		fields: [consequences.affectedFactionId],
		references: [factions.id],
	}),
	affectedRegion: one(regions, {
		fields: [consequences.affectedRegionId],
		references: [regions.id],
	}),
	affectedArea: one(areas, {
		fields: [consequences.affectedAreaId],
		references: [areas.id],
	}),
	affectedSite: one(sites, {
		fields: [consequences.affectedSiteId],
		references: [sites.id],
	}),
	affectedNpc: one(npcs, {
		fields: [consequences.affectedNpcId],
		references: [npcs.id],
	}),
	affectedConflict: one(conflicts, {
		fields: [consequences.affectedConflictId],
		references: [conflicts.id],
	}),
	affectedQuest: one(quests, {
		fields: [consequences.affectedQuestId],
		references: [quests.id],
	}),
}))
