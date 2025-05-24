import { tables } from "@tome-master/shared"
import { db } from "../index"
import { schemas, tableEnum } from "./narrative-tools-schema"
import { createManageEntityHandler, createManageSchema } from "./tool.utils"
import type { CreateEntityGetters, ToolDefinition } from "./utils/types"

type NarrativeGetters = CreateEntityGetters<typeof tables.narrativeTables>

export const entityGetters: NarrativeGetters = {
	all_destination_contribution: () => db.query.destinationContribution.findMany({}),
	all_narrative_destinations: () => db.query.narrativeDestinations.findMany({}),
	destination_contribution_by_id: (id: number) =>
		db.query.destinationContribution.findFirst({
			where: (destinationContribution, { eq }) => eq(destinationContribution.id, id),
			with: {
				destination: true,
				quest: true,
			},
		}),
	narrative_destination_by_id: (id: number) =>
		db.query.narrativeDestinations.findFirst({
			where: (narrativeDestinations, { eq }) => eq(narrativeDestinations.id, id),
			with: {
				destinationContributions: true,
				foreshadowing: true,
				worldStateChanges: true,
			},
		}),
}

export const narrativeToolDefinitions: Record<"manage_narrative", ToolDefinition> = {
	manage_narrative: {
		description: "Manage narrative-related entities.",
		inputSchema: createManageSchema(schemas, tableEnum),
		handler: createManageEntityHandler("manage_narrative", tables.narrativeTables, tableEnum, schemas),
	},
}
