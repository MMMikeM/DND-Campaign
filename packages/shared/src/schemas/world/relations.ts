// world/relations.ts
import { relations } from "drizzle-orm"
import { worldStateChanges } from "./tables.js"
import { quests, stageDecisions } from "../quests/tables.js"
import { factions } from "../factions/tables.js"
import { regions, sites, areas } from "../regions/tables.js"
import { npcs } from "../npc/tables.js"
import { majorConflicts } from "../conflict/tables.js"

export const worldStateChangesRelations = relations(worldStateChanges, ({ one }) => ({
	// Source of the change
	sourceQuest: one(quests, {
		fields: [worldStateChanges.questId],
		references: [quests.id],
		relationName: "questWorldChanges",
	}),
	sourceDecision: one(stageDecisions, {
		fields: [worldStateChanges.decisionId],
		references: [stageDecisions.id],
		relationName: "decisionWorldChanges",
	}),
	sourceConflict: one(majorConflicts, {
		fields: [worldStateChanges.conflictId],
		references: [majorConflicts.id],
		relationName: "conflictWorldChanges",
	}),

	// Affected entities
	affectedFaction: one(factions, {
		fields: [worldStateChanges.factionId],
		references: [factions.id],
		relationName: "factionWorldChanges",
	}),
	affectedRegion: one(regions, {
		fields: [worldStateChanges.regionId],
		references: [regions.id],
		relationName: "regionWorldChanges",
	}),
	affectedArea: one(areas, {
		fields: [worldStateChanges.areaId],
		references: [areas.id],
		relationName: "areaWorldChanges",
	}),
	affectedSite: one(sites, {
		fields: [worldStateChanges.siteId],
		references: [sites.id],
		relationName: "siteWorldChanges",
	}),
	affectedNpc: one(npcs, {
		fields: [worldStateChanges.npcId],
		references: [npcs.id],
		relationName: "npcWorldChanges",
	}),

	// Potential future impact
	leadsToQuest: one(quests, {
		fields: [worldStateChanges.futureQuestId],
		references: [quests.id],
		relationName: "worldChangeLeadsToQuest", // Unique relation name
	}),
}))
