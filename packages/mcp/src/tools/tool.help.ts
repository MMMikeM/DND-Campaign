import { search } from "fast-fuzzy"
import { z } from "zod/v4"
import { logger } from ".."
import { zodToMCP } from "../zodToMcp"
import {
	associations,
	conflicts,
	factions,
	foreshadowing,
	getEntity,
	narrative,
	npcs,
	quests,
	regions,
	world,
} from "./tools"
import type { ToolDefinition } from "./utils/types"

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

	const allToolsList = [...Object.values(categories).flat(), ...getEntity.tools]

	logger.info("Categories", categories)
	logger.info("Args", args)

	if (toolName) {
		const results = search(toolName, allToolsList, { keySelector: (t) => t.name })
		const tool = results.length > 0 ? results[0] : undefined

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

		let paramsInfo = "No parameters available."
		let requiredParams = ""
		let examples = ""

		// Handle the new structure for 'manage_*' tools
		if (tool.name.startsWith("manage_")) {
			// Define interfaces for expected JSON schema structure
			interface JsonSchemaProperty {
				const?: string
				enum?: string[]
			}
			interface JsonSchemaObject {
				properties?: {
					table?: JsonSchemaProperty
				}
			}
			interface JsonSchemaWithOneOf {
				oneOf?: JsonSchemaObject[]
			}

			// Type-safe extraction of possible table names
			let tableEnumValues: string[] = []
			const schemaWithOneOf = tool.inputSchema as JsonSchemaWithOneOf
			if (Array.isArray(schemaWithOneOf.oneOf)) {
				tableEnumValues = schemaWithOneOf.oneOf
					.map((subSchema) => {
						const tableProp = subSchema?.properties?.table
						return tableProp?.const ?? tableProp?.enum?.[0]
					})
					.filter((value): value is string => typeof value === "string")
			}
			const tableList = tableEnumValues.length > 0 ? ` (e.g., ${tableEnumValues.join(", ")})` : ""

			paramsInfo = `
- **table** (Required) (string): The specific type of entity to manage within this category${tableList}.
- **operation** (Required) (string): The operation to perform: "create", "update", or "delete".
- **id** (Optional/Required) (number): The ID of the entity. Required for "update" and "delete" operations. Omit for "create".
- **data** (Optional/Required) (object): The data for the entity. Required for "create" and "update" operations. Structure depends on the 'table' and 'operation'. Omit for "delete".
      `.trim()

			requiredParams =
				"\n\n**Required Parameters:** table, operation (plus 'id' for update/delete, 'data' for create/update)"

			examples = `
\n\n**Examples:**

Create a new entity (replace 'specific_table_name' and fields):
\`\`\`
${tool.name}({
  table: "specific_table_name",
  operation: "create",
  data: {
   
  }
})
\`\`\`

Update an existing entity (replace 'specific_table_name' and fields):
\`\`\`
${tool.name}({
  table: "specific_table_name",
  operation: "update",
  id: 123,
  data: {
   
  }
})
\`\`\`

Delete an entity (replace 'specific_table_name'):
\`\`\`
${tool.name}({
  table: "specific_table_name",
  operation: "delete",
  id: 123
})
\`\`\`
`
		} else {
			// Original logic for other tools
			paramsInfo = tool.inputSchema.properties
				? Object.entries(tool.inputSchema.properties)
						.map(([param, schema]) => {
							const required =
								isStringArray(tool.inputSchema.required) && tool.inputSchema.required.includes(param)
									? "(Required)"
									: "(Optional)"
							const schemaObject = schema as { description?: string; type?: string }
							const description = schemaObject.description || "No description provided"
							const type = schemaObject.type || "unknown"
							return `- **${param}** ${required} (${type}): ${description}`
						})
						.join("\n")
				: "No parameters available"

			requiredParams =
				isStringArray(tool.inputSchema.required) && tool.inputSchema.required.length > 0
					? `\n\n**Required Parameters:** ${tool.inputSchema.required.join(", ")}`
					: ""
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
					)}\n\n## General Tools\n- **get_entity**: ${getEntity.tools[0]?.description ?? "Get any entity by type and optional ID"} (Required: entity_type)\n\nFor category details: \`help({category: 'category_name'})\`\nFor tool details: \`help({tool: 'tool_name'})\``,
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
