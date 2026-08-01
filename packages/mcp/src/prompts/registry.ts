/**
 * Prompt Registry - Central Hub for Campaign Management Prompts
 *
 * Combines all prompt definitions into a single registry for MCP registration.
 */

import { enhancedCampaignPrompts } from "./campaign"
import { campaignContextPromptDefinitions } from "./campaign-context"
import { factionPromptDefinitions } from "./faction/index"
import { promptHelpDefinitions } from "./help"
import { locationPromptDefinitions } from "./location/index"
import { npcPromptDefinitions } from "./npc/index"
import { questPromptDefinitions } from "./quest"

// Combine all prompt definitions
export const prompts = {
	...campaignContextPromptDefinitions,
	...npcPromptDefinitions,
	...enhancedCampaignPrompts,
	...questPromptDefinitions,
	...factionPromptDefinitions,
	...locationPromptDefinitions,
	...promptHelpDefinitions,
}
