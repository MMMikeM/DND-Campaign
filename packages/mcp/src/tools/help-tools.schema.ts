import { z } from "zod/v4"
import type { Schema } from "./utils/tool.utils"

// Update enum to include all categories that *have* tools
const categoryEnum = z
	.enum([
		"conflicts",
		"context",
		"embeddings",
		"factions",
		"fuzzySearch",
		"getEntity",
		"items",
		"narrativeDestinations",
		"narrativeEvents",
		"npcs",
		"quests",
		"regions",
		"worldConcepts",
	])
	.optional()
	.describe("Optional category to filter tools")

export const schemas = {
	help: z
		.object({
			category: categoryEnum,
			tool: z.string().optional().describe("Optional specific tool name to get detailed parameter information"),
		})
		.strict()
		.describe("Get help with available tools, organized by category or detailed info about a specific tool"),
} as const satisfies Schema<"help">
