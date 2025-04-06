// npc-prompts.ts
import { z } from "zod"
import { db, logger } from ".."
import { tables } from "@tome-master/shared"
import { eq } from "drizzle-orm"
import type { PromptDefinition, PromptResult } from "./prompt-types"

// Define schemas for NPC prompt arguments
const createNpcConceptSchema = z.object({
	theme: z.string().describe("The theme or concept for this NPC (e.g., 'retired soldier', 'mysterious merchant')"),
	location: z.string().optional().describe("The location where this NPC is found"),
	alignment: z.string().optional().describe("Moral alignment tendencies (e.g., 'lawful good', 'chaotic neutral')"),
})

const createFactionNpcsSchema = z.object({
	factionId: z.number().describe("ID of the faction these NPCs belong to"),
	count: z.number().optional().default(3).describe("Number of NPCs to generate (default: 3)"),
	includeLeadership: z.boolean().optional().default(true).describe("Whether to include leadership roles"),
})

const createLocationNpcsSchema = z.object({
	locationId: z.number().describe("ID of the location these NPCs inhabit"),
	count: z.number().optional().default(3).describe("Number of NPCs to generate (default: 3)"),
})

const createLinkedNpcSchema = z.object({
	npcId: z.number().describe("ID of the NPC to link with"),
	relationshipType: z.string().describe("Type of relationship (e.g., 'ally', 'rival', 'family')"),
})

const createQuestNpcSchema = z.object({
	questId: z.number().describe("ID of the quest this NPC is involved with"),
	role: z.string().describe("Role in the quest (e.g., 'quest_giver', 'ally', 'antagonist')"),
})

// Handler for creating NPC concept
const handleCreateNpcConcept = async (args: z.infer<typeof createNpcConceptSchema>): Promise<PromptResult> => {
	logger.info("Creating NPC concept", args)

	// Base system prompt for morally complex NPCs
	const baseSystemPrompt = `You're a master character creator specializing in morally complex, flawed NPCs for a gritty fantasy campaign.

Your NPCs should have:
- Memorable personalities with contradictory motivations and self-serving instincts
- A balanced mix of strengths with significant character flaws that create moral dilemmas
- Distinctive speech patterns and mannerisms that make them instantly recognizable
- Messy connections to the world through factions, locations, and complicated relationships
- Personal vices, prejudices, or ethical blind spots that feel authentically human
- Secrets and self-interested goals that may align or clash with player objectives
- History of morally questionable decisions that continue to influence their present`

	// Create a specific prompt based on the args
	const promptText = `Create a unique NPC concept based on the theme: "${args.theme}"
${args.location ? `This NPC can be found in: ${args.location}` : ""}
${args.alignment ? `Their moral alignment tends toward: ${args.alignment}` : ""}

Provide the following details:
1. Name, race, gender, and age
2. Physical appearance and distinctive visual traits
3. Occupation and social standing
4. Core personality traits and moral outlook
5. Speech patterns and verbal mannerisms
6. Hidden motivations, secrets, or personal goals
7. Three potential story hooks involving this character`

	return {
		messages: [
			{
				role: "user",
				content: {
					type: "text",
					text: promptText,
				},
			},
		],
		description: `NPC concept based on theme: ${args.theme}`,
	}
}

// Handler for creating faction NPCs
const handleCreateFactionNpcs = async (args: z.infer<typeof createFactionNpcsSchema>): Promise<PromptResult> => {
	logger.info("Creating faction NPCs", args)

	// Fetch faction information from database
	const faction = await db.query.factions.findFirst({
		where: eq(tables.factionTables.factions.id, args.factionId),
	})

	if (!faction) {
		throw new Error(`Faction with ID ${args.factionId} not found`)
	}

	// Create a specific prompt based on the faction information
	const promptText = `Create ${args.count} unique NPCs for the "${faction.name}" faction.
Faction type: ${faction.type}
Faction alignment: ${faction.alignment}
${faction.description ? `Faction description: ${faction.description.join("\n")}` : ""}

${args.includeLeadership ? "Include at least one leadership figure." : ""}

For each NPC, provide:
1. Name, race, gender, and age
2. Role within the faction
3. Physical appearance and distinctive visual traits
4. Personality traits and moral outlook
5. Personal motivations for faction membership
6. A secret or personal goal that may sometimes conflict with faction interests`

	// Include faction data as a resource
	return {
		messages: [
			{
				role: "user",
				content: {
					type: "text",
					text: promptText,
				},
			},
			{
				role: "user",
				content: {
					type: "resource",
					resource: {
						uri: `tomekeeper://factions/${faction.id}`,
						text: JSON.stringify(faction, null, 2),
						mimeType: "application/json",
					},
				},
			},
		],
		description: `NPCs for faction: ${faction.name}`,
	}
}

// Define the NPC prompt definitions
export const npcPromptDefinitions = {
	create_npc_concept: {
		name: "create_npc_concept",
		category: "npc",
		description: "Generate a unique NPC concept for your campaign",
		schema: createNpcConceptSchema,
		handler: handleCreateNpcConcept,
	},
	create_faction_npcs: {
		name: "create_faction_npcs",
		category: "npc",
		description: "Generate NPCs associated with a specific faction",
		schema: createFactionNpcsSchema,
		handler: handleCreateFactionNpcs,
	},
	// Additional handlers would be implemented similarly
	create_location_npcs: {
		name: "create_location_npcs",
		category: "npc",
		description: "Generate NPCs for a specific location",
		schema: createLocationNpcsSchema,
		handler: async (args) => {
			// This would be fully implemented in a real scenario
			logger.info("Creating location NPCs", args)
			return { messages: [] }
		},
	},
	create_linked_npc: {
		name: "create_linked_npc",
		category: "npc",
		description: "Create an NPC with a relationship to an existing NPC",
		schema: createLinkedNpcSchema,
		handler: async (args) => {
			// This would be fully implemented in a real scenario
			logger.info("Creating linked NPC", args)
			return { messages: [] }
		},
	},
	create_quest_npc: {
		name: "create_quest_npc",
		category: "npc",
		description: "Create an NPC with a role in a specific quest",
		schema: createQuestNpcSchema,
		handler: async (args) => {
			// This would be fully implemented in a real scenario
			logger.info("Creating quest NPC", args)
			return { messages: [] }
		},
	},
} satisfies Record<string, PromptDefinition<z.ZodTypeAny>>
