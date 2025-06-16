// world/relations.ts
import { relations, sql } from "drizzle-orm"
import { conflicts } from "../conflicts/tables"
import { factions } from "../factions/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { narrativeDestinations } from "../narrative-destinations/tables"
import { npcs } from "../npcs/tables"
import { quests } from "../quests/tables"
import { areas, regions, sites } from "../regions/tables"
import { questStageDecisions, questStages } from "../stages/tables"
import { consequences, narrativeEvents } from "./tables"

export const narrativeEventsRelations = relations(narrativeEvents, ({ one, many }) => ({
	questStage: one(questStages, {
		fields: [narrativeEvents.questStageId],
		references: [questStages.id],
	}),

	triggeringStageDecision: one(questStageDecisions, {
		fields: [narrativeEvents.triggeringStageDecisionId],
		references: [questStageDecisions.id],
	}),
	relatedQuest: one(quests, {
		fields: [narrativeEvents.relatedQuestId],
		references: [quests.id],
	}),
	incomingForeshadowing: many(foreshadowing, { relationName: "foreshadowingForNarrativeEvent" }),
}))

export const consequencesRelations = relations(consequences, ({ one }) => ({
	// Trigger entity soft relations (what triggered the consequence)
	triggerQuest: one(quests, {
		relationName: "ConsequenceTriggerQuest",
		fields: [consequences.triggerEntityId],
		references: [quests.id],
		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
		where: sql`${consequences.triggerEntityType} = 'quest'`,
	}),

	triggerConflict: one(conflicts, {
		relationName: "ConsequenceTriggerConflict",
		fields: [consequences.triggerEntityId],
		references: [conflicts.id],
		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
		where: sql`${consequences.triggerEntityType} = 'conflict'`,
	}),

	// Note: 'decision' type doesn't map to a specific table as it represents quest stage decisions
	// which are handled differently in the application layer

	// Affected entity soft relations (what the consequence affects)
	affectedFaction: one(factions, {
		relationName: "ConsequenceAffectedFaction",
		fields: [consequences.affectedEntityId],
		references: [factions.id],
		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
		where: sql`${consequences.affectedEntityType} = 'faction'`,
	}),

	affectedRegion: one(regions, {
		relationName: "ConsequenceAffectedRegion",
		fields: [consequences.affectedEntityId],
		references: [regions.id],
		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
		where: sql`${consequences.affectedEntityType} = 'region'`,
	}),

	affectedArea: one(areas, {
		relationName: "ConsequenceAffectedArea",
		fields: [consequences.affectedEntityId],
		references: [areas.id],
		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
		where: sql`${consequences.affectedEntityType} = 'area'`,
	}),

	affectedSite: one(sites, {
		relationName: "ConsequenceAffectedSite",
		fields: [consequences.affectedEntityId],
		references: [sites.id],
		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
		where: sql`${consequences.affectedEntityType} = 'site'`,
	}),

	affectedNpc: one(npcs, {
		relationName: "ConsequenceAffectedNpc",
		fields: [consequences.affectedEntityId],
		references: [npcs.id],
		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
		where: sql`${consequences.affectedEntityType} = 'npc'`,
	}),

	affectedNarrativeDestination: one(narrativeDestinations, {
		relationName: "ConsequenceAffectedNarrativeDestination",
		fields: [consequences.affectedEntityId],
		references: [narrativeDestinations.id],
		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
		where: sql`${consequences.affectedEntityType} = 'narrative_destination'`,
	}),

	affectedConflict: one(conflicts, {
		relationName: "ConsequenceAffectedConflict",
		fields: [consequences.affectedEntityId],
		references: [conflicts.id],
		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
		where: sql`${consequences.affectedEntityType} = 'conflict'`,
	}),

	affectedQuest: one(quests, {
		relationName: "ConsequenceAffectedQuest",
		fields: [consequences.affectedEntityId],
		references: [quests.id],
		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
		where: sql`${consequences.affectedEntityType} = 'quest'`,
	}),
}))
