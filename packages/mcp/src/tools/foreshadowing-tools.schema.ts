import { tables } from "@tome-master/shared"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod/v4"
import { type CreateTableNames, optionalId, type Schema } from "./utils/tool.utils"

const {
	foreshadowingTables: { foreshadowing, enums },
} = tables

const { foreshadowedEntityType, discoverySubtlety, narrativeWeight, seedDeliveryMethods } = enums

type TableNames = CreateTableNames<typeof tables.foreshadowingTables>

export const tableEnum = ["foreshadowing"] as const satisfies TableNames

export const schemas = {
	foreshadowing: createInsertSchema(foreshadowing, {
		description: (s) => s.describe("Description of this foreshadowing seed"),
		tags: (s) => s.describe("Tags for this foreshadowing seed"),
		sourceNpcId: optionalId.describe("ID of the NPC that is the source of this foreshadowing seed"),
		sourceSiteId: optionalId.describe("ID of the site that is the source of this foreshadowing seed"),
		sourceQuestId: optionalId.describe("ID of the quest that is the source of this foreshadowing seed"),
		sourceQuestStageId: optionalId.describe("ID of the quest stage that is the source of this foreshadowing seed"),
		suggestedDeliveryMethods: z
			.enum(seedDeliveryMethods)
			.describe("Suggested methods for delivering this foreshadowing seed"),
		targetEntityType: z.enum(foreshadowedEntityType).describe("Type of entity this foreshadowing seed points toward"),
		targetAbstractDetail: (s) =>
			s.optional().describe("Abstract detail about the target entity (for abstract_theme or specific_reveal types)"),
		targetFactionId: optionalId.describe("ID of the faction that is the target of this foreshadowing seed"),
		targetItemId: optionalId.describe("ID of the item that is the target of this foreshadowing seed"),
		name: (s) => s.describe("Name of this foreshadowing seed"),
		targetConflictId: optionalId.describe("ID of the conflict that is the target of this foreshadowing seed"),
		targetNarrativeDestinationId: optionalId.describe(
			"ID of the narrative destination that is the target of this foreshadowing seed",
		),
		targetNpcId: optionalId.describe("ID of the NPC that is the target of this foreshadowing seed"),
		targetQuestId: optionalId.describe("ID of the quest that is the target of this foreshadowing seed"),
		targetLoreId: optionalId.describe("ID of the lore that is the target of this foreshadowing seed"),
		targetNarrativeEventId: optionalId.describe(
			"ID of the narrative event that is the target of this foreshadowing seed",
		),
		targetSiteId: optionalId.describe("ID of the site that is the target of this foreshadowing seed"),
		subtlety: z.enum(discoverySubtlety).describe("How noticeable this element is (obvious, moderate, subtle, hidden)"),
		narrativeWeight: z.enum(narrativeWeight).describe("Importance to the story (minor, supporting, major, crucial)"),

		gmNotes: (s) => s.describe("GM-only information about this element"),
		creativePrompts: (s) => s.describe("Ideas for presenting and integrating this element"),
	})
		.omit({ id: true })
		.strict()
		.describe("Clues, foreshadowing, and discoverable information that players can find through investigation")
		.refine(
			(data) => {
				// Validate that the correct target field is populated based on targetEntityType
				switch (data.targetEntityType) {
					case "quest":
						return data.targetQuestId !== undefined
					case "npc":
						return data.targetNpcId !== undefined
					case "narrative_event":
						return data.targetNarrativeEventId !== undefined
					case "conflict":
						return data.targetConflictId !== undefined
					case "item":
						return data.targetItemId !== undefined
					case "narrative_destination":
						return data.targetNarrativeDestinationId !== undefined
					case "lore":
						return data.targetLoreId !== undefined
					case "faction":
						return data.targetFactionId !== undefined
					case "site":
						return data.targetSiteId !== undefined
					case "abstract_theme":
					case "specific_reveal":
						return data.targetAbstractDetail !== undefined
					default:
						return false
				}
			},
			{
				message: "Target entity type must have corresponding target field populated",
				path: ["targetEntityType"],
			},
		),
} as const satisfies Schema<TableNames[number]>
