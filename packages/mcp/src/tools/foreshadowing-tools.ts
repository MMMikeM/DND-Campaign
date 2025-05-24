import { tables } from "@tome-master/shared"
import { db } from "../index"
import { schemas, tableEnum } from "./foreshadowing-tools-schema"
import { createManageEntityHandler, createManageSchema } from "./tool.utils"
import type { CreateEntityGetters, ToolDefinition } from "./utils/types"

type ForeshadowingGetters = CreateEntityGetters<typeof tables.foreshadowingTables>

export const entityGetters: ForeshadowingGetters = {
	all_narrative_foreshadowing: () => db.query.narrativeForeshadowing.findMany(),
	narrative_foreshadowing_by_id: (id: number) =>
		db.query.narrativeForeshadowing.findFirst({
			where: (narrativeForeshadowing, { eq }) => eq(narrativeForeshadowing.id, id),
			with: {
				sourceFaction: { columns: { name: true, id: true } },
				sourceNpc: { columns: { name: true, id: true } },
				sourceSite: { columns: { name: true, id: true } },
				sourceStage: { columns: { name: true, id: true } },
				foreshadowedDestination: true,
				foreshadowsEvent: true,
				foreshadowsNpc: true,
				foreshadowsQuest: true,
			},
		}),
}

export const foreshadowingToolDefinitions: Record<"manage_foreshadowing", ToolDefinition> = {
	manage_foreshadowing: {
		description: "Manage foreshadowing-related entities.",
		inputSchema: createManageSchema(schemas, tableEnum),
		handler: createManageEntityHandler("manage_foreshadowing", tables.foreshadowingTables, tableEnum, schemas),
	},
}
