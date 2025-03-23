import { npcRelationships, npcs } from "@tome-master/shared"
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
} from "./tool.utils"

/**
 * Tool names for NPC-related operations
 */
export type NpcToolNames =
	| "get_all_npcs"
	| "get_npc_by_id"
	| "manage_npc"
	| "manage_npc_relationship"

export const schemas = {
	npcIdSchema: z.object({ id: z.number() }),
	getAllNpcsSchema: z.object({}),

	npcmanageSchema: createInsertSchema(npcs, {
		id: z.number().optional(),
		background: jsonArray,
		motivation: jsonArray,
		secrets: jsonArray,
		descriptions: jsonArray,
		personalityTraits: jsonArray,
		items: jsonArray,
		knowledge: jsonArray,
		dialogue: jsonArray,
	}),

	npcRelationshipmanageSchema: createInsertSchema(npcRelationships, {
		id: z.number().optional(),
		description: jsonArray,
	}),
}

export const npcToolDefinitions: Record<NpcToolNames, ToolDefinition> = {
	manage_npc: {
		description: createEntityActionDescription("an NPC"),
		inputSchema: zodToMCP(schemas.npcmanageSchema, {
			id: "The ID of the NPC to update (omit to create new)",
			name: "The name of the NPC",
			race: "The race or species of the NPC",
			gender: "The gender of the NPC",
			occupation: "The NPC's profession or role in society",
			role: "The narrative role this NPC plays in the campaign",
			quirk: "A distinctive quirk or trait of this NPC",
			background: "The NPC's history and background",
			motivation: "What drives this NPC's actions and decisions",
			secrets: "Secrets the NPC is hiding",
			descriptions: "Physical descriptions and appearance details",
			personalityTraits: "Key personality traits that define this NPC",
			items: "Items the NPC possesses or carries",
			knowledge: "Information the NPC knows that might be useful to players",
			dialogue: "Potential dialogue lines or speech patterns",
		}),
		handler: createEntityHandler(npcs, schemas.npcmanageSchema, "NPC"),
	},

	manage_npc_relationship: {
		description: createEntityActionDescription("an NPC relationship"),
		inputSchema: zodToMCP(schemas.npcRelationshipmanageSchema, {
			id: "The ID of the relationship to update (omit to create new)",
			npcId: "The ID of the primary NPC in this relationship",
			relatedNpcId: "The ID of the secondary NPC in this relationship",
			relationshipType: "The type of relationship between these NPCs",
			description: "Detailed description of the relationship dynamics",
		}),
		handler: createEntityHandler(
			npcRelationships,
			schemas.npcRelationshipmanageSchema,
			"NPC relationship",
		),
	},

	get_all_npcs: {
		description: "Get all NPCs in the campaign world",
		inputSchema: zodToMCP(schemas.getAllNpcsSchema, {
			// Empty object with no fields to describe
		}),
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
		inputSchema: zodToMCP(schemas.npcIdSchema, {
			id: "The unique ID of the NPC to retrieve",
		}),
		handler: async (args) => {
			const parsed = schemas.npcIdSchema.parse(args)
			logger.info("Getting NPC by ID", { parsed })
			return (
				(await db.query.npcs.findFirst({
					where: eq(npcs.id, parsed.id),
					with: {
						relationships: true,
						significantItems: true,
						quests: true,
						areas: true,
						factions: true,
						locations: true,
						relatedTo: true,
					},
				})) ?? {
					isError: true,
					content: [{ type: "text", text: "NPC not found" }],
				}
			)
		},
	},
}
