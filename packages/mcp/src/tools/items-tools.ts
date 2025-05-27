import { tables } from "@tome-master/shared"
import { db } from "../index"
import { schemas, tableEnum } from "./items-tools-schema"
import { createManageEntityHandler, createManageSchema } from "./tool.utils"
import type { CreateEntityGetters, ToolDefinition } from "./utils/types"

type ItemGetters = CreateEntityGetters<typeof tables.itemTables>

export const entityGetters: ItemGetters = {
	all_items: () => db.query.items.findMany({}),
	all_item_history: () => db.query.itemHistory.findMany({}),

	item_by_id: (id: number) =>
		db.query.items.findFirst({
			where: (items, { eq }) => eq(items.id, id),
			with: {
				currentLocation: { columns: { name: true, id: true } },
				ownerNpc: { columns: { name: true, id: true } },
				controllingFaction: { columns: { name: true, id: true } },
				quest: { columns: { name: true, id: true } },
				stage: { columns: { name: true, id: true } },
				history: true,
			},
		}),

	item_history_by_id: (id: number) =>
		db.query.itemHistory.findFirst({
			where: (itemHistory, { eq }) => eq(itemHistory.id, id),
			with: {
				item: { columns: { name: true, id: true } },
			},
		}),
}

export const itemToolDefinitions: Record<"manage_items", ToolDefinition> = {
	manage_items: {
		description: "Manage item-related entities.",
		inputSchema: createManageSchema(schemas, tableEnum),
		handler: createManageEntityHandler("manage_items", tables.itemTables, tableEnum, schemas),
	},
}
