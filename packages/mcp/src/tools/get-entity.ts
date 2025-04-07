import { logger } from ".."
import { getEntitySchema } from "./get-entity-schema"
import type { ToolDefinition, ToolHandler, ToolHandlerReturn } from "./utils/types"

import { entityGetters as associationGetters } from "./association-tools"
import { entityGetters as conflictGetters } from "./conflict-tools"
import { entityGetters as factionGetters } from "./faction-tools"
import { entityGetters as foreshadowingGetters } from "./foreshadowing-tools"
import { entityGetters as narrativeGetters } from "./narrative-tools"
import { entityGetters as npcGetters } from "./npc-tools"
import { entityGetters as questGetters } from "./quest-tools"
import { entityGetters as regionGetters } from "./region-tools"
import { entityGetters as worldGetters } from "./world-tools"
import zodToMCP from "../zodToMcp"
// Note: embedding-tools do not follow the standard getter pattern

const combinedGetters = {
	...associationGetters,
	...conflictGetters,
	...factionGetters,
	...foreshadowingGetters,
	...narrativeGetters,
	...npcGetters,
	...questGetters,
	...regionGetters,
	...worldGetters,
}

const formatResponse = (message: string, isError = false): ToolHandlerReturn => ({
	isError,
	content: [{ type: "text", text: message }],
})

export const getEntityHandler: ToolHandler = async (args?: Record<string, unknown>) => {
	const parseResult = getEntitySchema.safeParse(args)
	if (!parseResult.success) {
		logger.error(`Invalid arguments for get_entity`, { errors: parseResult.error.flatten() })
		return formatResponse(`Invalid arguments: ${parseResult.error.message}`, true)
	}

	const { entity_type, id } = parseResult.data
	let getterKey: string | undefined
	let getterArgs: unknown[] = []

	try {
		if (id !== undefined) {
			logger.info(`Attempting to get ${entity_type} by ID: ${id}`)
			getterKey = `${entity_type}_by_id`
			getterArgs = [id]
		} else {
			logger.info(`Attempting to get all ${entity_type}s`)
			getterKey = `all_${entity_type}`
			if (!(getterKey in combinedGetters)) {
				const pluralKey = `all_${entity_type}s`
				if (pluralKey in combinedGetters) {
					getterKey = pluralKey
				} else {
					getterKey = undefined
				}
			}
		}

		if (!getterKey || !(getterKey in combinedGetters)) {
			logger.warn(`No valid getter found for entity type: ${entity_type} (tried key: ${getterKey})`)
			return formatResponse(`Invalid entity type or getter not found: ${entity_type}`, true)
		}

		// @ts-ignore - We've checked the key exists, but TS can't infer the function signature dynamically
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const getter: (...args: any[]) => Promise<any> = combinedGetters[getterKey]

		const result = await getter(...getterArgs)

		if (id !== undefined && (result === null || result === undefined)) {
			logger.info(`${entity_type} with ID ${id} not found.`)
			return formatResponse(`${entity_type} with ID ${id} not found.`)
		}

		logger.info(`Successfully retrieved ${entity_type}${id ? ` (ID: ${id})` : "s"}`)
		return result
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error)
		logger.error(`Error fetching ${entity_type}${id ? ` by ID ${id}` : "s"} using key ${getterKey}:`, error)
		return formatResponse(
			id
				? `Error fetching ${entity_type} by ID ${id}: ${errorMessage}`
				: `Error fetching all ${entity_type}s: ${errorMessage}`,
			true,
		)
	}
}

export const getEntityToolDefinition: Record<string, ToolDefinition> = {
	get_entity: {
		description: getEntitySchema.description ?? "Get any entity by type and optional ID",
		inputSchema: zodToMCP(getEntitySchema),
		handler: getEntityHandler,
	},
}
