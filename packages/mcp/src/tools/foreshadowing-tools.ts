import { tables } from "@tome-master/shared"
import { zodToMCP } from "../zodToMcp"
import { schemas } from "./foreshadowing-tools-schema"
import { eq } from "drizzle-orm"

import { CreateEntityGetters, CreateTableTools, ToolDefinition } from "./utils/types"
import { createEntityActionDescription, createEntityHandler } from "./tool.utils"
import { db } from ".."

const {
	foreshadowingTables: { narrativeForeshadowing },
} = tables

type ForeshadowingGetters = CreateEntityGetters<typeof tables.foreshadowingTables>
export type ForeshadowingTools = CreateTableTools<typeof tables.foreshadowingTables>

export const entityGetters: ForeshadowingGetters = {
	all_narrative_foreshadowing: () => db.query.narrativeForeshadowing.findMany(),
	narrative_foreshadowing_by_id: (id: number) =>
		db.query.narrativeForeshadowing.findFirst({
			where: eq(narrativeForeshadowing.id, id),
			with: {
				sourceFaction: { columns: { name: true, id: true } },
				sourceNpc: { columns: { name: true, id: true } },
				sourceSite: { columns: { name: true, id: true } },
				sourceStage: { columns: { name: true, id: true } },
				targetArc: true,
				targetNpc: { columns: { name: true, id: true } },
				targetQuest: { columns: { name: true, id: true } },
				targetTwist: true,
			},
		}),
}

export const foreshadowingToolDefinitions: Record<ForeshadowingTools, ToolDefinition> = {
	manage_narrative_foreshadowing: {
		description: createEntityActionDescription("narrative foreshadowing hint"),
		inputSchema: zodToMCP(schemas.manage_narrative_foreshadowing),
		handler: createEntityHandler(
			narrativeForeshadowing,
			schemas.manage_narrative_foreshadowing,
			"narrative foreshadowing hint",
		),
	},
}
