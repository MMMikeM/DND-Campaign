/**
 * Location Creation
 *
 * Provides the "create-location-enhanced" prompt for generating geographic locations
 * with faction control analysis, cultural integration, and automatic connection
 * suggestions within the campaign's political landscape.
 */

import { z } from "zod/v4"
import { db, logger } from ".."
import { createTypedHandler } from "./types"
import type { PromptDefinition } from "./utils"

const enhancedLocationCreationSchema = z.object({
	name: z.string().describe("Name for the new location"),
	type_hint: z.string().optional().describe("Type of location (city, town, village, fortress, dungeon, etc.)"),
	region_hint: z.string().optional().describe("Region or area where it's located"),
	size_hint: z.string().optional().describe("Size of the location (small, medium, large, etc.)"),
	purpose_hint: z.string().optional().describe("Primary purpose or function (trade hub, military outpost, etc.)"),
})

async function gatherLocationCreationContext(args: z.infer<typeof enhancedLocationCreationSchema>) {
	logger.info("Gathering location creation context", args)

	try {
		// Check for name conflicts
		const nameConflicts = await db.query.sites.findMany({
			where: (sites, { like }) => like(sites.name, `%${args.name}%`),
			columns: { id: true, name: true, type: true },
		})

		// Get existing locations for geographic context
		const existingLocations = await db.query.sites.findMany({
			columns: {
				id: true,
				name: true,
				type: true,
				description: true,
			},
			limit: 15,
		})

		// Get regions for hierarchical context
		const availableRegions = await db.query.regions.findMany({
			columns: {
				id: true,
				name: true,
				description: true,
			},
			limit: 10,
		})

		// Get nearby locations if region hint provided
		let nearbyEntities: any = null
		if (args.region_hint) {
			const relatedRegions = await db.query.regions.findMany({
				where: (regions, { like }) => like(regions.name, `%${args.region_hint}%`),
				columns: { id: true, name: true },
			})

			if (relatedRegions.length > 0) {
				const regionIds = relatedRegions.map((r) => r.id)

				// Get locations in the region
				const regionalLocations = await db.query.sites.findMany({
					where: (sites, { or, eq }) => or(...regionIds.map((id) => eq(sites.areaId, id))),
					columns: { id: true, name: true, type: true },
				})

				// Get factions in the region
				const regionalFactions = await db.query.factions.findMany({
					with: {
						primaryHqSite: {
							with: {
								area: { columns: { id: true, name: true } },
							},
						},
					},
					columns: { id: true, name: true, type: true },
				})

				// Get NPCs in the region
				const regionalNPCs = await db.query.npcs.findMany({
					columns: { id: true, name: true, occupation: true },
				})

				nearbyEntities = {
					regions: relatedRegions,
					locations: regionalLocations,
					factions: regionalFactions,
					npcs: regionalNPCs,
				}
			}
		}

		// Get factions for potential control/influence
		const activeFactions = await db.query.factions.findMany({
			columns: {
				id: true,
				name: true,
				type: true,
				publicAlignment: true,
				secretAlignment: true,
			},
		})

		// Get active conflicts for strategic positioning
		const activeConflicts = await db.query.majorConflicts.findMany({
			where: (majorConflicts, { eq }) => eq(majorConflicts.status, "active"),
			columns: {
				id: true,
				name: true,
				natures: true,
				description: true,
			},
		})

		// Get recent quests for location relevance
		const relevantQuests = await db.query.quests.findMany({
			columns: {
				id: true,
				name: true,
				type: true,
				description: true,
			},
		})

		// Generate location relationship suggestions
		const suggestedConnections = await generateLocationConnectionSuggestions(args, existingLocations, availableRegions)

		const context = {
			nameConflicts,
			existingLocations,
			availableRegions,
			nearbyEntities,
			activeFactions,
			activeConflicts,
			campaignThemes: {
				relevantQuests,
				activeConflicts,
			},
			suggestedConnections,
		}

		logger.info("Location context gathered successfully", {
			nameConflicts: nameConflicts.length,
			existingLocations: existingLocations.length,
			availableRegions: availableRegions.length,
			nearbyEntities: nearbyEntities ? Object.keys(nearbyEntities).length : 0,
			activeFactions: activeFactions.length,
		})

		return context
	} catch (error) {
		logger.error("Error gathering location creation context:", error)
		throw new Error("Failed to gather location creation context")
	}
}

