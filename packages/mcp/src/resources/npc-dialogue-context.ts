import type { Resource } from "@modelcontextprotocol/sdk/types.js"
import { tables } from "@tome-master/shared"
import { eq } from "drizzle-orm"
import { db, logger } from ".."
import type { ResourceDefinition, ResourceHandler, ResourceLister } from "./resource-types"
import { createJsonResource } from "./resource-utils"

const listNpcDialogueContexts: ResourceLister = async (): Promise<Resource[]> => {
	const npcs = await db.query.npcs.findMany({
		columns: { id: true, name: true },
		limit: 3,
	})
	return npcs.map(
		(npc): Resource => ({
			uri: `campaign://npc-dialogue-context/${npc.id}`,
			name: `${npc.name} Dialogue Context`,
			description: `Complete profile and relationships for ${npc.name} dialogue generation`,
			mimeType: "application/json",
		}),
	)
}

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
				siteAssociations: {
					with: { site: { columns: { name: true, type: true } } },
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
			location_context: npc.siteAssociations.map((rel) => ({
				site_name: rel.site?.name || "Unknown",
				site_type: rel.site?.type || "Unknown",
				description: rel.description,
			})),
			relationships: npc.outgoingRelationships.map((rel) => ({
				related_npc: rel.targetNpc?.name || "Unknown",
				occupation: rel.targetNpc?.occupation || "Unknown",
				relationship_type: rel.relationshipType,
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

export const npcDialogueResourceDefinition: ResourceDefinition = {
	uriTemplate: "campaign://npc-dialogue-context/{id}",
	name: "NPC Dialogue Context",
	description: "Complete NPC profile and relationships for generating authentic dialogue",
	mimeType: "application/json",
	handler: handleNpcDialogueContext,
	lister: listNpcDialogueContexts,
}
