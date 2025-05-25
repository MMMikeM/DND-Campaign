import { tables } from "@tome-master/shared"
import { eq } from "drizzle-orm"
import { db, logger } from ".."
import type { ResourceContent, ResourceDefinition, ResourceHandler } from "./resource-types"

// Helper function to safely stringify data
const safeStringify = (data: unknown): string => {
	try {
		return JSON.stringify(data, null, 2)
	} catch (error) {
		logger.warn("Failed to stringify data", { error })
		return String(data)
	}
}

// Helper to create JSON resource content
const createJsonResource = (uri: string, data: unknown): ResourceContent => ({
	uri,
	mimeType: "application/json",
	text: safeStringify(data),
})

// NPC Creation Context Handler
const handleNpcCreationContext: ResourceHandler = async (uri: string) => {
	const match = uri.match(/^campaign:\/\/npc-creation\/(.+)$/)
	if (!match || !match[1]) {
		throw new Error(`Invalid NPC creation URI: ${uri}`)
	}

	const npcName = decodeURIComponent(match[1])
	logger.info(`Gathering NPC creation context for: ${npcName}`)

	try {
		// Gather related campaign entities for context
		const [existingNpcs, factions, regions, sites] = await Promise.all([
			db.query.npcs.findMany({
				columns: { id: true, name: true, occupation: true, alignment: true },
				limit: 10,
			}),
			db.query.factions.findMany({
				columns: { id: true, name: true, type: true, alignment: true },
				limit: 10,
			}),
			db.query.regions.findMany({
				columns: { id: true, name: true, type: true },
				limit: 5,
			}),
			db.query.sites.findMany({
				columns: { id: true, name: true, siteType: true },
				limit: 10,
			}),
		])

		const contextData = {
			target_npc: {
				name: npcName,
				creation_timestamp: new Date().toISOString(),
			},
			campaign_context: {
				existing_npcs: existingNpcs.map((npc) => ({
					name: npc.name,
					occupation: npc.occupation,
					alignment: npc.alignment,
				})),
				active_factions: factions.map((faction) => ({
					name: faction.name,
					type: faction.type,
					alignment: faction.alignment,
				})),
				available_regions: regions.map((region) => ({
					name: region.name,
					type: region.type,
				})),
				notable_sites: sites.map((site) => ({
					name: site.name,
					type: site.siteType,
				})),
			},
			creation_guidelines: {
				integration_focus: "Ensure this NPC fits naturally into existing faction dynamics and regional politics",
				relationship_opportunities: "Consider connections to existing NPCs and factions",
				plot_relevance: "Design with potential quest hooks and story integration in mind",
			},
		}

		return [createJsonResource(uri, contextData)]
	} catch (error) {
		logger.error("Failed to gather NPC creation context", { error, npcName })
		throw new Error(`Failed to gather context for NPC: ${npcName}`)
	}
}

// Quest Creation Context Handler
const handleQuestCreationContext: ResourceHandler = async (uri: string) => {
	const match = uri.match(/^campaign:\/\/quest-creation\/(.+)$/)
	if (!match || !match[1]) {
		throw new Error(`Invalid quest creation URI: ${uri}`)
	}

	const questName = decodeURIComponent(match[1])
	logger.info(`Gathering quest creation context for: ${questName}`)

	try {
		// Gather campaign context for quest creation
		const [activeQuests, factions, conflicts, npcs] = await Promise.all([
			db.query.quests.findMany({
				columns: { id: true, name: true, type: true, urgency: true },
				limit: 10,
			}),
			db.query.factions.findMany({
				columns: { id: true, name: true, type: true, publicGoal: true },
				limit: 8,
			}),
			db.query.majorConflicts.findMany({
				columns: { id: true, name: true, nature: true, status: true },
				limit: 5,
			}),
			db.query.npcs.findMany({
				columns: { id: true, name: true, occupation: true },
				limit: 15,
			}),
		])

		const contextData = {
			target_quest: {
				name: questName,
				creation_timestamp: new Date().toISOString(),
			},
			campaign_state: {
				active_quests: activeQuests.map((quest) => ({
					name: quest.name,
					type: quest.type,
					urgency: quest.urgency,
				})),
				faction_landscape: factions.map((faction) => ({
					name: faction.name,
					type: faction.type,
					public_goal: faction.publicGoal,
				})),
				ongoing_conflicts: conflicts.map((conflict) => ({
					name: conflict.name,
					nature: conflict.nature,
					status: conflict.status,
				})),
				available_npcs: npcs.map((npc) => ({
					name: npc.name,
					occupation: npc.occupation,
				})),
			},
			design_principles: {
				narrative_integration: "Connect to existing storylines and faction dynamics",
				player_agency: "Provide multiple solution paths and meaningful choices",
				consequence_design: "Consider long-term impacts on campaign world",
			},
		}

		return [createJsonResource(uri, contextData)]
	} catch (error) {
		logger.error("Failed to gather quest creation context", { error, questName })
		throw new Error(`Failed to gather context for quest: ${questName}`)
	}
}

