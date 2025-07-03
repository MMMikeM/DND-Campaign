import { tables } from "@tome-master/shared"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod/v4"
import { type CreateTableNames, id, list, type Schema } from "./utils/tool.utils"

const {
	npcTables: { npcs, npcRelations, npcFactionMemberships, npcDetails, enums },
} = tables

const {
	adaptabilityLevels,
	alignments,
	availabilityLevels,
	characterComplexityProfiles,
	cprScores,
	genders,
	races,
	trustLevels,
	wealthLevels,
	npcFactionRoles,
} = enums

type TableNames = CreateTableNames<typeof tables.npcTables>

export const tableEnum = ["npcs", "npcRelations", "npcFactionMemberships", "npcDetails"] as const satisfies TableNames

export const schemas = {
	npcs: createInsertSchema(npcs, {
		age: (s) => s.describe("Approximate age or age range"),
		appearance: list.describe("Physical traits, clothing, and distinctive features in point form"),
		attitude: (s) => s.describe("General outlook and typical emotional state"),
		gender: z.enum(genders).describe("Gender identity (male, female, non-humanoid)"),
		name: (s) => s.describe("Full name or primary identifier"),
		occupation: (s) => s.describe("Profession, role, or primary activity"),
		quirk: (s) => s.describe("Single odd habit or trait that stands out"),
		race: z.enum(races).describe("Species or ancestry (human, elf, dwarf, etc.)"),
		voiceNotes: list.describe("Vocal qualities and accent for roleplaying"),
		tags: list.describe("Tags for this NPC"),
	})
		.omit({ id: true })
		.strict()
		.describe("Characters with distinct personalities who interact with players as allies, enemies, or contacts"),

	npcDetails: createInsertSchema(npcDetails, {
		npcId: id.describe("ID of the NPC this detail belongs to"),
		adaptability: z
			.enum(adaptabilityLevels)
			.describe("Response to new situations (rigid, reluctant, flexible, opportunistic)"),
		alignment: z.enum(alignments).describe("Moral stance (lawful good through chaotic evil)"),
		availability: z.enum(availabilityLevels).describe("How often this NPC can be encountered"),
		avoidTopics: list.describe("Subjects that make this NPC uncomfortable or defensive"),
		biases: list.describe("Prejudices and preconceptions that affect judgment"),
		capability: z.enum(cprScores).describe("Competence level (low, medium, high)"),
		knowledge: list.describe("Information and secrets players might discover"),
		goalsAndFears: list.describe("Goals and fears of the NPC"),
		complexity: z.enum(characterComplexityProfiles).describe("Character complexity archetype"),
		preferredTopics: list.describe("Subjects this NPC eagerly discusses"),
		proactivity: z.enum(cprScores).describe("Initiative level (low, medium, high)"),
		relatability: z.enum(cprScores).describe("How relatable this NPC is (low, medium, high)"),
		rumours: list.describe("Gossip and stories others tell about this character"),
		wealth: z.enum(wealthLevels).describe("Economic status (destitute, poor, moderate, rich, wealthy)"),
		secretsAndHistory: list.describe("Hidden information and life history of the NPC"),
	})
		.strict()
		.describe("Details about the NPC"),

	npcFactionMemberships: createInsertSchema(npcFactionMemberships, {
		npcId: id.describe("ID of the NPC in this relationship"),
		factionId: id.describe("ID of the faction this NPC belongs to"),
		justification: (s) => s.describe("Reason for allegiance (belief, gain, blackmail, family ties)"),
		loyalty: z.enum(trustLevels).describe("Dedication level to faction's interests"),
		rank: (s) => s.describe("Formal title or hierarchical position"),
		role: z.enum(npcFactionRoles).describe("Function within faction (leader, enforcer, spy, advisor)"),
		secrets: list.describe("Hidden information about their faction involvement"),
		creativePrompts: list.describe("GM ideas for using this faction relationship"),
		description: list.describe("Description of this faction relationship"),
		tags: list.describe("Tags for this faction relationship"),
	})
		.omit({ id: true })
		.strict()
		.describe("Establishes NPC membership in factions, creating loyalties that influence their actions"),

	npcRelations: createInsertSchema(npcRelations, {
		sourceNpcId: id.describe("ID of the primary NPC in this relationship"),
		targetNpcId: id.describe("ID of the secondary NPC in this relationship"),

		creativePrompts: list.describe("Story possibilities involving both NPCs"),
		description: list.describe("Current relationship status and visible dynamics"),
		dynamicsAndHistory: list.describe("How these NPCs typically interact with each other"),
		relationship: (s) => s.describe("Relationship type (family, friend, rival, mentor, enemy)"),
		tags: list.describe("Tags for this relationship"),
	})
		.omit({ id: true })
		.strict()
		.describe("Defines connections between NPCs, creating social networks and potential storylines")
		.refine((data) => data.sourceNpcId !== data.targetNpcId, {
			message: "An NPC cannot have a relationship with itself",
			path: ["targetNpcId"],
		}),
} as const satisfies Schema<TableNames[number]>
