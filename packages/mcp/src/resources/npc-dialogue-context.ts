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
				details: true,
				factionMemberships: {
					with: { faction: { columns: { name: true, type: true } } },
				},
				outgoingRelations: {
					with: { targetNpc: { columns: { name: true, occupation: true } } },
				},
			},
		})

		if (!npc) {
			throw new Error(`NPC not found with ID: ${npcId}`)
		}

		const site = npc.siteId
			? await db.query.sites.findFirst({
					where: eq(tables.regionTables.sites.id, npc.siteId),
					columns: { name: true, intendedSiteFunction: true },
				})
			: null

		const contextData = {
			npc_profile: {
				name: npc.name,
				occupation: npc.occupation,
				alignment: npc.details?.alignment || "true neutral",
				summary: npc.summary || [],
				attitude: npc.attitude,
				voice_notes: npc.voiceNotes,
				conversation_hook: npc.conversationHook,
				quirk: npc.quirk,
				appearance: npc.appearance || [],
				roleplaying_guide: npc.roleplayingGuide || [],
				preferred_topics: npc.details?.preferredTopics || [],
				avoid_topics: npc.details?.avoidTopics || [],
				knowledge: npc.details?.knowledge || [],
				biases: npc.details?.biases || [],
				secrets_and_history: npc.details?.secretsAndHistory || [],
				goals_and_fears: npc.details?.goalsAndFears || [],
			},
			faction_affiliations: npc.factionMemberships
				? [
						{
							faction_name: npc.factionMemberships.faction?.name || "Unknown",
							faction_type: npc.factionMemberships.faction?.type || "Unknown",
							role: npc.factionMemberships.role,
							loyalty: npc.factionMemberships.loyalty,
						},
					]
				: [],
			location_context: site
				? {
						site_name: site.name,
						site_type: site.intendedSiteFunction || "location",
					}
				: null,
			relationships: npc.outgoingRelations.map((rel) => ({
				related_npc: rel.targetNpc?.name || "Unknown",
				occupation: rel.targetNpc?.occupation || "Unknown",
				relationship_type: rel.relationship,
				dynamics: rel.dynamicsAndHistory || [],
			})),
			dialogue_guidelines: {
				speech_patterns: "Use the NPC's established voice notes and conversation hooks",
				topic_sensitivity: "Respect preferred and avoided topics based on established trust",
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
