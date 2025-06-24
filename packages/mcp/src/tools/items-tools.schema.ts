import { tables } from "@tome-master/shared"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod/v4"
import { type CreateTableNames, id, list, optionalId, type Schema } from "./utils/tool.utils"

const {
	itemTables: { items, itemNotableHistory, itemRelations, enums },
} = tables

const { itemTypes, rarityLevels, itemRelationshipTypes, narrativeRoles, perceivedSimplicityLevels, targetEntityTypes } =
	enums

type TableNames = CreateTableNames<typeof tables.itemTables>

export const tableEnum = ["items", "itemNotableHistory", "itemRelations"] as const satisfies TableNames

export const schemas = {
	items: createInsertSchema(items, {
		gmNotes: list.describe("GM-only information about this item"),
		tags: list.describe("Tags for this item"),
		description: list.describe("Physical attributes, history, and properties in point form"),
		creativePrompts: list.describe("GM ideas for using this item as a narrative element"),
		narrativeRole: z.enum(narrativeRoles).describe("Role of the item in the narrative"),
		perceivedSimplicity: z.enum(perceivedSimplicityLevels).describe("How simple the item is to use"),
		name: (s) => s.describe("Distinctive name or title of the item"),
		itemType: z
			.enum(itemTypes)
			.describe("Item category (weapon, armor, tool, treasure, document, key_item, consumable)"),
		rarity: z.enum(rarityLevels).describe("Rarity level (common, uncommon, rare, very_rare, legendary, artifact)"),
		loreSignificance: (s) => s.describe("Historical and cultural importance of this item"),
		mechanicalEffects: list.describe("Game mechanical effects and abilities of this item"),
		significance: (s) => s.describe("Item's importance to the plot or world lore"),
		creationPeriod: (s) => s.optional().describe("When this item was created"),
		placeOfOrigin: (s) => s.optional().describe("Where this item was originally created"),
		questId: optionalId.describe("ID of quest this item is related to"),
		questStageId: optionalId.describe("ID of quest stage this item is related to"),
	})
		.omit({ id: true })
		.strict()
		.describe("Interactive objects that players can acquire, use, and leverage in the narrative"),

	itemNotableHistory: createInsertSchema(itemNotableHistory, {
		itemId: id.describe("ID of item this history entry belongs to"),
		timeframe: (s) => s.describe("When this event occurred"),
		creativePrompts: list.describe("GM ideas for using this historical event"),
		description: list.describe("Description of the historical event in point form"),
		gmNotes: list.describe("GM-only information about this historical event"),
		tags: list.describe("Tags for this historical event"),
		eventDescription: (s) => s.describe("Description of the event that occurred to the item"),
		locationSiteId: optionalId.describe("ID of the site where the event occurred"),
		keyNpcId: optionalId.describe("ID of the NPC who is the key figure in this event"),
		npcRoleInEvent: z.enum(narrativeRoles).describe("Role of the NPC in the event"),
	})
		.omit({ id: true })
		.strict()
		.describe("Historical events and ownership changes for items"),

	itemRelations: createInsertSchema(itemRelations, {
		creativePrompts: list.describe("GM ideas for using this relationship"),
		description: list.describe("Description of the relationship in point form"),
		gmNotes: list.describe("GM-only information about this relationship"),
		tags: list.describe("Tags for this relationship"),
		sourceItemId: id.describe("ID of item this relationship belongs to"),
		conflictId: optionalId.describe("ID of conflict this relationship belongs to"),
		itemId: optionalId.describe("ID of item this relationship belongs to"),
		narrativeDestinationId: optionalId.describe("ID of narrative destination this relationship belongs to"),
		questId: optionalId.describe("ID of quest this relationship belongs to"),
		siteId: optionalId.describe("ID of site this relationship belongs to"),
		factionId: optionalId.describe("ID of faction this relationship belongs to"),
		npcId: optionalId.describe("ID of NPC this relationship belongs to"),
		relationshipDetails: (s) => s.optional().describe("Details about the relationship between entities"),
		relationshipType: z.enum(itemRelationshipTypes).describe("Type of relationship"),
	})
		.omit({ id: true })
		.strict()
		.describe("Relationships between items and other entities"),
} as const satisfies Schema<TableNames[number]>
