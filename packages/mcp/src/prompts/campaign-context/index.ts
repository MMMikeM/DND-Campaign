import { logger } from "../.."
import {
	getConflictContext,
	getConsequences,
	getFactionContext,
	getForehadowingContext,
	getLoreContext,
	getNpcContext,
	getQuestContext,
} from "../baseContext"
import { createPromptDefinition, type PromptDefinition } from "../types"
import { cleanObject } from "../utils"
import { type CampaignContextArgs, campaignContextSchema } from "./types"

async function campaignContextHandler(args: CampaignContextArgs) {
	logger.info(args, "Executing campaign context prompt")

	const [lore, conflicts, foreshadowing, npcs, quests, factions, consequences] = await Promise.all([
		getLoreContext(),
		getConflictContext(),
		getForehadowingContext(),
		getNpcContext(),
		getQuestContext(),
		getFactionContext(),
		getConsequences(),
	])

	const context = { lore, conflicts, foreshadowing, npcs, quests, factions, consequences }

	const cleanedContext = cleanObject(context)

	return {
		messages: [
			{
				role: "assistant" as const,
				content: {
					type: "resource" as const,
					resource: {
						uri: `campaign://context-data/full-campaign`,
						text: JSON.stringify(cleanedContext, null, 2),
						mimeType: "application/json",
					},
				},
			},
		],
	}
}

export const campaignContextPromptDefinitions: Record<string, PromptDefinition> = {
	load_campaign_context: createPromptDefinition(
		"Loads a comprehensive overview of the current campaign state into the context.",
		campaignContextSchema,
		campaignContextHandler,
	),
}
