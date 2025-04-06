import { tables } from "@tome-master/shared"
import { zodToMCP } from "../zodToMcp"
import { schemas } from "./foreshadowing-tools-schema"
import { eq } from "drizzle-orm"

import { CreateEntityGetters, CreateTableTools, ToolDefinition } from "./utils/types"
import { createEntityActionDescription, createEntityHandler, createGetEntityHandler } from "./tool.utils"
import { db } from ".."

const {
	foreshadowingTables: { narrativeForeshadowing },
} = tables

type ForeshadowingGetters = CreateEntityGetters<typeof tables.foreshadowingTables>
export type ForeshadowingTools = CreateTableTools<typeof tables.foreshadowingTables> | "get_foreshadowing_entity"

const entityGetters: ForeshadowingGetters = {
	all_narrative_foreshadowing: () => db.query.narrativeForeshadowing.findMany(),
	narrative_foreshadowing_by_id: (id: number) =>
		db.query.narrativeForeshadowing.findFirst({
			where: eq(narrativeForeshadowing.id, id),
		}),
}

export const foreshadowingToolDefinitions: Record<ForeshadowingTools, ToolDefinition> = {
	get_foreshadowing_entity: {
		description: "Get foreshadowing-related entity information by type and optional ID",
		inputSchema: zodToMCP(schemas.get_foreshadowing_entity),
		handler: createGetEntityHandler("foreshadowing", entityGetters),
	},
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
