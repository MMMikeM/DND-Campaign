// quests/stages/relations.ts
import { relations } from "drizzle-orm"
import { consequences } from "../consequences/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { itemConnections, items } from "../items/tables"
import { npcs } from "../npcs/tables"
import { quests } from "../quests/tables"
import { sites } from "../regions/tables"
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

	outgoingDecisions: many(questStageDecisions, { relationName: "sourceStageForDecisions" }),
	incomingDecisions: many(questStageDecisions, { relationName: "targetStageForDecisions" }),

	itemConnections: many(itemConnections, { relationName: "questStageItemConnections" }),
	npcInvolvement: many(npcStageInvolvement),
	outgoingForeshadowing: many(foreshadowing, { relationName: "ForeshadowingSourceQuestStage" }),
}))

export const questStageDecisionsRelations = relations(questStageDecisions, ({ one, many }) => ({
	quest: one(quests, {
		fields: [questStageDecisions.questId],
		references: [quests.id],
		relationName: "questForStageDecision",
	}),
	sourceStage: one(questStages, {
		fields: [questStageDecisions.fromQuestStageId],
		references: [questStages.id],
		relationName: "sourceStageForDecisions",
	}),
	targetStage: one(questStages, {
		fields: [questStageDecisions.toQuestStageId],
		references: [questStages.id],
		relationName: "targetStageForDecisions",
	}),

	consequences: many(consequences, { relationName: "ConsequenceTriggerQuestStageDecision" }),
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
