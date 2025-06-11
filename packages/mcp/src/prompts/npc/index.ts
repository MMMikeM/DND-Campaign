/**
 * NPC Creation
 *
 * Provides the "create-npc" prompt for generating detailed NPCs
 * with automatic relationship mapping, faction affiliations, quest hook
 * suggestions, and full campaign integration based on existing context.
 */

import { logger } from "../.."
import { createTypedHandler, extractArgsFromZodSchema, type PromptDefinition } from "../types"
import { gatherNPCCreationContext } from "./context"
import { type EnhancedNpcCreationArgs, enhancedNpcCreationSchema } from "./types"

async function enhancedNPCCreationHandler(args: EnhancedNpcCreationArgs) {
	logger.info("Executing enhanced NPC creation prompt", args)

	const context = await gatherNPCCreationContext(args)

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
			{
				role: "user" as const,
				content: {
					type: "text" as const,
					text: `Create NPC: "${args.name}"

Location hint: ${args.location_hint || "No preference"}
Faction hint: ${args.faction_hint || "No preference"}  
Role hint: ${args.role_hint || "No preference"}
Relationship hint: ${args.relationship_hint || "No preference"}
Occupation: ${args.occupation || "Flexible"}
Alignment: ${args.alignment || "Flexible"}

Using the comprehensive campaign context provided, generate a complete NPC that integrates seamlessly into the existing social, political, and narrative landscape:

## CHARACTER FOUNDATION
- Race, age, and basic physical appearance that fits the campaign world
- Occupation and social status that fills identified campaign gaps
- Moral alignment and complexity profile that balances the NPC roster
- Distinctive visual traits, mannerisms, and speech patterns for memorable roleplay

## PERSONALITY & PSYCHOLOGY
- Core personality traits, drives, and fears that create engaging interactions
- Hidden motivations, secrets, and personal goals that add narrative depth
- Adaptability, proactivity, and social dynamics that define their agency
- Player perception goal (trustworthy ally, mystery figure, comic relief, etc.)

## CAMPAIGN INTEGRATION
- Specific faction affiliations with role, rank, and loyalty level
- Current location and site associations that make narrative sense
- Relationships with existing NPCs that create interesting story potential
- Connections to active conflicts, quests, and narrative arcs

## NARRATIVE POTENTIAL
- Quest hooks and story opportunities that emerge from their background
- Foreshadowing elements they could deliver or represent
- Cultural or world concept connections that add thematic depth
- Knowledge, rumors, or secrets they possess about campaign events

## OPERATIONAL DETAILS
- Wealth level, availability, and practical considerations for GM use
- Dialogue samples and voice notes for consistent roleplay
- Preferred topics of conversation and subjects they avoid
- Current goals and how they might evolve based on campaign events

## RELATIONSHIP DYNAMICS
- Suggested relationships with existing NPCs (see relationship suggestions in context)
- How they interact with different faction members and affiliations
- Potential romantic, mentorship, rivalry, or alliance opportunities
- Social positioning within their community and broader campaign world

Generate an NPC that not only fits the specified hints but leverages the provided context to create meaningful connections, address campaign gaps, and provide rich opportunities for player interaction across social, political, and narrative dimensions.`,
				},
			},
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

export { gatherNPCCreationContext }
