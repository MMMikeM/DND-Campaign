import { db, logger } from "../.."
import { analyzePoliticalLandscape } from "./analysis"
import { generateFactionRelationshipSuggestions } from "./suggestions"
import type { FactionCreationArgs, NearbyEntities } from "./types"

export async function gatherFactionCreationContext(args: FactionCreationArgs) {
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

		// Get existing faction agendas to understand current political landscape
		const existingAgendas = await db.query.factionAgendas.findMany({
			with: {
				faction: { columns: { id: true, name: true } },
			},
			columns: {
				id: true,
				name: true,
				agendaType: true,
				currentStage: true,
				importance: true,
				ultimateAim: true,
				description: true,
			},
		})

		// Get faction influence mapping to understand territorial control
		const existingInfluence = await db.query.factionInfluence.findMany({
			with: {
				faction: { columns: { id: true, name: true } },
				region: { columns: { id: true, name: true } },
				area: { columns: { id: true, name: true } },
				site: { columns: { id: true, name: true } },
			},
			columns: {
				id: true,
				influenceLevel: true,
				presenceTypes: true,
				priorities: true,
			},
		})

		// Get existing diplomatic relationships
		const existingDiplomacy = await db.query.factionDiplomacy.findMany({
			with: {
				sourceFaction: { columns: { id: true, name: true } },
				targetFaction: { columns: { id: true, name: true } },
			},
			columns: {
				id: true,
				strength: true,
				diplomaticStatus: true,
				description: true,
			},
		})

		// Get narrative arc participation
		const narrativeParticipation = await db.query.narrativeDestinationParticipants.findMany({
			where: (dpi, { isNotNull }) => isNotNull(dpi.factionId),
			with: {
				faction: { columns: { id: true, name: true } },
				narrativeDestination: { columns: { id: true, name: true, type: true, status: true } },
			},
			columns: {
				id: true,
				roleInArc: true,
				arcImportance: true,
				involvementDetails: true,
			},
		})

		// Get quest involvement context
		const questParticipation = await db.query.questParticipants.findMany({
			where: (qpi, { isNotNull }) => isNotNull(qpi.factionId),
			with: {
				faction: { columns: { id: true, name: true } },
				quest: { columns: { id: true, name: true, type: true } },
			},
			columns: {
				id: true,
				roleInQuest: true,
				importanceInQuest: true,
				involvementDetails: true,
			},
		})

		// Get world concept connections
		const worldConceptLinks = await db.query.worldConceptLinks.findMany({
			where: (wcl, { isNotNull }) => isNotNull(wcl.factionId),
			with: {
				linkedFaction: { columns: { id: true, name: true } },
				worldConcept: { columns: { id: true, name: true, conceptType: true, status: true } },
			},
			columns: {
				id: true,
				linkRoleOrTypeText: true,
				linkStrength: true,
				linkDetailsText: true,
			},
		})

		// Get regional control and travel routes
		const regionConnections = await db.query.regionConnections.findMany({
			with: {
				sourceRegion: { columns: { id: true, name: true } },
				targetRegion: { columns: { id: true, name: true } },
			},
			columns: {
				id: true,
				connectionType: true,
				routeType: true,
				travelDifficulty: true,
				travelTime: true,
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
				alignment: true,
			},
		})

		// Get nearby entities if location hint provided
		let nearbyEntities: NearbyEntities | null = null

		if (args.location_hint) {
			const relatedSites = await db.query.sites.findMany({
				where: (sites, { like }) => like(sites.name, `%${args.location_hint}%`),
				with: {
					area: {
						columns: { id: true, name: true },
						with: { region: { columns: { id: true, name: true } } },
					},
				},
				columns: {
					id: true,
					name: true,
					type: true,
				},
			})

			const relatedNPCs = await db.query.npcSiteAssociations.findMany({
				where:
					relatedSites.length > 0
						? (npcSiteAssociations, { inArray }) =>
								inArray(
									npcSiteAssociations.siteId,
									relatedSites.map((s) => s.id),
								)
						: undefined,
				with: {
					npc: { columns: { id: true, name: true, occupation: true } },
					site: { columns: { id: true, name: true, type: true } },
				},
			})

			const relatedFactions = await db.query.factionInfluence.findMany({
				where:
					relatedSites.length > 0
						? (factionInfluence, { inArray }) =>
								inArray(
									factionInfluence.siteId,
									relatedSites.map((s) => s.id),
								)
						: undefined,
				with: {
					faction: { columns: { id: true, name: true, type: true, publicAlignment: true, secretAlignment: true } },
				},
				columns: {
					id: true,
					influenceLevel: true,
					presenceTypes: true,
				},
			})

			nearbyEntities = {
				sites: relatedSites.map((site) => ({
					id: site.id,
					name: site.name,
					type: site.type,
				})),
				npcs: relatedNPCs.map((npcSite) => ({
					id: npcSite.npc.id,
					name: npcSite.npc.name,
					type: npcSite.npc.occupation,
					npcs: [], // We don't need nested NPC data here
				})),
				factions: relatedFactions.map((influence) => ({
					id: influence.faction.id,
					name: influence.faction.name,
					type: influence.faction.type,
					publicAlignment: influence.faction.publicAlignment,
					secretAlignment: influence.faction.secretAlignment,
				})),
				influence: relatedFactions.map((influence) => ({
					id: influence.id,
					influenceLevel: influence.influenceLevel,
					presenceTypes: influence.presenceTypes,
					faction: { id: influence.faction.id, name: influence.faction.name },
				})),
			}
		}

		// Get active conflicts for political analysis
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

		// Analyze political landscape for faction positioning opportunities
		const politicalAnalysis = analyzePoliticalLandscape({
			existingFactions,
			existingAgendas,
			existingDiplomacy,
			activeConflicts,
			narrativeParticipation,
		})

		// Generate relationship suggestions
		const relationshipSuggestions = generateFactionRelationshipSuggestions(args, existingFactions)

		return {
			args,
			nameConflicts,
			existingFactions,
			existingAgendas,
			existingInfluence,
			existingDiplomacy,
			narrativeParticipation,
			questParticipation,
			worldConceptLinks,
			regionConnections,
			sites,
			potentialMembers,
			nearbyEntities,
			activeConflicts,
			politicalAnalysis,
			relationshipSuggestions,
		}
	} catch (error) {
		logger.error("Error gathering faction creation context:", error)
		throw error
	}
}
