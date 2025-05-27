import { tables } from "@tome-master/shared"
import { db } from "../index"
import { schemas, tableEnum } from "./items-tools-schema"
import { createManageEntityHandler, createManageSchema } from "./tool.utils"
import type { CreateEntityGetters, ToolDefinition } from "./utils/types"

type ItemGetters = CreateEntityGetters<typeof tables.itemTables>

export const entityGetters: ItemGetters = {
	all_items: () => db.query.items.findMany({}),
	all_item_notable_history: () => db.query.itemNotableHistory.findMany({}),
	all_item_relationships: () => db.query.itemRelationships.findMany({}),
	item_by_id: (id: number) =>
		db.query.items.findFirst({
			where: (items, { eq }) => eq(items.id, id),
			with: {
				notableHistory: true,
				sourceOfRelationships: {
					with: {
						sourceItem: { columns: { name: true, id: true } },
					},
				},
				targetInRelationships: {
					with: {
						relatedConflict: true,
						relatedFaction: true,
						relatedNpc: true,
						relatedQuest: true,
						relatedSite: true,
						relatedWorldConcept: true,
						relatedItem: true,
						relatedNarrativeDestination: true,
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
				relatedConflict: true,
				relatedFaction: true,
				relatedNpc: true,
				relatedQuest: true,
				relatedSite: true,
				relatedWorldConcept: true,
				relatedItem: true,
				relatedNarrativeDestination: true,
				sourceItem: true,
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
