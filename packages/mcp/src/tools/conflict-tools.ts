import { tables } from "@tome-master/shared"
import { eq } from "drizzle-orm"
import { db } from "../index"
import { schemas, tableEnum } from "./conflict-tools-schema"
import { createManageEntityHandler, createManageSchema } from "./tool.utils"
import { CreateEntityGetters, ToolDefinition } from "./utils/types"

const {
	conflictTables: { majorConflicts, conflictParticipants, conflictProgression },
} = tables

type ConflictGetters = CreateEntityGetters<typeof tables.conflictTables>

export const entityGetters: ConflictGetters = {
	all_major_conflicts: () => db.query.majorConflicts.findMany({}),
	all_conflict_participants: () => db.query.conflictParticipants.findMany({}),
	all_conflict_progression: () => db.query.conflictProgression.findMany({}),
	major_conflict_by_id: (id: number) =>
		db.query.majorConflicts.findFirst({
			where: eq(majorConflicts.id, id),
			with: {
				participants: true,
				primaryRegion: true,
				progression: true,
				worldChanges: true,
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

export const conflictToolDefinitions: Record<"manage_conflict", ToolDefinition> = {
	manage_conflict: {
		description: "Manage conflict-related entities.",
		inputSchema: createManageSchema(schemas, tableEnum),
		handler: createManageEntityHandler("manage_conflict", tables.conflictTables, tableEnum, schemas),
	},
}
