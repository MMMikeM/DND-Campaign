import { tables } from "@tome-master/shared"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod"
import { CreateTableNames, id, Schema } from "./tool.utils"

const {
	npcTables: { npcs, characterRelationships, npcFactions, npcSites, enums },
} = tables

export type TableNames = CreateTableNames<typeof tables.npcTables>

export const tableEnum = ["npcs", "characterRelationships", "npcFactions", "npcSites"] as const satisfies TableNames

export const schemas = {
	npcs: createInsertSchema(npcs, {
		id: id.describe("ID of NPC to manage (omit to create new, include alone to delete)"),
		adaptability: z
			.enum(enums.adaptability)
			.describe("Response to new situations (rigid, reluctant, flexible, opportunistic)"),
		age: (s) => s.describe("Approximate age or age range"),
		alignment: z.enum(enums.alignments).describe("Moral stance (lawful good through chaotic evil)"),
		appearance: (s) => s.describe("Physical traits, clothing, and distinctive features in point form"),
		attitude: (s) => s.describe("General outlook and typical emotional state"),
		avoidTopics: (s) => s.describe("Subjects that make this NPC uncomfortable or defensive"),
		background: (s) => s.describe("Life history and formative experiences"),
		biases: (s) => s.describe("Prejudices and preconceptions that affect judgment"),
		dialogue: (s) => s.describe("Signature phrases and speech patterns for roleplaying"),
		disposition: (s) => s.describe("Default attitude toward strangers"),
		drives: (s) => s.describe("Core motivations and desires that inspire actions"),
		fears: (s) => s.describe("Specific phobias and threats that concern this NPC"),
		gender: z.enum(enums.genders).describe("Gender identity (male, female, non-binary, non-humanoid)"),
		knowledge: (s) => s.describe("Information and secrets players might discover"),
		mannerisms: (s) => s.describe("Distinctive gestures and behavioral quirks"),
		name: (s) => s.describe("Full name or primary identifier"),
		occupation: (s) => s.describe("Profession, role, or primary activity"),
		personalityTraits: (s) => s.describe("Key character aspects and psychological qualities"),
		preferredTopics: (s) => s.describe("Subjects this NPC eagerly discusses"),
		quirk: (s) => s.describe("Single odd habit or trait that stands out"),
		race: z.enum(enums.races).describe("Species or ancestry (human, elf, dwarf, etc.)"),
		rumours: (s) => s.describe("Gossip and stories others tell about this character"),
		secrets: (s) => s.describe("Hidden information unknown to most others"),
		socialStatus: (s) => s.describe("Position in social hierarchy"),
		trustLevel: z.enum(enums.trustLevel).describe("Willingness to trust others (none, low, medium, high)"),
		voiceNotes: (s) => s.describe("Vocal qualities and accent for roleplaying"),
		wealth: z.enum(enums.wealthLevels).describe("Economic status (destitute, poor, moderate, rich, wealthy)"),
	})
		.omit({ id: true })
		.strict()
		.describe("Characters with distinct personalities who interact with players as allies, enemies, or contacts"),

	npcFactions: createInsertSchema(npcFactions, {
		id: id.describe("ID of NPC-faction relationship to manage (omit to create new, include alone to delete)"),
		npcId: id.describe("ID of the NPC in this relationship"),
		factionId: id.describe("ID of the faction this NPC belongs to"),
		justification: (s) => s.describe("Reason for allegiance (belief, gain, blackmail, family ties)"),
		loyalty: z.enum(enums.trustLevel).describe("Dedication level to faction's interests (0-4: none to high)"),
		rank: (s) => s.describe("Formal title or hierarchical position"),
		role: z.enum(enums.npcFactionRoles).describe("Function within faction (leader, enforcer, spy, advisor)"),
		secrets: (s) => s.describe("Hidden information about their faction involvement"),
	})
		.omit({ id: true })
		.strict()
		.describe("Establishes NPC membership in factions, creating loyalties that influence their actions"),

	npcSites: createInsertSchema(npcSites, {
		id: id.describe("ID of NPC-site relationship to manage (omit to create new, include alone to delete)"),
		npcId: id.describe("ID of the NPC who can be found here"),
		siteId: id.describe("ID of the site where this NPC can be encountered"),
		description: (s) => s.describe("How and why the NPC frequents this place and their activities"),
		creativePrompts: (s) => s.describe("Story hooks involving this NPC at this site"),
	})
		.omit({ id: true })
		.strict()
		.describe("Maps where NPCs can be encountered, helping GMs place characters consistently in the world"),

	characterRelationships: createInsertSchema(characterRelationships, {
		id: id.describe("ID of relationship to manage (omit to create new, include alone to delete)"),
		npcId: id.describe("ID of the primary NPC in this relationship"),
		relatedNpcId: id.describe("ID of the secondary NPC in this relationship"),
		creativePrompts: (s) => s.describe("Story possibilities involving both NPCs"),
		description: (s) => s.describe("Current relationship status and visible dynamics"),
		history: (s) => s.describe("Past interactions and shared experiences"),
		narrativeTensions: (s) => s.describe("Points of conflict or dramatic potential"),
		relationshipDynamics: (s) => s.describe("How these NPCs typically interact with each other"),
		sharedGoals: (s) => s.describe("Common objectives uniting these NPCs"),
		strength: z
			.enum(enums.relationshipStrengths)
			.describe("Relationship intensity (weak, moderate, strong, unbreakable)"),
		type: z.enum(enums.relationshipTypes).describe("Connection type (family, friend, rival, mentor, enemy, lover)"),
	})
		.omit({ id: true })
		.strict()
		.describe("Defines connections between NPCs, creating social networks and potential storylines"),
} as const satisfies Schema<TableNames[number]>
