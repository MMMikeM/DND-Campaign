import { tables } from "@tome-master/shared"
import { zodToMCP } from "../zodToMcp"
import { schemas } from "./narrative-tools-schema"
import { eq } from "drizzle-orm"
import { db } from ".."
import { createEntityActionDescription, createEntityHandler } from "./tool.utils"
import { CreateTableTools, CreateEntityGetters, ToolDefinition } from "./utils/types"
import { z } from "zod"

const {
	narrativeTables: { narrativeArcs, arcMembership },
} = tables

export const entityGetters: NarrativeGetters = {
	all_narrative_arcs: () => db.query.narrativeArcs.findMany({}),
	all_arc_membership: () => db.query.arcMembership.findMany({}),
	narrative_arc_by_id: (id: number) =>
		db.query.narrativeArcs.findFirst({
			where: eq(narrativeArcs.id, id),
			with: {
				foreshadowing: true,
				members: true,
				worldChanges: true,
			},
		}),
	arc_membership_by_id: (id: number) =>
		db.query.arcMembership.findFirst({
			where: eq(arcMembership.id, id),
			with: {
				arc: true,
				quest: true,
			},
		}),
}
export type NarrativeTools = CreateTableTools<typeof tables.narrativeTables>
export type NarrativeGetters = CreateEntityGetters<typeof tables.narrativeTables>

const getEntitySchema = z.object({
	entity_type: z.enum(["narrative_arcs", "arc_membership"]),
	entity_id: z.number().optional(),
})

export const narrativeToolDefinitions: Record<NarrativeTools, ToolDefinition> = {
	manage_narrative_arcs: {
		description: createEntityActionDescription("narrative arc"),
		inputSchema: zodToMCP(schemas.manage_narrative_arcs),
		handler: createEntityHandler(narrativeArcs, schemas.manage_narrative_arcs, "narrative arc"),
	},
	manage_arc_membership: {
		description: createEntityActionDescription("arc membership record"),
		inputSchema: zodToMCP(schemas.manage_arc_membership),
		handler: createEntityHandler(arcMembership, schemas.manage_arc_membership, "arc membership record"),
	},
}
