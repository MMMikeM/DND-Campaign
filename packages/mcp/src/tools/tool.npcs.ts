import { tables } from "@tome-master/shared"
import { eq } from "drizzle-orm"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod"
import { db, logger } from "../index"
import {
	createEntityHandler,
	createEntityActionDescription,
	jsonArray,
	type ToolDefinition,
	type CamelToSnakeCase,
} from "./tool.utils"
import { zodToMCP } from "../zodToMcp"

const {
	npcTables: { npcs, npcRelationships, npcFactions, npcLocations },
} = tables

type TableTools = `manage_${CamelToSnakeCase<keyof typeof tables.npcTables>}`

/**
 * Tool names for NPC-related operations
 */
export type NpcToolNames = "get_all_npcs" | "get_npc_by_id" | TableTools

export const schemas = {
	id: z.object({ id: z.number().describe("Unique identifier for the NPC record") }),
	
	manage_npcs: createInsertSchema(npcs, {
			id: z.number().optional().describe("The ID of the NPC to update (omit to create new)"),
			appearance: jsonArray.describe("Physical characteristics, clothing, distinctive features, and overall look in point form"),
			avoidTopics: jsonArray.describe("Conversation subjects that make this NPC uncomfortable, angry, or evasive"),
			background: jsonArray.describe("Life history, formative experiences, and significant past events"),
			biases: jsonArray.describe("Prejudices, preferences, and preconceived notions that affect their judgment"),
			dialogue: jsonArray.describe("Characteristic phrases, speech patterns, and verbal quirks for roleplaying"),
			drives: jsonArray.describe("Core motivations, ambitions, and desires that inspire this character's actions"),
			fears: jsonArray.describe("Specific phobias, anxieties, and threats that frighten or concern this NPC"),
			knowledge: jsonArray.describe("Specific information, expertise, and secrets this NPC possesses that players might discover"),
			mannerisms: jsonArray.describe("Distinctive gestures, habits, and behavioral quirks that make this NPC memorable"),
			personalityTraits: jsonArray.describe("Key character aspects, temperament, and psychological characteristics"),
			preferredTopics: jsonArray.describe("Subjects this NPC is passionate about, knowledgeable in, or eager to discuss"),
			rumours: jsonArray.describe("Gossip, hearsay, and stories others tell about this character"),
			secrets: jsonArray.describe("Hidden information, concealed plans, or private matters unknown to most others"),
			voiceNotes: jsonArray.describe("Vocal qualities, accent, cadence, and speech characteristics for roleplaying"),
			adaptability: (s) => s.describe("How they respond to unexpected situations (rigid, reluctant, flexible, opportunistic)"),
			attitude: (s) => s.describe("General outlook and typical emotional state when encountered"),
			wealth: (s) => s.describe("Economic status and available resources (destitute, poor, moderate, rich, wealthy)"),
			age: (s) => s.describe("Approximate age or age range, whether in years or descriptive terms"),
			alignment: (s) => s.describe("Moral and ethical positioning (lawful good, neutral good, chaotic good, lawful neutral, true neutral, chaotic neutral, lawful evil, neutral evil, chaotic evil)"),
			disposition: (s) => s.describe("Default attitude toward strangers and general sociability"),
			gender: (s) => s.describe("Gender identity of the NPC (male, female, non-humanoid)"),
			name: (s) => s.describe("The NPC's full name or primary identifier"),
			occupation: (s) => s.describe("Profession, job, role, or primary activity in society"),
			quirk: (s) => s.describe("A singular odd habit, trait, or characteristic that stands out"),
			race: (s) => s.describe("Species or ancestry (human, elf, dwarf, halfling, gnome, half-elf, half-orc, tiefling, dragonborn, other)"),
			socialStatus: (s) => s.describe("Position within local social hierarchy and how others regard them"),
			trustLevel: (s) => s.describe("Willingness to trust others with information or tasks (none, low, medium, high)"),
	}).strict().describe("A non-player character with a distinct personality who can interact with players"),
	
	manage_npc_factions: createInsertSchema(npcFactions, {
			secrets: jsonArray.describe("Hidden information about their faction involvement, potentially unknown to other faction members"),
			id: z.number().optional().describe("The ID of this NPC-faction relationship to update (omit to create new)"),
			npcId: z.number().describe("The ID of the NPC in this relationship (references npcs.id)"),
			factionId: z.number().optional().describe("The ID of the faction this NPC belongs to (references factions.id)"),
			loyalty: z.number().describe("Numeric rating of dedication to the faction's interests (0-4: none, low, medium, high)"),
			justification: z.string().describe("Reason for their allegiance (personal belief, financial gain, blackmail, family ties, etc.)"),
			role: z.string().describe("Function or position within the faction (leader, enforcer, spy, advisor, etc.)"),
			rank: z.string().describe("Formal title or hierarchical position within the organization"),
	}).strict().describe("A connection between an NPC and a faction, defining their role and standing within the organization"),
	
	manage_npc_locations: createInsertSchema(npcLocations, {
			creativePrompts: jsonArray.describe("Story hooks and scene ideas involving this NPC at this location"),
			description: jsonArray.describe("Details about how and why the NPC frequents this location and their typical activities there"),
			id: z.number().optional().describe("The ID of this NPC-location relationship to update (omit to create new)"),
			npcId: z.number().describe("The ID of the NPC who can be found here (references npcs.id)"),
			locationId: z.number().describe("The ID of the location where this NPC can be found (references locations.id)"),
	}).strict().describe("Places where an NPC can be encountered, including their routine and purpose there"),
	
	manage_npc_relationships: createInsertSchema(npcRelationships, {
			history: jsonArray.describe("Past interactions, shared experiences, and how these NPCs came to know each other"),
			description: jsonArray.describe("Current state of the relationship, interactions, and visible dynamics"),
			creativePrompts: jsonArray.describe("Story ideas, conflicts, and narrative possibilities involving both NPCs"),
			narrativeTensions: jsonArray.describe("Points of friction, disagreement, or dramatic potential between these characters"),
			sharedViews: jsonArray.describe("Common beliefs, opinions, and values that unite these NPCs"),
			relationshipDynamics: jsonArray.describe("How these NPCs typically interact, communicate, and behave around each other"),
			id: z.number().optional().describe("The ID of this relationship to update (omit to create new)"),
			npcId: z.number().describe("The ID of the primary NPC in this relationship (references npcs.id)"),
			relatedNpcId: z.number().describe("The ID of the secondary NPC in this relationship (references npcs.id)"),
			type: z.string().describe("Nature of the connection (family, friend, rival, mentor, enemy, lover, etc.)"),
			strength: z.number().describe("Numeric indicator of relationship intensity (1-4: weak, moderate, strong, unbreakable)"),
			relationsshipStrength: z.number().describe("Same as strength - numeric indicator of relationship intensity (1-4)"),
	}).strict().describe("Defines how two NPCs are connected and interact with each other"),
} satisfies Record<TableTools | "id", z.ZodTypeAny>

