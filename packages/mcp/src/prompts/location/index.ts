/**
 * Location Creation
 *
 * Provides the "create-location" prompt for generating geographic locations
 * with faction control analysis, cultural integration, and automatic connection
 * suggestions within the campaign's political landscape.
 */

import { logger } from "../.."
import {
	createPromptResult,
	createResourceMessage,
	createTextMessage,
	createTypedHandler,
	extractArgsFromZodSchema,
	type PromptDefinition,
} from "../types"
import { gatherLocationCreationContext } from "./context"
import { type EnhancedLocationCreationArgs, enhancedLocationCreationSchema } from "./types"

async function enhancedLocationCreationHandler(args: EnhancedLocationCreationArgs) {
	logger.info("Executing enhanced location creation prompt", args)

	const context = await gatherLocationCreationContext(args)

	return createPromptResult([
		createResourceMessage(
			"user",
			`campaign://creation-context/location-${args.name}`,
			JSON.stringify(context, null, 2),
			"application/json",
		),
		createTextMessage(
			"user",
			`Create Location: "${args.name}"

Type hint: ${args.type_hint || "No preference"}
Region hint: ${args.region_hint || "No preference"}
Size hint: ${args.size_hint || "No preference"}
Purpose hint: ${args.purpose_hint || "No preference"}

**Campaign Landscape Analysis:**
${JSON.stringify(context.locationAnalysis, null, 2)}

**Connection Suggestions:**
${JSON.stringify(context.connectionSuggestions, null, 2)}

${
	context.nameConflicts.length > 0
		? `
**⚠️ Name Conflicts Found:**
${context.nameConflicts.map((c) => `- ${c.name} (${c.type})`).join("\n")}
`
		: ""
}

${
	context.nearbyEntities
		? `
**Nearby Entities (Location: ${args.region_hint}):**
${JSON.stringify(context.nearbyEntities, null, 2)}
`
		: ""
}

**Campaign Themes (for thematic integration):**
${JSON.stringify(context.campaignThemes, null, 2)}

Using the comprehensive campaign context provided, generate a complete location that integrates seamlessly into the existing geographic, narrative, and political landscape:

## LOCATION FOUNDATION
- Clear site type and intended function that fills identified campaign gaps
- Specific area/region placement within established geographic hierarchy
- Physical layout optimized for tactical encounters and exploration
- Environmental details that support the campaign's themes and atmosphere

## STRATEGIC POSITIONING
- Geographic connections to existing sites via appropriate link types
- Role in regional power structures and faction influence networks
- Integration with active storylines, quest stages, and narrative arcs
- Contribution to campaign's exploration and discovery opportunities

## ENCOUNTER DESIGN
- Tactical battlemap considerations for potential combat encounters
- Interactive elements and environmental hazards that create engaging gameplay
- Hidden secrets and discovery opportunities that reward exploration
- Encounter types that balance the campaign's tactical and social elements

## NARRATIVE INTEGRATION
- Connections to ongoing conflicts, foreshadowing elements, and story arcs
- NPC associations and potential character interactions
- Historical significance and connections to items, events, or lore
- Plot hooks and story opportunities that emerge from the location's features

## REGIONAL CONTEXT
- Relationship to existing trade routes, travel patterns, and regional infrastructure
- Cultural and political significance within the broader campaign world
- Economic role and resource contributions to the regional ecosystem
- Defensive positioning and strategic value for various factions

## THEMATIC RESONANCE
- Atmospheric elements that reinforce campaign themes and player emotions
- Sensory details (sights, sounds, smells) that create immersive experiences
- Symbolic elements that connect to larger lore themes
- Mood and tone that complement the region's established atmosphere

Generate a location that not only fits the specified hints but leverages the provided context to create meaningful connections, address campaign gaps, and provide rich opportunities for player engagement across combat, exploration, and narrative dimensions.`,
		),
	])
}

// Create the prompt definition
export const locationPromptDefinitions: Record<string, PromptDefinition> = {
	"create-location": {
		description: "Create a location with full geographic context, faction control, and campaign integration",
		schema: enhancedLocationCreationSchema,
		arguments: extractArgsFromZodSchema(enhancedLocationCreationSchema),
		handler: createTypedHandler(enhancedLocationCreationSchema, enhancedLocationCreationHandler),
	},
}
