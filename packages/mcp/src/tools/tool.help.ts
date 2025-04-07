import {
	associations,
	factions,
	regions,
	npcs,
	quests,
	conflicts,
	narrative,
	world,
	foreshadowing,
	getEntity,
} from "./tools" // Added getEntity
import { logger } from ".."
import { z } from "zod"
import { zodToMCP } from "../zodToMcp"
import type { ToolDefinition } from "./utils/types" // Corrected import path

function isStringArray(value: unknown): value is string[] {
	return Array.isArray(value)
}

const handler = async (args?: Record<string, unknown>) => {
	const category = args?.category as string | undefined
	const toolName = args?.tool as string | undefined

	// Define categories *without* the old get_* tools (they were removed in previous steps)
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
		// Note: get_entity isn't strictly in a category, but could be listed under a 'general' or similar category if desired.
		// For now, it will appear in the full list and be searchable by name.
	}

	// Add get_entity separately for searching by name
	const allToolsList = [...Object.values(categories).flat(), ...getEntity.tools]

	logger.info("Categories", categories)
	logger.info("Args", args)

	if (toolName) {
		const tool = allToolsList.find((t) => t.name === toolName) // Search the combined list

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
					)}\n\n## General Tools\n- **get_entity**: ${getEntity.tools[0]?.description ?? "Get any entity by type and optional ID"} (Required: entity_type)\n\nFor category details: \`help({category: 'category_name'})\`\nFor tool details: \`help({tool: 'tool_name'})\``, // Added get_entity to general list with optional chaining
			},
		],
	}
}

// Update enum to include all categories that *have* tools
const categoryEnum = z
	.enum([
		"npcs",
		"factions",
		"regions",
		"quests",
		"associations",
		"conflicts",
		"narrative",
		"world",
		"foreshadowing",
		// Add other categories if they have tools defined
	])
	.optional()
	.describe("Optional category to filter tools")

const toolSchema = zodToMCP(
	z
		.object({
			category: categoryEnum,
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
