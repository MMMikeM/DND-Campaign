import { tables } from "@tome-master/shared"
import { db } from "../index"
import { schemas, tableEnum } from "./items-tools.schema"
import { createManageEntityHandler, createManageSchema } from "./utils/tool.utils"
import type { ToolDefinition } from "./utils/types"
import { createEntityGettersFactory } from "./utils/types"

const createEntityGetters = createEntityGettersFactory(tables.itemTables)

export const entityGetters = createEntityGetters({
	all_items: () => db.query.items.findMany({}),
	all_item_notable_history: () => db.query.itemNotableHistory.findMany({}),
	all_item_relations: () => db.query.itemRelations.findMany({}),
	item_by_id: (id: number) =>
		db.query.items.findFirst({
			where: (items, { eq }) => eq(items.id, id),
			with: {
				notableHistory: {
					with: {
						keyNpc: { columns: { name: true, id: true } },
						locationSite: { columns: { name: true, id: true } },
					},
				},
				incomingForeshadowing: true,

				questStage: true,
				relations: {
					with: {
						conflict: true,
						faction: true,
						npc: true,
						quest: true,
						site: true,
						lore: true,
						item: true,
						narrativeDestination: true,
					},
				},
			},
		}),
	item_notable_history_by_id: (id: number) =>
		db.query.itemNotableHistory.findFirst({
			where: (itemNotableHistory, { eq }) => eq(itemNotableHistory.id, id),
			with: {
				item: { columns: { name: true, id: true } },
			},
		}),
	item_relation_by_id: (id: number) =>
		db.query.itemRelations.findFirst({
			where: (itemRelations, { eq }) => eq(itemRelations.id, id),
			with: {
				relatedItem: true,
				conflict: true,
				faction: true,
				npc: true,
				quest: true,
				site: true,
				lore: true,
				item: true,
				narrativeDestination: true,
			},
		}),
})

export const itemToolDefinitions: Record<"manage_items", ToolDefinition> = {
	manage_items: {
		description: "Manage item-related entities.",
		inputSchema: createManageSchema(schemas, tableEnum),
		handler: createManageEntityHandler("manage_items", tables.itemTables, tableEnum, schemas),
		annotations: {
			title: "Manage Items",
			readOnlyHint: false,
			destructiveHint: false,
			idempotentHint: false,
			openWorldHint: false,
		},
	},
}
