import { db } from "../index"
import { createResourceUri, createRelationUri, logResourceError } from "./resource.utils"
import type { Resource } from "@modelcontextprotocol/sdk/types.js"

// Resource fetcher for NPCs
export async function fetchNpc(id: number) {
	return await db.query.npcs.findFirst({
		where: (npcs, { eq }) => eq(npcs.id, id),
	})
}

// Relation fetchers for NPC-related data
export const npcRelationFetchers = {
	npc_quests: async (npcId: number) => {
		const result = await db.query.npcs.findFirst({
			where: (npcs, { eq }) => eq(npcs.id, npcId),
			with: {
				quests: {
					with: {
						quest: true,
					},
				},
			},
		})
		return result || { quests: [] }
	},

	npc_locations: async (npcId: number) => {
		const result = await db.query.npcs.findFirst({
			where: (npcs, { eq }) => eq(npcs.id, npcId),
			with: {
				locations: {
					with: {
						location: true,
					},
				},
			},
		})
		return result || { locations: [] }
	},

	npc_factions: async (npcId: number) => {
		const result = await db.query.npcs.findFirst({
			where: (npcs, { eq }) => eq(npcs.id, npcId),
			with: {
				factions: {
					with: {
						faction: true,
					},
				},
			},
		})
		return result || { factions: [] }
	},

	npc_relationships: async (npcId: number) => {
		const result = await db.query.npcs.findFirst({
			where: (npcs, { eq }) => eq(npcs.id, npcId),
			with: {
				relationships: true,
			},
		})
		return result || { relationships: [] }
	},

	npc_significant_items: async (npcId: number) => {
		const result = await db.query.npcs.findFirst({
			where: (npcs, { eq }) => eq(npcs.id, npcId),
			with: {
				significantItems: true,
			},
		})
		return result || { significantItems: [] }
	},

	npc_items: async (npcId: number) => {
		const result = await db.query.npcSignificantItems.findMany({
			where: (npcSignificantItems, { eq }) => eq(npcSignificantItems.npcId, npcId),
		})
		return result || []
	},
}

// List all NPC resources
export async function listNpcResources(): Promise<Resource[]> {
	const resources: Resource[] = []

	try {
		const npcs = await db.query.npcs.findMany({
			columns: { id: true, name: true, race: true, occupation: true },
		})

		npcs.forEach((npc) => {
			resources.push({
				uri: createResourceUri("npcs", npc.id),
				name: `NPC: ${npc.name}`,
				description: `${npc.race} ${npc.occupation} named "${npc.name}"`,
				mimeType: "application/json",
			})

			// Add related resources
			resources.push({
				uri: createRelationUri("npc_factions", npc.id),
				name: `Factions for "${npc.name}"`,
				description: `All factions that ${npc.name} is associated with`,
				mimeType: "application/json",
			})

			// Add other relation resources
		})
	} catch (error) {
		logResourceError("listing NPC resources", "npcs", error)
	}

	return resources
}

// Get NPC resource templates
export function getNpcResourceTemplates() {
	return [
		{
			uriTemplate: "tomekeeper://entity/npcs/{id}",
			name: "NPC Details",
			description: "Details of a specific NPC",
			mimeType: "application/json",
		},
		{
			uriTemplate: "tomekeeper://relation/npc_factions/{npcId}",
			name: "NPC Factions",
			description: "Factions an NPC is affiliated with",
			mimeType: "application/json",
		},
		// Add other templates
	]
}
