import { getGeminiEmbedding, tables } from "@tome-master/shared"
import { cosineDistance, eq, sql } from "drizzle-orm"
import { z } from "zod/v4"
import { db, logger } from ".."
import type { PromptDefinition, PromptResult } from "./prompt-types"

// Use existing fuzzy search infrastructure
const searchBySimilarity = async (
	searchTerm: string,
	fuzzyWeight = 1.0,
	similarityThreshold = 0.3,
	maxLevenshtein = 2,
	phoneticStrength = 2,
) =>
	await db.execute(sql`
    SELECT id, name, source_table FROM search_fuzzy_combined(
      ${searchTerm},
      ${fuzzyWeight},
      ${similarityThreshold},
      ${maxLevenshtein},
      ${phoneticStrength}
    ) limit 10
  `)

// Smart hybrid search combining fuzzy + embedding search
const fuzzySearchEntities = async (query: string, entityType?: string) => {
	const { rows } = await searchBySimilarity(query)

	// Filter by entity type if specified
	let filteredRows = rows as Array<{ id: number; name: string; source_table: string }>
	if (entityType) {
		filteredRows = filteredRows.filter((row) => row.source_table === entityType)
	}

	// Enhance with additional info for each entity type
	const enhancedResults = await Promise.all(
		filteredRows.map(async (row) => {
			try {
				switch (row.source_table) {
					case "npcs": {
						const npc = await db.query.npcs.findFirst({
							where: eq(tables.npcTables.npcs.id, row.id),
							columns: { id: true, name: true, occupation: true },
							with: {
								relatedSites: {
									with: { site: { columns: { name: true } } },
									limit: 1,
								},
							},
						})
						return npc
							? {
									...npc,
									source_table: "npcs",
									location: npc.relatedSites[0]?.site?.name || "Unknown location",
								}
							: null
					}

					case "factions": {
						const faction = await db.query.factions.findFirst({
							where: eq(tables.factionTables.factions.id, row.id),
							columns: { id: true, name: true, type: true, alignment: true },
						})
						return faction ? { ...faction, source_table: "factions" } : null
					}

					case "quests": {
						const quest = await db.query.quests.findFirst({
							where: eq(tables.questTables.quests.id, row.id),
							columns: { id: true, name: true, urgency: true, type: true },
						})
						return quest ? { ...quest, source_table: "quests" } : null
					}

					default:
						return { ...row }
				}
			} catch (error) {
				logger.warn(`Failed to enhance ${row.source_table} entity ${row.id}`, { error })
				return { ...row }
			}
		}),
	)

	return enhancedResults.filter(Boolean)
}

// Entity-specific fuzzy search functions
const fuzzySearchNPCs = async (query: string, limit = 5) => {
	return fuzzySearchEntities(query, "npcs").then((results) => results.slice(0, limit))
}

const fuzzySearchFactions = async (query: string, limit = 5) => {
	return fuzzySearchEntities(query, "factions").then((results) => results.slice(0, limit))
}

const fuzzySearchQuests = async (query: string, limit = 5) => {
	return fuzzySearchEntities(query, "quests").then((results) => results.slice(0, limit))
}

// Embedding search utilities
const embeddingSearchNPCs = async (query: string, limit = 5) => {
	try {
		// Get embedding for the search query
		const queryEmbedding = await getGeminiEmbedding(query)

		// Find NPCs with similar embeddings
		const similarNPCs = await db
			.select({
				id: tables.embeddingTables.embeddings.id,
				similarity: cosineDistance(tables.embeddingTables.embeddings.embedding, queryEmbedding),
			})
			.from(tables.embeddingTables.embeddings)
			.orderBy(cosineDistance(tables.embeddingTables.embeddings.embedding, queryEmbedding))
			.limit(limit * 2) // Get more to filter for NPCs specifically

		const embeddingIds = similarNPCs.map((r) => r.id)
		const similarityMap = new Map(similarNPCs.map((r) => [r.id, r.similarity]))

		// Find NPCs that have these embeddings
		const npcResults = await db.query.npcs.findMany({
			columns: { id: true, name: true, occupation: true, embeddingId: true },
			with: {
				relatedSites: {
					with: { site: { columns: { name: true } } },
					limit: 1,
				},
			},
			where: (npcs, { inArray }) => inArray(npcs.embeddingId, embeddingIds),
		})

		return npcResults
			.map((npc) => ({
				...npc,
				location: npc.relatedSites[0]?.site?.name || "Unknown location",
				similarity: npc.embeddingId ? similarityMap.get(npc.embeddingId) : 1,
			}))
			.sort((a, b) => Number(a.similarity || 1) - Number(b.similarity || 1))
			.slice(0, limit)
	} catch (error) {
		logger.warn("Embedding search failed, falling back to empty results", { error })
		return []
	}
}

