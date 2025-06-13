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
	destinationParticipantInvolvement,
	destinationQuestRoles,
	destinationRelationships,
	narrativeDestinations,
} from "./tables"

export const narrativeDestinationsRelations = relations(narrativeDestinations, ({ one, many }) => ({
	region: one(regions, {
		fields: [narrativeDestinations.regionId],
		references: [regions.id],
		relationName: "regionNarrativeDestinations",
	}),
	conflict: one(conflicts, {
		fields: [narrativeDestinations.conflictId],
		references: [conflicts.id],
		relationName: "conflictNarrativeDestinations",
	}),

	sourceOfRelationships: many(destinationRelationships, { relationName: "sourceDestination" }),
	targetOfRelationships: many(destinationRelationships, { relationName: "targetDestination" }),

	questRoles: many(destinationQuestRoles, { relationName: "destinationQuestRoles" }),
	participantInvolvement: many(destinationParticipantInvolvement, {
		relationName: "destinationParticipantInvolvement",
	}),
	itemRelationships: many(itemRelationships, { relationName: "narrativeDestinationItemRelationships" }),
	worldConceptLinks: many(worldConceptLinks, { relationName: "narrativeDestinationWorldConceptLinks" }),
	foreshadowing: many(foreshadowing, { relationName: "foreshadowedNarrativeDestination" }),
}))

export const destinationRelationshipsRelations = relations(destinationRelationships, ({ one }) => ({
	sourceDestination: one(narrativeDestinations, {
		fields: [destinationRelationships.sourceDestinationId],
		references: [narrativeDestinations.id],
		relationName: "sourceDestination",
	}),
	targetDestination: one(narrativeDestinations, {
		fields: [destinationRelationships.targetDestinationId],
		references: [narrativeDestinations.id],
		relationName: "targetDestination",
	}),
}))

export const destinationQuestRolesRelations = relations(destinationQuestRoles, ({ one }) => ({
	destination: one(narrativeDestinations, {
		fields: [destinationQuestRoles.destinationId],
		references: [narrativeDestinations.id],
		relationName: "destinationQuestRoles",
	}),
	quest: one(quests, {
		fields: [destinationQuestRoles.questId],
		references: [quests.id],
		relationName: "questDestinationRoles",
	}),
}))

export const destinationParticipantInvolvementRelations = relations(destinationParticipantInvolvement, ({ one }) => ({
	destination: one(narrativeDestinations, {
		fields: [destinationParticipantInvolvement.destinationId],
		references: [narrativeDestinations.id],
		relationName: "destinationParticipantInvolvement",
	}),
	npc: one(npcs, {
		fields: [destinationParticipantInvolvement.npcId],
		references: [npcs.id],
		relationName: "npcDestinationInvolvement",
	}),
	faction: one(factions, {
		fields: [destinationParticipantInvolvement.factionId],
		references: [factions.id],
		relationName: "factionDestinationInvolvement",
	}),
}))
