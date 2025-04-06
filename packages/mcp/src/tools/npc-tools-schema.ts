import { createInsertSchema } from "drizzle-zod"
import { tables } from "@tome-master/shared"
import { z } from "zod"
import { NpcTools } from "./npc-tools"

const {
	npcTables: { npcs, characterRelationships, npcFactions, npcLocations },
} = tables

export const schemas = {
	get_all_npcs: z.object({}).describe("Get all NPCs"),
	get_npc_by_id: z.object({ id: z.number().describe("Get a specific NPC by ID") }),
	manage_npcs: createInsertSchema(npcs, {
		id: (s) => s.optional().describe("The ID of the NPC to update (omit to create new)"),
		appearance: (s) =>
			s.describe("Physical characteristics, clothing, distinctive features, and overall look in point form"),
		avoidTopics: (s) => s.describe("Conversation subjects that make this NPC uncomfortable, angry, or evasive"),
		background: (s) => s.describe("Life history, formative experiences, and significant past events"),
		biases: (s) => s.describe("Prejudices, preferences, and preconceived notions that affect their judgment"),
		dialogue: (s) => s.describe("Characteristic phrases, speech patterns, and verbal quirks for roleplaying"),
		drives: (s) => s.describe("Core motivations, ambitions, and desires that inspire this character's actions"),
		fears: (s) => s.describe("Specific phobias, anxieties, and threats that frighten or concern this NPC"),
		knowledge: (s) =>
			s.describe("Specific information, expertise, and secrets this NPC possesses that players might discover"),
		mannerisms: (s) => s.describe("Distinctive gestures, habits, and behavioral quirks that make this NPC memorable"),
		personalityTraits: (s) => s.describe("Key character aspects, temperament, and psychological characteristics"),
		preferredTopics: (s) => s.describe("Subjects this NPC is passionate about, knowledgeable in, or eager to discuss"),
		rumours: (s) => s.describe("Gossip, hearsay, and stories others tell about this character"),
		secrets: (s) => s.describe("Hidden information, concealed plans, or private matters unknown to most others"),
		voiceNotes: (s) => s.describe("Vocal qualities, accent, cadence, and speech characteristics for roleplaying"),
		adaptability: (s) =>
			s.describe("How they respond to unexpected situations (rigid, reluctant, flexible, opportunistic)"),
		attitude: (s) => s.describe("General outlook and typical emotional state when encountered"),
		wealth: (s) => s.describe("Economic status and available resources (destitute, poor, moderate, rich, wealthy)"),
		age: (s) => s.describe("Approximate age or age range, whether in years or descriptive terms"),
		alignment: (s) =>
			s.describe(
				"Moral and ethical positioning (lawful good, neutral good, chaotic good, lawful neutral, true neutral, chaotic neutral, lawful evil, neutral evil, chaotic evil)",
			),
		disposition: (s) => s.describe("Default attitude toward strangers and general sociability"),
		gender: (s) => s.describe("Gender identity of the NPC (male, female, non-humanoid)"),
		name: (s) => s.describe("The NPC's full name or primary identifier"),
		occupation: (s) => s.describe("Profession, job, role, or primary activity in society"),
		quirk: (s) => s.describe("A singular odd habit, trait, or characteristic that stands out"),
		race: (s) =>
			s.describe(
				"Species or ancestry (human, elf, dwarf, halfling, gnome, half-elf, half-orc, tiefling, dragonborn, other)",
			),
		socialStatus: (s) => s.describe("Position within local social hierarchy and how others regard them"),
		trustLevel: (s) => s.describe("Willingness to trust others with information or tasks (none, low, medium, high)"),
	})
		.omit({ embedding: true })
		.strict()
		.describe("A non-player character with a distinct personality who can interact with players"),

	manage_npc_factions: createInsertSchema(npcFactions, {
		secrets: (s) =>
			s.describe("Hidden information about their faction involvement, potentially unknown to other faction members"),
		id: (s) => s.optional().describe("The ID of this NPC-faction relationship to update (omit to create new)"),
		npcId: (s) => s.describe("The ID of the NPC in this relationship (references npcs.id)"),
		factionId: (s) => s.optional().describe("The ID of the faction this NPC belongs to (references factions.id)"),
		loyalty: (s) =>
			s.describe("Numeric rating of dedication to the faction's interests (0-4: none, low, medium, high)"),
		justification: (s) =>
			s.describe("Reason for their allegiance (personal belief, financial gain, blackmail, family ties, etc.)"),
		role: (s) => s.describe("Function or position within the faction (leader, enforcer, spy, advisor, etc.)"),
		rank: (s) => s.describe("Formal title or hierarchical position within the organization"),
	})
		.strict()
		.describe("A connection between an NPC and a faction, defining their role and standing within the organization"),

	manage_npc_locations: createInsertSchema(npcLocations, {
		creativePrompts: (s) => s.describe("Story hooks and scene ideas involving this NPC at this location"),
		description: (s) =>
			s.describe("Details about how and why the NPC frequents this location and their typical activities there"),
		id: (s) => s.optional().describe("The ID of this NPC-location relationship to update (omit to create new)"),
		npcId: (s) => s.describe("The ID of the NPC who can be found here (references npcs.id)"),
		siteId: (s) => s.describe("The ID of the site where this NPC can be found (references sites.id)"),
	})
		.strict()
		.describe("Places where an NPC can be encountered, including their routine and purpose there"),

	manage_character_relationships: createInsertSchema(characterRelationships, {
		history: (s) => s.describe("Past interactions, shared experiences, and how these NPCs came to know each other"),
		description: (s) => s.describe("Current state of the relationship, interactions, and visible dynamics"),
		creativePrompts: (s) => s.describe("Story ideas, conflicts, and narrative possibilities involving both NPCs"),
		narrativeTensions: (s) =>
			s.describe("Points of friction, disagreement, or dramatic potential between these characters"),
		sharedGoals: (s) => s.describe("Common goals that unite these NPCs"),
		relationshipDynamics: (s) =>
			s.describe("How these NPCs typically interact, communicate, and behave around each other"),
		id: (s) => s.optional().describe("The ID of this relationship to update (omit to create new)"),
		npcId: (s) => s.describe("The ID of the primary NPC in this relationship (references npcs.id)"),
		relatedNpcId: (s) => s.describe("The ID of the secondary NPC in this relationship (references npcs.id)"),
		type: (s) => s.describe("Nature of the connection (family, friend, rival, mentor, enemy, lover, etc.)"),
		strength: (s) =>
			s.describe("Numeric indicator of relationship intensity (1-4: weak, moderate, strong, unbreakable)"),
	})
		.strict()
		.describe("Defines how two NPCs are connected and interact with each other"),
} satisfies Record<NpcTools, z.ZodSchema<unknown>>
