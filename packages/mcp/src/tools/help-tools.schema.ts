import { z } from "zod/v4"
import type { Schema } from "./utils/tool.utils"

export const schemas = {
	help: z
		.object({
			tool: z.string().optional().describe("Optional specific tool name to get detailed parameter information"),
		})
		.strict()
		.describe("Get help with available tools, organized by category or detailed info about a specific tool"),
} as const satisfies Schema<"help">
