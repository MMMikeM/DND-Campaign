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
import * as stageModule from "./stages/relations"
import { questStages } from "./stages/tables"
import { questHooks, questParticipants, questRelations, quests } from "./tables"

const { npcStageInvolvementRelations, questStagesRelations, questStageDecisionsRelations } = stageModule
export { npcStageInvolvementRelations, questStagesRelations, questStageDecisionsRelations }

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

	consequences: many(consequences),
	triggeredEvents: many(narrativeEvents),
	outgoingForeshadowing: many(foreshadowing, { relationName: "foreshadowingFromQuest" }),
	incomingForeshadowing: many(foreshadowing, { relationName: "foreshadowingForQuest" }),
	itemRelations: many(itemRelations),
	loreLinks: many(loreLinks),
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
