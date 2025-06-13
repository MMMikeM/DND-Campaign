import { relations } from "drizzle-orm"
import { conflicts } from "../conflicts/tables"
import { factions } from "../factions/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { itemRelationships } from "../items/tables"
import { npcs } from "../npcs/tables"
import { quests } from "../quests/tables"
import { regions } from "../regions/tables"
import { worldConceptLinks } from "../world-concepts/tables"
import {
	narrativeDestinationParticipants,
	narrativeDestinationQuestRoles,
	narrativeDestinationRelationships,
	narrativeDestinations,
} from "./tables"

export const narrativeDestinationsRelations = relations(narrativeDestinations, ({ one, many }) => ({
	region: one(regions, {
		fields: [narrativeDestinations.regionId],
		references: [regions.id],
	}),
	conflict: one(conflicts, {
		fields: [narrativeDestinations.conflictId],
		references: [conflicts.id],
	}),

	outgoingRelationships: many(narrativeDestinationRelationships, { relationName: "sourceDestination" }),
	incomingRelationships: many(narrativeDestinationRelationships, { relationName: "targetDestination" }),

	questRoles: many(narrativeDestinationQuestRoles),
	participantInvolvement: many(narrativeDestinationParticipants),
	itemRelationships: many(itemRelationships),
	worldConceptLinks: many(worldConceptLinks),
	foreshadowingTarget: many(foreshadowing, { relationName: "foreshadowingForNarrativeDestination" }),
}))

export const destinationRelationshipsRelations = relations(narrativeDestinationRelationships, ({ one }) => ({
	sourceDestination: one(narrativeDestinations, {
		fields: [narrativeDestinationRelationships.sourceNarrativeDestinationId],
		references: [narrativeDestinations.id],
		relationName: "sourceDestination",
	}),
	targetDestination: one(narrativeDestinations, {
		fields: [narrativeDestinationRelationships.targetNarrativeDestinationId],
		references: [narrativeDestinations.id],
		relationName: "targetDestination",
	}),
}))

export const destinationQuestRolesRelations = relations(narrativeDestinationQuestRoles, ({ one }) => ({
	destination: one(narrativeDestinations, {
		fields: [narrativeDestinationQuestRoles.narrativeDestinationId],
		references: [narrativeDestinations.id],
	}),
	quest: one(quests, {
		fields: [narrativeDestinationQuestRoles.questId],
		references: [quests.id],
	}),
}))

export const destinationParticipantInvolvementRelations = relations(narrativeDestinationParticipants, ({ one }) => ({
	destination: one(narrativeDestinations, {
		fields: [narrativeDestinationParticipants.narrativeDestinationId],
		references: [narrativeDestinations.id],
	}),
	npc: one(npcs, {
		fields: [narrativeDestinationParticipants.npcId],
		references: [npcs.id],
	}),
	faction: one(factions, {
		fields: [narrativeDestinationParticipants.factionId],
		references: [factions.id],
	}),
}))
