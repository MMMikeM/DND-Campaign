import { logger } from ".."
import zodToMCP from "../zodToMcp"
import { entityGetters as conflictGetters } from "./conflict-tools"
import { entityGetters as eventsGetters } from "./events-tools"
import { entityGetters as factionGetters } from "./faction-tools"
import { entityGetters as foreshadowingGetters } from "./foreshadowing-tools"
import { getEntitySchema } from "./get-entity.schema"
import { entityGetters as itemsGetters } from "./items-tools"
import { entityGetters as narrativeGetters } from "./narrative-tools"
import { entityGetters as npcGetters } from "./npc-tools"
import { entityGetters as questGetters } from "./quest-tools"
import { entityGetters as regionGetters } from "./region-tools"
import type { ToolDefinition, ToolHandler, ToolHandlerReturn } from "./utils/types"
import { entityGetters as worldbuildingGetters } from "./worldbuilding-tools"

// Note: embedding-tools do not follow the standard getter pattern

const combinedGetters = {
	...conflictGetters,
	...eventsGetters,
	...factionGetters,
	...foreshadowingGetters,
	...itemsGetters,
	...narrativeGetters,
	...npcGetters,
	...questGetters,
	...regionGetters,
	...worldbuildingGetters,
}

const formatResponse = (message: string, isError = false): ToolHandlerReturn => ({
	isError,
	content: [{ type: "text", text: message }],
})

export const getEntityHandler: ToolHandler = async (args?: Record<string, unknown>) => {
	logger.info(`Received arguments for get_entity: ${JSON.stringify(args)}`)
	const parseResult = getEntitySchema.safeParse(args)
	if (!parseResult.success) {
		logger.error(`Invalid arguments for get_entity`, { errors: parseResult.error.flatten() })
		return formatResponse(`Invalid arguments: ${parseResult.error.message}`, true)
	}

	const { entity_type, id } = parseResult.data
	let getterKey: string | undefined
	let getterArgs: unknown[] = []

	try {
		// entity_type comes in as plural snake_case (e.g., "regions") based on the schema
		let singularEntityType: string
		let attemptedKey: string

		if (id !== undefined) {
			// For _by_id lookups, we need the singular form (e.g., "region")
			// Simple approach: remove trailing 's'. Assumes standard English plurals.
			singularEntityType = entity_type.endsWith("s") ? entity_type.slice(0, -1) : entity_type
			logger.info(`Attempting to get ${singularEntityType} (from ${entity_type}) by ID: ${id}`)
			getterKey = `${singularEntityType}_by_id` // e.g., region_by_id
			getterArgs = [id]
			attemptedKey = getterKey
		} else {
			// For 'all_' lookups, use the plural form directly from input
			logger.info(`Attempting to get all ${entity_type}`)
			// Per CreateEntityGetters type, 'all_' getters use the plural form.
			getterKey = `all_${entity_type}` // e.g., all_regions
			getterArgs = []
			attemptedKey = getterKey
		}

		if (!getterKey || !(getterKey in combinedGetters)) {
			logger.warn(
				`No valid getter found for entity type: ${entity_type} (tried key based on convention: ${attemptedKey})`,
			)
			logger.warn(`Available getters: ${Object.keys(combinedGetters).join(", ")}`)
			// Return the key that was actually attempted in the error message for clarity
			return formatResponse(`Getter not found for key: ${attemptedKey}`, true)
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
		logger.error(error)
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
