/**
 * NPC Creation
 *
 * Provides the "create-npc" prompt for generating detailed NPCs
 * with automatic relationship mapping, faction affiliations, quest hook
 * suggestions, and full campaign integration based on existing context.
 */

import { logger } from "../.."
import { createTextMessage, createTypedHandler, extractArgsFromZodSchema, type PromptDefinition } from "../types"
import { getBaseNPCContext } from "./context"
import { type EnhancedNpcCreationArgs, enhancedNpcCreationSchema } from "./types"

async function enhancedNPCCreationHandler(args: EnhancedNpcCreationArgs) {
	logger.info("Executing enhanced NPC creation prompt", args)

	const context = await getBaseNPCContext(args)

	// The new, refined prompt string
	let prompt = `
You are a master storyteller and world-builder acting as a Dungeon Master's assistant. Your primary function is to populate a detailed campaign world using a suite of specialized tools.

**Your Core Task:**
A user wants to create a new Non-Player Character (NPC). Your job is to analyze their request and the provided campaign context, and then use the available tools to create the NPC and fully integrate them into the world.

**Your Reasoning Process (Follow these steps):**

1.  **Analyze Context & Identify Opportunities:**
    *   Review the provided campaign context: existing NPCs, factions, conflicts, and lore.
    *   Pay close attention to the 'campaignAnalysis' and 'relationshipSuggestions' sections. These are your primary hints for identifying narrative gaps and potential connections.
    *   Synthesize the user's hints (name, location, role) with the contextual opportunities.

2.  **Create the Core NPC:**
    *   First, you **must** call the \`manage_npc\` tool with \`create\` on the \`npc\` table to establish the foundational character.
    *   Use the context and hints to populate the NPC's core attributes (description, personality, goals, etc.) thoughtfully. Ground them in the world.

3.  **Establish Connections (CRUCIAL):**
    *   A newly created NPC is isolated. Your most important follow-up task is to weave them into the campaign's fabric by creating relationships.
    *   Based on the context and relationship suggestions, determine if the new NPC should have affiliations with factions, relationships with other NPCs, or associations with specific locations.
    *   For **each** necessary connection, you **must** make a separate tool call if data is available:
`

	if (context.factions?.length) {
		prompt += `
    *   Available factions: ${context.factions
			?.map((faction) => {
				return `\`
        Faction: \`${faction.name}\` (Id: \`${faction.id}\`)
        Headquarters: \`${faction.primaryHqSite?.name}\` (Id: \`${faction.primaryHqSite?.id}\`)
        Agendas: ${faction.agendas
					.map(
						(agenda) => `
          Description: \`${agenda.description}\`
          Current Stage: \`${agenda.currentStage}\`
          Importance: \`${agenda.importance}\`
        `,
					)
					.join(", ")}
        Influence: ${faction.influence
					.map(
						(influence) => `
          Level: \`${influence.influenceLevel}\`
          ${influence.site ? `Site: \`${influence.site?.name}\` (Id: \`${influence.site?.id}\`)` : ""}
          ${influence.area ? `Area: \`${influence.area?.name}\` (Id: \`${influence.area?.id}\`)` : ""}
          ${influence.region ? `Region: \`${influence.region?.name}\` (Id: \`${influence.region?.id}\`)` : ""}
          ${influence.regionConnection ? `Region Connection: \`${influence.regionConnection?.name}\` (Id: \`${influence.regionConnection?.id}\`)` : ""}
        `,
					)
					.join(", ")}
        Members: ${faction.members.length}
            ${faction.members
							.map((member) => {
								return `\`
              ${member.npc.name}\` (Id: \`${member.npc.id}\`)
              Role: \`${member.role}\`
              `
							})
							.join(", ")}
        `
			})
			.join(", ")}
  `
	}

	if (context.npcs?.length) {
		prompt += `
    *   Available NPCs: ${context.npcs?.map((npc) => npc.name).join(", ")}
  `
	}

	if (context.sites?.length) {
		prompt += `
    *   Available sites: ${context.sites?.map((site) => site.name).join(", ")}
  `
	}

	prompt += `
4.  **Create Optional Connections:**
    *   \`manage_conflict\` on the \`conflict_participant\` table
    *   \`manage_narrative_event\` on the \`narrative_event_consequence\` table
    *   \`manage_foreshadowing\` on the \`foreshadowing\` table
    *   \`manage_item\` on the \`item_relation\` table
    *   \`manage_narrative_destination\` on the \`narrative_destination_participant\` table
    *   \`manage_quest\` on the \`quest_hook\` table
    *   \`manage_quest\` on the \`quest_stage_delivery\` table
    *   \`manage_stage\` on the \`stage_involvement\` table
    *   \`manage_lore\` on the \`lore_link\` table
  `

	return {
		messages: [
			{
				role: "user" as const,
				content: {
					type: "resource" as const,
					resource: {
						uri: `campaign://creation-context/npc-${args.name}`,
						text: JSON.stringify(context, null, 2),
						mimeType: "application/json",
					},
				},
			},
			createTextMessage("user", prompt),
		],
	}
}

export const npcPromptDefinitions: Record<string, PromptDefinition> = {
	create_npc: {
		description: "Create NPC with comprehensive campaign context, relationship mapping, and narrative integration",
		schema: enhancedNpcCreationSchema,
		handler: createTypedHandler(enhancedNpcCreationSchema, enhancedNPCCreationHandler),
		arguments: extractArgsFromZodSchema(enhancedNpcCreationSchema),
	},
}

export { getBaseNPCContext as gatherNPCCreationContext }
