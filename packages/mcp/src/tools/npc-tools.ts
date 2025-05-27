import { tables } from "@tome-master/shared"
import { db } from "../index"
import { schemas, tableEnum } from "./npc-tools-schema"
import { createManageEntityHandler, createManageSchema } from "./tool.utils"
import type { CreateEntityGetters, ToolDefinition } from "./utils/types"

type NpcGetters = CreateEntityGetters<typeof tables.npcTables>

export const entityGetters: NpcGetters = {
	all_npcs: () => db.query.npcs.findMany({}),
	all_npc_factions: () => db.query.npcFactions.findMany({}),
	all_npc_sites: () => db.query.npcSites.findMany({}),
	all_npc_relationships: () => db.query.npcRelationships.findMany({}),

	npc_by_id: (id: number) =>
		db.query.npcs.findFirst({
			where: (npcs, { eq }) => eq(npcs.id, id),
			with: {
				affectedByConsequences: true,
				sourceOfForeshadowing: true,
				targetOfForeshadowing: true,
				conflictParticipation: { with: { conflict: { columns: { name: true, id: true } } } },
				currentLocation: { with: { region: { columns: { name: true, id: true } } } },
				destinationInvolvement: { with: { destination: { columns: { name: true, id: true } } } },
				itemHistory: { with: { item: { columns: { name: true, id: true } } } },
				questHooks: { with: { quest: { columns: { name: true, id: true } } } },
				questStageDeliveries: { with: { quest: { columns: { name: true, id: true } } } },
				worldConceptLinks: { with: { worldConcept: { columns: { name: true, id: true } } } },
				relatedFactions: { with: { faction: { columns: { name: true, id: true } } } },
				relatedSites: { with: { site: { columns: { name: true, id: true } } } },
				incomingRelationships: { with: { sourceNpc: { columns: { name: true, id: true } } } },
				outgoingRelationships: { with: { targetNpc: { columns: { name: true, id: true } } } },
				itemRelationships: { with: { sourceItem: { columns: { name: true, id: true } } } },
			},
		}),
	npc_faction_by_id: (id: number) =>
		db.query.npcFactions.findFirst({
			where: (npcFactions, { eq }) => eq(npcFactions.id, id),
			with: {
				npc: true,
				faction: true,
			},
		}),
	npc_site_by_id: (id: number) =>
		db.query.npcSites.findFirst({
			where: (npcSites, { eq }) => eq(npcSites.id, id),
			with: {
				npc: true,
				site: true,
			},
		}),
	npc_relationship_by_id: (id: number) =>
		db.query.npcRelationships.findFirst({
			where: (npcRelationships, { eq }) => eq(npcRelationships.id, id),
			with: {
				sourceNpc: true,
				targetNpc: true,
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
