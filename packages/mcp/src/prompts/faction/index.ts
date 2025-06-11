/**
 * Faction Creation
 *
 * Provides the "create-faction" prompt for generating detailed factions
 * with comprehensive political analysis, relationship mapping, territorial influence,
 * and narrative integration suggestions based on existing campaign context.
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
import { gatherFactionCreationContext } from "./context"
import { type FactionCreationArgs, factionCreationSchema } from "./types"

async function enhancedFactionCreationHandler(args: FactionCreationArgs) {
	logger.info("Executing enhanced faction creation prompt", args)

	const context = await gatherFactionCreationContext(args)

	return createPromptResult([
		createResourceMessage(
			"user",
			`campaign://creation-context/faction-${args.name}`,
			JSON.stringify(context, null, 2),
			"application/json",
		),
		createTextMessage(
			"user",
			`Create a detailed faction with the name "${args.name}" using the following context:

**Faction Creation Parameters:**
${JSON.stringify(args, null, 2)}

**Campaign Political Landscape Analysis:**
${JSON.stringify(context.politicalAnalysis, null, 2)}

**Relationship Suggestions:**
${JSON.stringify(context.relationshipSuggestions, null, 2)}

**Existing Factions (for relationship context):**
${JSON.stringify(context.existingFactions.slice(0, 10), null, 2)}

**Current Political Activities:**
- Active Agendas: ${context.existingAgendas.length}
- Diplomatic Relationships: ${context.existingDiplomacy.length}
- Territorial Influence Points: ${context.existingInfluence.length}
- Active Conflicts: ${context.activeConflicts.length}
- Narrative Arc Involvement: ${context.narrativeParticipation.length}

${
	context.nameConflicts.length > 0
		? `
**⚠️ Name Conflicts Found:**
${context.nameConflicts.map((c) => `- ${c.name} (${c.type.join(", ")})`).join("\n")}
`
		: ""
}

${
	context.nearbyEntities
		? `
**Nearby Entities (Location: ${args.location_hint}):**
${JSON.stringify(context.nearbyEntities, null, 2)}
`
		: ""
}

**World Context Links:**
${JSON.stringify(context.worldConceptLinks.slice(0, 5), null, 2)}

**Regional Control:**
${JSON.stringify(context.regionConnections.slice(0, 5), null, 2)}

**Available NPCs for Potential Membership:**
${JSON.stringify(context.potentialMembers.slice(0, 8), null, 2)}

Please create a comprehensive faction that includes:

1. **Core Identity & Values**
   - Faction name, type, and public/secret alignments
   - Core values, beliefs, and organizational culture
   - Public goals vs. hidden agendas
   - Symbols, rituals, and identifying characteristics

2. **Political Integration**
   - Relationships with existing factions (allies, enemies, neutral)
   - Position in current conflicts and narrative arcs
   - Territorial interests and influence zones
   - Diplomatic opportunities and rivalries

3. **Organizational Structure**
   - Leadership hierarchy and key figures
   - Membership requirements and recruitment methods
   - Internal politics and power dynamics
   - Resources, wealth, and capabilities

4. **Campaign Integration**
   - How this faction advances ongoing storylines
   - Quest hooks and player interaction opportunities
   - Potential conflicts and alliance opportunities
   - Long-term narrative potential

5. **Operational Details**
   - Primary activities and methods
   - Headquarters location and secondary bases
   - Communication networks and information gathering
   - Current projects and immediate goals

The faction should feel naturally integrated into the existing political landscape while offering new opportunities for player engagement and narrative development.

Generate specific, actionable content that a GM can immediately use in their campaign, including potential plot hooks, NPC suggestions for faction members, and ways this faction intersects with existing campaign elements.`,
		),
	])
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
