import { tables } from "@tome-master/shared"
import { createEntityActionDescription, createEntityHandler } from "./tool.utils"
import { zodToMCP } from "../zodToMcp"
import { schemas, type WorldTools } from "./world-tools-schema"
import { CreateEntityGetters, ToolDefinition } from "./utils/types"
import { db } from ".."
import { eq } from "drizzle-orm"

const {
	worldTables: { worldStateChanges },
} = tables

export type WorldGetters = CreateEntityGetters<typeof tables.worldTables>

export const entityGetters: WorldGetters = {
	all_world_state_changes: () => db.query.worldStateChanges.findMany(),
	world_state_change_by_id: (id: number) =>
		db.query.worldStateChanges.findFirst({
			where: eq(worldStateChanges.id, id),
			with: {
				relatedArc: true,
				sourceConflict: true,
				sourceDecision: true,
				sourceQuest: true,
				leadsToQuest: true,
				affectedArea: { columns: { name: true, id: true } },
				affectedFaction: { columns: { name: true, id: true } },
				affectedNpc: { columns: { name: true, id: true } },
				affectedRegion: { columns: { name: true, id: true } },
				affectedSite: { columns: { name: true, id: true } },
			},
		}),
}

export const worldToolDefinitions: Record<WorldTools, ToolDefinition> = {
	manage_world_state_changes: {
		description: createEntityActionDescription("world state change record"),
		inputSchema: zodToMCP(schemas.manage_world_state_changes),
		handler: createEntityHandler(worldStateChanges, schemas.manage_world_state_changes, "world state change record"),
	},
}
