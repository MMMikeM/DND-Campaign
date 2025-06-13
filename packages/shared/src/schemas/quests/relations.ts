// quests/relations.ts
import { relations } from "drizzle-orm"
import { factions } from "../factions/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { itemRelationships } from "../items/tables"
import { narrativeDestinationQuestRoles } from "../narrative-destinations/tables"
import { consequences, narrativeEvents } from "../narrative-events/tables"
import { npcs } from "../npcs/tables"
import { regions, sites } from "../regions/tables"
import { worldConceptLinks } from "../world-concepts/tables"
import { questStages } from "./stages/tables"
import { questHooks, questParticipants, questRelationships, quests } from "./tables"

export const questsRelations = relations(quests, ({ many, one }) => ({
	region: one(regions, {
		fields: [quests.regionId],
		references: [regions.id],
	}),
	outgoingRelationships: many(questRelationships, {
		relationName: "questOutgoingRelationships",
	}),
	incomingRelationships: many(questRelationships, {
		relationName: "questIncomingRelationships",
	}),
	stages: many(questStages),

	hooks: many(questHooks),
	participants: many(questParticipants),
	narrativeDestinationContributions: many(narrativeDestinationQuestRoles),

	consequences: many(consequences),
	triggeredEvents: many(narrativeEvents),
	foreshadowingSource: many(foreshadowing, { relationName: "foreshadowingFromQuest" }),
	foreshadowingTarget: many(foreshadowing, { relationName: "foreshadowingForQuest" }),
	itemRelationships: many(itemRelationships),
	worldConceptLinks: many(worldConceptLinks),
}))

export const questRelationshipsRelations = relations(questRelationships, ({ one }) => ({
	sourceQuest: one(quests, {
		fields: [questRelationships.sourceQuestId],
		references: [quests.id],
		relationName: "questOutgoingRelationships",
	}),
	targetQuest: one(quests, {
		fields: [questRelationships.targetQuestId],
		references: [quests.id],
		relationName: "questIncomingRelationships",
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