// Hybrid smart search: fuzzy first, then embedding fallback
const smartEntitySearch = async (query: string, entityType: "npc" | "faction" | "quest", limit = 5) => {
	logger.info(`Smart search for ${entityType}: "${query}"`)

	// Step 1: Try fuzzy search first
	// biome-ignore lint/suspicious/noExplicitAny: <AI sucks>
	let fuzzyResults: any[] = []
	switch (entityType) {
		case "npc":
			fuzzyResults = await fuzzySearchNPCs(query, limit)
			break
		case "faction":
			fuzzyResults = await fuzzySearchFactions(query, limit)
			break
		case "quest":
			fuzzyResults = await fuzzySearchQuests(query, limit)
			break
	}

	if (fuzzyResults.length > 0) {
		return {
			method: "fuzzy" as const,
			results: fuzzyResults,
			query,
		}
	}

	// Step 2: Fall back to embedding search for NPCs (most common case)
	if (entityType === "npc") {
		const embeddingResults = await embeddingSearchNPCs(query, limit)
		if (embeddingResults.length > 0) {
			return {
				method: "semantic" as const,
				results: embeddingResults,
				query,
			}
		}
	}

	// No results found
	return {
		method: "none" as const,
		results: [],
		query,
	}
}

// Build comprehensive NPC context for dialogue
const buildNPCDialogueContext = async (npcId: number, playerQuery: string) => {
	// Simple basic query first to avoid schema issues
	const npcContext = await db.query.npcs.findFirst({
		where: eq(tables.npcTables.npcs.id, npcId),
		columns: {
			id: true,
			name: true,
			occupation: true,
			alignment: true,
			secrets: true,
			// Add basic properties available in NPC schema
			gender: true,
			race: true,
			trustLevel: true,
			disposition: true,
		},
	})

	if (!npcContext) {
		throw new Error(`NPC with ID ${npcId} not found`)
	}

	const contextResource = {
		npc_basic: {
			name: npcContext.name,
			occupation: npcContext.occupation,
			alignment: npcContext.alignment,
			gender: npcContext.gender,
			race: npcContext.race,
			trustLevel: npcContext.trustLevel,
			disposition: npcContext.disposition,
			secrets: Array.isArray(npcContext.secrets) ? npcContext.secrets.join(", ") : npcContext.secrets,
		},
		campaign_context: {
			player_query: playerQuery,
			interaction_context: "The player is interacting with this NPC",
		},
	}

	return [
		{
			role: "user" as const,
			content: {
				type: "resource" as const,
				resource: {
					uri: `campaign://npc-dialogue-context/${npcId}`,
					text: JSON.stringify(contextResource, null, 2),
					mimeType: "application/json",
				},
			},
		},
		{
			role: "user" as const,
			content: {
				type: "text" as const,
				text: `Player says to ${npcContext.name}: "${playerQuery}"\n\nGenerate authentic dialogue that reflects this NPC's personality, current situation, faction loyalties, and relationships. Consider their secrets and motivations when crafting the response.`,
			},
		},
	]
}

// Schema definitions
const npcDialogueSchema = z.object({
	npc_name: z.string().describe("NPC name (fuzzy search supported - partial names OK)"),
	player_query: z.string().describe("What the player says or asks the NPC"),
	emotional_state: z.string().optional().describe("NPC's current emotional state if relevant"),
})

const questAdaptationSchema = z.object({
	quest_name: z.string().describe("Quest name (fuzzy search supported)"),
	unexpected_action: z.string().describe("What unexpected action did the players take?"),
	preserve_themes: z.boolean().default(true).describe("Try to preserve the original quest themes"),
})

const factionResponseSchema = z.object({
	faction_name: z.string().describe("Faction name (fuzzy search supported)"),
	player_action: z.string().describe("What action did the players take that affects this faction?"),
	response_urgency: z.enum(["immediate", "next_session", "background"]).default("next_session"),
})

