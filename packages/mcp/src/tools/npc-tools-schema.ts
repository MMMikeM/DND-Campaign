import { tables } from "@tome-master/shared"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod/v4"
import { type CreateTableNames, id, optionalId, type Schema } from "./tool.utils"

const {
	npcTables: { npcs, npcRelationships, npcFactions, npcSites, enums },
} = tables

type TableNames = CreateTableNames<typeof tables.npcTables>

export const tableEnum = ["npcs", "npcRelationships", "npcFactions", "npcSites"] as const satisfies TableNames

export const schemas = {
	npcs: createInsertSchema(npcs, {
		adaptability: z
			.enum(enums.adaptabilityLevels)
			.describe("Response to new situations (rigid, reluctant, flexible, opportunistic)"),
		age: (s) => s.describe("Approximate age or age range"),
		alignment: z.enum(enums.alignments).describe("Moral stance (lawful good through chaotic evil)"),
		appearance: (s) => s.describe("Physical traits, clothing, and distinctive features in point form"),
		attitude: (s) => s.describe("General outlook and typical emotional state"),
		availability: z.enum(enums.availabilityLevels).describe("How often this NPC can be encountered"),
		avoidTopics: (s) => s.describe("Subjects that make this NPC uncomfortable or defensive"),
		background: (s) => s.describe("Life history and formative experiences"),
		biases: (s) => s.describe("Prejudices and preconceptions that affect judgment"),
		capability: z.enum(enums.cprScores).describe("Competence level (low, medium, high)"),
		complexityProfile: z.enum(enums.characterComplexityProfiles).describe("Character complexity archetype"),
		currentGoals: (s) => s.describe("Current objectives and motivations"),
		currentLocationId: optionalId.describe("ID of the site where this NPC is currently located"),
		dialogue: (s) => s.describe("Signature phrases and speech patterns for roleplaying"),
		disposition: (s) => s.describe("Default attitude toward strangers"),
		drives: (s) => s.describe("Core motivations and desires that inspire actions"),
		fears: (s) => s.describe("Specific phobias and threats that concern this NPC"),
		gender: z.enum(enums.genders).describe("Gender identity (male, female, non-humanoid)"),
		knowledge: (s) => s.describe("Information and secrets players might discover"),
		mannerisms: (s) => s.describe("Distinctive gestures and behavioral quirks"),
		name: (s) => s.describe("Full name or primary identifier"),
		occupation: (s) => s.describe("Profession, role, or primary activity"),
		personalityTraits: (s) => s.describe("Key character aspects and psychological qualities"),
		playerPerceptionGoal: z.enum(enums.playerPerceptionGoals).describe("Intended player perception of this NPC"),
		preferredTopics: (s) => s.describe("Subjects this NPC eagerly discusses"),
		proactivity: z.enum(enums.cprScores).describe("Initiative level (low, medium, high)"),
		quirk: (s) => s.describe("Single odd habit or trait that stands out"),
		race: z.enum(enums.races).describe("Species or ancestry (human, elf, dwarf, etc.)"),
		relatability: z.enum(enums.cprScores).describe("How relatable this NPC is (low, medium, high)"),
		rumours: (s) => s.describe("Gossip and stories others tell about this character"),
		secrets: (s) => s.describe("Hidden information unknown to most others"),
		socialStatus: (s) => s.describe("Position in social hierarchy"),
		trustLevel: z.enum(enums.trustLevels).describe("Willingness to trust others (none, low, medium, high)"),
		voiceNotes: (s) => s.describe("Vocal qualities and accent for roleplaying"),
		wealth: z.enum(enums.wealthLevels).describe("Economic status (destitute, poor, moderate, rich, wealthy)"),
		creativePrompts: (s) => s.describe("GM ideas for using this NPC in the campaign"),
		description: (s) => s.describe("Key characteristics and role in point form"),
		gmNotes: (s) => s.describe("GM-only information about this NPC"),
		tags: (s) => s.describe("Tags for this NPC"),
	})
		.omit({ id: true, embeddingId: true })
		.strict()
		.describe("Characters with distinct personalities who interact with players as allies, enemies, or contacts"),

	npcFactions: createInsertSchema(npcFactions, {
		npcId: id.describe("ID of the NPC in this relationship"),
		factionId: id.describe("ID of the faction this NPC belongs to"),
		justification: (s) => s.describe("Reason for allegiance (belief, gain, blackmail, family ties)"),
		loyalty: z.enum(enums.trustLevels).describe("Dedication level to faction's interests"),
		rank: (s) => s.describe("Formal title or hierarchical position"),
		role: z.enum(enums.npcFactionRoles).describe("Function within faction (leader, enforcer, spy, advisor)"),
		secrets: (s) => s.describe("Hidden information about their faction involvement"),
		creativePrompts: (s) => s.describe("GM ideas for using this faction relationship"),
		description: (s) => s.describe("Description of this faction relationship"),
		gmNotes: (s) => s.describe("GM-only notes about this faction relationship"),
		tags: (s) => s.describe("Tags for this faction relationship"),
	})
		.omit({ id: true })
		.strict()
		.describe("Establishes NPC membership in factions, creating loyalties that influence their actions"),

	npcSites: createInsertSchema(npcSites, {
		npcId: id.describe("ID of the NPC who can be found here"),
		siteId: id.describe("ID of the site where this NPC can be encountered"),
		associationType: z.enum(enums.siteAssociationTypes).describe("Type of association with this site"),
		description: (s) => s.describe("How and why the NPC frequents this place and their activities"),
		creativePrompts: (s) => s.describe("Story hooks involving this NPC at this site"),
		gmNotes: (s) => s.describe("GM-only notes about this site association"),
		tags: (s) => s.describe("Tags for this site association"),
	})
		.omit({ id: true })
		.strict()
		.describe("Maps where NPCs can be encountered, helping GMs place characters consistently in the world"),

	npcRelationships: createInsertSchema(npcRelationships, {
		npcId: id.describe("ID of the primary NPC in this relationship"),
		relatedNpcId: id.describe("ID of the secondary NPC in this relationship"),
		relationshipType: z
			.enum(enums.relationshipTypes)
			.describe("Connection type (family, friend, rival, mentor, enemy)"),
		strength: z
			.enum(enums.relationshipStrengths)
			.describe("Relationship intensity (weak, moderate, friendly, strong, unbreakable, hostile, war)"),
		isBidirectional: z.boolean().describe("Whether this relationship applies in both directions"),
		creativePrompts: (s) => s.describe("Story possibilities involving both NPCs"),
		description: (s) => s.describe("Current relationship status and visible dynamics"),
		gmNotes: (s) => s.describe("GM-only notes about this relationship"),
		history: (s) => s.describe("Past interactions and shared experiences"),
		narrativeTensions: (s) => s.describe("Points of conflict or dramatic potential"),
		relationshipDynamics: (s) => s.describe("How these NPCs typically interact with each other"),
		sharedGoals: (s) => s.describe("Common objectives uniting these NPCs"),
		tags: (s) => s.describe("Tags for this relationship"),
	})
		.omit({ id: true })
		.strict()
		.describe("Defines connections between NPCs, creating social networks and potential storylines")
		.refine((data) => data.npcId !== data.relatedNpcId, {
			message: "An NPC cannot have a relationship with itself",
			path: ["relatedNpcId"],
		}),
} as const satisfies Schema<TableNames[number]>
