import { associations, factions, regions, npcs, quests, conflicts, narrative, world, foreshadowing } from "./tools"
import { logger } from ".."
import { z } from "zod"
import { zodToMCP } from "../zodToMcp"
import { ToolDefinition } from "./tool.utils"

function isStringArray(value: unknown): value is string[] {
	return Array.isArray(value)
}

const handler = async (args?: Record<string, unknown>) => {
	const category = args?.category as string | undefined
	const toolName = args?.tool as string | undefined

	const categories = {
		npcs: npcs.tools,
		factions: factions.tools,
		regions: regions.tools,
		quests: quests.tools,
		associations: associations.tools,
		conflicts: conflicts.tools,
		narrative: narrative.tools,
		world: world.tools,
		foreshadowing: foreshadowing.tools,
	}

	logger.info("Categories", categories)
	logger.info("Args", args)

	if (toolName) {
		const allToolsFlat = Object.values(categories).flat()
		const tool = allToolsFlat.find((t) => t.name === toolName)

		if (!tool) {
			return {
				content: [
					{
						type: "text",
						text: `Tool "${toolName}" not found. Use help() to see all available tools.`,
					},
				],
			}
		}

		// Get parameter descriptions in a readable format
		const paramsInfo = tool.inputSchema.properties
			? Object.entries(tool.inputSchema.properties)
					.map(([param, schema]) => {
						// Safely check if required array contains this parameter
						const required =
							isStringArray(tool.inputSchema.required) && tool.inputSchema.required.includes(param)
								? "(Required)"
								: "(Optional)"

						// Safely access description field
						const schemaObject = schema as { description?: string; type?: string }
						const description = schemaObject.description || "No description provided"
						const type = schemaObject.type || "unknown"

						return `- **${param}** ${required} (${type}): ${description}`
					})
					.join("\n")
			: "No parameters available"

		// List required parameters separately for clarity - with type safety
		const requiredParams =
			isStringArray(tool.inputSchema.required) && tool.inputSchema.required.length > 0
				? `\n\n**Required Parameters:** ${tool.inputSchema.required.join(", ")}`
				: ""

		// Examples section for common operations
		let examples = ""
		if (tool.name.startsWith("manage_") || tool.name.startsWith("create_") || tool.name.startsWith("update_")) {
			examples = `
\n\n**Examples:**

Create new:
\`\`\`
${tool.name}({
  // required fields without id
})
\`\`\`

Update existing:
\`\`\`
${tool.name}({
  id: "existing-id",
  // fields to update
})
\`\`\`

Delete:
\`\`\`
${tool.name}({
  id: "existing-id"
})
\`\`\`
`
		}

		return {
			content: [
				{
					type: "text",
					text: `# Tool: ${tool.name}\n\n${tool.description}${requiredParams}\n\n## Parameters\n${paramsInfo}${examples}`,
				},
			],
		}
	}

	// If category specified, return just that category
	if (category && category in categories) {
		return {
			content: [
				{
					type: "text",
					text: `# ${category.toUpperCase()} Tools\n\n${categories[category as keyof typeof categories]
						.map((t) => {
							// Add required parameters to the description - safely
							const requiredParams =
								isStringArray(t.inputSchema.required) && t.inputSchema.required.length > 0
									? ` (Required params: ${t.inputSchema.required.join(", ")})`
									: ""
							return `- **${t.name}**: ${t.description}${requiredParams}`
						})
						.join("\n")}\n\nFor detailed parameter info on a specific tool, use \`help({tool: 'tool_name'})\``,
				},
			],
		}
	}

	// Otherwise return all categories with improved info
	return {
		content: [
			{
				type: "text",
				text: `# Available Tool Categories\n\n${Object.entries(categories)
					.map(
						([cat, tools]) =>
							`## ${cat.toUpperCase()} (${tools.length})\n${tools
								.map((t) => {
									// Add required parameter info to the description - safely
									const requiredParams =
										isStringArray(t.inputSchema.required) && t.inputSchema.required.length > 0
											? ` (Required: ${t.inputSchema.required.join(", ")})`
											: ""
									return `- **${t.name}**: ${t.description}${requiredParams}`
								})
								.join("\n")}`,
					)
					.join(
						"\n\n",
					)}\n\nFor category details: \`help({category: 'category_name'})\`\nFor tool details: \`help({tool: 'tool_name'})\``,
			},
		],
	}
}

const toolSchema = zodToMCP(
	z
		.object({
			category: z
				.enum(["npcs", "factions", "regions", "quests", "associations"])
				.optional()
				.describe("Optional category to filter tools"),
			tool: z.string().optional().describe("Optional specific tool name to get detailed parameter information"),
		})
		.strict()
		.describe("Get help with available tools, organized by category or detailed info about a specific tool"),
)

export const helpToolDefinitions: Record<string, ToolDefinition> = {
	help: {
		description: "Get help with available tools, organized by category or detailed info about a specific tool",
		inputSchema: toolSchema,
		handler,
	},
}
