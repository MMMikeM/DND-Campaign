import { tables } from "@tome-master/shared"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod/v4"
import { type CreateTableNames, list, optionalId, type Schema } from "./utils/tool.utils"

const {
	foreshadowingTables: { foreshadowing, enums },
} = tables

const { discoverySubtlety, narrativeWeight, seedDeliveryMethods } = enums

type TableNames = CreateTableNames<typeof tables.foreshadowingTables>

export const tableEnum = ["foreshadowing"] as const satisfies TableNames

export const schemas = {
	foreshadowing: createInsertSchema(foreshadowing, {
		name: (s) =>
			s.describe(
				"Brief, evocative name for this foreshadowing element (e.g., 'The Oracle's Gambit', 'Broken Crown Symbol')",
			),
		description: list.describe(
			"How this foreshadowing manifests - focus on the CLUE/HINT itself, not full explanations of what it foreshadows",
		),

		sourceQuestId: optionalId.describe("ID of the quest this foreshadowing is related to"),
		sourceQuestStageId: optionalId.describe("ID of the quest stage this foreshadowing is related to"),
		sourceSiteId: optionalId.describe("ID of the site this foreshadowing is related to"),
		sourceNpcId: optionalId.describe("ID of the NPC this foreshadowing is related to"),
		sourceLoreId: optionalId.describe("ID of the lore this foreshadowing is related to"),

		targetQuestId: optionalId.describe("ID of the quest this foreshadowing is related to"),
		targetNpcId: optionalId.describe("ID of the NPC this foreshadowing is related to"),
		targetConflictId: optionalId.describe("ID of the conflict this foreshadowing is related to"),
		targetLoreId: optionalId.describe("ID of the lore this foreshadowing is related to"),
		targetFactionId: optionalId.describe("ID of the faction this foreshadowing is related to"),
		targetSiteId: optionalId.describe("ID of the site this foreshadowing is related to"),

		subtlety: z
			.enum(discoverySubtlety)
			.describe("How obvious the clue is - balance against narrativeWeight for proper timing"),
		narrativeWeight: z
			.enum(narrativeWeight)
			.describe("Story importance of what this foreshadows - major revelations need more subtle early hints"),
		suggestedDeliveryMethods: z
			.enum(seedDeliveryMethods)
			.describe(
				"Best method for presenting this clue in context - choose based on source entity and discovery circumstances",
			),
		creativePrompts: list.describe(
			"Specific ideas for presenting this foreshadowing element - focus on discovery scenarios, not exposition",
		),
		tags: list.describe("Tags for organizing and tracking foreshadowing elements across the campaign"),
	})
		.omit({ id: true })
		.strict()
		.describe(
			"Breadcrumbs and clues that build toward future revelations - focus on discoverable hints, not full explanations",
		),
} as const satisfies Schema<TableNames[number]>
