import { tables } from "@tome-master/shared"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod/v4"
import { type CreateTableNames, list, optionalId, type Schema } from "./utils/tool.utils"

const {
	foreshadowingTables: { foreshadowing, enums },
} = tables

const { foreshadowedTargetType, foreshadowingSourceType, discoverySubtlety, narrativeWeight, seedDeliveryMethods } =
	enums

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
		sourceEntityType: z
			.optional(z.enum(foreshadowingSourceType))
			.describe("Type of entity this foreshadowing seed originates from (where players encounter the clue)"),
		sourceEntityId: optionalId.describe(
			"ID of the entity where this foreshadowing appears (location, NPC, item, etc.)",
		),
		targetEntityType: z
			.optional(z.enum(foreshadowedTargetType))
			.describe("Type of entity this foreshadowing hints toward (what the clue points to)"),
		targetEntityId: optionalId.describe("ID of the entity this foreshadowing points toward (the future revelation)"),
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
		gmNotes: list.describe(
			"Timing guidance, player reaction tips, and connection management - avoid spoiling the actual revelation",
		),
		tags: list.describe("Tags for organizing and tracking foreshadowing elements across the campaign"),
	})
		.omit({ id: true })
		.strict()
		.describe(
			"Breadcrumbs and clues that build toward future revelations - focus on discoverable hints, not full explanations",
		),
} as const satisfies Schema<TableNames[number]>
