import { db, logger } from ".."
import type { ResourceDefinition, ResourceHandler } from "./resource-types"
import { createJsonResource } from "./resource-utils"

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
			}),
			db.query.factions.findMany({
				columns: { id: true, name: true, type: true, publicAlignment: true, secretAlignment: true },
			}),
			db.query.regions.findMany({
				columns: { id: true, name: true, type: true },
			}),
			db.query.sites.findMany({
				columns: { id: true, name: true, type: true },
			}),
		])

		const contextData = {
			target_npc: {
				name: npcName,
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
					public_alignment: faction.publicAlignment,
					secret_alignment: faction.secretAlignment,
				})),
				available_regions: regions.map((region) => ({
					name: region.name,
					type: region.type,
				})),
				notable_sites: sites.map((site) => ({
					name: site.name,
					type: site.type,
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
		logger.error("Failed to gather NPC creation context", {
			error: error instanceof Error ? {
				name: error.name,
				message: error.message,
				stack: error.stack,
			} : error,
			npcName,
			uri,
		})
		throw new Error(`Failed to gather context for NPC: ${npcName} - ${error instanceof Error ? error.message : String(error)}`)
	}
}

export const npcCreationResourceDefinition: ResourceDefinition = {
	uriTemplate: "campaign://npc-creation/{name}",
	name: "NPC Creation Context",
	description: "Comprehensive campaign context for creating new NPCs with proper integration",
	mimeType: "application/json",
	handler: handleNpcCreationContext,
}
