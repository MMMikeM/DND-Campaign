import type { Tool } from "@modelcontextprotocol/sdk/types.js"
import { search } from "fast-fuzzy"
import { logger } from ".."
import zodToMCP from "../zodToMcp"
import { schemas } from "./help-tools.schema"
import {
	conflicts,
	factions,
	fuzzySearch,
	getEntity,
	items,
	lore,
	narrativeDestinations,
	narrativeEvents,
	npcs,
	quests,
	regions,
} from "./tools"
import type { ToolDefinition } from "./utils/types"

// Type for tools as they come from extractToolsAndHandlers
type ExtractedTool = Tool & { name: string }

function isStringArray(value: unknown): value is string[] {
	return Array.isArray(value)
}

function getToolInfo(tool: ExtractedTool, originalDefinitions: Record<string, ToolDefinition>) {
	let paramsInfo = "No parameters available."
	let requiredParams = ""
	let examples = ""
	let enumsText = ""

	// Get the original tool definition to access enums
	const originalTool = originalDefinitions[tool.name]
	logger.info("Getting tool info", { toolName: tool.name, hasOriginal: !!originalTool })

	// Handle enums first (for all tools)
	if (originalTool?.enums && Object.keys(originalTool.enums).length > 0) {
		enumsText = `\n\n## Available Enums\n\n${Object.entries(originalTool.enums)
			.map(([name, values]) => `- **${name}**: [${values.join(", ")}]`)
			.join("\n")}`
		logger.info("Found enums for tool", { toolName: tool.name, enumCount: Object.keys(originalTool.enums).length })
	}

	// Handle the new structure for 'manage_*' tools
	if (tool.name.startsWith("manage_")) {
		logger.info("Processing manage tool", { toolName: tool.name })
		const manageToolInfo = getManageToolInfo(tool)
		paramsInfo = manageToolInfo.paramsInfo
		requiredParams = manageToolInfo.requiredParams
		examples = manageToolInfo.examples
	} else {
		logger.info("Processing regular tool", { toolName: tool.name })
		const regularToolInfo = getRegularToolInfo(tool)
		paramsInfo = regularToolInfo.paramsInfo
		requiredParams = regularToolInfo.requiredParams
	}

	return { paramsInfo, requiredParams, examples, enumsText }
}

function getManageToolInfo(tool: ExtractedTool) {
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

	logger.info("Extracted table enum values for manage tool", { toolName: tool.name, tableEnumValues })

	const paramsInfo = `
- **table** (Required) (string): The specific type of entity to manage within this category${tableList}.
- **operation** (Required) (string): The operation to perform: "create", "update", or "delete".
- **id** (Optional/Required) (number): The ID of the entity. Required for "update" and "delete" operations. Omit for "create".
- **data** (Optional/Required) (object): The data for the entity. Required for "create" and "update" operations. Structure depends on the 'table' and 'operation'. Omit for "delete".
      `.trim()

	const requiredParams =
		"\n\n**Required Parameters:** table, operation (plus 'id' for update/delete, 'data' for create/update)"

	const examples = `
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

	return { paramsInfo, requiredParams, examples }
}

function getRegularToolInfo(tool: ExtractedTool) {
	const paramsInfo = tool.inputSchema.properties
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

	const requiredParams =
		isStringArray(tool.inputSchema.required) && tool.inputSchema.required.length > 0
			? `\n\n**Required Parameters:** ${tool.inputSchema.required.join(", ")}`
			: ""

	return { paramsInfo, requiredParams, examples: "" }
}

function handleToolSpecificHelp(
	toolName: string,
	allToolsList: ExtractedTool[],
	allDefinitions: Record<string, ToolDefinition>,
) {
	logger.info("Handling tool-specific help", { toolName })

	const results = search(toolName, allToolsList, { keySelector: (t) => t.name })
	const tool = results.length > 0 ? results[0] : undefined

	if (!tool) {
		logger.info("Tool not found", { toolName })
		return {
			content: [
				{
					type: "text",
					text: `Tool "${toolName}" not found. Use help() to see all available tools.`,
				},
			],
		}
	}

	logger.info("Found tool, getting info", { toolName: tool.name })
	const { paramsInfo, requiredParams, examples, enumsText } = getToolInfo(tool, allDefinitions)

	const description = tool.description || "No description available"

	return {
		content: [
			{
				type: "text",
				text: `# Tool: ${tool.name}\n\n${description}${requiredParams}\n\n## Parameters\n${paramsInfo}${examples}${enumsText}`,
			},
		],
	}
}

