import { relations } from "drizzle-orm"
import { majorConflicts } from "../conflict/tables"
import { embeddings } from "../embeddings/tables"
import { factions } from "../factions/tables"
import { itemRelationships } from "../items/tables"
import { npcs } from "../npc/tables"
import { quests } from "../quests/tables"
import { areas, regions, sites } from "../regions/tables"
import { worldConceptLinks } from "../worldbuilding/tables"
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
	area: one(areas, {
		fields: [narrativeDestinations.areaId],
		references: [areas.id],
		relationName: "areaNarrativeDestinations",
	}),
	site: one(sites, {
		fields: [narrativeDestinations.siteId],
		references: [sites.id],
		relationName: "siteNarrativeDestinations",
	}),
	conflict: one(majorConflicts, {
		fields: [narrativeDestinations.conflictId],
		references: [majorConflicts.id],
		relationName: "conflictNarrativeDestinations",
	}),

	questRoles: many(destinationQuestRoles, { relationName: "destinationQuestRoles" }),
	participantInvolvement: many(destinationParticipantInvolvement, {
		relationName: "destinationParticipantInvolvement",
	}),
	itemRelationships: many(itemRelationships, { relationName: "narrativeDestinationItemRelationships" }),
	worldConceptLinks: many(worldConceptLinks, { relationName: "narrativeDestinationWorldConceptLinks" }),

	embedding: one(embeddings, {
		fields: [narrativeDestinations.embeddingId],
		references: [embeddings.id],
	}),
}))

export const destinationRelationshipsRelations = relations(destinationRelationships, ({ one }) => ({
	sourceDestination: one(narrativeDestinations, {
		fields: [destinationRelationships.sourceDestinationId],
		references: [narrativeDestinations.id],
		relationName: "sourceDestinationInRelationship",
	}),
	relatedDestination: one(narrativeDestinations, {
		fields: [destinationRelationships.relatedDestinationId],
		references: [narrativeDestinations.id],
		relationName: "relatedDestinationInRelationship",
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
