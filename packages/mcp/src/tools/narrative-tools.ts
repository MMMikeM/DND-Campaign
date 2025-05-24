import { tables } from "@tome-master/shared"
import { eq } from "drizzle-orm"
import { db } from "../index"
import { schemas, tableEnum } from "./narrative-tools-schema"
import { createManageEntityHandler, createManageSchema } from "./tool.utils"
import type { CreateEntityGetters, ToolDefinition } from "./utils/types"

const {
	narrativeTables: { narrativeArcs, arcMembership },
} = tables

type NarrativeGetters = CreateEntityGetters<typeof tables.narrativeTables>

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

export const narrativeToolDefinitions: Record<"manage_narrative", ToolDefinition> = {
	manage_narrative: {
		description: "Manage narrative-related entities.",
		inputSchema: createManageSchema(schemas, tableEnum),
		handler: createManageEntityHandler("manage_narrative", tables.narrativeTables, tableEnum, schemas),
	},
}
