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
			columns: { id: true, name: true },
		})

		// Get existing sites for reference and to avoid name conflicts
		const existingSites = await db.query.sites.findMany({
			with: {
				area: {
					with: { region: { columns: { id: true, name: true } } },
				},
				encounters: { columns: { id: true, name: true, objectiveType: true } },
				secret: true,
				npcs: { columns: { id: true, name: true, occupation: true } },
			},
			columns: {
				id: true,
				name: true,
				intendedSiteFunction: true,
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
				dangerLevel: true,
				atmosphereAndCulture: true,
			},
		})

		// Get site encounters for understanding location types and challenges
		const existingEncounters = await db.query.siteEncounters.findMany({
			with: {
				site: { columns: { id: true, name: true } },
			},
			columns: {
				id: true,
				name: true,
				objectiveType: true,
				encounterVibe: true,
			},
		})

		// Get site secrets for understanding hidden elements
		const existingSecrets = await db.query.siteSecrets.findMany({
			with: {
				site: { columns: { id: true, name: true } },
			},
			columns: {
				id: true,
				secretType: true,
				difficultyToDiscover: true,
			},
		})

		// Get site links for understanding connections
		const existingLinks = await db.query.siteLinks.findMany({
			with: {
				sourceSite: { columns: { id: true, name: true } },
				targetSite: { columns: { id: true, name: true } },
			},
			columns: {
				id: true,
				linkType: true,
				description: true,
			},
		})

		// Get NPC site associations - NPCs have siteId field
		const npcSiteAssociations = await db.query.npcs.findMany({
			where: (npc, { isNotNull }) => isNotNull(npc.siteId),
			with: {
				site: { columns: { id: true, name: true } },
			},
			columns: {
				id: true,
				name: true,
				occupation: true,
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
				quest: { columns: { id: true, name: true } },
				site: { columns: { id: true, name: true } },
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

		// Get item connections to locations
		const itemConnections = await db.query.itemConnections.findMany({
			where: (ic, { isNotNull }) => isNotNull(ic.connectedSiteId),
			with: {
				sourceItem: { columns: { id: true, name: true, itemType: true } },
				site: { columns: { id: true, name: true } },
			},
			columns: {
				id: true,
				relationship: true,
				details: true,
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
					columns: { id: true, name: true, intendedSiteFunction: true },
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
				const nearbyNPCs = await db.query.npcs.findMany({
					where: (npcs, { inArray }) =>
						inArray(
							npcs.siteId,
							nearbySites.map((s) => s.id),
						),
					columns: { id: true, name: true, occupation: true, siteId: true },
				})

				nearbyEntities = {
					regions: matchingRegions,
					areas: nearbyAreas,
					sites: nearbySites.map((s) => ({
						...s,
						type: "site", // Add required type field
					})),
					factions: nearbyFactionInfluence.map((fi) => ({
						id: fi.faction.id,
						name: fi.faction.name,
						type: fi.faction.type,
						influence: [{ level: fi.influenceLevel, id: fi.id }],
					})),
					npcs: nearbyNPCs.map((npc) => ({
						id: npc.id,
						name: npc.name,
						occupation: npc.occupation,
						sites: [{ id: npc.siteId }],
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
				tags: true, // Use tags instead of themes
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
			relevantQuests: relevantQuests.map((quest) => ({
				...quest,
				themes: quest.tags, // Map tags to themes
			})),
			activeConflicts,
			foreshadowing,
		}

		// Generate analysis and suggestions
		const locationAnalysis = analyzeLocationLandscape({
			existingSites: existingSites.map((s) => ({
				id: s.id,
				name: s.name,
				type: "site", // Add required type field
				intendedSiteFunction: s.intendedSiteFunction,
				encounters: s.encounters.map((e) => ({
					objectiveType: e.objectiveType,
					encounterCategory: "combat", // Default category
				})),
				secrets: [], // Will be populated separately
			})),
			existingEncounters: existingEncounters.map((e) => ({
				objectiveType: e.objectiveType,
				encounterCategory: "combat", // Default category
			})),
			existingSecrets: existingSecrets.map((s) => ({
				secretType: s.secretType,
			})),
			factionInfluence: factionInfluence.map((fi) => ({
				influenceLevel: fi.influenceLevel,
				faction: { id: fi.faction.id, name: fi.faction.name },
				site: fi.site,
				area: fi.area,
				region: fi.region,
			})),
			questStages: questStages.map((qs) => ({
				stageType: qs.stageType,
				stageImportance: qs.stageImportance,
				site: qs.site ? { ...qs.site, type: "site" } : null,
			})),
			activeConflicts,
		})

		const connectionSuggestions = generateLocationConnectionSuggestions(
			args,
			existingSites.map((s) => ({
				id: s.id,
				name: s.name,
				type: "site", // Add required type field
				intendedSiteFunction: s.intendedSiteFunction,
				description: [], // Add required field
				features: [], // Add required field
				mood: "", // Add required field
				environment: "", // Add required field
				area: s.area,
				encounters: s.encounters.map((e) => ({
					id: e.id,
					name: e.name,
					objectiveType: e.objectiveType,
					encounterCategory: "combat", // Add required field with default value
				})),
				secrets: [], // Add required field
				npcs: [], // Add required field
			})),

			availableRegions.map((r) => ({
				id: r.id,
				name: r.name,
				type: r.type,
				description: [], // Add required field
				dangerLevel: r.dangerLevel,
				atmosphereType: r.atmosphereAndCulture.join(", "), // Transform atmosphereAndCulture to atmosphereType
				areas: r.areas,
			})),
			existingLinks.map((link) => ({
				id: link.id,
				linkType: link.linkType,
				description: link.description,
				sourceSite: {
					...link.sourceSite,
					type: "site", // Add required type field
				},
				targetSite: {
					...link.targetSite,
					type: "site", // Add required type field
				},
			})),
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
			itemConnections,
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
