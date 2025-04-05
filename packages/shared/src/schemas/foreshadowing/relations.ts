// foreshadowing/relations.ts
import { relations } from "drizzle-orm"
import { narrativeForeshadowing } from "./tables.js"
import { quests, questStages, questTwists } from "../quests/tables.js"
import { npcs } from "../npc/tables.js"
import { factions } from "../factions/tables.js"
import { locations } from "../regions/tables.js"
import { narrativeArcs } from "../narrative/tables.js"

export const narrativeForeshadowingRelations = relations(narrativeForeshadowing, ({ one }) => ({
	// Source of the foreshadowing
	sourceStage: one(questStages, {
		fields: [narrativeForeshadowing.questStageId],
		references: [questStages.id],
		relationName: "stageForeshadowing",
	}),
	sourceLocation: one(locations, {
		fields: [narrativeForeshadowing.locationId],
		references: [locations.id],
		relationName: "locationForeshadowing",
	}),
	sourceNpc: one(npcs, {
		fields: [narrativeForeshadowing.npcId],
		references: [npcs.id],
		relationName: "npcForeshadowingSource",
	}),
	sourceFaction: one(factions, {
		fields: [narrativeForeshadowing.factionId],
		references: [factions.id],
		relationName: "factionForeshadowingSource",
	}),

	// Target of the foreshadowing
	targetQuest: one(quests, {
		fields: [narrativeForeshadowing.foreshadowsQuestId],
		references: [quests.id],
		relationName: "questForeshadowedBy",
	}),
	targetTwist: one(questTwists, {
		fields: [narrativeForeshadowing.foreshadowsTwistId],
		references: [questTwists.id],
		relationName: "twistForeshadowedBy",
	}),
	targetNpc: one(npcs, {
		fields: [narrativeForeshadowing.foreshadowsNpcId],
		references: [npcs.id],
		relationName: "npcForeshadowedBy",
	}),
	targetArc: one(narrativeArcs, {
		fields: [narrativeForeshadowing.foreshadowsArcId],
		references: [narrativeArcs.id],
		relationName: "arcForeshadowing", // Matches relation in narrative/relations.ts
	}),
}))
