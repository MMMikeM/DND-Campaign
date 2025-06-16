import { tables } from "@tome-master/shared"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod/v4"
import { type CreateTableNames, id, list, type Schema } from "./utils/tool.utils"

const {
	loreTables: { lore, loreLinks, enums },
} = tables

type TableNames = CreateTableNames<typeof tables.loreTables>

const { loreTypes, loreLinkStrengths, targetEntityTypes } = enums

export const tableEnum = ["lore", "loreLinks"] as const satisfies TableNames

export const schemas = {
	lore: createInsertSchema(lore, {
		name: (s) => s.describe("Distinctive name for this lore"),
		summary: (s) => s.describe("The one-sentence pitch for this lore"),
		loreType: z.enum(loreTypes).describe("Category of lore (cultural, political, religious, etc.)"),
		tags: list.describe("Tags for this lore"),

		surfaceImpression: (s) => s.describe("What it seems to be at a glance"),
		livedReality: (s) => s.describe("How people actually interact with it"),
		hiddenTruths: (s) => s.describe("The secret origin or true purpose"),
		modernRelevance: (s) => s.describe("Why this matters to the campaign right now"),

		aesthetics_and_symbols: list.describe("Key symbols, colors, textures, sounds, smells"),
		interactions_and_rules: list.describe("How it can be interacted with - mechanics, vulnerabilities, rituals, laws"),
		connections_to_world: list.describe("How it's linked to factions, NPCs, places, or other lore"),

		core_tenets_and_traditions: list.describe("Core beliefs, values, and key traditions"),
		history_and_legacy: list.describe("Key historical moments, origins, and lasting impact"),
		conflicting_narratives: list.describe("Different viewpoints or propaganda about the concept"),

		questHooks: list.describe("Quest hooks related to this lore"),

		creativePrompts: list.describe("GM ideas for using this lore"),
		gmNotes: list.describe("GM-only information about this lore"),
	})
		.omit({ id: true })
		.strict()
		.describe("Cultural, political, religious, and historical lore that shapes the world"),

	loreLinks: createInsertSchema(loreLinks, {
		loreId: id.describe("ID of the lore being linked"),
		targetEntityId: id.describe("ID of the entity linked to this lore"),
		targetEntityType: z.enum(targetEntityTypes).describe("Type of entity linked to this lore"),
		linkRoleOrTypeText: (s) => s.describe("Description of the link role or type"),
		linkStrength: z.enum(loreLinkStrengths).describe("Strength of the link"),
		linkDetailsText: (s) => s.describe("Details about the link"),
		creativePrompts: list.describe("GM ideas for using this link"),
		description: list.describe("Description of this link"),
		gmNotes: list.describe("GM-only information about this link"),
		tags: list.describe("Tags for this link"),
	})
		.omit({ id: true })
		.strict()
		.describe("Links between lore and other entities"),
} as const satisfies Schema<TableNames[number]>
