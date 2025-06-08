/**
 * Faction Creation
 *
 * Provides the "create-faction-enhanced" prompt for generating political organizations
 * with automatic relationship mapping, territory analysis, and integration with
 * existing campaign conflicts and power structures.
 */

import { z } from "zod/v4"
import { db, logger } from ".."
import { createTypedHandler } from "./types"
import type { PromptDefinition } from "./utils"

const enhancedFactionCreationSchema = z.object({
	name: z.string().describe("Name for the new faction"),
	type_hint: z.string().optional().describe("Type of faction (military, religious, trade, criminal, etc.)"),
	location_hint: z.string().optional().describe("Where they're based or operate"),
	alignment_hint: z.string().optional().describe("Faction alignment preference"),
	role_hint: z.string().optional().describe("Role in campaign (ally, enemy, neutral, etc.)"),
})

async function gatherFactionCreationContext(args: z.infer<typeof enhancedFactionCreationSchema>) {
	logger.info("Gathering faction creation context", args)

	try {
		// Check for name conflicts
		const nameConflicts = await db.query.factions.findMany({
			where: (factions, { like }) => like(factions.name, `%${args.name}%`),
			columns: { id: true, name: true, type: true },
		})

		// Get existing factions for relationship context
		const existingFactions = await db.query.factions.findMany({
			with: {
				primaryHqSite: {
					with: {
						area: { columns: { id: true, name: true } },
					},
				},
			},
			columns: {
				id: true,
				name: true,
				type: true,
				publicAlignment: true,
				secretAlignment: true,
				description: true,
			},
		})

		// Get all locations/sites for geographic context
		const sites = await db.query.sites.findMany({
			with: { area: { columns: { id: true, name: true }, with: { region: { columns: { id: true, name: true } } } } },
			columns: {
				id: true,
				name: true,
				type: true,
				description: true,
			},
		})

		// Get existing NPCs for potential faction members
		const potentialMembers = await db.query.npcs.findMany({
			columns: {
				id: true,
				name: true,
				occupation: true,
			},
		})

		// Get nearby entities if location hint provided
		let nearbyEntities: any = null

		if (args.location_hint) {
			const relatedSites = await db.query.sites.findMany({
				where: (sites, { like }) => like(sites.name, `%${args.location_hint}%`),
				columns: { id: true, name: true, type: true },
			})

			if (relatedSites.length > 0) {
				const siteIds = relatedSites.map((s) => s.id)

				// Get NPCs in the area
				const siteNpcs = await db.query.sites.findMany({
					with: {
						npcs: true,
					},
					where: (sites, { or, eq }) => or(...siteIds.map((id) => eq(sites.id, id))),
					columns: { id: true, name: true, type: true },
				})

				// Get other factions in the area
				const nearbyFactions = await db.query.factions.findMany({
					where: (factions, { or, eq }) => or(...siteIds.map((id) => eq(factions.primaryHqSiteId, id))),
					columns: { id: true, name: true, type: true, publicAlignment: true, secretAlignment: true },
				})

				nearbyEntities = {
					sites: relatedSites,
					npcs: siteNpcs,
					factions: nearbyFactions,
				}
			}
		}

		// Get active conflicts for faction positioning
		const activeConflicts = await db.query.majorConflicts.findMany({
			where: (majorConflicts, { eq }) => eq(majorConflicts.status, "active"),
			columns: {
				id: true,
				name: true,
				description: true,
			},
		})

		// Generate faction relationship suggestions based on type and alignment
		const suggestedRelationships = await generateFactionRelationshipSuggestions(args, existingFactions)

		const context = {
			nameConflicts,
			existingFactions,
			locations: sites,
			potentialMembers,
			nearbyEntities,
			activeConflicts,
			campaignThemes: {
				activeConflicts,
			},
			suggestedRelationships,
		}

		logger.info("Faction context gathered successfully", {
			nameConflicts: nameConflicts.length,
			existingFactions: existingFactions.length,
			locations: sites.length,
			potentialMembers: potentialMembers.length,
			nearbyEntities: nearbyEntities ? Object.keys(nearbyEntities).length : 0,
		})

		return context
	} catch (error) {
		logger.error("Error gathering faction creation context:", error)
		throw new Error("Failed to gather faction creation context")
	}
}

