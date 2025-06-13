// quests/stages/relations.ts
import { relations } from "drizzle-orm"
import { foreshadowing } from "../../foreshadowing/tables"
import { items } from "../../items/tables"
import { consequences, narrativeEvents } from "../../narrative-events/tables"
import { npcs } from "../../npcs/tables"
import { sites } from "../../regions/tables"
import { quests } from "../tables"
import { npcStageInvolvement, questStages, stageDecisions } from "./tables"

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
	decisionsFrom: many(stageDecisions, {
		relationName: "decisionsFromStage",
	}),
	decisionsTo: many(stageDecisions, {
		relationName: "decisionsToStage",
	}),
	items: many(items),
	narrativeEvents: many(narrativeEvents),
	npcInvolvement: many(npcStageInvolvement),
	foreshadowingSource: many(foreshadowing, { relationName: "foreshadowingFromQuestStage" }),
}))

export const stageDecisionsRelations = relations(stageDecisions, ({ one, many }) => ({
	quest: one(quests, {
		fields: [stageDecisions.questId],
		references: [quests.id],
	}),
	fromStage: one(questStages, {
		fields: [stageDecisions.fromQuestStageId],
		references: [questStages.id],
		relationName: "decisionsFromStage",
	}),
	toStage: one(questStages, {
		fields: [stageDecisions.toQuestStageId],
		references: [questStages.id],
		relationName: "decisionsToStage",
	}),

	triggeredEvents: many(narrativeEvents),
	consequences: many(consequences),
}))

export const npcStageInvolvementRelations = relations(npcStageInvolvement, ({ one }) => ({
	npc: one(npcs, {
		fields: [npcStageInvolvement.npcId],
		references: [npcs.id],
	}),
	questStage: one(questStages, {
		fields: [npcStageInvolvement.questStageId],
		references: [questStages.id],
	}),
}))