// Enhanced prompt handlers with hybrid search
const handleNPCDialogue = async (args: unknown): Promise<PromptResult> => {
	const parseResult = npcDialogueSchema.safeParse(args)
	if (!parseResult.success) {
		return {
			messages: [
				{
					role: "assistant",
					content: {
						type: "text",
						text: `❌ Invalid arguments: ${parseResult.error.message}`,
					},
				},
			],
			description: "Invalid arguments for NPC dialogue",
		}
	}

	const validatedArgs = parseResult.data
	logger.info("Generating NPC dialogue with smart search", validatedArgs)

	const searchResult = await smartEntitySearch(validatedArgs.npc_name, "npc")

	if (searchResult.results.length === 0) {
		return {
			messages: [
				{
					role: "assistant",
					content: {
						type: "text",
						text: `❌ No NPCs found matching "${validatedArgs.npc_name}". Try:\n- Different spelling or partial names (fuzzy search)\n- Descriptive terms like "corrupt noble" or "nervous blacksmith" (semantic search)\n- Character traits, occupations, or plot roles`,
					},
				},
			],
			description: `No NPC matches for "${validatedArgs.npc_name}"`,
		}
	}

	if (searchResult.results.length === 1) {
		// Perfect match - generate context-rich dialogue
		const npc = searchResult.results[0]
		const dialogueContext = await buildNPCDialogueContext(npc.id, validatedArgs.player_query)
		return {
			messages: dialogueContext,
			description: `NPC dialogue for ${npc.name} (found via ${searchResult.method} search)`,
		}
	}

	// Multiple matches - help user choose
	const matchList = searchResult.results
		.map((npc, i) => `${i + 1}. **${npc.name}** (${npc.occupation || "Unknown role"}) - ${npc.location}`)
		.join("\n")

	return {
		messages: [
			{
				role: "assistant",
				content: {
					type: "text",
					text: `🔍 Found ${searchResult.results.length} NPCs via ${searchResult.method} search for "${validatedArgs.npc_name}":\n\n${matchList}\n\n**To continue:**\n- Use the exact name from the list above\n- Or try running this prompt again with more specific details`,
				},
			},
		],
		description: `Multiple NPC matches for "${validatedArgs.npc_name}" (${searchResult.method} search)`,
	}
}

const handleQuestAdaptation = async (args: unknown): Promise<PromptResult> => {
	const parseResult = questAdaptationSchema.safeParse(args)
	if (!parseResult.success) {
		return {
			messages: [
				{
					role: "assistant",
					content: {
						type: "text",
						text: `❌ Invalid arguments: ${parseResult.error.message}`,
					},
				},
			],
			description: "Invalid arguments for quest adaptation",
		}
	}

	const validatedArgs = parseResult.data
	logger.info("Adapting quest with smart search", validatedArgs)

	const searchResult = await smartEntitySearch(validatedArgs.quest_name, "quest")

	if (searchResult.results.length === 0) {
		return {
			messages: [
				{
					role: "assistant",
					content: {
						type: "text",
						text: `❌ No quests found matching "${validatedArgs.quest_name}". Try checking active quests or using partial names.`,
					},
				},
			],
			description: `No quest matches for "${validatedArgs.quest_name}"`,
		}
	}

	if (searchResult.results.length === 1) {
		// Build quest context and adaptation guidance
		const quest = searchResult.results[0]
		// Could expand this with full quest context similar to NPC dialogue
		return {
			messages: [
				{
					role: "user",
					content: {
						type: "text",
						text: `Quest "${quest.name}" (${quest.status}) needs adaptation.\n\nUnexpected player action: "${validatedArgs.unexpected_action}"\n\nHow can I adapt this quest while ${validatedArgs.preserve_themes ? "preserving the original themes" : "allowing complete pivoting"}? Provide specific suggestions for next steps.`,
					},
				},
			],
			description: `Quest adaptation for ${quest.name} (found via ${searchResult.method} search)`,
		}
	}

	// Multiple matches
	const matchList = searchResult.results
		.map((quest, i) => `${i + 1}. **${quest.name}** (${quest.status}) - ${quest.type} quest`)
		.join("\n")

	return {
		messages: [
			{
				role: "assistant",
				content: {
					type: "text",
					text: `🔍 Found ${searchResult.results.length} quests via ${searchResult.method} search for "${validatedArgs.quest_name}":\n\n${matchList}\n\nPlease run the prompt again with the exact quest name from above.`,
				},
			},
		],
		description: `Multiple quest matches for "${validatedArgs.quest_name}" (${searchResult.method} search)`,
	}
}

// Export enhanced prompt definitions
export const enhancedCampaignPrompts = {
	generate_npc_dialogue: {
		name: "generate_npc_dialogue",
		category: "campaign",
		description: "Generate contextual NPC dialogue with full campaign awareness (supports fuzzy name search)",
		schema: npcDialogueSchema,
		handler: handleNPCDialogue,
	},
	adapt_quest_progression: {
		name: "adapt_quest_progression",
		category: "campaign",
		description: "Adapt quest progression when players take unexpected actions (supports fuzzy quest search)",
		schema: questAdaptationSchema,
		handler: handleQuestAdaptation,
	},
} satisfies Record<string, PromptDefinition<z.ZodTypeAny>>
