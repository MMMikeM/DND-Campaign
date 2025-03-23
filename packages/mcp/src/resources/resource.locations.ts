import { db } from "../index"
import { createResourceUri, createRelationUri, logResourceError } from "./resource.utils"
import type { Resource } from "@modelcontextprotocol/sdk/types.js"

// Resource fetcher for locations
export async function fetchLocation(id: number) {
	return await db.query.locations.findFirst({
		where: (locations, { eq }) => eq(locations.id, id),
	})
}

// Relation fetchers for location-related data
export const locationRelationFetchers = {
	location_quests: async (locationId: number) => {
		const result = await db.query.locations.findFirst({
			where: (locations, { eq }) => eq(locations.id, locationId),
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

	location_npcs: async (locationId: number) => {
		const result = await db.query.locations.findFirst({
			where: (locations, { eq }) => eq(locations.id, locationId),
			with: {
				npcs: {
					with: {
						npc: true,
					},
				},
			},
		})
		return result || { npcs: [] }
	},

	location_factions: async (locationId: number) => {
		const result = await db.query.locations.findFirst({
			where: (locations, { eq }) => eq(locations.id, locationId),
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

	location_areas: async (locationId: number) => {
		const result = await db.query.locations.findFirst({
			where: (locations, { eq }) => eq(locations.id, locationId),
			with: {
				areas: true,
			},
		})
		return result || { areas: [] }
	},

	location_encounters: async (locationId: number) => {
		const result = await db.query.locations.findFirst({
			where: (locations, { eq }) => eq(locations.id, locationId),
			with: {
				encounters: true,
			},
		})
		return result || { encounters: [] }
	},

	location_relations: async (locationId: number) => {
		const result = await db.query.locations.findFirst({
			where: (locations, { eq }) => eq(locations.id, locationId),
			with: {
				relatedTo: true,
				relations: true,
			},
		})
		return result || { relations: [], relatedTo: [] }
	},

	area_npcs: async (locationId: number, areaId?: number) => {
		return await db.query.areaNpcs.findMany({
			where: (areaNpcs, { eq, and }) => {
				const conditions = [eq(areaNpcs.locationId, locationId)]
				if (areaId) {
					conditions.push(eq(areaNpcs.areaId, areaId))
				}
				return and(...conditions)
			},
			with: {
				npc: true,
			},
		})
	},
}

// List all location resources
export async function listLocationResources(): Promise<Resource[]> {
	const resources: Resource[] = []

	try {
		const locations = await db.query.locations.findMany({
			columns: { id: true, name: true, type: true },
		})

		locations.forEach((location) => {
			resources.push({
				uri: createResourceUri("locations", location.id),
				name: `Location: ${location.name}`,
				description: `${location.type} location "${location.name}"`,
				mimeType: "application/json",
			})

			// Add related resources
			resources.push({
				uri: createRelationUri("location_npcs", location.id),
				name: `NPCs at "${location.name}"`,
				description: `All NPCs found at ${location.name}`,
				mimeType: "application/json",
			})

			// Add other relation resources
		})
	} catch (error) {
		logResourceError("listing location resources", "locations", error)
	}

	return resources
}

// Get location resource templates
export function getLocationResourceTemplates() {
	return [
		{
			uriTemplate: "tomekeeper://entity/locations/{id}",
			name: "Location Details",
			description: "Details of a specific location",
			mimeType: "application/json",
		},
		{
			uriTemplate: "tomekeeper://relation/location_npcs/{locationId}",
			name: "Location NPCs",
			description: "NPCs at a specific location",
			mimeType: "application/json",
		},
		// Add other templates
	]
}
