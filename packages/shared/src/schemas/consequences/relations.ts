// consequences/relations.ts
import { relations } from "drizzle-orm"
import { conflicts } from "../conflicts/tables"
import { factions } from "../factions/tables"
import { npcs } from "../npcs/tables"
import { quests } from "../quests/tables"
import { areas, regions, sites } from "../regions/tables"
import { questStageDecisions } from "../stages/tables"
import { consequences } from "./tables"

export const consequenceRelations = relations(consequences, ({ one, many }) => ({
	// Self-referencing relations
	affectedConsequence: one(consequences, {
		fields: [consequences.affectedConsequenceId],
		references: [consequences.id],
		relationName: "affectingConsequences",
	}),
	affectingConsequences: many(consequences, {
		relationName: "affectingConsequences",
	}),

	// Trigger relations
	triggerQuest: one(quests, {
		fields: [consequences.triggerQuestId],
		references: [quests.id],
		relationName: "ConsequenceTriggerQuest",
	}),

	triggerQuestStageDecision: one(questStageDecisions, {
		fields: [consequences.triggerQuestStageDecisionId],
		references: [questStageDecisions.id],
		relationName: "ConsequenceTriggerQuestStageDecision",
	}),

	// Affected entity relations
	affectedFaction: one(factions, {
		relationName: "ConsequenceAffectedFaction",
		fields: [consequences.affectedFactionId],
		references: [factions.id],
	}),
	affectedRegion: one(regions, {
		fields: [consequences.affectedRegionId],
		references: [regions.id],
		relationName: "ConsequenceAffectedRegion",
	}),
	affectedArea: one(areas, {
		fields: [consequences.affectedAreaId],
		references: [areas.id],
		relationName: "ConsequenceAffectedArea",
	}),
	affectedSite: one(sites, {
		fields: [consequences.affectedSiteId],
		references: [sites.id],
		relationName: "ConsequenceAffectedSite",
	}),
	affectedNpc: one(npcs, {
		fields: [consequences.affectedNpcId],
		references: [npcs.id],
		relationName: "ConsequenceAffectedNpc",
	}),
	affectedConflict: one(conflicts, {
		fields: [consequences.affectedConflictId],
		references: [conflicts.id],
		relationName: "ConsequenceAffectedConflict",
	}),
	affectedQuest: one(quests, {
		fields: [consequences.affectedQuestId],
		references: [quests.id],
		relationName: "ConsequenceAffectedQuest",
	}),
}))
