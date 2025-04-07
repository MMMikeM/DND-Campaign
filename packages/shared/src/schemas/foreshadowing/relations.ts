// foreshadowing/relations.ts
import { relations } from "drizzle-orm"
import { narrativeForeshadowing } from "./tables.js"
import { quests, questStages, questTwists } from "../quests/tables.js"
import { npcs } from "../npc/tables.js"
import { factions } from "../factions/tables.js"
import { sites } from "../regions/tables.js"
import { narrativeArcs } from "../narrative/tables.js"

export const narrativeForeshadowingRelations = relations(narrativeForeshadowing, ({ one }) => ({
	sourceStage: one(questStages, {
		fields: [narrativeForeshadowing.questStageId],
		references: [questStages.id],
		relationName: "stageForeshadowing",
	}),
	sourceSite: one(sites, {
		fields: [narrativeForeshadowing.siteId],
		references: [sites.id],
		relationName: "siteForeshadowing",
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

	targetQuest: one(quests, {
		fields: [narrativeForeshadowing.foreshadowsQuestId],
		references: [quests.id],
		relationName: "questForeshadowing",
	}),
	targetTwist: one(questTwists, {
		fields: [narrativeForeshadowing.foreshadowsTwistId],
		references: [questTwists.id],
		relationName: "twistForeshadowing",
	}),
	targetNpc: one(npcs, {
		fields: [narrativeForeshadowing.foreshadowsNpcId],
		references: [npcs.id],
		relationName: "npcForeshadowing",
	}),
	targetArc: one(narrativeArcs, {
		fields: [narrativeForeshadowing.foreshadowsArcId],
		references: [narrativeArcs.id],
		relationName: "arcForeshadowing",
	}),
}))
