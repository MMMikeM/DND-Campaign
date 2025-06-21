import { tables } from "@tome-master/shared"
import { db } from "../index"
import { schemas, tableEnum } from "./items-tools.schema"
import { createEnhancedPolymorphicConfig, createManageEntityHandler, createManageSchema } from "./utils/tool.utils"
import type { ToolDefinition } from "./utils/types"
import { createEntityGettersFactory } from "./utils/types"

const createEntityGetters = createEntityGettersFactory(tables.itemTables)

// Configure polymorphic validation for itemRelations table
const { targetEntityTypes } = tables.itemTables.enums
const polymorphicHelper = createEnhancedPolymorphicConfig(tables)
const polymorphicConfig = polymorphicHelper.fromEnums("itemRelations", [
	{
		typeField: "targetEntityType",
		idField: "targetEntityId",
		enumValues: targetEntityTypes,
		// No exclusions needed - all target entity types map to tables
	},
])

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
						sourceItem: true,
						targetConflict: true,
						targetFaction: true,
						targetLore: true,
						targetNpc: true,
						targetQuest: true,
						targetSite: true,
						targetItem: true,
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
				sourceItem: true,
				targetConflict: true,
				targetFaction: true,
				targetLore: true,
				targetNpc: true,
				targetQuest: true,
				targetSite: true,
				targetItem: true,
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
