import { z } from "zod/v4"
import { searchEntities } from "./search"
import { createErrorResponse, createResponse } from "./tool.utils"
import type { ToolDefinition } from "./types"

const searchSchema = z.object({
	searchTerm: z.string(),
})

export const fuzzySearchToolDefinitions: Record<"fuzzy_search", ToolDefinition> = {
	fuzzy_search: {
		description: "Search for entities by similarity.",
		inputSchema: searchSchema,
		handler: async (args) => {
			if (!args) {
				return createErrorResponse("No arguments provided to fuzzy_search handler.")
			}
			const parseResult = searchSchema.safeParse(args)
			if (!parseResult.success) {
				return createErrorResponse("Invalid arguments provided to fuzzy_search handler.")
			}
			const { searchTerm } = parseResult.data
			return createResponse((await searchEntities(searchTerm, 3)) as any)
		},
		annotations: {
			title: "Fuzzy Search",
			readOnlyHint: true,
			destructiveHint: false,
			idempotentHint: true,
			openWorldHint: false,
		},
	},
}