async function generateFactionRelationshipSuggestions(
	args: z.infer<typeof enhancedFactionCreationSchema>,
	existingFactions: any[],
) {
	const suggestions: string[] = []

	// Suggest based on type similarities/conflicts
	if (args.type_hint) {
		const similarFactions = existingFactions.filter(
			(f) =>
				f.type === args.type_hint ||
				(args.type_hint === "trade" && f.type === "merchant") ||
				(args.type_hint === "military" && f.type === "guard"),
		)

		if (similarFactions.length > 0) {
			suggestions.push(`Potential rivalry with ${similarFactions[0].name} (competing ${args.type_hint} interests)`)
			if (similarFactions.length > 1) {
				suggestions.push(`Possible alliance with ${similarFactions[1].name} (shared ${args.type_hint} goals)`)
			}
		}
	}

	// Suggest based on alignment
	if (args.alignment_hint) {
		const alignedFactions = existingFactions.filter((f) => f.alignment === args.alignment_hint)
		const opposedFactions = existingFactions.filter(
			(f) =>
				(args.alignment_hint?.includes("lawful") && f.alignment?.includes("chaotic")) ||
				(args.alignment_hint?.includes("chaotic") && f.alignment?.includes("lawful")) ||
				(args.alignment_hint?.includes("good") && f.alignment?.includes("evil")) ||
				(args.alignment_hint?.includes("evil") && f.alignment?.includes("good")),
		)

		if (alignedFactions.length > 0) {
			suggestions.push(`Natural alliance with ${alignedFactions[0].name} (shared ${args.alignment_hint} values)`)
		}
		if (opposedFactions.length > 0) {
			suggestions.push(`Ideological conflict with ${opposedFactions[0].name} (opposing moral values)`)
		}
	}

	return suggestions
}

async function enhancedFactionCreationHandler(args: z.infer<typeof enhancedFactionCreationSchema>) {
	logger.info("Executing enhanced faction creation prompt", args)

	const context = await gatherFactionCreationContext(args)

	return {
		messages: [
			{
				role: "user" as const,
				content: {
					type: "resource" as const,
					resource: {
						uri: `campaign://creation-context/faction-${args.name}`,
						text: JSON.stringify(context, null, 2),
						mimeType: "application/json",
					},
				},
			},
			{
				role: "user" as const,
				content: {
					type: "text" as const,
					text: `Create Faction: "${args.name}"

Type hint: ${args.type_hint || "No preference"}
Location hint: ${args.location_hint || "No preference"}
Alignment hint: ${args.alignment_hint || "No preference"}
Role hint: ${args.role_hint || "No preference"}

Generate a complete faction including:
- Clear faction type and organizational structure
- Leadership hierarchy and key members (reference existing NPCs if suitable)
- Primary goals, methods, and ideology
- Geographic territory or sphere of influence (use existing locations)
- Resources, assets, and power level
- Specific relationships with existing factions (alliances, rivalries, conflicts)
- Position in current campaign conflicts and quests
- Hidden agendas or secrets that fit campaign themes
- Potential faction quests or story hooks for player interaction

Ensure the faction fits naturally into the existing campaign world and creates meaningful political/social dynamics with current entities. Consider how this faction would interact with ongoing conflicts and quests.`,
				},
			},
		],
	}
}

export const enhancedFactionPromptDefinitions: Record<string, PromptDefinition> = {
	"create-faction-enhanced": {
		description: "Create a faction with full campaign context, relationship suggestions, and political positioning",
		schema: enhancedFactionCreationSchema,
		handler: createTypedHandler(enhancedFactionCreationSchema, enhancedFactionCreationHandler),
	},
}
