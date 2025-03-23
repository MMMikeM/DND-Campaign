import { db } from "../index"
import type { Resource } from "@modelcontextprotocol/sdk/types.js"
import { createResourceUri, createRelationUri, logResourceError } from "./resource.utils"
// Resource fetcher for factions
export async function fetchFaction(id: number) {
	return await db.query.factions.findFirst({
		where: (factions, { eq }) => eq(factions.id, id),
	})
}

// Relation fetchers for faction-related data
export const factionRelationFetchers = {
	faction_quests: async (factionId: number) => {
		const result = await db.query.factions.findFirst({
			where: (factions, { eq }) => eq(factions.id, factionId),
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

	faction_npcs: async (factionId: number) => {
		const result = await db.query.factions.findFirst({
			where: (factions, { eq }) => eq(factions.id, factionId),
			with: {
				members: true,
			},
		})
		return result || { members: [] }
	},

	faction_locations: async (factionId: number) => {
		const result = await db.query.factions.findFirst({
			where: (factions, { eq }) => eq(factions.id, factionId),
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

	faction_relationships: async (factionId: number) => {
		const result = await db.query.factions.findFirst({
			where: (factions, { eq }) => eq(factions.id, factionId),
			with: {
				relationships: true,
			},
		})
		return result || { relationships: [] }
	},
}

// List all faction resources
export async function listFactionResources(): Promise<Resource[]> {
	const resources: Resource[] = []

	try {
		const factions = await db.query.factions.findMany({
			columns: { id: true, name: true, type: true },
		})

		factions.forEach((faction) => {
			resources.push({
				uri: createResourceUri("factions", faction.id),
				name: `Faction: ${faction.name}`,
				description: `${faction.type} faction "${faction.name}"`,
				mimeType: "application/json",
			})

			// Add related resources
			resources.push({
				uri: createRelationUri("faction_npcs", faction.id),
				name: `Members of "${faction.name}"`,
				description: `All NPCs who are members of ${faction.name}`,
				mimeType: "application/json",
			})

			// Add other relation resources
		})
	} catch (error) {
		logResourceError("listing faction resources", "factions", error)
	}

	return resources
}

// Get faction resource templates
export function getFactionResourceTemplates() {
	return [
		{
			uriTemplate: "tomekeeper://entity/factions/{id}",
			name: "Faction Details",
			description: "Details of a specific faction",
			mimeType: "application/json",
		},
		{
			uriTemplate: "tomekeeper://relation/faction_npcs/{factionId}",
			name: "Faction Members",
			description: "NPCs who are members of a specific faction",
			mimeType: "application/json",
		},
		// Add other templates
	]
}
