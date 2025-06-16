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
		description: list.describe("Description of this foreshadowing seed"),
		tags: list.describe("Tags for this foreshadowing seed"),
		sourceEntityType: z
			.optional(z.enum(foreshadowingSourceType))
			.describe("Type of entity this foreshadowing seed comes from"),
		sourceEntityId: optionalId.describe("ID of the entity this foreshadowing seed comes from"),
		suggestedDeliveryMethods: z
			.enum(seedDeliveryMethods)
			.describe("Suggested methods for delivering this foreshadowing seed"),
		targetEntityType: z
			.optional(z.enum(foreshadowedTargetType))
			.describe("Type of entity this foreshadowing seed points toward"),
		targetEntityId: optionalId.describe("ID of the entity this foreshadowing seed points toward"),
		name: (s) => s.describe("Name of this foreshadowing seed"),
		subtlety: z.enum(discoverySubtlety).describe("How noticeable this element is (obvious, moderate, subtle, hidden)"),
		narrativeWeight: z.enum(narrativeWeight).describe("Importance to the story (minor, supporting, major, crucial)"),

		gmNotes: list.describe("GM-only information about this element"),
		creativePrompts: list.describe("Ideas for presenting and integrating this element"),
	})
		.omit({ id: true })
		.strict()
		.describe("Clues, foreshadowing, and discoverable information that players can find through investigation"),
} as const satisfies Schema<TableNames[number]>
