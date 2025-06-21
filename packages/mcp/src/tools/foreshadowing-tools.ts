import { tables } from "@tome-master/shared"
import { db } from "../index"
import { schemas, tableEnum } from "./foreshadowing-tools.schema"
import { createEnhancedPolymorphicConfig, createManageEntityHandler, createManageSchema } from "./utils/tool.utils"
import type { ToolDefinition } from "./utils/types"
import { createEntityGettersFactory } from "./utils/types"

const createEntityGetters = createEntityGettersFactory(tables.foreshadowingTables)

// Configure polymorphic validation for foreshadowing table
const { foreshadowedTargetType, foreshadowingSourceType } = tables.foreshadowingTables.enums
const polymorphicHelper = createEnhancedPolymorphicConfig(tables)
const polymorphicConfig = polymorphicHelper.fromEnums("foreshadowing", [
	{
		typeField: "targetEntityType",
		idField: "targetEntityId",
		enumValues: foreshadowedTargetType,
		exclude: ["abstract_theme", "specific_reveal"],
	},
	{
		typeField: "sourceEntityType",
		idField: "sourceEntityId",
		enumValues: foreshadowingSourceType,
		exclude: ["item_description"],
	},
])

export const entityGetters = createEntityGetters({
	all_foreshadowing: () => db.query.foreshadowing.findMany({}),

	foreshadowing_by_id: (id: number) =>
		db.query.foreshadowing.findFirst({
			where: (foreshadowing, { eq }) => eq(foreshadowing.id, id),
			with: {
				sourceLore: { columns: { name: true, id: true } },
				sourceNpc: { columns: { name: true, id: true } },
				sourceSite: { columns: { name: true, id: true } },
				sourceQuest: { columns: { name: true, id: true } },
				sourceQuestStage: { columns: { name: true, id: true } },
				targetFaction: { columns: { name: true, id: true } },
				targetItem: { columns: { name: true, id: true } },
				targetConflict: { columns: { name: true, id: true } },
				targetNarrativeDestination: { columns: { name: true, id: true } },
				targetNpc: { columns: { name: true, id: true } },
				targetQuest: { columns: { name: true, id: true } },
				targetLore: { columns: { name: true, id: true } },
				targetNarrativeEvent: { columns: { name: true, id: true } },
				targetSite: { columns: { name: true, id: true } },
			},
		}),
})

export const foreshadowingToolDefinitions: Record<"manage_foreshadowing", ToolDefinition> = {
	manage_foreshadowing: {
		enums: tables.foreshadowingTables.enums,
		description: "Manage foreshadowing-related entities.",
		inputSchema: createManageSchema(schemas, tableEnum),
		handler: createManageEntityHandler(
			"manage_foreshadowing",
			tables.foreshadowingTables,
			tableEnum,
			schemas,
			polymorphicConfig,
		),
		annotations: {
			title: "Manage Foreshadowing",
			readOnlyHint: false,
			destructiveHint: false,
			idempotentHint: false,
			openWorldHint: false,
		},
	},
}
