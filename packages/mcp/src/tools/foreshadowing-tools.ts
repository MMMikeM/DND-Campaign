import { tables } from "@tome-master/shared"
import { db } from "../index"
import { schemas, tableEnum } from "./foreshadowing-tools.schema"
import { createManageEntityHandler, createManageSchema, nameAndId } from "./utils/tool.utils"
import type { ToolDefinition } from "./utils/types"
import { createEntityGettersFactory } from "./utils/types"

const createEntityGetters = createEntityGettersFactory(tables.foreshadowingTables)

export const entityGetters = createEntityGetters({
	all_foreshadowing: () => db.query.foreshadowing.findMany({}),

	foreshadowing_by_id: (id: number) =>
		db.query.foreshadowing.findFirst({
			where: (foreshadowing, { eq }) => eq(foreshadowing.id, id),
			with: {
				incomingLoreLinks: nameAndId,
				sourceItem: nameAndId,
				sourceLore: nameAndId,
				sourceNpc: nameAndId,
				sourceQuest: nameAndId,
				sourceQuestStage: nameAndId,
				sourceSite: nameAndId,
				targetConflict: nameAndId,
				targetConsequence: nameAndId,
				targetFaction: nameAndId,
				targetItem: nameAndId,
				targetLore: nameAndId,
				targetNpc: nameAndId,
				targetQuest: nameAndId,
				targetSite: nameAndId,
			},
		}),
})

export const foreshadowingToolDefinitions: Record<"manage_foreshadowing", ToolDefinition> = {
	manage_foreshadowing: {
		enums: tables.foreshadowingTables.enums,
		description: "Manage foreshadowing-related entities.",
		inputSchema: createManageSchema(schemas, tableEnum),
		handler: createManageEntityHandler("manage_foreshadowing", tables.foreshadowingTables, tableEnum, schemas),
		annotations: {
			title: "Manage Foreshadowing",
			readOnlyHint: false,
			destructiveHint: false,
			idempotentHint: false,
			openWorldHint: false,
		},
	},
}
