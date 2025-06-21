/**
 * Quest Creation
 *
 * Provides the "create-quest" prompt for generating complex adventures
 * with multi-stage development, faction involvement analysis, and automatic
 * integration with existing storylines and campaign conflicts.
 */

import { logger } from "../.."
import type { PromptDefinition } from "../types"
import { createTypedHandler, extractArgsFromZodSchema } from "../types"
import { gatherQuestCreationContext } from "./context"
import { type QuestCreationArgs, questCreationSchema } from "./types"

async function enhancedQuestCreationHandler(args: QuestCreationArgs) {
	logger.info("Executing enhanced quest creation prompt", args)

	try {
		const context = await gatherQuestCreationContext(args)

		return {
			messages: [
				{
					role: "user" as const,
					content: {
						type: "resource" as const,
						resource: {
							uri: `campaign://creation-context/quest-${args.name}`,
							text: JSON.stringify(context, null, 2),
							mimeType: "application/json",
						},
					},
				},
				{
					role: "user" as const,
					content: {
						type: "text" as const,
						text: `Create Quest: "${args.name}"

Type hint: ${args.type_hint || "No preference"}
Level hint: ${args.level_hint || "No preference"}
Location hint: ${args.location_hint || "No preference"}
Faction hint: ${args.faction_hint || "No preference"}
Theme hint: ${args.theme_hint || "No preference"}

Using the comprehensive campaign context provided, generate a complete quest that integrates seamlessly into the existing narrative, political, and social landscape:

## QUEST FOUNDATION
- Clear quest objectives and success conditions that align with campaign themes
- Quest giver motivation and background (reference existing NPCs and factions)
- Primary hook that draws players into the adventure naturally
- Initial setup that establishes stakes and urgency appropriately

## QUEST STRUCTURE
- Detailed quest stages with specific locations, challenges, and decision points
- Multiple solution paths that accommodate different party approaches and skills
- Integration points with existing locations, leveraging their established characteristics
- Pacing considerations that balance investigation, action, and roleplay opportunities

## CAMPAIGN INTEGRATION
- Key NPCs involved (allies, enemies, neutrals) with clear roles and motivations
- Faction relationships and political implications that affect ongoing storylines
- Direct connections to active conflicts and how quest outcomes influence them
- References to existing quests (sequels, parallels, or prerequisites) for narrative continuity

## NARRATIVE DEPTH
- Potential complications and alternative solutions that create meaningful choices
- Moral dilemmas or ethical considerations that challenge player assumptions
- Secrets or hidden elements that enhance discovery and investigation
- Character development opportunities for individual party members

## CONSEQUENCES & REWARDS
- Immediate rewards (treasure, information, political gains, relationships)
- Long-term consequences that affect world state and future opportunities
- Failure states and how they impact the campaign rather than ending progression
- Hooks for future adventures and story development emerging from quest resolution

## OPERATIONAL DETAILS
- Estimated session count and pacing recommendations for GM planning
- Key locations with tactical considerations and atmospheric descriptions
- Important dialogue samples and roleplay guidance for major NPCs
- Contingency plans for common player approaches or unexpected solutions

Ensure the quest feels naturally embedded in the campaign world, creates meaningful consequences regardless of outcome, and provides rich opportunities for player agency and character development while advancing the broader narrative themes.`,
					},
				},
			],
		}
	} catch (error) {
		logger.error("Error in enhanced quest creation handler:", {
			error:
				error instanceof Error
					? {
							name: error.name,
							message: error.message,
							stack: error.stack,
						}
					: error,
			questArgs: args,
		})
		throw error
	}
}

export const questPromptDefinitions: Record<string, PromptDefinition> = {
	"create-quest": {
		description: "Create a quest with full campaign context, NPC integration, and narrative consequences",
		schema: questCreationSchema,
		handler: createTypedHandler(questCreationSchema, enhancedQuestCreationHandler),
		arguments: extractArgsFromZodSchema(questCreationSchema),
	},
}

export { gatherQuestCreationContext }