// Faction Response Context Handler
const handleFactionResponseContext: ResourceHandler = async (uri: string) => {
	const match = uri.match(/^campaign:\/\/faction-response\/(.+)$/)
	if (!match || !match[1]) {
		throw new Error(`Invalid faction response URI: ${uri}`)
	}

	const factionName = decodeURIComponent(match[1])
	logger.info(`Gathering faction response context for: ${factionName}`)

	try {
		// Find the specific faction
		const faction = await db.query.factions.findFirst({
			where: (factions, { eq }) => eq(factions.name, factionName),
			with: {
				agendas: true,
				culture: true,
				outgoingRelationships: {
					with: { targetFaction: { columns: { name: true, type: true } } },
				},
				incomingRelationships: {
					with: { sourceFaction: { columns: { name: true, type: true } } },
				},
			},
		})

		if (!faction) {
			throw new Error(`Faction not found: ${factionName}`)
		}

		const contextData = {
			faction_profile: {
				name: faction.name,
				type: faction.type,
				alignment: faction.alignment,
				public_goal: faction.publicGoal,
				secret_goal: faction.secretGoal,
				values: faction.values,
				resources: faction.resources,
			},
			faction_culture:
				faction.culture && faction.culture.length > 0
					? {
							symbols: faction.culture[0]?.symbols,
							rituals: faction.culture[0]?.rituals,
							taboos: faction.culture[0]?.taboos,
						}
					: null,
			active_agendas: faction.agendas.map((agenda) => ({
				name: agenda.name,
				type: agenda.agendaType,
				stage: agenda.currentStage,
				importance: agenda.importance,
				ultimate_aim: agenda.ultimateAim,
			})),
			diplomatic_relations: {
				allies: faction.outgoingRelationships
					.filter((rel) => rel.diplomaticStatus === "ally")
					.map((rel) => rel.targetFaction.name),
				enemies: faction.outgoingRelationships
					.filter((rel) => rel.diplomaticStatus === "enemy")
					.map((rel) => rel.targetFaction.name),
				rivals: faction.outgoingRelationships
					.filter((rel) => rel.diplomaticStatus === "rival")
					.map((rel) => rel.targetFaction.name),
			},
			response_guidelines: {
				decision_making: "Consider faction values, current agendas, and diplomatic relationships",
				public_vs_private: "Distinguish between public statements and private actions",
				escalation_factors: "Assess what would cause the faction to escalate or de-escalate",
			},
		}

		return [createJsonResource(uri, contextData)]
	} catch (error) {
		logger.error("Failed to gather faction response context", { error, factionName })
		throw new Error(`Failed to gather context for faction: ${factionName}`)
	}
}

// NPC Dialogue Context Handler
const handleNpcDialogueContext: ResourceHandler = async (uri: string) => {
	const match = uri.match(/^campaign:\/\/npc-dialogue-context\/(\d+)$/)
	if (!match || !match[1]) {
		throw new Error(`Invalid NPC dialogue URI: ${uri}`)
	}

	const npcId = Number.parseInt(match[1])
	logger.info(`Gathering NPC dialogue context for ID: ${npcId}`)

	try {
		const npc = await db.query.npcs.findFirst({
			where: eq(tables.npcTables.npcs.id, npcId),
			with: {
				relatedFactions: {
					with: { faction: { columns: { name: true, type: true } } },
				},
				relatedSites: {
					with: { site: { columns: { name: true, siteType: true } } },
				},
				outgoingRelationships: {
					with: { targetNpc: { columns: { name: true, occupation: true } } },
				},
			},
		})

		if (!npc) {
			throw new Error(`NPC not found with ID: ${npcId}`)
		}

		const contextData = {
			npc_profile: {
				name: npc.name,
				occupation: npc.occupation,
				alignment: npc.alignment,
				personality_traits: npc.personalityTraits,
				dialogue_style: npc.dialogue,
				voice_notes: npc.voiceNotes,
				mannerisms: npc.mannerisms,
				preferred_topics: npc.preferredTopics,
				avoid_topics: npc.avoidTopics,
				secrets: npc.secrets,
				knowledge: npc.knowledge,
				trust_level: npc.trustLevel,
				disposition: npc.disposition,
			},
			faction_affiliations: npc.relatedFactions.map((rel) => ({
				faction_name: rel.faction?.name || "Unknown",
				faction_type: rel.faction?.type || "Unknown",
				role: rel.role,
				loyalty: rel.loyalty,
			})),
			location_context: npc.relatedSites.map((rel) => ({
				site_name: rel.site?.name || "Unknown",
				site_type: rel.site?.siteType || "Unknown",
				description: rel.description,
			})),
			relationships: npc.outgoingRelationships.map((rel) => ({
				related_npc: rel.targetNpc?.name || "Unknown",
				occupation: rel.targetNpc?.occupation || "Unknown",
				relationship_type: rel.type,
				strength: rel.strength,
			})),
			dialogue_guidelines: {
				speech_patterns: "Use the NPC's established dialogue style and voice notes",
				topic_sensitivity: "Respect preferred and avoided topics based on trust level",
				faction_loyalty: "Consider faction affiliations when discussing politics or conflicts",
				secret_knowledge: "Reveal secrets only when appropriate trust is established",
			},
		}

		return [createJsonResource(uri, contextData)]
	} catch (error) {
		logger.error("Failed to gather NPC dialogue context", { error, npcId })
		throw new Error(`Failed to gather context for NPC ID: ${npcId}`)
	}
}

