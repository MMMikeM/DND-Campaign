import { tables } from "@tome-master/shared"
import { CamelToSnakeCase, createEntityActionDescription, createEntityHandler, type ToolDefinition } from "./tool.utils"
import { zodToMCP } from "../zodToMcp"
import { schemas } from "./conflict-tools-schema"

const {
	conflictTables: { majorConflicts, conflictParticipants, conflictProgression },
} = tables

type TableTools = `manage_${CamelToSnakeCase<keyof typeof tables.conflictTables>}`
export type ConflictTools = TableTools

export const conflictToolDefinitions: Record<ConflictTools, ToolDefinition> = {
	manage_major_conflicts: {
		description: createEntityActionDescription("major conflict"),
		inputSchema: zodToMCP(schemas.manage_major_conflicts),
		handler: createEntityHandler(majorConflicts, schemas.manage_major_conflicts, "major conflict"),
	},
	manage_conflict_participants: {
		description: createEntityActionDescription("conflict participant"),
		inputSchema: zodToMCP(schemas.manage_conflict_participants),
		handler: createEntityHandler(conflictParticipants, schemas.manage_conflict_participants, "conflict participant"),
	},
	manage_conflict_progression: {
		description: createEntityActionDescription("conflict progression record"),
		inputSchema: zodToMCP(schemas.manage_conflict_progression),
		handler: createEntityHandler(
			conflictProgression,
			schemas.manage_conflict_progression,
			"conflict progression record",
		),
	},
}
