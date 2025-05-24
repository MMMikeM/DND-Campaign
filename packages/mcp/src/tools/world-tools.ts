import { tables } from "@tome-master/shared"
import { eq } from "drizzle-orm"
import { db } from "../index"
import { createManageEntityHandler, createManageSchema } from "./tool.utils"
import type { CreateEntityGetters, ToolDefinition } from "./utils/types"
import { schemas, tableEnum } from "./world-tools-schema"

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

export const worldToolDefinitions: Record<"manage_world", ToolDefinition> = {
	manage_world: {
		description: "Manage world-related entities.",
		inputSchema: createManageSchema(schemas, tableEnum),
		handler: createManageEntityHandler("manage_world", tables.worldTables, tableEnum, schemas),
	},
}
