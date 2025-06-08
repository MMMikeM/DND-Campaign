/**
 * NPC Creation
 *
 * Provides the "create-npc-enhanced" prompt for generating detailed NPCs
 * with automatic relationship mapping, faction affiliations, and quest hook
 * suggestions based on existing campaign context.
 */

import { tables } from "@tome-master/shared"
import { and, like, or } from "drizzle-orm"
import { z } from "zod/v4"
import { db, logger } from ".."
import type { GetPromptResult, PromptDefinition } from "./types"

// Schema for enhanced NPC creation with context hints
const createNpcContextualSchema = z.object({
	name: z.string().describe("Name for the new NPC"),
	location_hint: z.string().optional().describe("Location where they're based (optional)"),
	faction_hint: z.string().optional().describe("Faction affiliation hint (optional)"),
	role_hint: z.string().optional().describe("Role in campaign (optional)"),
	occupation: z.string().optional().describe("Occupation or job (optional)"),
	alignment: z.string().optional().describe("Moral alignment tendencies (optional)"),
})

// Context gathering functions
async function gatherNPCCreationContext(args: z.infer<typeof createNpcContextualSchema>) {
	logger.info("Gathering NPC creation context", args)

	const context: any = {
		nameConflicts: [],
		existingNPCs: [],
		factions: [],
		locations: [],
		nearbyEntities: [],
		suggestedRelationships: [],
		campaignThemes: [],
	}

	try {
		// 1. Check for name conflicts
		if (args.name) {
			const nameConflicts = await db.query.npcs.findMany({
				where: like(tables.npcTables.npcs.name, `%${args.name}%`),
				columns: { id: true, name: true, occupation: true },
			})
			context.nameConflicts = nameConflicts
		}

		// 2. Get recent NPCs for relationship suggestions
		const existingNPCs = await db.query.npcs.findMany({
			columns: { id: true, name: true, occupation: true, alignment: true },
			with: {
				incomingRelationships: {
					with: {
						sourceNpc: {
							columns: { name: true, id: true },
						},
					},
				},
				outgoingRelationships: {
					with: {
						targetNpc: {
							columns: { name: true, id: true },
						},
					},
				},
				relatedFactions: {
					with: {
						faction: { columns: { name: true, id: true } },
					},
				},
			},
		})
		context.existingNPCs = existingNPCs

		// 3. Get active factions
		const factions = await db.query.factions.findMany({
			columns: { id: true, name: true, type: true, publicAlignment: true, secretAlignment: true, description: true },
			orderBy: (factions, { asc }) => [asc(factions.name)],
		})
		context.factions = factions

		// 4. Get location hierarchy
		const locations = await db.query.sites.findMany({
			columns: { id: true, name: true, type: true, description: true },
			orderBy: (sites, { asc }) => [asc(sites.name)],
		})
		context.locations = locations

		// 5. Find entities near location hint
		if (args.location_hint) {
			const nearbyNPCs = await db.query.npcs.findMany({
				where: or(
					like(tables.npcTables.npcs.name, `%${args.location_hint}%`),
					// Could also search by site associations
				),
				columns: { id: true, name: true, occupation: true },
			})

			const nearbyFactions = await db.query.factions.findMany({
				where: like(tables.factionTables.factions.name, `%${args.location_hint}%`),
				columns: { id: true, name: true, type: true },
			})

			context.nearbyEntities = {
				npcs: nearbyNPCs,
				factions: nearbyFactions,
			}
		}

		// 6. Generate relationship suggestions based on role/faction hints
		if (args.faction_hint || args.role_hint) {
			const relationshipCandidates = await db.query.npcs.findMany({
				where: and(
					args.faction_hint ? like(tables.npcTables.npcs.occupation, `%${args.faction_hint}%`) : undefined,
					args.role_hint ? like(tables.npcTables.npcs.occupation, `%${args.role_hint}%`) : undefined,
				),
				columns: { id: true, name: true, occupation: true, alignment: true },
			})

			context.suggestedRelationships = relationshipCandidates.map((npc) => ({
				targetNpc: npc,
				suggestedRelationships: ["ally", "rival", "mentor", "former_colleague", "business_partner"],
			}))
		}

		// 7. Get campaign themes from recent quests/conflicts
		const recentQuests = await db.query.quests.findMany({
			columns: { id: true, name: true, description: true },
		})

		// Note: conflicts table might not exist yet, skipping for now
		const activeConflicts: any[] = []

		context.campaignThemes = {
			recentQuests,
			activeConflicts,
		}
	} catch (error) {
		logger.error("Error gathering NPC creation context", { error })
		// Continue with partial context rather than failing
	}

	return context
}

// Handler for contextual NPC creation
const handleCreateNpcContextual = async (args: unknown): Promise<GetPromptResult> => {
	const validatedArgs = createNpcContextualSchema.parse(args)
	logger.info("Creating contextual NPC", args)

	// Automatically gather campaign context
	const context = await gatherNPCCreationContext(validatedArgs)

	// Create the context-aware prompt
	const promptText = `Create NPC: "${validatedArgs.name}"

Location hint: ${validatedArgs.location_hint || "No preference"}
Faction hint: ${validatedArgs.faction_hint || "No preference"}  
Role hint: ${validatedArgs.role_hint || "No preference"}
Occupation: ${validatedArgs.occupation || "Flexible"}
Alignment: ${validatedArgs.alignment || "Flexible"}

Generate a complete NPC including:
1. Race, class/occupation, and age
2. Physical appearance and distinctive visual traits
3. Personality traits and moral outlook
4. Speech patterns and verbal mannerisms
5. Hidden motivations, secrets, or personal goals
6. 2-3 relationship suggestions with existing NPCs (see context data)
7. Potential quest hooks or story connections
8. Specific faction affiliations (choose from existing factions in context)
9. Geographic location (choose from existing locations in context)

IMPORTANT GUIDELINES:
- Avoid name conflicts with existing NPCs (see nameConflicts in context)
- Create meaningful connections to current campaign entities
- Ensure the NPC fits naturally into the existing world
- Consider the current campaign themes and conflicts
- Suggest relationships that create interesting story potential

Use the provided campaign context to make informed decisions about factions, locations, and relationships.`

	return {
		messages: [
			{
				role: "user",
				content: {
					type: "resource",
					resource: {
						uri: `campaign://creation-context/npc-${validatedArgs.name}`,
						text: JSON.stringify(context, null, 2),
						mimeType: "application/json",
					},
				},
			},
			{
				role: "user",
				content: {
					type: "text",
					text: promptText,
				},
			},
		],
		description: `Enhanced NPC creation for: ${validatedArgs.name} with full campaign context`,
	}
}

// Export the enhanced NPC prompt definition
export const enhancedNpcPromptDefinitions = {
	"create-npc-enhanced": {
		description: "Create NPC with full campaign context and relationship suggestions",
		schema: createNpcContextualSchema,
		handler: handleCreateNpcContextual,
	},
} satisfies Record<string, PromptDefinition<z.ZodTypeAny>>

// Export the context gathering function for use in other files
export { gatherNPCCreationContext }
