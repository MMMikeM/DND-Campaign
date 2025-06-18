import { db, logger } from "../.."
import {
	getConflictContext,
	getFactionContext,
	getLocationContext,
	getLoreContext,
	getNpcContext,
	getQuestContext,
} from "../baseContext"
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

		// Use base context functions for shared queries
		const [
			existingFactions,
			locationContext,
			loreLinks,
			activeConflicts,
			questParticipation,
			narrativeDestinations,
			potentialMembers,
		] = await Promise.all([
			getFactionContext(args.name), // This will get all factions if no name provided
			getLocationContext(args.location_hint),
			getLoreContext(),
			getConflictContext(),
			getQuestContext(),
			// Get narrative destinations for arc participation context
			db.query.narrativeDestinations.findMany({
				with: {
					participantInvolvement: {
						where: (pi, { isNotNull }) => isNotNull(pi.factionId),
						with: {
							faction: { columns: { id: true, name: true } },
						},
						columns: {
							id: true,
							narrativeRole: true,
							importance: true,
							involvementDetails: true,
						},
					},
				},
				columns: { id: true, name: true, type: true, status: true },
			}),
			getNpcContext(), // Get all NPCs for potential faction members
		])

		// Get faction-specific data that's not in base context functions
		const [existingAgendas, existingInfluence, existingDiplomacy] = await Promise.all([
			// Get existing faction agendas to understand current political landscape
			db.query.factionAgendas.findMany({
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
			}),

			// Get faction influence mapping to understand territorial control
			db.query.factionInfluence.findMany({
				with: {
					faction: { columns: { id: true, name: true } },
					relatedArea: { columns: { id: true, name: true } },
					relatedRegionConnection: { columns: { id: true, name: true } },
					relatedRegion: { columns: { id: true, name: true } },
					relatedSite: { columns: { id: true, name: true } },
				},
				columns: {
					id: true,
					influenceLevel: true,
					presenceTypes: true,
					priorities: true,
				},
			}),

			// Get existing diplomatic relationships
			db.query.factionDiplomacy.findMany({
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
			}),
		])

		// Transform narrative participation data to match expected format
		const narrativeParticipation = narrativeDestinations.flatMap((dest) =>
			dest.participantInvolvement.map((involvement) => ({
				id: involvement.id,
				narrativeRole: involvement.narrativeRole,
				importance: involvement.importance,
				involvementDetails: involvement.involvementDetails,
				faction: involvement.faction,
				narrativeDestination: {
					id: dest.id,
					name: dest.name,
					type: dest.type,
					status: dest.status,
				},
			})),
		)

		// Extract quest participation from quest context
		const questParticipationData = questParticipation
			.flatMap((quest) =>
				quest.participants.map((participant) => ({
					id: participant.id,
					roleInQuest: participant.roleInQuest,
					importanceInQuest: participant.importanceInQuest,
					involvementDetails: participant.involvementDetails,
					faction: participant.npc ? null : { id: Number(quest.id), name: quest.name }, // This needs proper faction data
					quest: { id: Number(quest.id), name: quest.name, type: quest.type },
				})),
			)
			.filter((p) => p.faction) // Only keep faction participants

		// Get nearby entities if location hint provided - leverage location context
		let nearbyEntities: NearbyEntities | null = null
		if (args.location_hint && locationContext) {
			const relatedFactions = await db.query.factionInfluence.findMany({
				where:
					locationContext.sites.length > 0
						? (factionInfluence, { inArray, eq, and }) =>
								and(
									eq(factionInfluence.relatedEntityType, "site"),
									inArray(
										factionInfluence.relatedEntityId,
										locationContext.sites.map((s) => s.id),
									),
								)
						: undefined,
				with: {
					faction: { columns: { id: true, name: true, type: true, publicAlignment: true, secretAlignment: true } },
					relatedSite: { columns: { id: true, name: true } },
				},
				columns: {
					id: true,
					influenceLevel: true,
					presenceTypes: true,
				},
			})

			nearbyEntities = {
				sites: locationContext.sites.map((site) => ({
					id: site.id,
					name: site.name,
					type: site.type,
				})),
				npcs: locationContext.sites.flatMap((site) =>
					site.npcAssociations.map((assoc) => ({
						id: assoc.npc.id,
						name: assoc.npc.name,
						type: "Unknown", // Site associations don't have occupation
						npcs: [], // We don't need nested NPC data here
					})),
				),
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

		// Get region connections for territorial analysis
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

		// Transform existing factions to match expected format for analysis
		const existingFactionsForAnalysis = existingFactions.map((faction) => ({
			id: faction.id,
			name: faction.name,
			type: faction.type as readonly string[],
			publicAlignment: faction.publicAlignment,
			secretAlignment: faction.secretAlignment,
			description: faction.description,
			primaryHqSite: faction.primaryHqSite
				? { area: { id: faction.primaryHqSite.id, name: faction.primaryHqSite.name } }
				: null,
		}))

		// Transform conflicts to match expected format for analysis - now with complete data from base context
		const transformedConflicts = activeConflicts.map((conflict) => ({
			id: conflict.id,
			name: conflict.name,
			description: Array.isArray(conflict.description) ? conflict.description : [conflict.description || ""],
			moralDilemma: conflict.moralDilemma,
			stakes: Array.isArray(conflict.stakes) ? conflict.stakes : [conflict.stakes || ""],
			participants: conflict.participants,
		}))

		// Analyze political landscape for faction positioning opportunities
		const politicalAnalysis = analyzePoliticalLandscape({
			existingFactions: existingFactionsForAnalysis,
			existingAgendas,
			existingDiplomacy,
			activeConflicts: transformedConflicts,
			narrativeParticipation,
		})

		// Generate relationship suggestions
		const relationshipSuggestions = generateFactionRelationshipSuggestions(args, existingFactionsForAnalysis)

		return {
			args,
			nameConflicts,
			existingFactions,
			existingAgendas,
			existingInfluence,
			existingDiplomacy,
			narrativeParticipation,
			questParticipation: questParticipationData,
			loreLinks: loreLinks,
			regionConnections,
			sites: locationContext?.sites || [],
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
