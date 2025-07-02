import { tables } from "@tome-master/shared"
import { db } from "../index"
import { schemas, tableEnum } from "./consequence-tools.schema"
import { createManageEntityHandler, createManageSchema } from "./utils/tool.utils"
import type { ToolDefinition } from "./utils/types"
import { createEntityGettersFactory } from "./utils/types"

const createEntityGetters = createEntityGettersFactory(tables.consequenceTables)

export const entityGetters = createEntityGetters({
	all_consequences: () => db.query.consequences.findMany({}),

	consequence_by_id: (id: number) =>
		db.query.consequences.findFirst({
			where: (consequences, { eq }) => eq(consequences.id, id),
			with: {
				affectedConsequence: true,
				affectingConsequences: true,
				triggerQuestStageDecision: true,
				affectedConflict: true,
				affectedNpc: true,
				affectedQuest: true,
				triggerQuest: true,
				affectedRegion: true,
				affectedArea: true,
				affectedSite: true,
				affectedFaction: true,
			},
		}),
})

export const consequenceToolDefinitions: Record<"manage_consequence", ToolDefinition> = {
	manage_consequence: {
		enums: tables.consequenceTables.enums,
		description: "Manage consequence-related entities.",
		inputSchema: createManageSchema(schemas, tableEnum),
		handler: createManageEntityHandler("manage_consequence", tables.consequenceTables, tableEnum, schemas),
		annotations: {
			title: "Manage Consequences",
			readOnlyHint: false,
			destructiveHint: false,
			idempotentHint: false,
			openWorldHint: false,
		},
	},
}
