import { tables } from "@tome-master/shared"
import { isNotNull, like } from "drizzle-orm"
import { db, logger } from "../.."
import { analyzeCampaignContext } from "./analysis"
import { generateNPCCreationSuggestions } from "./suggestions"
import type { EnhancedNpcCreationArgs, RegionalContext } from "./types"

export async function gatherNPCCreationContext(args: EnhancedNpcCreationArgs) {
	logger.info("Gathering enhanced NPC creation context", args)

	try {
		// Check for name conflicts
		const nameConflicts = await db.query.npcs.findMany({
			where: like(tables.npcTables.npcs.name, `%${args.name}%`),
			columns: { id: true, name: true, occupation: true, alignment: true },
		})

		// Get existing NPCs with their faction affiliations and site associations
		const existingNPCs = await db.query.npcs.findMany({
			with: {
				factionMemberships: {
					with: {
						faction: { columns: { id: true, name: true } },
					},
					columns: { role: true, loyalty: true },
				},
				siteAssociations: {
					with: {
						site: { columns: { id: true, name: true } },
					},
					columns: { associationType: true, isCurrent: true },
				},
			},
			columns: {
				id: true,
				name: true,
				occupation: true,
				alignment: true,
				complexityProfile: true,
				playerPerceptionGoal: true,
			},
		})

		// Get factions with their basic information and agendas
		const factions = await db.query.factions.findMany({
			with: {
				agendas: {
					columns: { currentStage: true, importance: true },
				},
				influence: {
					with: {
						faction: { columns: { id: true, name: true } },
						site: { columns: { id: true, name: true } },
						area: { columns: { id: true, name: true } },
						region: { columns: { id: true, name: true } },
					},
					columns: { influenceLevel: true },
				},
			},
			columns: { id: true, name: true, type: true },
		})

		// Get locations (sites) with NPCs and their context
		const locations = await db.query.sites.findMany({
			with: {
				npcAssociations: {
					with: {
						npc: { columns: { id: true, name: true, occupation: true } },
					},
					columns: { associationType: true, isCurrent: true },
				},
				secrets: {
					columns: { secretType: true, difficultyToDiscover: true },
				},
				encounters: {
					columns: { name: true, encounterCategory: true },
				},
				area: {
					columns: { id: true, name: true },
					with: { region: { columns: { id: true, name: true } } },
				},
			},
			columns: {
				id: true,
				name: true,
				description: true,
				type: true,
				intendedSiteFunction: true,
				mood: true,
				environment: true,
			},
		})

		// Get major conflicts with participants
		const activeConflicts = await db.query.conflicts.findMany({
			with: {
				participants: {
					with: {
						npc: { columns: { id: true, name: true } },
						faction: { columns: { id: true, name: true } },
					},
					columns: { role: true, motivation: true },
				},
			},
			columns: { id: true, name: true, status: true, moralDilemma: true },
		})

		// Get quests with participant involvement
		const quests = await db.query.quests.findMany({
			with: {
				participants: {
					with: {
						npc: { columns: { id: true } },
					},
					columns: { roleInQuest: true, involvementDetails: true, importanceInQuest: true },
				},
			},
			columns: { id: true, name: true, type: true, urgency: true, visibility: true },
		})

		// Get narrative arcs with participant involvement
		const narrativeArcs = await db.query.narrativeDestinations.findMany({
			with: {
				participantInvolvement: {
					with: {
						npc: { columns: { id: true } },
					},
					columns: { roleInArc: true, involvementDetails: true, arcImportance: true },
				},
			},
			columns: { id: true, name: true, type: true, status: true },
		})

		// Get world concepts with their links to other entities
		const worldConcepts = await db.query.worldConcepts.findMany({
			with: {
				links: {
					columns: {
						regionId: true,
						factionId: true,
						npcId: true,
						linkStrength: true,
						linkRoleOrTypeText: true,
					},
				},
			},
			columns: {
				id: true,
				name: true,
				conceptType: true,
				summary: true,
			},
		})

		// Get foreshadowing seeds for story integration
		const foreshadowingSeeds = await db.query.foreshadowing.findMany({
			where: (fs, { or }) => or(isNotNull(fs.sourceNpcId), isNotNull(fs.targetNpcId)),
			with: {
				sourceNpc: { columns: { id: true, name: true } },
				targetNpc: { columns: { id: true, name: true } },
			},
			columns: {
				id: true,
				targetEntityType: true,
				subtlety: true,
				narrativeWeight: true,
				description: true,
			},
		})

		// Get regional context if location hint provided
		let regionalContext: RegionalContext | null = null

		if (args.location_hint) {
			const matchedLocations = locations.filter(
				(location) =>
					location.name.toLowerCase().includes(args.location_hint?.toLowerCase() || "") ||
					location.area?.name.toLowerCase().includes(args.location_hint?.toLowerCase() || "") ||
					location.area?.region?.name.toLowerCase().includes(args.location_hint?.toLowerCase() || ""),
			)

			if (matchedLocations.length > 0) {
				const locationIds = matchedLocations.map((l) => l.id)
				const areaIds = matchedLocations.map((l) => l.area?.id).filter(Boolean) as number[]
				const regionIds = matchedLocations.map((l) => l.area?.region?.id).filter(Boolean) as number[]

				// Get NPCs in these locations
				const regionalNPCs = existingNPCs.filter((npc) =>
					npc.siteAssociations.some((site) => locationIds.includes(site.site?.id || 0)),
				)

				// Get factions with influence in these areas
				const regionalFactions = factions.filter((faction) =>
					faction.influence.some(
						(inf) =>
							(inf.site && locationIds.includes(inf.site.id)) ||
							(inf.area && areaIds.includes(inf.area.id)) ||
							(inf.region && regionIds.includes(inf.region.id)),
					),
				)

				// Get cultural concepts relevant to the region
				const culturalInfluences = worldConcepts.filter(
					(concept) =>
						concept.conceptType === "cultural" ||
						concept.conceptType === "cultural_group" ||
						concept.links.some((link) => link.regionId && regionIds.includes(link.regionId)),
				)

				regionalContext = {
					matchedLocations: matchedLocations.map((loc) => ({
						id: loc.id,
						name: loc.name,
						type: loc.type,
						area: loc.area
							? {
									id: loc.area.id,
									name: loc.area.name,
									region: loc.area.region
										? {
												id: loc.area.region.id,
												name: loc.area.region.name,
											}
										: undefined,
								}
							: undefined,
					})),
					regionalNPCs: regionalNPCs.map((npc) => ({
						id: npc.id,
						name: npc.name,
						occupation: npc.occupation,
						alignment: npc.alignment,
						relatedFactions: npc.factionMemberships.map((nf) => ({
							faction: { name: nf.faction.name },
							role: nf.role,
						})),
					})),
					regionalFactions: regionalFactions.map((f) => ({
						id: f.id,
						name: f.name,
						type: f.type,
					})),
					culturalInfluences: culturalInfluences.map((concept) => ({
						id: concept.id,
						name: concept.name,
						conceptType: concept.conceptType,
						summary: concept.summary,
						links: concept.links,
					})),
				}
			}
		}

		// Analyze campaign landscape for NPC positioning opportunities
		const campaignAnalysis = analyzeCampaignContext(
			existingNPCs.map((npc) => ({
				id: npc.id,
				complexityProfile: npc.complexityProfile,
				playerPerceptionGoal: npc.playerPerceptionGoal,
				relatedFactions: npc.factionMemberships,
			})),
			factions,
			activeConflicts,
			quests,
			narrativeArcs,
		)

		// Generate targeted relationship suggestions
		const relationshipSuggestions = generateNPCCreationSuggestions({
			args,
			existingNPCs: existingNPCs.map((npc) => ({
				id: npc.id,
				name: npc.name,
				occupation: npc.occupation,
				alignment: npc.alignment,
				relatedFactions: npc.factionMemberships.map((nf) => ({
					faction: { name: nf.faction.name },
					role: nf.role,
				})),
			})),
			factions: factions.map((f) => ({
				id: f.id,
				name: f.name,
				type: f.type,
			})),
			regionalContext,
			campaignAnalysis,
		})

		const context = {
			nameConflicts,
			existingNPCs,
			factions,
			locations,
			activeConflicts,
			quests,
			narrativeArcs,
			worldConcepts,
			foreshadowingSeeds,
			regionalContext,
			campaignAnalysis,
			relationshipSuggestions,
		}

		logger.info("NPC context gathered successfully", {
			nameConflicts: nameConflicts.length,
			existingNPCs: existingNPCs.length,
			factions: factions.length,
			locations: locations.length,
			activeConflicts: activeConflicts.length,
			quests: quests.length,
			narrativeArcs: narrativeArcs.length,
			worldConcepts: worldConcepts.length,
			foreshadowingSeeds: foreshadowingSeeds.length,
			hasRegionalContext: !!regionalContext,
		})

		return context
	} catch (error) {
		logger.error("Error gathering NPC creation context:", {
			error:
				error instanceof Error
					? {
							name: error.name,
							message: error.message,
							stack: error.stack,
						}
					: error,
			npcArgs: args,
		})
		throw new Error(
			`Failed to gather NPC creation context for "${args.name}": ${error instanceof Error ? error.message : String(error)}`,
		)
	}
}
