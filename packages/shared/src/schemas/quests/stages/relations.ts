// quests/stages/relations.ts
import { relations } from "drizzle-orm"
import { consequences, narrativeEvents } from "../../events/tables"
import { foreshadowing } from "../../foreshadowing/tables"
import { items } from "../../items/tables"
import { npcs } from "../../npc/tables"
import { sites } from "../../regions/tables"
import { quests } from "../tables"
import { npcStageInvolvement, questStages, stageDecisions } from "./tables"

export const questStagesRelations = relations(questStages, ({ one, many }) => ({
	quest: one(quests, {
		fields: [questStages.questId],
		references: [quests.id],
		relationName: "questStages",
	}),
	site: one(sites, {
		fields: [questStages.siteId],
		references: [sites.id],
		relationName: "siteQuestStages",
	}),
	deliveryNpc: one(npcs, {
		fields: [questStages.deliveryNpcId],
		references: [npcs.id],
		relationName: "npcQuestStageDeliveries",
	}),
	decisionsFrom: many(stageDecisions, {
		relationName: "decisionsFromStage",
	}),
	decisionsTo: many(stageDecisions, {
		relationName: "decisionsToStage",
	}),
	items: many(items, { relationName: "stageItems" }),
	narrativeEvents: many(narrativeEvents, {
		relationName: "stageEvents",
	}),
	npcInvolvement: many(npcStageInvolvement, {
		relationName: "stageNpcInvolvement",
	}),
	foreshadowingSeeds: many(foreshadowing, {
		relationName: "stageForeshadowingSeeds",
	}),
}))

export const stageDecisionsRelations = relations(stageDecisions, ({ one, many }) => ({
	quest: one(quests, {
		fields: [stageDecisions.questId],
		references: [quests.id],
		relationName: "questDecisions",
	}),
	fromStage: one(questStages, {
		fields: [stageDecisions.fromStageId],
		references: [questStages.id],
		relationName: "decisionsFromStage",
	}),
	toStage: one(questStages, {
		fields: [stageDecisions.toStageId],
		references: [questStages.id],
		relationName: "decisionsToStage",
	}),

	triggeredEvents: many(narrativeEvents, {
		relationName: "decisionTriggeredEvents",
	}),
	consequences: many(consequences, { relationName: "consequencesByDecision" }),
}))

export const npcStageInvolvementRelations = relations(npcStageInvolvement, ({ one }) => ({
	npc: one(npcs, {
		fields: [npcStageInvolvement.npcId],
		references: [npcs.id],
		relationName: "npcStageInvolvement",
	}),
	questStage: one(questStages, {
		fields: [npcStageInvolvement.questStageId],
		references: [questStages.id],
		relationName: "stageNpcInvolvement",
	}),
}))
