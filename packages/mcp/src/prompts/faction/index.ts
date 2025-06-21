/**
 * Faction Creation
 *
 * Provides the "create-faction" prompt for generating detailed factions
 * with comprehensive political analysis, relationship mapping, territorial influence,
 * and narrative integration suggestions based on existing campaign context.
 */

import { logger } from "../.."
import { createTextMessage, createTypedHandler, extractArgsFromZodSchema, type PromptDefinition } from "../types"
import { gatherFactionCreationContext } from "./context"
import { type FactionCreationArgs, factionCreationSchema } from "./types"

async function enhancedFactionCreationHandler(args: FactionCreationArgs) {
	logger.info("Executing enhanced faction creation prompt", args)

	const context = await gatherFactionCreationContext(args)

	// The new, refined prompt string
	let prompt = `
You are a master storyteller and world-builder acting as a Dungeon Master's assistant. Your primary function is to populate a detailed campaign world using a suite of specialized tools.

**Your Core Task:**
A user wants to create a new Faction. Your job is to analyze their request and the provided campaign context, and then use the available tools to create the Faction and fully integrate them into the world.

**Your Reasoning Process (Follow these steps):**

1.  **Analyze Context & Identify Opportunities:**
    *   Review the provided campaign context: existing NPCs, factions, conflicts, and lore.
    *   Pay close attention to the 'politicalAnalysis' and 'relationshipSuggestions' sections. These are your primary hints for identifying narrative gaps and potential connections.
    *   Synthesize the user's hints (name, location, type) with the contextual opportunities.

2.  **Create the Core Faction:**
    *   First, you **must** call the \`manage_faction\` tool with \`create\` on the \`faction\` table to establish the foundational entity.
    *   Use the context and hints to populate the Faction's core attributes (description, goals, etc.) thoughtfully. Ground them in the world.

3.  **Establish Connections (CRUCIAL):**
    *   A newly created Faction is isolated. Your most important follow-up task is to weave them into the campaign's fabric by creating relationships and influence.
    *   Based on the context and relationship suggestions, determine if the new Faction should have diplomatic ties, members, or territorial influence.
    *   For **each** necessary connection, you **must** make a separate tool call if data is available:
`
	if (context.factions?.length) {
		prompt += `
    *   Available factions: ${context.factions
			?.map((faction) => {
				return `\`
        Faction: \`${faction.name}\` (Id: \`${faction.id}\`)
        `
			})
			.join(", ")}
  `
	}

	if (context.npcs?.length) {
		prompt += `
    *   Available NPCs for membership: ${context.npcs?.map((npc) => npc.name).join(", ")}
  `
	}

	if (context.sites?.length) {
		prompt += `
    *   Available sites for HQs/influence: ${context.sites?.map((site) => site.name).join(", ")}
  `
	}

	prompt += `
4.  **Create Optional Connections:**
    *   \`manage_faction\` on the \`faction_agenda\` table to define goals.
    *   \`manage_faction\` on the \`faction_diplomacy\` table to set relations.
    *   \`manage_faction\` on the \`faction_influence\` table to claim territory.
    *   \`manage_faction\` on the \`faction_member\` table to add NPCs.
    *   \`manage_conflict\` on the \`conflict_participant\` table.
    *   \`manage_narrative_destination\` on the \`narrative_destination_participant\` table.
  `

	return {
		messages: [
			{
				role: "user" as const,
				content: {
					type: "resource" as const,
					resource: {
						uri: `campaign://creation-context/faction-${args.name}`,
						text: JSON.stringify(context, null, 2),
						mimeType: "application/json",
					},
				},
			},
			createTextMessage("user", prompt),
		],
	}
}

// Create the prompt definition
export const factionPromptDefinitions: Record<string, PromptDefinition> = {
	"create-faction": {
		description:
			"Create a detailed faction with comprehensive political analysis, relationship mapping, and campaign integration suggestions",
		schema: factionCreationSchema,
		handler: createTypedHandler(factionCreationSchema, enhancedFactionCreationHandler),
		arguments: extractArgsFromZodSchema(factionCreationSchema),
	},
}
