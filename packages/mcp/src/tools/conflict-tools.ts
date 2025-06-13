import { tables } from "@tome-master/shared"
import { db } from "../index"
import { schemas, tableEnum } from "./conflict-tools.schema"
import { createManageEntityHandler, createManageSchema } from "./utils/tool.utils"
import type { ToolDefinition } from "./utils/types"
import { createEntityGettersFactory } from "./utils/types"

const createEntityGetters = createEntityGettersFactory(tables.conflictTables)

export const entityGetters = createEntityGetters({
	all_conflicts: () => db.query.conflicts.findMany({}),
	all_conflict_participants: () => db.query.conflictParticipants.findMany({}),
	conflict_by_id: (id: number) =>
		db.query.conflicts.findFirst({
			where: (conflicts, { eq }) => eq(conflicts.id, id),
			with: {
				affectedByConsequences: true,
				consequences: true,
				foreshadowingSeeds: true,
				itemRelationships: true,
				narrativeDestinations: true,
				worldConceptLinks: true,
				primaryRegion: true,
				participants: { with: { faction: true, npc: true } },
			},
		}),
	conflict_participant_by_id: (id: number) =>
		db.query.conflictParticipants.findFirst({
			where: (conflictParticipants, { eq }) => eq(conflictParticipants.id, id),
			with: {
				conflict: true,
				faction: true,
				npc: true,
			},
		}),
})

export const conflictToolDefinitions: Record<"manage_conflict", ToolDefinition> = {
	manage_conflict: {
		description: "Manage conflict-related entities.",
		inputSchema: createManageSchema(schemas, tableEnum),
		handler: createManageEntityHandler("manage_conflict", tables.conflictTables, tableEnum, schemas),
		annotations: {
			title: "Manage Conflicts",
			readOnlyHint: false,
			destructiveHint: false,
			idempotentHint: false,
			openWorldHint: false,
		},
	},
}
