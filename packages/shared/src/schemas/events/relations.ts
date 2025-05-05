import { relations } from "drizzle-orm"
import { narrativeForeshadowing } from "../foreshadowing/tables"
import { questStages, quests, stageDecisions } from "../quests/tables"
import { narrativeEvents } from "./tables"

export const narrativeEventsRelations = relations(narrativeEvents, ({ one, many }) => ({
	questStage: one(questStages, {
		fields: [narrativeEvents.questStageId],
		references: [questStages.id],
	}),
	triggeringDecision: one(stageDecisions, {
		fields: [narrativeEvents.triggeringDecisionId],
		references: [stageDecisions.id],
	}),
	relatedQuest: one(quests, {
		fields: [narrativeEvents.relatedQuestId],
		references: [quests.id],
	}),
	foreshadowedBy: many(narrativeForeshadowing, {
		relationName: "foreshadowsEvent",
	}),
}))
