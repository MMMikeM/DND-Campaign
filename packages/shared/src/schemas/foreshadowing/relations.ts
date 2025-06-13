import { relations } from "drizzle-orm"
import { conflicts } from "../conflicts/tables"
import { factions } from "../factions/tables"
import { items } from "../items/tables"
import { narrativeDestinations } from "../narrative-destinations/tables"
import { narrativeEvents } from "../narrative-events/tables"
import { npcs } from "../npcs/tables"
import { questStages, quests } from "../quests/tables"
import { sites } from "../regions/tables"
import { worldConcepts } from "../world-concepts/tables"
import { foreshadowing } from "./tables"

export const foreshadowingSeedsRelations = relations(foreshadowing, ({ one }) => ({
	targetQuest: one(quests, {
		fields: [foreshadowing.targetQuestId],
		references: [quests.id],
		relationName: "foreshadowedQuest",
	}),
	targetNpc: one(npcs, {
		fields: [foreshadowing.targetNpcId],
		references: [npcs.id],
		relationName: "foreshadowedNpc",
	}),
	targetNarrativeEvent: one(narrativeEvents, {
		fields: [foreshadowing.targetNarrativeEventId],
		references: [narrativeEvents.id],
		relationName: "foreshadowedNarrativeEvent",
	}),
	targetConflict: one(conflicts, {
		fields: [foreshadowing.targetConflictId],
		references: [conflicts.id],
		relationName: "foreshadowedConflict",
	}),
	targetItem: one(items, {
		fields: [foreshadowing.targetItemId],
		references: [items.id],
		relationName: "foreshadowedItem",
	}),
	targetNarrativeDestination: one(narrativeDestinations, {
		fields: [foreshadowing.targetNarrativeDestinationId],
		references: [narrativeDestinations.id],
		relationName: "foreshadowedNarrativeDestination",
	}),
	targetWorldConcept: one(worldConcepts, {
		fields: [foreshadowing.targetWorldConceptId],
		references: [worldConcepts.id],
		relationName: "foreshadowedWorldConcept",
	}),
	targetFaction: one(factions, {
		fields: [foreshadowing.targetFactionId],
		references: [factions.id],
		relationName: "foreshadowedFaction",
	}),
	targetSite: one(sites, {
		fields: [foreshadowing.targetSiteId],
		references: [sites.id],
		relationName: "foreshadowedSite",
	}),

	sourceQuest: one(quests, {
		fields: [foreshadowing.sourceQuestId],
		references: [quests.id],
		relationName: "questForeshadowingSeeds",
	}),
	sourceQuestStage: one(questStages, {
		fields: [foreshadowing.sourceQuestStageId],
		references: [questStages.id],
		relationName: "questStageForeshadowingSeeds",
	}),
	sourceSite: one(sites, {
		fields: [foreshadowing.sourceSiteId],
		references: [sites.id],
		relationName: "siteForeshadowingSeeds",
	}),
	sourceNpc: one(npcs, {
		fields: [foreshadowing.sourceNpcId],
		references: [npcs.id],
		relationName: "npcForeshadowingSeeds",
	}),
}))
