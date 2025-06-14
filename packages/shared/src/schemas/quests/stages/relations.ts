// quests/stages/relations.ts
import { relations } from "drizzle-orm"
import { foreshadowing } from "../../foreshadowing/tables"
import { items } from "../../items/tables"
import { consequences, narrativeEvents } from "../../narrative-events/tables" // Assuming consequences might be needed
import { npcs } from "../../npcs/tables"
import { sites } from "../../regions/tables"
import { quests } from "../tables"
import { npcStageInvolvement, questStageDecisions, questStages } from "./tables"

export const questStagesRelations = relations(questStages, ({ one, many }) => ({
	quest: one(quests, {
		fields: [questStages.questId],
		references: [quests.id],
	}),
	site: one(sites, {
		fields: [questStages.siteId],
		references: [sites.id],
	}),
	deliveryNpc: one(npcs, {
		fields: [questStages.deliveryNpcId],
		references: [npcs.id],
	}),

	outgoingDecisions: many(questStageDecisions, { relationName: "decisionsFromStage" }),
	incomingDecisions: many(questStageDecisions, { relationName: "decisionsToStage" }),

	items: many(items),
	narrativeEvents: many(narrativeEvents),
	npcInvolvement: many(npcStageInvolvement),
	foreshadowingSource: many(foreshadowing, { relationName: "foreshadowingFromQuestStage" }),
}))

export const questStageDecisionsRelations = relations(questStageDecisions, ({ one, many }) => ({
	quest: one(quests, {
		fields: [questStageDecisions.questId],
		references: [quests.id],
	}),
	fromStage: one(questStages, {
		fields: [questStageDecisions.fromQuestStageId],
		references: [questStages.id],
		relationName: "decisionsFromStage",
	}),
	toStage: one(questStages, {
		fields: [questStageDecisions.toQuestStageId],
		references: [questStages.id],
		relationName: "decisionsToStage",
	}),

	triggeredEvents: many(narrativeEvents),
	consequences: many(consequences),
}))

export const npcStageInvolvementRelations = relations(npcStageInvolvement, ({ one }) => ({
	questStage: one(questStages, {
		fields: [npcStageInvolvement.questStageId],
		references: [questStages.id],
	}),
	npc: one(npcs, {
		fields: [npcStageInvolvement.npcId],
		references: [npcs.id],
	}),
}))
