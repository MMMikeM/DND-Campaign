// world/relations.ts
import { relations } from "drizzle-orm"
import { majorConflicts } from "../conflict/tables.js"
import { factions } from "../factions/tables.js"
import { narrativeArcs } from "../narrative/tables.js"
import { npcs } from "../npc/tables.js"
import { quests, stageDecisions } from "../quests/tables.js"
import { areas, regions, sites } from "../regions/tables.js"
import { worldStateChanges } from "./tables.js"

export const worldStateChangesRelations = relations(worldStateChanges, ({ one }) => ({
	// Source of the change
	sourceQuest: one(quests, {
		fields: [worldStateChanges.questId],
		references: [quests.id],
		relationName: "worldChangesByQuest", // Changed to match questsRelations
	}),
	sourceDecision: one(stageDecisions, {
		fields: [worldStateChanges.decisionId],
		references: [stageDecisions.id],
		relationName: "worldChangesByDecision", // Changed to match stageDecisionsRelations
	}),
	sourceConflict: one(majorConflicts, {
		fields: [worldStateChanges.conflictId],
		references: [majorConflicts.id],
		relationName: "worldChangesByConflict",
	}),

	relatedArc: one(narrativeArcs, {
		fields: [worldStateChanges.arcId],
		references: [narrativeArcs.id],
		relationName: "worldChangesByArc", // Changed to match narrativeArcsRelations
	}),

	// Affected entities
	affectedFaction: one(factions, {
		fields: [worldStateChanges.factionId],
		references: [factions.id],
		relationName: "worldChangesAffectingFaction",
	}),
	affectedRegion: one(regions, {
		fields: [worldStateChanges.regionId],
		references: [regions.id],
		relationName: "worldChangesAffectingRegion",
	}),
	affectedArea: one(areas, {
		fields: [worldStateChanges.areaId],
		references: [areas.id],
		relationName: "worldChangesAffectingArea",
	}),
	affectedSite: one(sites, {
		fields: [worldStateChanges.siteId],
		references: [sites.id],
		relationName: "worldChangesAffectingSite",
	}),
	affectedNpc: one(npcs, {
		fields: [worldStateChanges.npcId],
		references: [npcs.id],
		relationName: "worldChangesAffectingNpc",
	}),

	// Potential future impact
	leadsToQuest: one(quests, {
		fields: [worldStateChanges.futureQuestId],
		references: [quests.id],
		relationName: "worldChangeLeadsToQuest",
	}),
}))
