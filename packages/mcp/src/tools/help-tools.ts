import { createFuzzySearch, SCORES } from "ekrina"
import { z } from "zod/v4"
import { logger } from ".."
import { schemas } from "./help-tools.schema"
import type { ToolDefinition } from "./utils/types"

// There should be 2 cases for help:
// 1. No args: general help - lists the different available tools
// 2. Tool: tool help -
// - lists the tables available for the tool
// - lists the enums for the tool
// - lists the parameters for a specific tool

// The general help should be a list of the different categories, and the number of tools in each category.
// The tool help should be a list of the parameters for a specific tool.

type JsonSchemaObject = {
	properties?: Record<string, { description?: string; type?: string; enum?: string[] }>
	required?: string[]
}

const toJsonSchema = (tool: ToolDefinition): JsonSchemaObject =>
	z.toJSONSchema(tool.inputSchema, { target: "draft-7" }) as JsonSchemaObject

const formatEnumsForTool = (originalTool?: ToolDefinition): string => {
	if (!originalTool?.enums || Object.keys(originalTool.enums).length === 0) {
		return ""
	}
	const enumsText = Object.entries(originalTool.enums)
		.map(([name, values]) => `- **${name}**: \`${values.join("`, `")}\``)
		.join("\n")

	return `\n\n## Available Enums\n\n${enumsText}`
}

const formatManageToolParameters = (schema: JsonSchemaObject): string => {
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

const formatRegularToolParameters = (schema: JsonSchemaObject): string => {
	const paramsInfo = schema.properties
		? Object.entries(schema.properties)
				.map(([param, paramSchema]) => {
					const required = schema.required?.includes(param) ? "(Required)" : "(Optional)"
					const description = paramSchema.description || "No description provided"
					const type = paramSchema.type || "unknown"
					return `- **${param}** ${required} (${type}): ${description}`
				})
				.join("\n")
		: "No parameters available"

	const requiredParams = schema.required?.length ? `**Required Parameters:** \`${schema.required.join("`, `")}\`` : ""

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

const createToolHelpResponse = (toolName: string, allDefinitions: Record<string, ToolDefinition>) => {
	// Searching the entries carries the definition through with the match, so a
	// hit needs no second lookup and can't come back without its tool.
	const searchTools = createFuzzySearch(Object.entries(allDefinitions), ([name]) => name)
	const [match] = searchTools(toolName)

	// Anything scoring above CONTAINS is a fuzzy chain or a one-edit typo rescue.
	// Taking those answers a help request about one tool with a different one.
	const found = match && match.score <= SCORES.CONTAINS ? match.item : undefined

	if (!found) {
		return {
			content: [
				{
					type: "text" as const,
					text: `Tool "${toolName}" not found. Use help() to see all available tools.`,
				},
			],
		}
	}

	const [foundName, tool] = found
	const description = tool.description || "No description available"
	const enumsText = formatEnumsForTool(tool)
	const schema = toJsonSchema(tool)

	let paramsText = ""
	let examplesText = ""

	if (foundName.startsWith("manage_")) {
		paramsText = formatManageToolParameters(schema)
		examplesText = formatToolExamples(foundName)
	} else {
		paramsText = formatRegularToolParameters(schema)
	}

	const helpText = `# Tool: ${foundName}\n\n${description}\n\n${paramsText}${examplesText}${enumsText}`

	return {
		content: [{ type: "text" as const, text: helpText }],
	}
}

const createGeneralHelpResponse = (
	categories: Record<string, Record<string, ToolDefinition>>,
	generalTools: Record<string, ToolDefinition>,
) => {
	const categoriesText = Object.entries(categories)
		.map(
			([cat, tools]) =>
				`## ${cat.toUpperCase()} (${Object.keys(tools).length})\n${Object.keys(tools)
					.map((name) => `- **${name}**`)
					.join("\n")}`,
		)
		.join("\n\n")

	const generalToolsText = Object.entries(generalTools)
		.map(([name, def]) => `- **${name}**: ${def.description}`)
		.join("\n")

	const helpText = `# Available Tool Categories\n\n${categoriesText}\n\n## General Tools\n${generalToolsText}\n\nFor tool details: \`help({tool: 'tool_name'})\``

	return {
		content: [{ type: "text" as const, text: helpText }],
	}
}

const handler = async (args?: Record<string, unknown>) => {
	const toolName = args?.tool as string | undefined

	logger.info({ toolName, args }, "Help handler called")

	// Imported lazily to avoid a module cycle (tools.ts statically imports this file)
	const { allToolDefinitions, generalToolDefinitions, toolCategories } = await import("./tools")

	if (toolName) {
		return createToolHelpResponse(toolName, allToolDefinitions)
	}

	return createGeneralHelpResponse(toolCategories, generalToolDefinitions)
}

export const helpToolDefinitions: Record<string, ToolDefinition> = {
	help: {
		description: "Get help with available tools, organized by category or detailed info about a specific tool",
		inputSchema: schemas.help,
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
