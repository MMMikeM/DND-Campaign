import { tables } from "@tome-master/shared"
import { db } from "../index"
import { schemas, tableEnum } from "./lore-tools.schema"
import { createEnhancedPolymorphicConfig, createManageEntityHandler, createManageSchema } from "./utils/tool.utils"
import type { ToolDefinition } from "./utils/types"
import { createEntityGettersFactory } from "./utils/types"

const createEntityGetters = createEntityGettersFactory(tables.loreTables)

// Configure polymorphic validation for loreLinks table
const { targetEntityTypes } = tables.loreTables.enums
const polymorphicHelper = createEnhancedPolymorphicConfig(tables)
const polymorphicConfig = polymorphicHelper.fromEnums("loreLinks", [
	{
		typeField: "targetEntityType",
		idField: "targetEntityId",
		enumValues: targetEntityTypes,
		// No exclusions needed - all target entity types map to tables
	},
])

const loreTableDefs = {
	lore: tables.loreTables.lore,
	loreLinks: tables.loreTables.loreLinks,
}

export const entityGetters = createEntityGetters({
	all_lore: () => db.query.lore.findMany({}),
	all_lore_links: () => db.query.loreLinks.findMany({}),

	lore_by_id: (id: number) =>
		db.query.lore.findFirst({
			where: (lore, { eq }) => eq(lore.id, id),
			with: {
				incomingForeshadowing: true,
				itemRelations: true,
				links: {
					with: {
						targetConflict: { columns: { name: true, id: true } },
						targetFaction: { columns: { name: true, id: true } },
						targetNpc: { columns: { name: true, id: true } },
						targetQuest: { columns: { name: true, id: true } },
						targetRegion: { columns: { name: true, id: true } },
						targetLore: { columns: { name: true, id: true } },
						lore: { columns: { name: true, id: true } },
					},
				},
			},
		}),

	lore_link_by_id: (id: number) =>
		db.query.loreLinks.findFirst({
			where: (loreLinks, { eq }) => eq(loreLinks.id, id),
			with: {
				targetConflict: { columns: { name: true, id: true } },
				targetFaction: { columns: { name: true, id: true } },
				targetNpc: { columns: { name: true, id: true } },
				targetQuest: { columns: { name: true, id: true } },
				targetRegion: { columns: { name: true, id: true } },
				targetLore: { columns: { name: true, id: true } },
				lore: { columns: { name: true, id: true } },
			},
		}),
})

export const loreToolDefinitions: Record<"manage_lore", ToolDefinition> = {
	manage_lore: {
		enums: tables.loreTables.enums,
		description: "Manage lore-related entities.",
		inputSchema: createManageSchema(schemas, tableEnum),
		handler: createManageEntityHandler("manage_lore", loreTableDefs, tableEnum, schemas, polymorphicConfig),
		annotations: {
			title: "Manage Lore",
			readOnlyHint: false,
			destructiveHint: false,
			idempotentHint: false,
			openWorldHint: false,
		},
	},
}
