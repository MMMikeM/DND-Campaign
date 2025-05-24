import { tables } from "@tome-master/shared"
import { db } from "../index"
import { createManageEntityHandler, createManageSchema } from "./tool.utils"
import type { CreateEntityGetters, ToolDefinition } from "./utils/types"
import { schemas, tableEnum } from "./world-tools-schema"

type WorldGetters = CreateEntityGetters<typeof tables.worldTables>

export const entityGetters: WorldGetters = {
	all_world_state_changes: () => db.query.worldStateChanges.findMany(),
	world_state_change_by_id: (id: number) =>
		db.query.worldStateChanges.findFirst({
			where: (worldStateChanges, { eq }) => eq(worldStateChanges.id, id),
			with: {
				area: true,
				quest: true,
				region: true,
				site: true,
				conflict: true,
				decision: true,
				destination: true,
				faction: true,
				futureQuest: true,
				npc: true,
			},
		}),
}

export const worldToolDefinitions: Record<"manage_world", ToolDefinition> = {
	manage_world: {
		description: "Manage world-related entities.",
		inputSchema: createManageSchema(schemas, tableEnum),
		handler: createManageEntityHandler("manage_world", tables.worldTables, tableEnum, schemas),
	},
}
