import { db, logger } from "../.."
import { analyzeLocationLandscape } from "./analysis"
import { generateLocationConnectionSuggestions } from "./suggestions"
import type { CampaignThemes, EnhancedLocationCreationArgs, NearbyEntitiesForLocation } from "./types"

export async function gatherLocationCreationContext(args: EnhancedLocationCreationArgs) {
	logger.info("Gathering location creation context", args)

	try {
		// Check for name conflicts
		const nameConflicts = await db.query.sites.findMany({
			where: (sites, { like }) => like(sites.name, `%${args.name}%`),
			columns: { id: true, name: true, type: true },
		})

		// Get existing sites for reference and to avoid name conflicts
		const existingSites = await db.query.sites.findMany({
			with: {
				area: {
					with: { region: { columns: { id: true, name: true } } },
				},
				encounters: { columns: { id: true, name: true, objectiveType: true, encounterCategory: true } },
				secrets: { columns: { id: true, secretType: true, difficultyToDiscover: true } },
				npcAssociations: {
					with: {
						npc: { columns: { id: true, name: true, occupation: true } },
					},
					columns: { associationType: true },
				},
			},
			columns: {
				id: true,
				name: true,
				type: true,
				intendedSiteFunction: true,
				description: true,
				features: true,
				mood: true,
				environment: true,
			},
			limit: 20,
		})

		// Get regions and areas for hierarchical context
		const availableRegions = await db.query.regions.findMany({
			with: {
				areas: { columns: { id: true, name: true, type: true } },
			},
			columns: {
				id: true,
				name: true,
				type: true,
				description: true,
				dangerLevel: true,
				atmosphereType: true,
			},
		})

		// Get site encounters for understanding location types and challenges
		const existingEncounters = await db.query.siteEncounters.findMany({
			with: {
				site: { columns: { id: true, name: true, type: true } },
			},
			columns: {
				id: true,
				name: true,
				objectiveType: true,
				encounterCategory: true,
				encounterVibe: true,
			},
		})

		// Get site secrets for understanding hidden elements
		const existingSecrets = await db.query.siteSecrets.findMany({
			with: {
				site: { columns: { id: true, name: true, type: true } },
			},
			columns: {
				id: true,
				secretType: true,
				difficultyToDiscover: true,
				description: true,
			},
		})

		// Get site links for understanding connections
		const existingLinks = await db.query.siteLinks.findMany({
			with: {
				sourceSite: { columns: { id: true, name: true, type: true } },
				targetSite: { columns: { id: true, name: true, type: true } },
			},
			columns: {
				id: true,
				linkType: true,
				description: true,
			},
		})

		// Get NPC site associations
		const npcSiteAssociations = await db.query.npcSiteAssociations.findMany({
			with: {
				npc: { columns: { id: true, name: true, occupation: true, alignment: true } },
				site: { columns: { id: true, name: true, type: true } },
			},
			columns: {
				id: true,
				associationType: true,
				description: true,
			},
		})

		// Get faction influence over locations
		const factionInfluence = await db.query.factionInfluence.findMany({
			with: {
				faction: { columns: { id: true, name: true, type: true } },
				region: { columns: { id: true, name: true } },
				area: { columns: { id: true, name: true } },
				site: { columns: { id: true, name: true } },
			},
			columns: {
				id: true,
				influenceLevel: true,
				presenceTypes: true,
				presenceDetails: true,
				priorities: true,
			},
		})

		// Get quest stages at locations
		const questStages = await db.query.questStages.findMany({
			where: (qs, { isNotNull }) => isNotNull(qs.siteId),
			with: {
				quest: { columns: { id: true, name: true, type: true } },
				site: { columns: { id: true, name: true, type: true } },
			},
			columns: {
				id: true,
				name: true,
				stageType: true,
				stageImportance: true,
				description: true,
			},
		})

		// Get foreshadowing seeds related to sites
		const foreshadowing = await db.query.foreshadowing.findMany({
			where: (fs, { or, isNotNull }) => or(isNotNull(fs.sourceSiteId), isNotNull(fs.targetSiteId)),
			with: {
				sourceSite: { columns: { id: true, name: true } },
				targetSite: { columns: { id: true, name: true } },
			},
			columns: {
				id: true,
				subtlety: true,
				narrativeWeight: true,
				description: true,
			},
		})

		// Get item history at locations
		const itemHistory = await db.query.itemNotableHistory.findMany({
			where: (inh, { isNotNull }) => isNotNull(inh.locationSiteId),
			with: {
				item: { columns: { id: true, name: true, itemType: true } },
				locationSite: { columns: { id: true, name: true, type: true } },
			},
			columns: {
				id: true,
				eventDescription: true,
				timeframe: true,
				npcRoleInEvent: true,
			},
		})

		// Get nearby entities if region hint provided
		let nearbyEntities: NearbyEntitiesForLocation | null = null

		if (args.region_hint) {
			// Get regions that match the hint
			const matchingRegions = await db.query.regions.findMany({
				where: (regions, { like }) => like(regions.name, `%${args.region_hint}%`),
				columns: { id: true, name: true, type: true },
			})

			if (matchingRegions.length > 0) {
				const regionIds = matchingRegions.map((r) => r.id)

				// Get areas in those regions
				const nearbyAreas = await db.query.areas.findMany({
					where: (areas, { inArray }) => inArray(areas.regionId, regionIds),
					columns: { id: true, name: true, type: true },
				})

				// Get sites in those areas
				const nearbySites = await db.query.sites.findMany({
					where: (sites, { inArray }) =>
						inArray(
							sites.areaId,
							nearbyAreas.map((a) => a.id),
						),
					columns: { id: true, name: true, type: true, intendedSiteFunction: true },
				})

				// Get faction influence in the regions
				const nearbyFactionInfluence = await db.query.factionInfluence.findMany({
					where: (fi, { inArray, or }) =>
						or(
							inArray(fi.regionId, regionIds),
							inArray(
								fi.areaId,
								nearbyAreas.map((a) => a.id),
							),
						),
					with: {
						faction: { columns: { id: true, name: true, type: true } },
						region: { columns: { id: true, name: true } },
						area: { columns: { id: true, name: true } },
					},
					columns: { id: true, influenceLevel: true },
				})

				// Get NPCs in nearby sites
				const nearbyNPCs = await db.query.npcSiteAssociations.findMany({
					where: (npcSiteAssociations, { inArray }) =>
						inArray(
							npcSiteAssociations.siteId,
							nearbySites.map((s) => s.id),
						),
					with: { npc: { columns: { id: true, name: true, occupation: true } } },
					columns: { id: true },
				})

				nearbyEntities = {
					regions: matchingRegions,
					areas: nearbyAreas,
					sites: nearbySites,
					factions: nearbyFactionInfluence.map((fi) => ({
						id: fi.faction.id,
						name: fi.faction.name,
						type: fi.faction.type,
						influence: [{ level: fi.influenceLevel, id: fi.id }],
					})),
					npcs: nearbyNPCs.map((npc) => ({
						id: npc.npc.id,
						name: npc.npc.name,
						occupation: npc.npc.occupation,
						sites: [{ id: npc.id }],
					})),
				}
			}
		}

		// Get campaign themes and active conflicts
		const relevantQuests = await db.query.quests.findMany({
			columns: {
				id: true,
				name: true,
				type: true,
				description: true,
				mood: true,
				themes: true,
			},
			limit: 10,
		})

		const activeConflicts = await db.query.conflicts.findMany({
			where: (conflicts, { eq }) => eq(conflicts.status, "active"),
			with: {
				participants: {
					with: {
						faction: { columns: { id: true, name: true } },
						npc: { columns: { id: true, name: true } },
					},
				},
			},
			columns: {
				id: true,
				name: true,
				description: true,
				moralDilemma: true,
				stakes: true,
			},
		})

		const campaignThemes: CampaignThemes = {
			relevantQuests,
			activeConflicts,
			foreshadowing,
		}

		// Generate analysis and suggestions
		const locationAnalysis = analyzeLocationLandscape({
			existingSites,
			existingEncounters,
			existingSecrets,
			factionInfluence: factionInfluence.map((fi) => ({
				influenceLevel: fi.influenceLevel,
				faction: { id: fi.faction.id, name: fi.faction.name },
				site: fi.site,
				area: fi.area,
				region: fi.region,
			})),
			questStages,
			activeConflicts,
		})

		const connectionSuggestions = generateLocationConnectionSuggestions(
			args,
			existingSites.map((s) => ({
				...s,
				npcs: s.npcAssociations,
			})),
			availableRegions,
			existingLinks,
		)

		return {
			nameConflicts,
			existingSites,
			availableRegions,
			existingEncounters,
			existingSecrets,
			existingLinks,
			npcSiteAssociations,
			factionInfluence,
			questStages,
			foreshadowingSeeds: foreshadowing,
			itemHistory,
			nearbyEntities,
			campaignThemes,
			locationAnalysis,
			connectionSuggestions,
		}
	} catch (error) {
		logger.error("Error gathering location creation context", error)
		throw error
	}
}
