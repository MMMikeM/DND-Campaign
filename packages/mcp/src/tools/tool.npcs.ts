import { tables } from "@tome-master/shared"
import { eq } from "drizzle-orm"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod"
import { db, logger } from "../index"
import zodToMCP from "../zodToMcp"
import {
	createEntityHandler,
	createEntityActionDescription,
	jsonArray,
	type ToolDefinition,
	type CamelToSnakeCase,
} from "./tool.utils"

const {
	npcTables: { npcs, npcRelationships, npcFactions, npcLocations },
} = tables

type TableTools = `manage_${CamelToSnakeCase<keyof typeof tables.npcTables>}`

/**
 * Tool names for NPC-related operations
 */
export type NpcToolNames = "get_all_npcs" | "get_npc_by_id" | TableTools

export const schemas = {
	id: z.object({ id: z.number() }),
	manage_npcs: createInsertSchema(npcs, {
		id: z.number().optional(),
		appearance: jsonArray,
		avoidTopics: jsonArray,
		background: jsonArray,
		biases: jsonArray,
		dialogue: jsonArray,
		drives: jsonArray,
		fears: jsonArray,
		knowledge: jsonArray,
		mannerisms: jsonArray,
		personalityTraits: jsonArray,
		preferredTopics: jsonArray,
		rumours: jsonArray,
		secrets: jsonArray,
		voiceNotes: jsonArray,
	}).strict(),
	manage_npc_factions: createInsertSchema(npcFactions, {
		secrets: jsonArray,
	}).strict(),
	manage_npc_locations: createInsertSchema(npcLocations, {
		creativePrompts: jsonArray,
		description: jsonArray,
	}).strict(),
	manage_npc_relationships: createInsertSchema(npcRelationships, {
		history: jsonArray,
		description: jsonArray,
		creativePrompts: jsonArray,
		narrativeTensions: jsonArray,
		sharedViews: jsonArray,
		relationshipDynamics: jsonArray,
	}).strict(),
} satisfies Record<TableTools | "id", z.ZodTypeAny>

export const npcToolDefinitions: Record<NpcToolNames, ToolDefinition> = {
	get_all_npcs: {
		description: "Get all NPCs in the campaign world",
		inputSchema: zodToMCP(z.any()),
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
		inputSchema: zodToMCP(schemas.id, {
			id: "The unique ID of the NPC to retrieve",
		}),
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
		inputSchema: zodToMCP(schemas.manage_npcs, {
			id: "The ID of the NPC to update (omit to create new)",
			name: "The name of the NPC",
			race: "The race or species of the NPC",
			gender: "The gender of the NPC",
			occupation: "The NPC's profession or role in society",
			quirk: "A distinctive quirk or trait of this NPC",
			background: "The NPC's history and background",
			secrets: "Secrets the NPC is hiding",
			personalityTraits: "Key personality traits that define this NPC",
			knowledge: "Information the NPC knows that might be useful to players",
			dialogue: "Potential dialogue lines or speech patterns",
			adaptability: "How adaptable the NPC is to changing situations",
			age: "The age of the NPC",
			attitude: "The NPC's general attitude or demeanor",
			avoidTopics: "Topics the NPC prefers to avoid in conversation",
			biases: "Any biases or prejudices the NPC holds",
			fears: "Fears or phobias the NPC has",
			mannerisms: "Distinctive mannerisms or behaviors",
			preferredTopics: "Topics the NPC enjoys discussing",
			rumours: "Rumors or gossip about the NPC",
			alignment: "The NPC's moral alignment (e.g., lawful good, chaotic neutral)",
			disposition: "The NPC's general disposition towards others (e.g., friendly, hostile)",
			trustLevel: "The NPC's level of trust towards others",
			wealth: "The NPC's wealth level (e.g., poor, rich)",
			appearance: "Physical appearance details of the NPC",
			drives: "What drives the NPC's actions and decisions",
			voiceNotes: "Description of the NPC's voice",
			socialStatus: "The NPC's social status or class",
		}),
		handler: createEntityHandler(npcs, schemas.manage_npcs, "NPC"),
	},
	manage_npc_relationships: {
		description: createEntityActionDescription("an NPC relationship"),
		inputSchema: zodToMCP(schemas.manage_npc_relationships, {
			id: "The ID of the relationship to update (omit to create new)",
			npcId: "The ID of the primary NPC in this relationship",
			relatedNpcId: "The ID of the secondary NPC in this relationship",
			description: "Detailed description of the relationship dynamics",
			creativePrompts: "Creative prompts for this relationship",
			history: "Historical background of the relationship",
			sharedViews: "Shared views or beliefs between the NPCs",
			narrativeTensions: "Narrative tensions or conflicts in the relationship",
			relationshipDynamics: "Dynamics of the relationship (e.g., friendly, hostile)",
			relationsshipStrength: "Strength of the relationship (e.g., weak, moderate, strong)",
			strength: "Strength of the relationship (e.g., weak, moderate, strong)",
			type: "Type of relationship (e.g., ally, enemy, neutral)",
		}),
		handler: createEntityHandler(npcRelationships, schemas.manage_npc_relationships, "NPC relationship"),
	},
	manage_npc_factions: {
		description: createEntityActionDescription("an NPC faction"),
		inputSchema: zodToMCP(schemas.manage_npc_factions, {
			id: "The ID of the faction to update (omit to create new)",
			npcId: "The ID of the NPC in this faction",
			factionId: "The ID of the faction",
			loyalty: "The NPC's loyalty level to this faction",
			justification: "Justification for the NPC's loyalty",
			role: "The NPC's role within the faction",
			rank: "The NPC's rank within the faction",
			secrets: "Secrets related to the NPC's involvement with this faction",
		}),
		handler: createEntityHandler(npcFactions, schemas.manage_npc_factions, "NPC faction"),
	},
	manage_npc_locations: {
		description: createEntityActionDescription("an NPC location"),
		inputSchema: zodToMCP(schemas.manage_npc_locations, {
			id: "The ID of the location to update (omit to create new)",
			npcId: "The ID of the NPC in this location",
			locationId: "The ID of the location",
			description: "Description of the NPC's presence in this location",
			creativePrompts: "Creative prompts for this location",
		}),
		handler: createEntityHandler(npcLocations, schemas.manage_npc_locations, "NPC location"),
	},
}
