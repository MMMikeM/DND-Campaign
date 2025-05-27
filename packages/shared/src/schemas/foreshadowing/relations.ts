import { relations } from "drizzle-orm"
import { majorConflicts } from "../conflict/tables"
import { embeddings } from "../embeddings/tables"
import { narrativeEvents } from "../events/tables"
import { factions } from "../factions/tables"
import { items } from "../items/tables"
import { narrativeDestinations } from "../narrative/tables"
import { npcs } from "../npc/tables"
import { questStages, quests } from "../quests/tables"
import { sites } from "../regions/tables"
import { worldConcepts } from "../worldbuilding/tables"
import { foreshadowingSeeds } from "./tables"

export const foreshadowingSeedsRelations = relations(foreshadowingSeeds, ({ one }) => ({
	targetQuest: one(quests, {
		fields: [foreshadowingSeeds.targetQuestId],
		references: [quests.id],
		relationName: "foreshadowedQuest",
	}),
	targetNpc: one(npcs, {
		fields: [foreshadowingSeeds.targetNpcId],
		references: [npcs.id],
		relationName: "foreshadowedNpc",
	}),
	targetNarrativeEvent: one(narrativeEvents, {
		fields: [foreshadowingSeeds.targetNarrativeEventId],
		references: [narrativeEvents.id],
		relationName: "foreshadowedEvent",
	}),
	targetMajorConflict: one(majorConflicts, {
		fields: [foreshadowingSeeds.targetMajorConflictId],
		references: [majorConflicts.id],
		relationName: "foreshadowedConflict",
	}),
	targetItem: one(items, {
		fields: [foreshadowingSeeds.targetItemId],
		references: [items.id],
		relationName: "foreshadowedItem",
	}),
	targetNarrativeDestination: one(narrativeDestinations, {
		fields: [foreshadowingSeeds.targetNarrativeDestinationId],
		references: [narrativeDestinations.id],
		relationName: "foreshadowedDestination",
	}),
	targetWorldConcept: one(worldConcepts, {
		fields: [foreshadowingSeeds.targetWorldConceptId],
		references: [worldConcepts.id],
		relationName: "foreshadowedWorldConcept",
	}),
	targetFaction: one(factions, {
		fields: [foreshadowingSeeds.targetFactionId],
		references: [factions.id],
		relationName: "foreshadowedFaction",
	}),
	targetSite: one(sites, {
		fields: [foreshadowingSeeds.targetSiteId],
		references: [sites.id],
		relationName: "foreshadowedSite",
	}),

	sourceQuest: one(quests, {
		fields: [foreshadowingSeeds.sourceQuestId],
		references: [quests.id],
		relationName: "questForeshadowingSeeds",
	}),
	sourceQuestStage: one(questStages, {
		fields: [foreshadowingSeeds.sourceQuestStageId],
		references: [questStages.id],
		relationName: "stageForeshadowingSeeds",
	}),
	sourceSite: one(sites, {
		fields: [foreshadowingSeeds.sourceSiteId],
		references: [sites.id],
		relationName: "siteForeshadowingSeeds",
	}),
	sourceNpc: one(npcs, {
		fields: [foreshadowingSeeds.sourceNpcId],
		references: [npcs.id],
		relationName: "npcForeshadowingSeeds",
	}),

	embedding: one(embeddings, {
		fields: [foreshadowingSeeds.embeddingId],
		references: [embeddings.id],
	}),
}))
