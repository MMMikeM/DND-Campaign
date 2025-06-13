import { db, logger } from ".."
import type { ResourceDefinition, ResourceHandler } from "./resource-types"
import { createJsonResource } from "./resource-utils"

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
			}),
			db.query.factions.findMany({
				columns: { id: true, name: true, type: true, publicGoal: true },
			}),
			db.query.conflicts.findMany({
				columns: { id: true, name: true, natures: true, status: true },
			}),
			db.query.npcs.findMany({
				columns: { id: true, name: true, occupation: true },
			}),
		])

		const contextData = {
			target_quest: {
				name: questName,
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
					nature: conflict.natures,
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
		logger.error("Failed to gather quest creation context", {
			error:
				error instanceof Error
					? {
							name: error.name,
							message: error.message,
							stack: error.stack,
						}
					: error,
			questName,
			uri,
		})
		throw new Error(
			`Failed to gather context for quest: ${questName} - ${error instanceof Error ? error.message : String(error)}`,
		)
	}
}

export const questCreationResourceDefinition: ResourceDefinition = {
	uriTemplate: "campaign://quest-creation/{name}",
	name: "Quest Creation Context",
	description: "Campaign state and context for designing new quests with narrative integration",
	mimeType: "application/json",
	handler: handleQuestCreationContext,
}
