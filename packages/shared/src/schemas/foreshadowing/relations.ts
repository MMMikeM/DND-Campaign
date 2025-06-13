import { relations } from "drizzle-orm"
import { conflicts } from "../conflict/tables"
import { narrativeEvents } from "../events/tables"
import { factions } from "../factions/tables"
import { items } from "../items/tables"
import { narrativeDestinations } from "../narrative/tables"
import { npcs } from "../npc/tables"
import { questStages, quests } from "../quests/tables"
import { sites } from "../regions/tables"
import { worldConcepts } from "../worldbuilding/tables"
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
		relationName: "foreshadowedEvent",
	}),
	targetMajorConflict: one(conflicts, {
		fields: [foreshadowing.targetMajorConflictId],
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
		relationName: "foreshadowedDestination",
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
		relationName: "stageForeshadowingSeeds",
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
