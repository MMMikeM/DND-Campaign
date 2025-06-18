import { logger } from "../.."
import {
	getConflictContext,
	getFactionContext,
	getForehadowingContext,
	getLoreContext,
	getNarrativeDestsinationContext,
	getNarrativeEventContext,
	getNpcContext,
	getQuestContext,
} from "../baseContext"
import { createTypedHandler, extractArgsFromZodSchema, type PromptDefinition } from "../types"
import { cleanObject } from "../utils"
import { type CampaignContextArgs, campaignContextSchema } from "./types"

async function campaignContextHandler(args: CampaignContextArgs) {
	logger.info("Executing campaign context prompt", args)

	const [lore, narrativeDestinations, narrativeEvents, conflicts, foreshadowing, npcs] = await Promise.all([
		getLoreContext(),
		getNarrativeDestsinationContext(),
		getNarrativeEventContext(),
		getConflictContext(),
		getForehadowingContext(),
		getNpcContext(),
	])

	const questContext = await getQuestContext(args.questName)
	const factionContext = await getFactionContext(args.factionName)

	const context = {
		lore,
		narrativeDestinations,
		narrativeEvents,
		conflicts,
		foreshadowing,
		npcs,
		quests: questContext,
		factions: factionContext,
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
