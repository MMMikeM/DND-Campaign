import { tables } from "@tome-master/shared"
import { db } from "../index"
import { schemas, tableEnum } from "./items-tools.schema"
import { createManageEntityHandler, createManageSchema, nameAndId } from "./utils/tool.utils"
import type { ToolDefinition } from "./utils/types"
import { createEntityGettersFactory } from "./utils/types"

const createEntityGetters = createEntityGettersFactory(tables.itemTables)

export const entityGetters = createEntityGetters({
	all_items: () => db.query.items.findMany({}),
	all_item_connections: () => db.query.itemConnections.findMany({}),
	item_by_id: (id: number) =>
		db.query.items.findFirst({
			where: (items, { eq }) => eq(items.id, id),
			with: {
				outgoingForeshadowing: { with: { sourceItem: nameAndId } },
				incomingForeshadowing: { with: { targetItem: nameAndId } },
				loreLinks: true,
				relations: {
					with: {
						sourceItem: true,
						lore: true,
						questStage: true,
						conflict: true,
						item: true,
						quest: true,
						site: true,
						npc: true,
						faction: true,
					},
				},
			},
		}),
	item_connection_by_id: (id: number) =>
		db.query.itemConnections.findFirst({
			where: (itemConnections, { eq }) => eq(itemConnections.id, id),
			with: {
				sourceItem: true,
				item: true,
				npc: true,
				conflict: true,
				quest: true,
				site: true,
				faction: true,
			},
		}),
})

export const itemToolDefinitions: Record<"manage_item", ToolDefinition> = {
	manage_item: {
		enums: tables.itemTables.enums,
		description: "Manage item-related entities.",
		inputSchema: createManageSchema(schemas, tableEnum),
		handler: createManageEntityHandler("manage_item", tables.itemTables, tableEnum, schemas),
		annotations: {
			title: "Manage Items",
			readOnlyHint: false,
			destructiveHint: false,
			idempotentHint: false,
			openWorldHint: false,
		},
	},
}
