import { tables } from "@tome-master/shared"
import { zodToMCP } from "../zodToMcp"
import { schemas } from "./conflict-tools-schema"
import { CreateEntityGetters, CreateTableTools, ToolDefinition } from "./utils/types"
import { createEntityActionDescription, createEntityHandler, createGetEntityHandler } from "./tool.utils"
import { db } from ".."
import { eq } from "drizzle-orm"

const {
	conflictTables: { majorConflicts, conflictParticipants, conflictProgression },
} = tables

type ConflictGetters = CreateEntityGetters<typeof tables.conflictTables>
export type ConflictTools = CreateTableTools<typeof tables.conflictTables> | "get_conflict_entity"

const entityGetters: ConflictGetters = {
	all_major_conflicts: () => db.query.majorConflicts.findMany(),
	all_conflict_participants: () => db.query.conflictParticipants.findMany(),
	all_conflict_progression: () => db.query.conflictProgression.findMany(),
	major_conflict_by_id: (id: number) =>
		db.query.majorConflicts.findFirst({
			where: eq(majorConflicts.id, id),
			with: {
				participants: true,
				primaryRegion: true,
				progression: true,
			},
		}),
	conflict_participant_by_id: (id: number) =>
		db.query.conflictParticipants.findFirst({
			where: eq(conflictParticipants.id, id),
			with: {
				conflict: true,
				faction: true,
			},
		}),

	conflict_progression_by_id: (id: number) =>
		db.query.conflictProgression.findFirst({
			where: eq(conflictProgression.id, id),
			with: {
				conflict: true,
				quest: true,
			},
		}),
}

export const conflictToolDefinitions: Record<ConflictTools, ToolDefinition> = {
	get_conflict_entity: {
		description: "Get conflict-related entity information by type and optional ID",
		inputSchema: zodToMCP(schemas.get_conflict_entity),
		handler: createGetEntityHandler("conflict", entityGetters),
	},
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
