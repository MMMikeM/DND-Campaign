import { tables } from "@tome-master/shared"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod/v4"
import { type CreateTableNames, id, optionalId, type Schema } from "./utils/tool.utils"

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
		tags: (s) => s.describe("Tags for this lore").min(1).max(10),

		// Layered Revelation
		surfaceImpression: (s) => s.describe("What it seems to be at a glance"),
		livedReality: (s) => s.describe("How people actually interact with it"),
		hiddenTruths: (s) => s.describe("The secret origin or true purpose"),

		// Actionable & Evocative Details
		aesthetics_and_symbols: (s) => s.describe("Key symbols, colors, textures, sounds, smells").min(1).max(10),
		interactions_and_rules: (s) =>
			s.describe("How it can be interacted with - mechanics, vulnerabilities, rituals, laws").min(1).max(10),
		connections_to_world: (s) => s.describe("How it's linked to factions, NPCs, places, or other lore").min(1).max(10),

		// Consolidated Lore Buckets
		core_tenets_and_traditions: (s) => s.describe("Core beliefs, values, and key traditions").min(1).max(10),
		history_and_legacy: (s) => s.describe("Key historical moments, origins, and lasting impact").min(1).max(10),
		conflicting_narratives: (s) => s.describe("Different viewpoints or propaganda about the concept").min(1).max(10),

		// Actionable Hooks
		modernRelevance: (s) => s.describe("Why this matters to the campaign right now"),
		questHooks: (s) => s.describe("Quest hooks related to this lore").min(1).max(10),

		// GM Tools
		creativePrompts: (s) => s.describe("GM ideas for using this lore").min(1).max(10),
		gmNotes: (s) => s.describe("GM-only information about this lore").min(1).max(10),
	})
		.omit({ id: true })
		.strict()
		.describe("Cultural, political, religious, and historical lore that shapes the world"),

	loreLinks: createInsertSchema(loreLinks, {
		loreId: id.describe("ID of the lore being linked"),
		regionId: optionalId.describe("ID of region linked to this lore"),
		factionId: optionalId.describe("ID of faction linked to this lore"),
		npcId: optionalId.describe("ID of NPC linked to this lore"),
		conflictId: optionalId.describe("ID of conflict linked to this lore"),
		questId: optionalId.describe("ID of quest linked to this lore"),
		linkRoleOrTypeText: (s) => s.describe("Description of the link role or type"),
		linkStrength: z.enum(loreLinkStrengths).describe("Strength of the link"),
		linkDetailsText: (s) => s.describe("Details about the link"),
		creativePrompts: (s) => s.describe("GM ideas for using this link").min(1).max(5),
		description: (s) => s.describe("Description of this link").min(1).max(5),
		gmNotes: (s) => s.describe("GM-only information about this link").min(1).max(5),
		tags: (s) => s.describe("Tags for this link").min(1).max(5),
	})
		.omit({ id: true })
		.strict()
		.describe("Links between lore and other entities")
		.refine((data) => data.regionId || data.factionId || data.npcId || data.conflictId || data.questId, {
			message: "At least one entity must be linked",
			path: ["regionId", "factionId", "npcId", "conflictId", "questId"],
		}),
} as const satisfies Schema<TableNames[number]>
