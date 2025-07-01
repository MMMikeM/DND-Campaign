// quests/relations.ts
import { relations } from "drizzle-orm"
import { consequences } from "../consequences/tables"
import { factions } from "../factions/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { itemConnections } from "../items/tables"
import { loreLinks } from "../lore/tables"
import { npcs } from "../npcs/tables"
import { sites } from "../regions/tables"
import { questStageDecisions, questStages } from "../stages/tables"
import { questHooks, questParticipants, questRelations, quests } from "./tables"

export const questsRelations = relations(quests, ({ many, one }) => ({
	prerequisiteQuest: one(quests, {
		fields: [quests.prerequisiteQuestId],
		references: [quests.id],
		relationName: "PrerequisiteQuest",
	}),
	dependentQuests: many(quests, {
		relationName: "PrerequisiteQuest",
	}),
	outgoingRelations: many(questRelations, {
		relationName: "questoutgoingRelations",
	}),
	incomingRelations: many(questRelations, {
		relationName: "questincomingRelations",
	}),
	stages: many(questStages),
	stageDecisions: many(questStageDecisions, { relationName: "questForStageDecision" }),

	hooks: many(questHooks),
	participants: many(questParticipants),

	triggeredConsequences: many(consequences, { relationName: "ConsequenceTriggerQuest" }),
	affectingConsequences: many(consequences, { relationName: "ConsequenceAffectedQuest" }),
	outgoingForeshadowing: many(foreshadowing, { relationName: "ForeshadowingSourceQuest" }),
	incomingForeshadowing: many(foreshadowing, { relationName: "ForeshadowingTargetQuest" }),
	itemRelations: many(itemConnections, { relationName: "questItemRelations" }),
	loreLinks: many(loreLinks, { relationName: "LoreLinkTargetQuest" }),
}))

export const questRelationTargets = relations(questRelations, ({ one }) => ({
	sourceQuest: one(quests, {
		fields: [questRelations.sourceQuestId],
		references: [quests.id],
		relationName: "questoutgoingRelations",
	}),
	targetQuest: one(quests, {
		fields: [questRelations.targetQuestId],
		references: [quests.id],
		relationName: "questincomingRelations",
	}),
}))

export const questHooksRelations = relations(questHooks, ({ one }) => ({
	quest: one(quests, {
		fields: [questHooks.questId],
		references: [quests.id],
	}),
	site: one(sites, {
		fields: [questHooks.siteId],
		references: [sites.id],
	}),
	faction: one(factions, {
		fields: [questHooks.factionId],
		references: [factions.id],
	}),
	deliveryNpc: one(npcs, {
		fields: [questHooks.deliveryNpcId],
		references: [npcs.id],
	}),
}))

export const questParticipantsRelations = relations(questParticipants, ({ one }) => ({
	quest: one(quests, {
		fields: [questParticipants.questId],
		references: [quests.id],
	}),
	npc: one(npcs, {
		fields: [questParticipants.npcId],
		references: [npcs.id],
	}),
	faction: one(factions, {
		fields: [questParticipants.factionId],
		references: [factions.id],
	}),
}))
