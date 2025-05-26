// quests/relations.ts
import { relations } from "drizzle-orm"
import { conflictProgression } from "../conflict/tables"
import { embeddings } from "../embeddings/tables"
import { consequences, narrativeEvents } from "../events/tables"
import { factions } from "../factions/tables"
import { investigations } from "../investigation/tables"
import { items } from "../items/tables"
import { destinationQuestRoles } from "../narrative/tables"
import { npcs } from "../npc/tables"
import { regions, sites } from "../regions/tables"
import { questStages } from "./stages/tables"
import {
	questFactionInvolvement,
	questHooks,
	questNpcInvolvement,
	questRelationships,
	quests,
	questUnlockConditions,
} from "./tables"

export const questsRelations = relations(quests, ({ many, one }) => ({
	region: one(regions, {
		fields: [quests.regionId],
		references: [regions.id],
		relationName: "regionQuests",
	}),
	dependencies: many(questRelationships, {
		relationName: "questDependencies",
	}),
	dependents: many(questRelationships, {
		relationName: "questDependents",
	}),
	stages: many(questStages, { relationName: "questStages" }),
	unlockConditions: many(questUnlockConditions, { relationName: "questUnlockConditions" }),
	factionInvolvement: many(questFactionInvolvement, { relationName: "questFactionInvolvement" }),
	npcRoles: many(questNpcInvolvement, { relationName: "questNpcRoles" }),
	hooks: many(questHooks, { relationName: "questHooks" }),
	items: many(items, { relationName: "questItems" }),
	conflictProgression: many(conflictProgression, { relationName: "questConflictImpacts" }),
	destinationContributions: many(destinationQuestRoles, { relationName: "questDestinationContributions" }),

	consequences: many(consequences, {
		relationName: "consequencesByQuest",
	}),
	triggeredEvents: many(narrativeEvents, {
		relationName: "relatedQuestEvents",
	}),
	investigations: many(investigations, { relationName: "questInvestigations" }),
	embedding: one(embeddings, {
		fields: [quests.embeddingId],
		references: [embeddings.id],
	}),
}))

export const questRelationshipsRelations = relations(questRelationships, ({ one }) => ({
	sourceQuest: one(quests, {
		fields: [questRelationships.questId],
		references: [quests.id],
		relationName: "questDependencies",
	}),
	targetQuest: one(quests, {
		fields: [questRelationships.relatedQuestId],
		references: [quests.id],
		relationName: "questDependents",
	}),
}))

export const questUnlockConditionsRelations = relations(questUnlockConditions, ({ one }) => ({
	quest: one(quests, {
		fields: [questUnlockConditions.questId],
		references: [quests.id],
		relationName: "questUnlockConditions",
	}),
}))

// Quest-owned association relations
export const questNpcInvolvementRelations = relations(questNpcInvolvement, ({ one }) => ({
	quest: one(quests, {
		fields: [questNpcInvolvement.questId],
		references: [quests.id],
		relationName: "questNpcRoles",
	}),
	npc: one(npcs, {
		fields: [questNpcInvolvement.npcId],
		references: [npcs.id],
		relationName: "npcQuests",
	}),
}))

export const questFactionInvolvementRelations = relations(questFactionInvolvement, ({ one }) => ({
	quest: one(quests, {
		fields: [questFactionInvolvement.questId],
		references: [quests.id],
		relationName: "questFactionInvolvement",
	}),
	faction: one(factions, {
		fields: [questFactionInvolvement.factionId],
		references: [factions.id],
		relationName: "factionQuests",
	}),
}))

export const questHooksRelations = relations(questHooks, ({ one }) => ({
	quest: one(quests, {
		fields: [questHooks.questId],
		references: [quests.id],
		relationName: "questHooks",
	}),
	site: one(sites, {
		fields: [questHooks.siteId],
		references: [sites.id],
		relationName: "siteQuestHooks",
	}),
	faction: one(factions, {
		fields: [questHooks.factionId],
		references: [factions.id],
		relationName: "factionQuestHooks",
	}),
	deliveryNpc: one(npcs, {
		fields: [questHooks.deliveryNpcId],
		references: [npcs.id],
		relationName: "npcQuestHooks",
	}),
}))