export const npcToolDefinitions: Record<NpcToolNames, ToolDefinition> = {
	get_all_npcs: {
		description: "Get all NPCs in the campaign world",
		inputSchema: zodToMCP(z.object({})),
		handler: async () => {
			logger.info("Getting all NPCs")
			const npcs = await db.query.npcs.findMany({})
			// Debug what's being returned
			logger.debug("Factions retrieved:", {
				stringified: JSON.stringify(npcs),
				type: typeof npcs,
			})
			return npcs
		},
	},
	get_npc_by_id: {
		description: "Get detailed information about a specific NPC by ID",
		inputSchema: zodToMCP(schemas.id),
		handler: async (args) => {
			const parsed = schemas.id.parse(args)
			logger.info("Getting NPC by ID", { parsed })
			return (
				(await db.query.npcs.findFirst({
					where: eq(npcs.id, parsed.id),
					with: {
						relatedClues: { with: { stage: true } },
						relatedQuests: true,
						relatedItems: true,
						relatedLocations: true,
						relatedQuestHooks: { with: { hook: true } },
						incomingRelationships: {
							with: {
								sourceNpc: true,
							},
						},
						outgoingRelationships: {
							with: {
								targetNpc: true,
							},
						},
					},
				})) ?? {
					isError: true,
					content: [{ type: "text", text: "NPC not found" }],
				}
			)
		},
	},
	manage_npcs: {
		description: createEntityActionDescription("an NPC"),
		inputSchema: zodToMCP(schemas.manage_npcs),
		handler: createEntityHandler(npcs, schemas.manage_npcs, "NPC"),
	},
	manage_npc_relationships: {
		description: createEntityActionDescription("an NPC relationship"),
		inputSchema: zodToMCP(schemas.manage_npc_relationships),
		handler: createEntityHandler(npcRelationships, schemas.manage_npc_relationships, "NPC relationship"),
	},
	manage_npc_factions: {
		description: createEntityActionDescription("an NPC faction"),
		inputSchema: zodToMCP(schemas.manage_npc_factions),
		handler: createEntityHandler(npcFactions, schemas.manage_npc_factions, "NPC faction"),
	},
	manage_npc_locations: {
		description: createEntityActionDescription("an NPC location"),
		inputSchema: zodToMCP(schemas.manage_npc_locations),
		handler: createEntityHandler(npcLocations, schemas.manage_npc_locations, "NPC location"),
	},
}
