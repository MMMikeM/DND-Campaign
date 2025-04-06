import { tables } from "@tome-master/shared"
import { createEntityActionDescription, createEntityHandler, type ToolDefinition } from "./tool.utils"
import { zodToMCP } from "../zodToMcp"
import { schemas, type WorldTools } from "./world-tools-schema"

const {
	worldTables: { worldStateChanges },
} = tables

export const worldToolDefinitions: Record<WorldTools, ToolDefinition> = {
	manage_world_state_changes: {
		description: createEntityActionDescription("world state change record"),
		inputSchema: zodToMCP(schemas.manage_world_state_changes),
		handler: createEntityHandler(worldStateChanges, schemas.manage_world_state_changes, "world state change record"),
	},
}
