import { tables } from "@tome-master/shared"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { db, logger } from "../index"
import {
	createEntityActionDescription,
	createEntityHandler,
	type CamelToSnakeCase,
	type ToolDefinition,
} from "./tool.utils"
import { zodToMCP } from "../zodToMcp"
import { schemas } from "./npc-tools-schema"

const {
	npcTables: { npcs, characterRelationships, npcFactions, npcLocations },
} = tables

type TableTools = `manage_${CamelToSnakeCase<keyof typeof tables.npcTables>}`
export type NpcTools = TableTools | "get_all_npcs" | "get_npc_by_id"

export const npcToolDefinitions: Record<NpcTools, ToolDefinition> = {
	get_all_npcs: {
		description: "Get all NPCs in the campaign world",
		inputSchema: zodToMCP(z.object({})),
		handler: async () => {
			logger.info("Getting all NPCs")
			const npcs = await db.query.npcs.findMany({})
			logger.debug("Factions retrieved:", {
				stringified: JSON.stringify(npcs),
				type: typeof npcs,
			})
			return npcs
		},
	},
	get_npc_by_id: {
		description: "Get detailed information about a specific NPC by ID",
		inputSchema: zodToMCP(schemas.get_npc_by_id),
		handler: async (args) => {
			const parsed = schemas.get_npc_by_id.parse(args)
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
		description: createEntityActionDescription("NPC"),
		inputSchema: zodToMCP(schemas.manage_npcs),
		handler: createEntityHandler(npcs, schemas.manage_npcs, "NPC"),
	},
	manage_character_relationships: {
		description: createEntityActionDescription("an NPC relationship"),
		inputSchema: zodToMCP(schemas.manage_character_relationships),
		handler: createEntityHandler(characterRelationships, schemas.manage_character_relationships, "NPC relationship"),
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
