import { z } from "zod/v4"
import type { Schema } from "./utils/tool.utils"

// Update enum to include all categories that *have* tools
const categoryEnum = z
	.enum([
		"npcs",
		"factions",
		"regions",
		"quests",
		"conflicts",
		"context",
		"embeddings",
		"events",
		"fuzzySearch",
		"getEntity",
		"items",
		"narrative",
		"worldbuilding",
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