async function generateLocationConnectionSuggestions(
	args: z.infer<typeof enhancedLocationCreationSchema>,
	existingLocations: any[],
	availableRegions: any[],
) {
	const suggestions: string[] = []

	// Suggest based on type relationships
	if (args.type_hint) {
		const complementaryTypes = {
			town: ["village", "city", "fortress"],
			village: ["town", "city"],
			city: ["town", "fortress", "port"],
			fortress: ["town", "city", "outpost"],
			port: ["city", "town", "island"],
			dungeon: ["ruins", "cave", "fortress"],
		}

		const complementary = complementaryTypes[args.type_hint as keyof typeof complementaryTypes] || []
		const relatedLocations = existingLocations.filter(
			(loc) => complementary.includes(loc.type) || loc.type === args.type_hint,
		)

		if (relatedLocations.length > 0) {
			suggestions.push(`Trade route connection to ${relatedLocations[0].name} (${relatedLocations[0].type})`)
			if (relatedLocations.length > 1) {
				suggestions.push(`Strategic position between ${relatedLocations[0].name} and ${relatedLocations[1].name}`)
			}
		}
	}

	// Suggest regional connections
	if (args.region_hint && availableRegions.length > 0) {
		const matchingRegions = availableRegions.filter((region) =>
			region.name.toLowerCase().includes(args.region_hint?.toLowerCase() || ""),
		)

		if (matchingRegions.length > 0) {
			suggestions.push(`Key settlement in ${matchingRegions[0].name} region`)
		}
	}

	// Suggest purpose-based connections
	if (args.purpose_hint) {
		if (args.purpose_hint.includes("trade")) {
			suggestions.push("Hub for regional trade networks and merchant guilds")
		}
		if (args.purpose_hint.includes("military")) {
			suggestions.push("Strategic defensive position and military staging area")
		}
		if (args.purpose_hint.includes("religious")) {
			suggestions.push("Pilgrimage destination and spiritual center")
		}
	}

	return suggestions
}

async function enhancedLocationCreationHandler(args: z.infer<typeof enhancedLocationCreationSchema>) {
	logger.info("Executing enhanced location creation prompt", args)

	const context = await gatherLocationCreationContext(args)

	return {
		messages: [
			{
				role: "user" as const,
				content: {
					type: "resource" as const,
					resource: {
						uri: `campaign://creation-context/location-${args.name}`,
						text: JSON.stringify(context, null, 2),
						mimeType: "application/json",
					},
				},
			},
			{
				role: "user" as const,
				content: {
					type: "text" as const,
					text: `Create Location: "${args.name}"

Type hint: ${args.type_hint || "No preference"}
Region hint: ${args.region_hint || "No preference"}
Size hint: ${args.size_hint || "No preference"}
Purpose hint: ${args.purpose_hint || "No preference"}

Generate a complete location including:
- Detailed physical description and layout
- Population size and demographics
- Government structure and leadership (reference existing NPCs if suitable)
- Economic activities and resources
- Geographic connections to existing locations and regions
- Faction presence and territorial control (use existing factions)
- Notable buildings, landmarks, and districts
- Cultural characteristics and local customs
- Strategic importance in current conflicts and political situations
- Secrets, mysteries, or hidden elements that fit campaign themes
- Adventure hooks and potential quest locations
- How this location interacts with ongoing campaign events

Ensure the location fits naturally into the existing world geography and creates meaningful connections with current entities. Consider how this location would be affected by active conflicts and how it might serve campaign narratives.`,
				},
			},
		],
	}
}

export const enhancedLocationPromptDefinitions: Record<string, PromptDefinition> = {
	"create-location-enhanced": {
		description: "Create a location with full geographic context, faction control, and campaign integration",
		schema: enhancedLocationCreationSchema,
		handler: createTypedHandler(enhancedLocationCreationSchema, enhancedLocationCreationHandler),
	},
}
