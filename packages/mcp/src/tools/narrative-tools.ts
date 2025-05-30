import { tables } from "@tome-master/shared"
import { db } from "../index"
import { schemas, tableEnum } from "./narrative-tools.schema"
import { createManageEntityHandler, createManageSchema } from "./utils/tool.utils"
import type { ToolDefinition } from "./utils/types"
import { createEntityGettersFactory } from "./utils/types"

const createEntityGetters = createEntityGettersFactory(tables.narrativeTables)

export const entityGetters = createEntityGetters({
	all_narrative_destinations: () => db.query.narrativeDestinations.findMany({}),
	all_destination_participant_involvement: () => db.query.destinationParticipantInvolvement.findMany({}),
	all_destination_quest_roles: () => db.query.destinationQuestRoles.findMany({}),
	all_destination_relationships: () => db.query.destinationRelationships.findMany({}),
	destination_participant_involvement_by_id: (id: number) =>
		db.query.destinationParticipantInvolvement.findFirst({
			where: (destinationParticipantInvolvement, { eq }) => eq(destinationParticipantInvolvement.id, id),
			with: {
				destination: true,
				faction: true,
				npc: true,
			},
		}),
	destination_quest_role_by_id: (id: number) =>
		db.query.destinationQuestRoles.findFirst({
			where: (destinationQuestRoles, { eq }) => eq(destinationQuestRoles.id, id),
			with: {
				destination: true,
				quest: true,
			},
		}),
	destination_relationship_by_id: (id: number) =>
		db.query.destinationRelationships.findFirst({
			where: (destinationRelationships, { eq }) => eq(destinationRelationships.id, id),
			with: {
				relatedDestination: true,
				sourceDestination: true,
			},
		}),
	narrative_destination_by_id: (id: number) =>
		db.query.narrativeDestinations.findFirst({
			where: (narrativeDestinations, { eq }) => eq(narrativeDestinations.id, id),
			with: {
				conflict: true,
				itemRelationships: true,
				participantInvolvement: true,
				questRoles: true,
				region: true,
				worldConceptLinks: true,
			},
		}),
})

export const narrativeToolDefinitions: Record<"manage_narrative", ToolDefinition> = {
	manage_narrative: {
		description: "Manage narrative-related entities.",
		inputSchema: createManageSchema(schemas, tableEnum),
		handler: createManageEntityHandler("manage_narrative", tables.narrativeTables, tableEnum, schemas),
	},
}
