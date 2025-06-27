// quests/relations.ts
import { relations } from "drizzle-orm"
import { factions } from "../factions/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { itemRelations } from "../items/tables"
import { loreLinks } from "../lore/tables"
import { narrativeDestinationQuestRoles } from "../narrative-destinations/tables"
import { consequences, narrativeEvents } from "../narrative-events/tables"
import { npcs } from "../npcs/tables"
import { regions, sites } from "../regions/tables"
import { questStages } from "../stages/tables"
import { questHooks, questParticipants, questRelations, quests } from "./tables"

export const questsRelations = relations(quests, ({ many, one }) => ({
	region: one(regions, {
		fields: [quests.regionId],
		references: [regions.id],
	}),
	outgoingRelations: many(questRelations, {
		relationName: "questoutgoingRelations",
	}),
	incomingRelations: many(questRelations, {
		relationName: "questincomingRelations",
	}),
	stages: many(questStages),

	hooks: many(questHooks),
	participants: many(questParticipants),
	narrativeDestinationContributions: many(narrativeDestinationQuestRoles),

	triggeredConsequences: many(consequences, { relationName: "ConsequenceTriggerQuest" }),
	affectingConsequences: many(consequences, { relationName: "ConsequenceAffectedQuest" }),
	triggeredEvents: many(narrativeEvents, { relationName: "QuestTriggeredEvents" }),
	outgoingForeshadowing: many(foreshadowing, { relationName: "ForeshadowingSourceQuest" }),
	incomingForeshadowing: many(foreshadowing, { relationName: "ForeshadowingTargetQuest" }),
	itemRelations: many(itemRelations, { relationName: "questItemRelations" }),
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
