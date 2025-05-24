import { tables } from "@tome-master/shared"
import { eq } from "drizzle-orm"
import { db } from "../index"
import { schemas, tableEnum } from "./npc-tools-schema"
import { createManageEntityHandler, createManageSchema } from "./tool.utils"
import type { CreateEntityGetters, ToolDefinition } from "./utils/types"

const {
	npcTables: { npcs, characterRelationships, npcFactions, npcSites },
} = tables

export type NpcGetters = CreateEntityGetters<typeof tables.npcTables>

export const entityGetters: NpcGetters = {
	all_npcs: () => db.query.npcs.findMany({}),
	all_character_relationships: () => db.query.characterRelationships.findMany({}),
	all_npc_factions: () => db.query.npcFactions.findMany({}),
	all_npc_sites: () => db.query.npcSites.findMany({}),

	npc_by_id: (id: number) =>
		db.query.npcs.findFirst({
			where: eq(npcs.id, id),
			with: {
				relatedItems: true,
				relatedQuestHooks: { with: { hook: true } },
				relatedFactions: { with: { faction: { columns: { name: true, id: true } } } },
				relatedClues: { with: { stage: { columns: { name: true, id: true } } } },
				relatedQuests: { with: { quest: { columns: { name: true, id: true } } } },
				relatedSites: { with: { site: { columns: { name: true, id: true } } } },
				incomingRelationships: { with: { sourceNpc: { columns: { name: true, id: true } } } },
				outgoingRelationships: { with: { targetNpc: { columns: { name: true, id: true } } } },
			},
		}),
	character_relationship_by_id: (id: number) =>
		db.query.characterRelationships.findFirst({
			where: eq(characterRelationships.id, id),
			with: {
				sourceNpc: true,
				targetNpc: true,
			},
		}),
	npc_faction_by_id: (id: number) =>
		db.query.npcFactions.findFirst({
			where: eq(npcFactions.id, id),
			with: {
				npc: true,
				faction: true,
			},
		}),
	npc_site_by_id: (id: number) =>
		db.query.npcSites.findFirst({
			where: eq(npcSites.id, id),
			with: {
				npc: true,
				site: true,
			},
		}),
}

export const npcToolDefinitions: Record<"manage_npc", ToolDefinition> = {
	manage_npc: {
		description: "Manage NPC-related entities.",
		inputSchema: createManageSchema(schemas, tableEnum),
		handler: createManageEntityHandler("manage_npc", tables.npcTables, tableEnum, schemas),
	},
}