function handleCategorySpecificHelp(category: string, categories: Record<string, ExtractedTool[]>) {
	logger.info("Handling category-specific help", { category })

	const categoryTools = categories[category]
	if (!categoryTools) {
		logger.error("Category not found", { category, availableCategories: Object.keys(categories) })
		return {
			content: [
				{
					type: "text",
					text: `Category "${category}" not found. Available categories: ${Object.keys(categories).join(", ")}`,
				},
			],
		}
	}

	return {
		content: [
			{
				type: "text",
				text: `# ${category.toUpperCase()} Tools\n\n${categoryTools
					.map((t) => {
						// Add required parameters to the description - safely
						const requiredParams =
							isStringArray(t.inputSchema.required) && t.inputSchema.required.length > 0
								? ` (Required params: ${t.inputSchema.required.join(", ")})`
								: ""
						const description = t.description || "No description available"
						return `- **${t.name}**: ${description}${requiredParams}`
					})
					.join("\n")}\n\nFor detailed parameter info on a specific tool, use \`help({tool: 'tool_name'})\``,
			},
		],
	}
}

function handleGeneralHelp(categories: Record<string, ExtractedTool[]>) {
	logger.info("Handling general help")

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
									const description = t.description || "No description available"
									return `- **${t.name}**: ${description}${requiredParams}`
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

const handler = async (args?: Record<string, unknown>) => {
	const category = args?.category as string | undefined
	const toolName = args?.tool as string | undefined

	logger.info("Help handler called", { category, toolName, args })

	const categories = {
		conflicts: conflicts.tools,
		narrativeEvents: narrativeEvents.tools,
		factions: factions.tools,
		fuzzySearch: fuzzySearch.tools,
		getEntity: getEntity.tools,
		items: items.tools,
		narrativeDestinations: narrativeDestinations.tools,
		npcs: npcs.tools,
		quests: quests.tools,
		regions: regions.tools,
		lore: lore.tools,
	}

	// Import the original definitions to access enums and other metadata
	const { npcToolDefinitions } = await import("./npc-tools")
	const { conflictToolDefinitions } = await import("./conflict-tools")
	const { factionToolDefinitions } = await import("./faction-tools")
	const { itemToolDefinitions } = await import("./items-tools")
	const { loreToolDefinitions } = await import("./lore-tools")
	const { questToolDefinitions } = await import("./quest-tools")
	const { regionToolDefinitions } = await import("./region-tools")
	const { narrativeDestinationToolDefinitions } = await import("./narrative-destination-tools")
	const { narrativeEventToolDefinitions } = await import("./narrative-events-tools")
	const { fuzzySearchToolDefinitions } = await import("./utils/fuzzy-search")
	const { getEntityToolDefinition } = await import("./get-entity")

	const allDefinitions = {
		...npcToolDefinitions,
		...conflictToolDefinitions,
		...factionToolDefinitions,
		...itemToolDefinitions,
		...loreToolDefinitions,
		...questToolDefinitions,
		...regionToolDefinitions,
		...narrativeDestinationToolDefinitions,
		...narrativeEventToolDefinitions,
		...fuzzySearchToolDefinitions,
		...getEntityToolDefinition,
		...helpToolDefinitions,
	}

	const allToolsList = [...Object.values(categories).flat(), ...getEntity.tools]

	logger.info("Help categories and tools", {
		categoriesLength: Object.keys(categories).length,
		allToolsLength: allToolsList.length,
		definitionsLength: Object.keys(allDefinitions).length,
	})

	if (toolName) {
		return handleToolSpecificHelp(toolName, allToolsList, allDefinitions)
	}

	if (category && category in categories) {
		return handleCategorySpecificHelp(category, categories)
	}

	return handleGeneralHelp(categories)
}

export const helpToolDefinitions: Record<string, ToolDefinition> = {
	help: {
		description: "Get help with available tools, organized by category or detailed info about a specific tool",
		inputSchema: zodToMCP(schemas.help),
		handler,
		annotations: {
			title: "Help",
			readOnlyHint: true,
			destructiveHint: false,
			idempotentHint: true,
			openWorldHint: false,
		},
	},
}
