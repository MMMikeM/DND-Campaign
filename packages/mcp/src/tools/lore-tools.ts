import { tables } from "@tome-master/shared"
import { db } from "../index"
import { schemas, tableEnum } from "./lore-tools.schema"
import { createManageEntityHandler, createManageSchema } from "./utils/tool.utils"
import type { ToolDefinition } from "./utils/types"
import { createEntityGettersFactory } from "./utils/types"

const createEntityGetters = createEntityGettersFactory(tables.loreTables)

export const entityGetters = createEntityGetters({
	all_lore: () => db.query.lore.findMany({}),
	all_lore_links: () => db.query.loreLinks.findMany({}),

	lore_by_id: (id: number) =>
		db.query.lore.findFirst({
			where: (lore, { eq }) => eq(lore.id, id),
			with: {
				itemRelations: true,
				links: {
					with: {
						lore: true,
						targetConflict: true,
						targetFaction: true,
						targetNpc: true,
						targetQuest: true,
						targetRegion: true,
					},
				},
				incomingForeshadowing: true,
			},
		}),

	lore_link_by_id: (id: number) =>
		db.query.loreLinks.findFirst({
			where: (loreLinks, { eq }) => eq(loreLinks.id, id),
			with: {
				lore: true,
				targetConflict: true,
				targetFaction: true,
				targetNpc: true,
				targetQuest: true,
				targetRegion: true,
			},
		}),
})

export const loreToolDefinitions: Record<"manage_lore", ToolDefinition> = {
	manage_lore: {
		description: "Manage lore-related entities.",
		inputSchema: createManageSchema(schemas, tableEnum),
		handler: createManageEntityHandler("manage_lore", tables.loreTables, tableEnum, schemas),
		annotations: {
			title: "Manage Lore",
			readOnlyHint: false,
			destructiveHint: false,
			idempotentHint: false,
			openWorldHint: false,
		},
	},
}
