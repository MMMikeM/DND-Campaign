// world/relations.ts
import { relations } from "drizzle-orm"
import { majorConflicts } from "../conflict/tables.js"
import { factions } from "../factions/tables.js"
import { narrativeDestinations } from "../narrative/tables.js"
import { npcs } from "../npc/tables.js"
import { quests, stageDecisions } from "../quests/tables.js"
import { areas, regions, sites } from "../regions/tables.js"
import { worldStateChanges } from "./tables.js"

export const worldStateChangesRelations = relations(worldStateChanges, ({ one }) => ({
	// Source of the change
	quest: one(quests, {
		fields: [worldStateChanges.questId],
		references: [quests.id],
		relationName: "worldChangesByQuest",
	}),
	decision: one(stageDecisions, {
		fields: [worldStateChanges.decisionId],
		references: [stageDecisions.id],
		relationName: "worldChangesByDecision",
	}),
	conflict: one(majorConflicts, {
		fields: [worldStateChanges.conflictId],
		references: [majorConflicts.id],
		relationName: "worldChangesInConflict",
	}),
	destination: one(narrativeDestinations, {
		fields: [worldStateChanges.destinationId],
		references: [narrativeDestinations.id],
		relationName: "worldChangesForDestination",
	}),
	// Affected entities
	faction: one(factions, {
		fields: [worldStateChanges.factionId],
		references: [factions.id],
		relationName: "worldChangesAffectingFaction",
	}),

	region: one(regions, {
		fields: [worldStateChanges.regionId],
		references: [regions.id],
		relationName: "worldChangesInRegion",
	}),
	area: one(areas, {
		fields: [worldStateChanges.areaId],
		references: [areas.id],
		relationName: "worldChangesInArea",
	}),
	site: one(sites, {
		fields: [worldStateChanges.siteId],
		references: [sites.id],
		relationName: "worldChangesAtSite",
	}),
	npc: one(npcs, {
		fields: [worldStateChanges.npcId],
		references: [npcs.id],
		relationName: "worldChangesAffectingNpc",
	}),

	// Potential future impact
	futureQuest: one(quests, {
		fields: [worldStateChanges.futureQuestId],
		references: [quests.id],
		relationName: "worldChangeLeadsToQuest",
	}),
	embedding: one(require("../embeddings/tables").embeddings, {
		fields: [worldStateChanges.embeddingId],
		references: [require("../embeddings/tables").embeddings.id],
	}),
}))
