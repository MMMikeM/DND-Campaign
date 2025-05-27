// quests/stages/relations.ts
import { relations } from "drizzle-orm"
import { embeddings } from "../../embeddings/tables"
import { consequences, narrativeEvents } from "../../events/tables"
import { foreshadowingSeeds } from "../../foreshadowing/tables"
import { items } from "../../items/tables"
import { npcs } from "../../npc/tables"
import { sites } from "../../regions/tables"
import { quests } from "../tables"
import { questStages, stageDecisions } from "./tables"

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
	deliveryNpcs: many(npcs, {
		relationName: "npcQuestDeliveries",
	}),
	foreshadowingSeeds: many(foreshadowingSeeds, {
		relationName: "stageForeshadowingSeeds",
	}),

	embedding: one(embeddings, {
		fields: [questStages.embeddingId],
		references: [embeddings.id],
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
