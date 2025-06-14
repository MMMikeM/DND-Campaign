// worldbuilding/relations.ts
import { relations } from "drizzle-orm"
import { conflicts } from "../conflicts/tables"
import { factions } from "../factions/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { itemRelations } from "../items/tables"
import { npcs } from "../npcs/tables"
import { quests } from "../quests/tables"
import { regions } from "../regions/tables"
import { worldConceptLinks, worldConceptRelations, worldConcepts } from "./tables"

export const worldConceptsRelations = relations(worldConcepts, ({ many }) => ({
	outgoingRelations: many(worldConceptRelations, {
		relationName: "sourceWorldConceptInRelationship",
	}),
	incomingRelations: many(worldConceptRelations, {
		relationName: "targetWorldConceptInRelationship",
	}),
	links: many(worldConceptLinks),
	itemRelations: many(itemRelations),
	foreshadowingTarget: many(foreshadowing, { relationName: "foreshadowingForWorldConcept" }),
}))

export const worldConceptRelationTargets = relations(worldConceptRelations, ({ one }) => ({
	sourceWorldConcept: one(worldConcepts, {
		fields: [worldConceptRelations.sourceWorldConceptId],
		references: [worldConcepts.id],
		relationName: "sourceWorldConceptInRelationship",
	}),
	targetWorldConcept: one(worldConcepts, {
		fields: [worldConceptRelations.targetWorldConceptId],
		references: [worldConcepts.id],
		relationName: "targetWorldConceptInRelationship",
	}),
}))

export const worldConceptLinksRelations = relations(worldConceptLinks, ({ one }) => ({
	worldConcept: one(worldConcepts, {
		fields: [worldConceptLinks.worldConceptId],
		references: [worldConcepts.id],
	}),

	linkedRegion: one(regions, {
		fields: [worldConceptLinks.regionId],
		references: [regions.id],
	}),
	linkedNpc: one(npcs, {
		fields: [worldConceptLinks.npcId],
		references: [npcs.id],
	}),
	linkedFaction: one(factions, {
		fields: [worldConceptLinks.factionId],
		references: [factions.id],
	}),
	linkedQuest: one(quests, {
		fields: [worldConceptLinks.questId],
		references: [quests.id],
	}),
	linkedConflict: one(conflicts, {
		fields: [worldConceptLinks.conflictId],
		references: [conflicts.id],
	}),
}))
