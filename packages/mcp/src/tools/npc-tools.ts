import { tables } from "@tome-master/shared"
import { eq } from "drizzle-orm"
import { db } from "../index"
import { createEntityActionDescription, createEntityHandler, createGetEntityHandler } from "./tool.utils"
import { zodToMCP } from "../zodToMcp"
import { schemas } from "./npc-tools-schema"
import { CreateEntityGetters, CreateTableTools, ToolDefinition } from "./utils/types"

const {
	npcTables: { npcs, characterRelationships, npcFactions, npcSites },
} = tables

export type NpcGetters = CreateEntityGetters<typeof tables.npcTables>

const entityGetters: NpcGetters = {
	all_npcs: () => db.query.npcs.findMany({}),
	all_character_relationships: () => db.query.characterRelationships.findMany({}),
	all_npc_factions: () => db.query.npcFactions.findMany({}),
	all_npc_sites: () => db.query.npcSites.findMany({}),

	npc_by_id: (id: number) =>
		db.query.npcs.findFirst({
			where: eq(npcs.id, id),
			with: {
				relatedFactions: true,
				relatedClues: { with: { stage: true } },
				relatedQuests: true,
				relatedItems: true,
				relatedSites: true,
				relatedQuestHooks: { with: { hook: true } },
				incomingRelationships: { with: { sourceNpc: true } },
				outgoingRelationships: { with: { targetNpc: true } },
			},
		}),
	character_relationship_by_id: (id: number) =>
		db.query.characterRelationships.findFirst({
			where: eq(characterRelationships.id, id),
			with: { sourceNpc: true, targetNpc: true },
		}),
	npc_faction_by_id: (id: number) =>
		db.query.npcFactions.findFirst({
			where: eq(npcFactions.id, id),
			with: { npc: true, faction: true },
		}),
	npc_site_by_id: (id: number) =>
		db.query.npcSites.findFirst({
			where: eq(npcSites.id, id),
			with: { npc: true, site: true },
		}),
}

export type NpcTools = CreateTableTools<typeof tables.npcTables> | "get_npc_entity"

export const npcToolDefinitions: Record<NpcTools, ToolDefinition> = {
	get_npc_entity: {
		description: "Get NPC-related entity information by type and optional ID",
		inputSchema: zodToMCP(schemas.get_npc_entity),
		handler: createGetEntityHandler("npc", entityGetters),
	},
	manage_npcs: {
		description: createEntityActionDescription("NPC"),
		inputSchema: zodToMCP(schemas.manage_npcs),
		handler: createEntityHandler(npcs, schemas.manage_npcs, "npc"),
	},
	manage_character_relationships: {
		description: createEntityActionDescription("character relationship"),
		inputSchema: zodToMCP(schemas.manage_character_relationships),
		handler: createEntityHandler(
			characterRelationships,
			schemas.manage_character_relationships,
			"character_relationship",
		),
	},
	manage_npc_factions: {
		description: createEntityActionDescription("NPC faction"),
		inputSchema: zodToMCP(schemas.manage_npc_factions),
		handler: createEntityHandler(npcFactions, schemas.manage_npc_factions, "npc_faction"),
	},
	manage_npc_sites: {
		description: createEntityActionDescription("NPC site"),
		inputSchema: zodToMCP(schemas.manage_npc_sites),
		handler: createEntityHandler(npcSites, schemas.manage_npc_sites, "npc_site"),
	},
}
