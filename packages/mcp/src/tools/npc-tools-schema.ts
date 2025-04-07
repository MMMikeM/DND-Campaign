import { createInsertSchema } from "drizzle-zod"
import { tables } from "@tome-master/shared"
import { z } from "zod"
import { NpcTools } from "./npc-tools"
import { id, optionalId } from "./tool.utils" // Added import

const {
	npcTables: { npcs, characterRelationships, npcFactions, npcSites, enums },
} = tables

export const schemas = {
	get_npc_entity: z
		.object({
			entity_type: z
				.enum(["npc", "character_relationship", "npc_faction", "npc_site"])
				.describe("Type of NPC-related entity to retrieve"),
			id: optionalId.describe("Optional ID of the specific entity to retrieve"),
		})
		.describe("Get an NPC-related entity by type and optional ID"),
	manage_npcs: createInsertSchema(npcs, {
		id: optionalId.describe("ID of NPC to manage (omit to create new, include alone to delete)"),
		appearance: (s) => s.describe("Physical traits, clothing, and distinctive features in point form"),
		avoidTopics: (s) => s.describe("Subjects that make this NPC uncomfortable or defensive"),
		background: (s) => s.describe("Life history and formative experiences"),
		biases: (s) => s.describe("Prejudices and preconceptions that affect judgment"),
		dialogue: (s) => s.describe("Signature phrases and speech patterns for roleplaying"),
		drives: (s) => s.describe("Core motivations and desires that inspire actions"),
		fears: (s) => s.describe("Specific phobias and threats that concern this NPC"),
		knowledge: (s) => s.describe("Information and secrets players might discover"),
		mannerisms: (s) => s.describe("Distinctive gestures and behavioral quirks"),
		personalityTraits: (s) => s.describe("Key character aspects and psychological qualities"),
		preferredTopics: (s) => s.describe("Subjects this NPC eagerly discusses"),
		rumours: (s) => s.describe("Gossip and stories others tell about this character"),
		secrets: (s) => s.describe("Hidden information unknown to most others"),
		voiceNotes: (s) => s.describe("Vocal qualities and accent for roleplaying"),
		attitude: (s) => s.describe("General outlook and typical emotional state"),
		age: (s) => s.describe("Approximate age or age range"),
		disposition: (s) => s.describe("Default attitude toward strangers"),
		name: (s) => s.describe("Full name or primary identifier"),
		occupation: (s) => s.describe("Profession, role, or primary activity"),
		quirk: (s) => s.describe("Single odd habit or trait that stands out"),
		socialStatus: (s) => s.describe("Position in social hierarchy"),
		adaptability: z
			.enum(enums.adaptability)
			.describe("Response to new situations (rigid, reluctant, flexible, opportunistic)"),
		wealth: z.enum(enums.wealthLevels).describe("Economic status (destitute, poor, moderate, rich, wealthy)"),
		alignment: z.enum(enums.alignments).describe("Moral stance (lawful good through chaotic evil)"),
		race: z.enum(enums.races).describe("Species or ancestry (human, elf, dwarf, etc.)"),
		gender: z.enum(enums.genders).describe("Gender identity (male, female, non-binary, non-humanoid)"),
		trustLevel: z.enum(enums.trustLevel).describe("Willingness to trust others (none, low, medium, high)"),
	})
		.omit({ embedding: true })
		.strict()
		.describe("Characters with distinct personalities who interact with players as allies, enemies, or contacts"),

	manage_npc_factions: createInsertSchema(npcFactions, {
		secrets: (s) => s.describe("Hidden information about their faction involvement"),
		id: optionalId.describe("ID of NPC-faction relationship to manage (omit to create new, include alone to delete)"),
		npcId: id.describe("ID of the NPC in this relationship"),
		factionId: id.describe("ID of the faction this NPC belongs to"), // Corrected: Should be required for membership
		justification: (s) => s.describe("Reason for allegiance (belief, gain, blackmail, family ties)"),
		rank: (s) => s.describe("Formal title or hierarchical position"),
		loyalty: z.enum(enums.trustLevel).describe("Dedication level to faction's interests (0-4: none to high)"),
		role: z.enum(enums.npcFactionRoles).describe("Function within faction (leader, enforcer, spy, advisor)"),
	})
		.strict()
		.describe("Establishes NPC membership in factions, creating loyalties that influence their actions"),

	manage_npc_sites: createInsertSchema(npcSites, {
		id: optionalId.describe("ID of NPC-site relationship to manage (omit to create new, include alone to delete)"),
		creativePrompts: (s) => s.describe("Story hooks involving this NPC at this site"),
		description: (s) => s.describe("How and why the NPC frequents this place and their activities"),
		npcId: id.describe("ID of the NPC who can be found here"),
		siteId: id.describe("ID of the site where this NPC can be encountered"),
	})
		.strict()
		.describe("Maps where NPCs can be encountered, helping GMs place characters consistently in the world"),

	manage_character_relationships: createInsertSchema(characterRelationships, {
		id: optionalId.describe("ID of relationship to manage (omit to create new, include alone to delete)"),
		history: (s) => s.describe("Past interactions and shared experiences"),
		description: (s) => s.describe("Current relationship status and visible dynamics"),
		creativePrompts: (s) => s.describe("Story possibilities involving both NPCs"),
		narrativeTensions: (s) => s.describe("Points of conflict or dramatic potential"),
		sharedGoals: (s) => s.describe("Common objectives uniting these NPCs"),
		relationshipDynamics: (s) => s.describe("How these NPCs typically interact with each other"),
		npcId: id.describe("ID of the primary NPC in this relationship"),
		relatedNpcId: id.describe("ID of the secondary NPC in this relationship"),
		type: z.enum(enums.relationshipTypes).describe("Connection type (family, friend, rival, mentor, enemy, lover)"),
		strength: z
			.enum(enums.relationshipStrengths)
			.describe("Relationship intensity (weak, moderate, strong, unbreakable)"),
	})
		.strict()
		.describe("Defines connections between NPCs, creating social networks and potential storylines"),
} satisfies Record<NpcTools, z.ZodSchema<unknown>>
