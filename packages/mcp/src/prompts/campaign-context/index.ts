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
import { createTypedHandler, extractArgsFromZodSchema, type PromptDefinition } from "../types"
import { cleanObject } from "../utils"
import { type CampaignContextArgs, campaignContextSchema } from "./types"

async function campaignContextHandler(args: CampaignContextArgs) {
	logger.info("Executing campaign context prompt", args)

	const [lore, conflicts, foreshadowing, npcs, consequences] = await Promise.all([
		getLoreContext(),
		getConsequences(),
		getConflictContext(),
		getForehadowingContext(),
		getNpcContext(),
		getConsequences(),
	])

	const questContext = await getQuestContext()
	const factionContext = await getFactionContext()

	const context = {
		lore,
		conflicts,
		foreshadowing,
		npcs,
		quests: questContext,
		factions: factionContext,
		consequences,
	}

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
	load_campaign_context: {
		description: "Loads a comprehensive overview of the current campaign state into the context.",
		schema: campaignContextSchema,
		handler: createTypedHandler(campaignContextSchema, campaignContextHandler),
		arguments: extractArgsFromZodSchema(campaignContextSchema),
	},
}
