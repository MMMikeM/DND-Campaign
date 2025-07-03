import type { Tool } from "@modelcontextprotocol/sdk/types.js"
import { search } from "fast-fuzzy"
import { logger } from ".."
import zodToMCP from "../zodToMcp"
import { schemas } from "./help-tools.schema"
import { conflicts, consequences, factions, fuzzySearch, getEntity, items, lore, npcs, quests, regions } from "./tools"
import type { ToolDefinition } from "./utils/types"

// There should be 2 cases for help:
// 1. No args: general help - lists the different available tools
// 2. Tool: tool help -
// - lists the tables available for the tool
// - lists the enums for the tool
// - lists the parameters for a specific tool

// The general help should be a list of the different categories, and the number of tools in each category.
// The tool help should be a list of the parameters for a specific tool.

// Type for tools as they come from extractToolsAndHandlers
type ExtractedTool = Tool & { name: string }

const isStringArray = (value: unknown): value is string[] => Array.isArray(value)

const formatEnumsForTool = (originalTool?: ToolDefinition): string => {
	if (!originalTool?.enums || Object.keys(originalTool.enums).length === 0) {
		return ""
	}
	const enumsText = Object.entries(originalTool.enums)
		.map(([name, values]) => `- **${name}**: \`${values.join("`, `")}\``)
		.join("\n")

	return `\n\n## Available Enums\n\n${enumsText}`
}

const formatManageToolParameters = (tool: ExtractedTool): string => {
	const schema = tool.inputSchema as { properties?: { table?: { enum?: string[] } } }
	const tableEnumValues = schema.properties?.table?.enum ?? []
	const tableListItems = tableEnumValues.map((value) => `  - \`${value}\``).join("\n")
	const tableList = tableEnumValues.length > 0 ? `\n\n  Possible values:\n${tableListItems}\n` : ""

	const paramsInfo = [
		`- **table** (Required) (string): The specific type of entity to manage within this category.${tableList}`,
		'- **operation** (Required) (string): The operation to perform: "create", "update", or "delete".',
		'- **id** (Optional/Required) (number): The ID of the entity. Required for "update" and "delete" operations. Omit for "create".',
		"- **data** (Optional/Required) (object): The data for the entity. Required for \"create\" and \"update\" operations. Structure depends on the 'table' and 'operation'. Omit for 'delete'.",
	].join("\n")

	const requiredParams =
		"**Required Parameters:** `table`, `operation` (plus `id` for update/delete, `data` for create/update)"

	return `${requiredParams}\n\n## Parameters\n${paramsInfo}`
}

const formatRegularToolParameters = (tool: ExtractedTool): string => {
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
			? `**Required Parameters:** \`${tool.inputSchema.required.join("`, `")}\``
			: ""

	return `${requiredParams}\n\n## Parameters\n${paramsInfo}`
}

const formatToolExamples = (toolName: string): string => `
\n\n**Examples:**

Create a new entity (replace 'specific_table_name' and fields):
\`\`\`
${toolName}({
  table: "specific_table_name",
  operation: "create",
  data: {}
})
\`\`\`

Update an existing entity with a partial payload (acts like a PATCH, not a PUT). Only provide the fields you want to change:
\`\`\`
${toolName}({
  table: "specific_table_name",
  operation: "update",
  id: 123,
  data: {}
})
\`\`\`

Delete an entity (replace 'specific_table_name'):
\`\`\`
${toolName}({
  table: "specific_table_name",
  operation: "delete",
  id: 123
})
\`\`\`
`

const createToolHelpResponse = (
	toolName: string,
	allToolsList: ExtractedTool[],
	allDefinitions: Record<string, ToolDefinition>,
) => {
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

	const description = tool.description || "No description available"
	const originalTool = allDefinitions[tool.name]
	const enumsText = formatEnumsForTool(originalTool)

	let paramsText = ""
	let examplesText = ""

	if (tool.name.startsWith("manage_")) {
		paramsText = formatManageToolParameters(tool)
		examplesText = formatToolExamples(tool.name)
	} else {
		paramsText = formatRegularToolParameters(tool)
	}

	const helpText = `# Tool: ${tool.name}\n\n${description}\n\n${paramsText}${examplesText}${enumsText}`

	return {
		content: [{ type: "text", text: helpText }],
	}
}

const createGeneralHelpResponse = (categories: Record<string, ExtractedTool[]>) => {
	const categoriesText = Object.entries(categories)
		.map(
			([cat, tools]) => `## ${cat.toUpperCase()} (${tools.length})\n${tools.map((t) => `- **${t.name}**`).join("\n")}`,
		)
		.join("\n\n")

	const generalToolsText = `- **get_entity**: ${getEntity.tools[0]?.description ?? "Get any entity by type and optional ID"}\n- **fuzzy_search**: ${fuzzySearch.tools[0]?.description ?? "Search for entities by similarity."}`

	const helpText = `# Available Tool Categories\n\n${categoriesText}\n\n## General Tools\n${generalToolsText}\n\nFor tool details: \`help({tool: 'tool_name'})\``

	return {
		content: [{ type: "text", text: helpText }],
	}
}

const handler = async (args?: Record<string, unknown>) => {
	const toolName = args?.tool as string | undefined

	logger.info("Help handler called", { toolName, args })

	const categories = {
		conflicts: conflicts.tools,
		consequences: consequences.tools,
		factions: factions.tools,
		items: items.tools,
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
	const { consequenceToolDefinitions } = await import("./consequence-tools")
	const { fuzzySearchToolDefinitions } = await import("./utils/fuzzy-search")
	const { getEntityToolDefinition } = await import("./get-entity")

	const allDefinitions: Record<string, ToolDefinition> = {
		...npcToolDefinitions,
		...conflictToolDefinitions,
		...factionToolDefinitions,
		...itemToolDefinitions,
		...loreToolDefinitions,
		...questToolDefinitions,
		...regionToolDefinitions,
		...consequenceToolDefinitions,
		...fuzzySearchToolDefinitions,
		...getEntityToolDefinition,
		...helpToolDefinitions,
	}

	const allToolsList = [...Object.values(categories).flat(), ...getEntity.tools, ...fuzzySearch.tools]

	if (toolName) {
		return createToolHelpResponse(toolName, allToolsList, allDefinitions)
	}

	return createGeneralHelpResponse(categories)
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
