import { tables } from "@tome-master/shared"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod/v4"
import { type CreateTableNames, id, list, optionalId, type Schema } from "./utils/tool.utils"

const { lore, loreLinks, enums } = tables.loreTables

type TableNames = CreateTableNames<typeof tables.loreTables>

const { loreTypes, linkStrengths } = enums

export const tableEnum = ["lore", "loreLinks"] as const satisfies TableNames

const longList = z.array(z.string()).min(3).max(10)

export const schemas = {
	lore: createInsertSchema(lore, {
		name: (s) => s.describe("Distinctive name for this foundational concept, cultural phenomenon, or world system"),
		summary: (s) => s.describe("One-sentence description of this broad concept that multiple entities reference"),
		description: longList.describe("Detailed description of this concept"),
		creativePrompts: list.describe("GM ideas for incorporating this foundational concept into scenes and storylines"),
		gmNotes: list.describe("GM-only information about the deeper implications and campaign uses of this concept"),

		loreType: z
			.enum(loreTypes)
			.describe(
				"Category of lore (cultural, political, religious, natural, mythic, historical, institutional, philosophical)",
			),
		tags: list.describe("Tags for this lore concept"),

		surfaceImpression: (s) => s.describe("How this concept appears to casual observers or outsiders"),
		livedReality: (s) => s.describe("How people who interact with this concept daily actually experience it"),
		hiddenTruths: (s) => s.describe("The deeper reality or secret aspects known only to a few"),
		modernRelevance: (s) => s.describe("Why this foundational concept is crucial to current campaign events"),

		aesthetics_and_symbols: list.describe("Visual, auditory, and sensory elements associated with this concept"),
		interactions_and_rules: longList.describe(
			"How characters can interact with this concept - rituals, laws, vulnerabilities, mechanics",
		),
		connections_to_world: list.describe(
			"How this concept connects to and influences factions, NPCs, places, and other lore",
		),

		core_tenets_and_traditions: longList.describe(
			"Fundamental beliefs, values, and established practices of this concept",
		),
		history_and_legacy: longList.describe("Origin story, major historical developments, and lasting cultural impact"),
		conflicting_narratives: longList.describe(
			"Competing interpretations, propaganda, or viewpoints about this concept",
		),
	})
		.omit({ id: true })
		.strict()
		.describe(`FOUNDATIONAL WORLDBUILDING CONCEPTS that multiple entities reference. 
		
		USE FOR: Cultural movements, belief systems, natural phenomena, magical systems, historical events, divine hierarchies, political situations, species/racial concepts, philosophical schools.
		
		DO NOT USE FOR: Specific organizations (use factions), individual people (use NPCs), particular places (use regions/areas/sites), unique objects (use items), specific quests (use quests), or detailed information that belongs in another entity type.
		
		THINK: Would multiple factions, NPCs, or locations reference this concept? Is this foundational knowledge that shapes how the world works? If yes, use lore. If this is about one specific organization or person, use the appropriate entity type instead.`),

	loreLinks: createInsertSchema(loreLinks, {
		loreId: id.describe("ID of the source lore entry"),

		itemId: optionalId.describe("Related item ID"),
		conflictId: optionalId.describe("Related conflict ID"),
		narrativeDestinationId: optionalId.describe("Related narrative destination ID"),
		questId: optionalId.describe("Related quest ID"),
		factionId: optionalId.describe("Related faction ID"),
		npcId: optionalId.describe("Related NPC ID"),
		regionId: optionalId.describe("Related region ID"),
		foreshadowingId: optionalId.describe("Related foreshadowing ID"),
		relatedLoreId: optionalId.describe("Related lore ID"),
		linkRoleOrTypeText: (s) =>
			s.describe("Brief categorization of the relationship type (e.g., 'Primary antagonist', 'Spiritual foundation')"),
		linkStrength: z.enum(linkStrengths).describe("Strength of the connection (tenuous, moderate, strong, defining)"),
		linkDetailsText: (s) =>
			s.describe(
				"Concise explanation of how the entities connect - focus on the relationship, not the entities themselves",
			),
		creativePrompts: list.describe(
			"GM ideas for scenes/situations that arise specifically from this RELATIONSHIP - avoid duplicating prompts from either core entity",
		),
		description: list.describe(
			"How this relationship manifests or functions - describe the CONNECTION dynamics, not the individual entities",
		),
		gmNotes: list.describe(
			"GM guidance for managing this specific relationship - avoid repeating general advice from core entities",
		),
		tags: list.describe("Tags specific to this relationship dynamic - not general entity tags"),
	})
		.omit({ id: true })
		.strict()
		.describe(
			"Connects lore to other entities. Focus on RELATIONSHIP dynamics - avoid duplicating content from core entities.",
		)
		.refine((data) => {
			if (data.relatedLoreId) {
				return data.relatedLoreId !== data.loreId
			}
			return true
		}, "Lore cannot link to itself"),
} as const satisfies Schema<TableNames[number]>
