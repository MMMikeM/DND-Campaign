import { tables } from "@tome-master/shared"
import { db } from "../index"
import { schemas, tableEnum } from "./narrative-destination-tools.schema"
import { createManageEntityHandler, createManageSchema } from "./utils/tool.utils"
import type { ToolDefinition } from "./utils/types"
import { createEntityGettersFactory } from "./utils/types"

const createEntityGetters = createEntityGettersFactory(tables.narrativeDestinationTables)

export const entityGetters = createEntityGetters({
	all_narrative_destinations: () => db.query.narrativeDestinations.findMany({}),
	all_narrative_destination_participants: () => db.query.narrativeDestinationParticipants.findMany({}),
	all_narrative_destination_quest_roles: () => db.query.narrativeDestinationQuestRoles.findMany({}),
	all_narrative_destination_relations: () => db.query.narrativeDestinationRelations.findMany({}),
	all_narrative_destination_outcomes: () => db.query.narrativeDestinationOutcomes.findMany({}),

	narrative_destination_by_id: (id: number) =>
		db.query.narrativeDestinations.findFirst({
			where: (narrativeDestinations, { eq }) => eq(narrativeDestinations.id, id),
			with: {
				incomingForeshadowing: true,
				incomingRelations: true,
				itemRelations: true,
				outgoingRelations: true,
				participantInvolvement: true,
				questRoles: true,
				region: true,
				loreLinks: true,
				conflict: true,
			},
		}),
	narrative_destination_quest_role_by_id: (id: number) =>
		db.query.narrativeDestinationQuestRoles.findFirst({
			where: (narrativeDestinationQuestRoles, { eq }) => eq(narrativeDestinationQuestRoles.id, id),
			with: {
				narrativeDestination: true,
				quest: true,
			},
		}),
	narrative_destination_participant_by_id: (id: number) =>
		db.query.narrativeDestinationParticipants.findFirst({
			where: (narrativeDestinationParticipants, { eq }) => eq(narrativeDestinationParticipants.id, id),
			with: {
				narrativeDestination: true,
				faction: true,
				npc: true,
			},
		}),
	narrative_destination_relation_by_id: (id: number) =>
		db.query.narrativeDestinationRelations.findFirst({
			where: (narrativeDestinationRelations, { eq }) => eq(narrativeDestinationRelations.id, id),
			with: {
				sourceNarrativeDestination: true,
				targetNarrativeDestination: true,
			},
		}),
	narrative_destination_outcome_by_id: (id: number) =>
		db.query.narrativeDestinationOutcomes.findFirst({
			where: (narrativeDestinationOutcomes, { eq }) => eq(narrativeDestinationOutcomes.id, id),
			with: {
				narrativeDestination: true,
			},
		}),
})

export const narrativeDestinationToolDefinitions: Record<"manage_narrative_destination", ToolDefinition> = {
	manage_narrative_destination: {
		description: "Manage narrative-related entities.",
		inputSchema: createManageSchema(schemas, tableEnum),
		handler: createManageEntityHandler(
			"manage_narrative_destination",
			tables.narrativeDestinationTables,
			tableEnum,
			schemas,
		),
		annotations: {
			title: "Manage Narrative Destination",
			readOnlyHint: false,
			destructiveHint: false,
			idempotentHint: false,
			openWorldHint: false,
		},
	},
}
