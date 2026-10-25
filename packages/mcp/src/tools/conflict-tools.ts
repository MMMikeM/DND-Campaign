import { enums, tables } from "@tome-master/shared/entities/conflicts"
import { db } from "../index"
import { schemas, tableEnum } from "./conflict-tools.schema"
import { createManageEntityHandler, createManageSchema } from "./utils/tool.utils"
import type { ToolDefinition } from "./utils/types"
import { createEntityGettersFactory } from "./utils/types"

const createEntityGetters = createEntityGettersFactory(tables)

export const entityGetters = createEntityGetters({
	all_conflicts: () => db.query.conflicts.findMany({}),
	all_conflict_participants: () => db.query.conflictParticipants.findMany({}),
	conflict_by_id: (id: number) =>
		db.query.conflicts.findFirst({
			where: { id },
			with: {
				affectingConsequences: true,
				incomingForeshadowing: true,
				itemConnections: true,
				loreLinks: true,
				region: true,
				participants: { with: { faction: true, npc: true } },
			},
		}),
	conflict_participant_by_id: (id: number) =>
		db.query.conflictParticipants.findFirst({
			where: { id },
			with: {
				conflict: true,
				faction: true,
				npc: true,
			},
		}),
})

export const conflictToolDefinitions: Record<"manage_conflict", ToolDefinition> = {
	manage_conflict: {
		enums,
		description: "Manage conflict-related entities.",
		inputSchema: createManageSchema(schemas, tableEnum),
		handler: createManageEntityHandler("manage_conflict", tables, tableEnum, schemas),
		annotations: {
			title: "Manage Conflicts",
			readOnlyHint: false,
			destructiveHint: true,
			idempotentHint: false,
			openWorldHint: false,
		},
	},
}
