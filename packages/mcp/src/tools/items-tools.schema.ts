import { tables } from "@tome-master/shared"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod/v4"
import { type CreateTableNames, id, optionalId, type Schema } from "./utils/tool.utils"

const {
	itemTables: { items, itemNotableHistory, itemRelationships, enums },
} = tables

const { itemTypes, rarityLevels, itemRelationshipTypes, narrativeRoles, perceivedSimplicityLevels, targetEntityTypes } =
	enums

type TableNames = CreateTableNames<typeof tables.itemTables>

export const tableEnum = ["items", "itemNotableHistory", "itemRelationships"] as const satisfies TableNames

export const schemas = {
	items: createInsertSchema(items, {
		gmNotes: (s) => s.describe("GM-only information about this item"),
		tags: (s) => s.describe("Tags for this item"),
		narrativeRole: z.enum(narrativeRoles).describe("Role of the item in the narrative"),
		perceivedSimplicity: z.enum(perceivedSimplicityLevels).describe("How simple the item is to use"),
		name: (s) => s.describe("Distinctive name or title of the item"),
		itemType: z
			.enum(itemTypes)
			.describe("Item category (weapon, armor, tool, treasure, document, key_item, consumable)"),
		rarity: z.enum(rarityLevels).describe("Rarity level (common, uncommon, rare, very_rare, legendary, artifact)"),
		description: (s) => s.describe("Physical attributes, history, and properties in point form"),
		loreSignificance: (s) => s.describe("Historical and cultural importance of this item"),
		mechanicalEffects: (s) => s.describe("Game mechanical effects and abilities of this item"),
		significance: (s) => s.describe("Item's importance to the plot or world lore"),
		creativePrompts: (s) => s.describe("GM ideas for using this item as a narrative element"),
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
		creativePrompts: (s) => s.describe("GM ideas for using this historical event"),
		description: (s) => s.describe("Description of the historical event in point form"),
		gmNotes: (s) => s.describe("GM-only information about this historical event"),
		tags: (s) => s.describe("Tags for this historical event"),
		eventDescription: (s) => s.describe("Description of the event that occurred to the item"),
		locationSiteId: optionalId.describe("ID of the site where the event occurred"),
		keyNpcId: optionalId.describe("ID of the NPC who is the key figure in this event"),
		npcRoleInEvent: z.enum(narrativeRoles).describe("Role of the NPC in the event"),
	})
		.omit({ id: true })
		.strict()
		.describe("Historical events and ownership changes for items"),

	itemRelationships: createInsertSchema(itemRelationships, {
		targetEntityType: z.enum(targetEntityTypes).describe("Type of entity this relationship belongs to"),
		creativePrompts: (s) => s.describe("GM ideas for using this relationship"),
		description: (s) => s.describe("Description of the relationship in point form"),
		gmNotes: (s) => s.describe("GM-only information about this relationship"),
		tags: (s) => s.describe("Tags for this relationship"),
		targetConflictId: optionalId.describe("ID of related conflict"),
		targetFactionId: optionalId.describe("ID of related faction"),
		targetItemId: optionalId.describe("ID of related item"),
		targetNpcId: optionalId.describe("ID of related NPC"),
		targetSiteId: optionalId.describe("ID of related site"),
		targetWorldConceptId: optionalId.describe("ID of related world concept"),
		targetNarrativeDestinationId: optionalId.describe("ID of related narrative destination"),
		targetQuestId: optionalId.describe("ID of related quest"),
		relationshipDetails: (s) => s.optional().describe("Details about the relationship between entities"),
		relationshipType: z.enum(itemRelationshipTypes).describe("Type of relationship"),
		sourceItemId: id.describe("ID of item this relationship belongs to"),
	})
		.omit({ id: true })
		.strict()
		.describe("Relationships between items and other entities"),
} as const satisfies Schema<TableNames[number]>
