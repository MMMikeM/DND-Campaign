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
	all_item_relationships: () => db.query.itemRelationships.findMany({}),
	item_by_id: (id: number) =>
		db.query.items.findFirst({
			where: (items, { eq }) => eq(items.id, id),
			with: {
				notableHistory: {
					with: {
						keyNpc: { columns: { name: true, id: true } },
						eventLocationSite: { columns: { name: true, id: true } },
					},
				},
				sourceOfRelationships: {
					with: {
						targetConflict: { columns: { name: true, id: true } },
						targetFaction: { columns: { name: true, id: true } },
						targetNpc: { columns: { name: true, id: true } },
						targetQuest: { columns: { name: true, id: true } },
						targetSite: { columns: { name: true, id: true } },
						targetWorldConcept: { columns: { name: true, id: true } },
						targetItem: { columns: { name: true, id: true } },
						targetNarrativeDestination: { columns: { name: true, id: true } },
					},
				},
				targetOfRelationships: {
					with: {
						sourceItem: { columns: { name: true, id: true } },
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
	item_relationship_by_id: (id: number) =>
		db.query.itemRelationships.findFirst({
			where: (itemRelationships, { eq }) => eq(itemRelationships.id, id),
			with: {
				targetConflict: true,
				targetFaction: true,
				targetNpc: true,
				targetQuest: true,
				targetSite: true,
				targetWorldConcept: true,
				targetItem: true,
				targetNarrativeDestination: true,
				sourceItem: true,
			},
		}),
})

export const itemToolDefinitions: Record<"manage_items", ToolDefinition> = {
	manage_items: {
		description: "Manage item-related entities.",
		inputSchema: createManageSchema(schemas, tableEnum),
		handler: createManageEntityHandler("manage_items", tables.itemTables, tableEnum, schemas),
	},
}
