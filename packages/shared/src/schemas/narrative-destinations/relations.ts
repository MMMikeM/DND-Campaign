import { relations } from "drizzle-orm"
import { conflicts } from "../conflicts/tables"
import { factions } from "../factions/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { itemRelations } from "../items/tables"
import { loreLinks } from "../lore/tables"
import { npcs } from "../npcs/tables"
import { quests } from "../quests/tables"
import { regions } from "../regions/tables"
import {
	narrativeDestinationParticipants,
	narrativeDestinationQuestRoles,
	narrativeDestinationRelations,
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

	outgoingRelations: many(narrativeDestinationRelations, { relationName: "sourceDestination" }),
	incomingRelations: many(narrativeDestinationRelations, { relationName: "targetDestination" }),

	questRoles: many(narrativeDestinationQuestRoles),
	participantInvolvement: many(narrativeDestinationParticipants),
	itemRelations: many(itemRelations),
	loreLinks: many(loreLinks, { relationName: "LoreLinkTargetNarrativeDestination" }),
	incomingForeshadowing: many(foreshadowing, { relationName: "ForeshadowingTargetNarrativeDestination" }),
}))

export const narrativeDestinationRelationTargets = relations(narrativeDestinationRelations, ({ one }) => ({
	sourceNarrativeDestination: one(narrativeDestinations, {
		fields: [narrativeDestinationRelations.sourceNarrativeDestinationId],
		references: [narrativeDestinations.id],
		relationName: "sourceDestination",
	}),
	targetNarrativeDestination: one(narrativeDestinations, {
		fields: [narrativeDestinationRelations.targetNarrativeDestinationId],
		references: [narrativeDestinations.id],
		relationName: "targetDestination",
	}),
}))

export const destinationQuestRolesRelations = relations(narrativeDestinationQuestRoles, ({ one }) => ({
	narrativeDestination: one(narrativeDestinations, {
		fields: [narrativeDestinationQuestRoles.narrativeDestinationId],
		references: [narrativeDestinations.id],
	}),
	quest: one(quests, {
		fields: [narrativeDestinationQuestRoles.questId],
		references: [quests.id],
	}),
}))

export const destinationParticipantInvolvementRelations = relations(narrativeDestinationParticipants, ({ one }) => ({
	narrativeDestination: one(narrativeDestinations, {
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
