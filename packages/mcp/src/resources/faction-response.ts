import type { Resource } from "@modelcontextprotocol/sdk/types.js"
import { db, logger } from ".."
import type { ResourceDefinition, ResourceHandler, ResourceLister } from "./resource-types"
import { createJsonResource } from "./resource-utils"

const listFactionResponses: ResourceLister = async (): Promise<Resource[]> => {
	const factions = await db.query.factions.findMany({
		columns: { id: true, name: true },
		limit: 3,
	})
	return factions.map(
		(faction): Resource => ({
			uri: `campaign://faction-response/${encodeURIComponent(faction.name)}`,
			name: `${faction.name} Response Context`,
			description: `Detailed information about ${faction.name} for generating authentic responses`,
			mimeType: "application/json",
		}),
	)
}

const handleFactionResponseContext: ResourceHandler = async (uri: string) => {
	const match = uri.match(/^campaign:\/\/faction-response\/(.+)$/)
	if (!match || !match[1]) {
		throw new Error(`Invalid faction response URI: ${uri}`)
	}

	const factionName = decodeURIComponent(match[1])
	logger.info(`Gathering faction response context for: ${factionName}`)

	try {
		const faction = await db.query.factions.findFirst({
			where: (factions, { eq }) => eq(factions.name, factionName),
			with: {
				agendas: true,
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
				public_alignment: faction.publicAlignment,
				secret_alignment: faction.secretAlignment,
				public_goal: faction.publicGoal,
				secret_goal: faction.secretGoal,
				values: faction.values,
			},
			faction_culture: {
				symbols: faction.symbols,
				rituals: faction.rituals,
				taboos: faction.taboos,
			},
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

export const factionResponseResourceDefinition: ResourceDefinition = {
	uriTemplate: "campaign://faction-response/{name}",
	name: "Faction Response Context",
	description: "Detailed faction information for generating authentic responses to player actions",
	mimeType: "application/json",
	handler: handleFactionResponseContext,
	lister: listFactionResponses,
}
