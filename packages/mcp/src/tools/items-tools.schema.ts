import { tables } from "@tome-master/shared"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod/v4"
import { type CreateTableNames, id, optionalId, type Schema } from "./utils/tool.utils"

const {
	itemTables: { items, itemNotableHistory, itemRelationships, enums },
} = tables

type TableNames = CreateTableNames<typeof tables.itemTables>

export const tableEnum = ["items", "itemNotableHistory", "itemRelationships"] as const satisfies TableNames

export const schemas = {
	items: createInsertSchema(items, {
		name: (s) => s.describe("Distinctive name or title of the item"),
		itemType: z
			.enum(enums.itemTypes)
			.describe("Item category (weapon, armor, tool, treasure, document, key_item, consumable)"),
		rarity: z
			.enum(enums.rarityLevels)
			.describe("Rarity level (common, uncommon, rare, very_rare, legendary, artifact)"),
		description: (s) => s.describe("Physical attributes, history, and properties in point form"),
		loreSignificance: (s) => s.describe("Historical and cultural importance of this item"),
		mechanicalEffects: (s) => s.describe("Game mechanical effects and abilities of this item"),
		significance: (s) => s.describe("Item's importance to the plot or world lore"),
		creativePrompts: (s) => s.describe("GM ideas for using this item as a narrative element"),
		creationPeriod: (s) => s.optional().describe("When this item was created"),
		placeOfOrigin: (s) => s.optional().describe("Where this item was originally created"),
		relatedQuestId: optionalId.describe("ID of quest this item is related to"),
	})
		.omit({ id: true, embeddingId: true })
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
		eventLocationSiteId: optionalId.describe("ID of the site where the event occurred"),
		keyNpcId: optionalId.describe("ID of the NPC who is the key figure in this event"),
		npcRoleInEvent: (s) => s.describe("Role of the NPC in the event"),
	})
		.omit({ id: true })
		.strict()
		.describe("Historical events and ownership changes for items"),

	itemRelationships: createInsertSchema(itemRelationships, {
		creativePrompts: (s) => s.describe("GM ideas for using this relationship"),
		description: (s) => s.describe("Description of the relationship in point form"),
		gmNotes: (s) => s.describe("GM-only information about this relationship"),
		tags: (s) => s.describe("Tags for this relationship"),
		relatedConflictId: optionalId.describe("ID of related conflict"),
		relatedEntityType: z.enum(enums.relatedEntityTypes).describe("Type of related entity"),
		relatedItemId: optionalId.describe("ID of related item"),
		relatedNpcId: optionalId.describe("ID of related NPC"),
		relatedFactionId: optionalId.describe("ID of related faction"),
		relatedSiteId: optionalId.describe("ID of related site"),
		relatedWorldConceptId: optionalId.describe("ID of related world concept"),
		relatedNarrativeDestinationId: optionalId.describe("ID of related narrative destination"),
		relatedQuestId: optionalId.describe("ID of related quest"),
		relationshipDetails: (s) => s.optional().describe("Details about the relationship between entities"),
		relationshipType: z.enum(enums.itemRelationshipTypes).describe("Type of relationship"),
		sourceItemId: id.describe("ID of item this relationship belongs to"),
	})
		.omit({ id: true })
		.strict()
		.describe("Relationships between items and other entities")
		.refine(
			(data) => {
				// Validate that the correct related field is populated based on relatedEntityType
				switch (data.relatedEntityType) {
					case "item":
						return data.relatedItemId !== undefined
					case "npc":
						return data.relatedNpcId !== undefined
					case "faction":
						return data.relatedFactionId !== undefined
					case "site":
						return data.relatedSiteId !== undefined
					case "quest":
						return data.relatedQuestId !== undefined
					case "conflict":
						return data.relatedConflictId !== undefined
					case "narrative_destination":
						return data.relatedNarrativeDestinationId !== undefined
					case "world_concept":
						return data.relatedWorldConceptId !== undefined
					default:
						return false
				}
			},
			{
				message: "Related entity type must have corresponding related field populated",
				path: ["relatedEntityType"],
			},
		),
} as const satisfies Schema<TableNames[number]>
