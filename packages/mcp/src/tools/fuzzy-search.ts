import { sql } from "drizzle-orm"
import { z } from "zod/v4"
import { db } from ".."
import zodToMCP from "../zodToMcp"
import { createErrorResponse, createResponse } from "./tool.utils"
import type { ToolDefinition } from "./utils/types"

export const searchBySimilarity = async (
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
    ) limit 3
  `)

const searchSchema = z.object({
	searchTerm: z.string(),
})

export const fuzzySearchToolDefinitions: Record<"fuzzy_search", ToolDefinition> = {
	fuzzy_search: {
		description: "Search for entities by similarity.",
		inputSchema: zodToMCP(searchSchema),
		handler: async (args) => {
			if (!args) {
				return createErrorResponse("No arguments provided to fuzzy_search handler.")
			}
			const parseResult = searchSchema.safeParse(args)
			if (!parseResult.success) {
				return createErrorResponse("Invalid arguments provided to fuzzy_search handler.")
			}
			const { searchTerm } = parseResult.data
			const { rows } = await searchBySimilarity(searchTerm)
			return createResponse(rows)
		},
	},
}