// Location Context Handler
const handleLocationContext: ResourceHandler = async (uri: string) => {
	const match = uri.match(/^campaign:\/\/location-context\/(.+)$/)
	if (!match || !match[1]) {
		throw new Error(`Invalid location context URI: ${uri}`)
	}

	const locationName = decodeURIComponent(match[1])
	logger.info(`Gathering location context for: ${locationName}`)

	try {
		// Try to find as site first, then region
		const [site, region] = await Promise.all([
			db.query.sites.findFirst({
				where: (sites, { eq }) => eq(sites.name, locationName),
				with: {
					area: {
						with: { region: { columns: { name: true, type: true } } },
					},
					encounters: true,
					secrets: true,
					npcs: {
						with: { npc: { columns: { name: true, occupation: true } } },
					},
				},
			}),
			db.query.regions.findFirst({
				where: (regions, { eq }) => eq(regions.name, locationName),
				with: {
					areas: {
						with: {
							sites: { columns: { name: true, siteType: true } },
						},
					},
				},
			}),
		])

		let contextData: unknown

		if (site) {
			contextData = {
				location_type: "site",
				site_details: {
					name: site.name,
					type: site.siteType,
					description: site.description,
					features: site.features,
					mood: site.mood,
					environment: site.environment,
				},
				regional_context: site.area?.region
					? {
							region_name: site.area.region.name,
							region_type: site.area.region.type,
						}
					: null,
				encounters: site.encounters.map((enc) => ({
					name: enc.name,
					type: enc.encounterType,
					difficulty: enc.difficulty,
				})),
				secrets: site.secrets.map((secret) => ({
					type: secret.secretType,
					difficulty: secret.difficultyToDiscover,
				})),
				npcs_present: site.npcs.map((rel) => ({
					name: rel.npc.name,
					occupation: rel.npc.occupation,
					description: rel.description,
				})),
			}
		} else if (region) {
			contextData = {
				location_type: "region",
				region_details: {
					name: region.name,
					type: region.type,
					description: region.description,
					danger_level: region.dangerLevel,
					economy: region.economy,
					population: region.population,
				},
				notable_sites: region.areas.flatMap((area) =>
					area.sites.map((site) => ({
						name: site.name,
						type: site.siteType,
					})),
				),
			}
		} else {
			throw new Error(`Location not found: ${locationName}`)
		}

		return [createJsonResource(uri, contextData)]
	} catch (error) {
		logger.error("Failed to gather location context", { error, locationName })
		throw new Error(`Failed to gather context for location: ${locationName}`)
	}
}

// Export resource definitions
export const campaignResourceDefinitions: Record<string, ResourceDefinition> = {
	"npc-creation": {
		uriTemplate: "campaign://npc-creation/{name}",
		name: "NPC Creation Context",
		description: "Comprehensive campaign context for creating new NPCs with proper integration",
		mimeType: "application/json",
		handler: handleNpcCreationContext,
	},
	"quest-creation": {
		uriTemplate: "campaign://quest-creation/{name}",
		name: "Quest Creation Context",
		description: "Campaign state and context for designing new quests with narrative integration",
		mimeType: "application/json",
		handler: handleQuestCreationContext,
	},
	"faction-response": {
		uriTemplate: "campaign://faction-response/{name}",
		name: "Faction Response Context",
		description: "Detailed faction information for generating authentic responses to player actions",
		mimeType: "application/json",
		handler: handleFactionResponseContext,
	},
	"npc-dialogue-context": {
		uriTemplate: "campaign://npc-dialogue-context/{id}",
		name: "NPC Dialogue Context",
		description: "Complete NPC profile and relationships for generating authentic dialogue",
		mimeType: "application/json",
		handler: handleNpcDialogueContext,
	},
	"location-context": {
		uriTemplate: "campaign://location-context/{name}",
		name: "Location Context",
		description: "Detailed information about sites and regions for scene setting and encounters",
		mimeType: "application/json",
		handler: handleLocationContext,
	},
}
