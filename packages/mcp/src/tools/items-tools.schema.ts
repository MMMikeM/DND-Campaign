import { tables } from "@tome-master/shared"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod/v4"
import { type CreateTableNames, id, list, optionalId, type Schema } from "./utils/tool.utils"

const {
	itemTables: { items, itemConnections, enums },
} = tables

const { itemTypes, rarityLevels, narrativeRoles } = enums

type TableNames = CreateTableNames<typeof tables.itemTables>

export const tableEnum = ["items", "itemConnections"] as const satisfies TableNames

export const schemas = {
	items: createInsertSchema(items, {
		tags: list.describe("Tags for this item"),
		description: list.describe("Physical attributes, history, and properties in point form"),
		creativePrompts: list.describe("GM ideas for using this item as a narrative element"),
		narrativeRole: z.enum(narrativeRoles).describe("Role of the item in the narrative"),
		name: (s) => s.describe("Distinctive name or title of the item"),
		itemType: z
			.enum(itemTypes)
			.describe("Item category (weapon, armor, tool, treasure, document, key_item, consumable)"),
		rarity: z.enum(rarityLevels).describe("Rarity level (common, uncommon, rare, very_rare, legendary, artifact)"),
		mechanicalEffects: list.describe("Game mechanical effects and abilities of this item"),
		narrativeSignificance: list.describe("Narrative significance of the item"),
		provenanceAndHistory: list.describe("Provenance and history of the item"),
	})
		.omit({ id: true })
		.strict()
		.describe("Interactive objects that players can acquire, use, and leverage in the narrative"),

	itemConnections: createInsertSchema(itemConnections, {
		connectedConflictId: optionalId.describe("ID of conflict this item is connected to"),
		connectedNpcId: optionalId.describe("ID of NPC this item is connected to"),
		connectedQuestId: optionalId.describe("ID of quest this item is connected to"),
		connectedSiteId: optionalId.describe("ID of site this item is connected to"),
		connectedFactionId: optionalId.describe("ID of faction this item is connected to"),
		connectedLoreId: optionalId.describe("ID of lore this item is connected to"),
		connectedItemId: optionalId.describe("ID of item this relationship belongs to"),
		details: list.describe("Details about the connection between items"),
		itemId: id.describe("ID of item this connection belongs to"),
		relationship: list.describe("Type of relationship"),
	})
		.omit({ id: true })
		.strict()
		.describe("Relationships between items and other entities"),
} as const satisfies Schema<TableNames[number]>
