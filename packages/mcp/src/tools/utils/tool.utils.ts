import { eq } from "drizzle-orm"
import { z } from "zod/v4"
import { db, logger } from "../../index"
import type { baseTableWithId, ToolHandler, ToolHandlerReturn } from "./types"

export type CreateTableNames<T> = ReadonlyArray<keyof Omit<T, "enums">>
export type Schema<T extends string> = Record<T, z.ZodObject>

export const id = z.coerce.number()
export const optionalId = z.coerce.number().optional()
export const list = z.array(z.string()).min(1).max(5)

// Re-export from schema.ts to avoid circular dependencies
export { createManageSchema } from "./schema"

// --- Polymorphic Entity Validation Types ---

export interface PolymorphicField {
	typeField: string
	idField: string
	allowedTypes: Record<string, baseTableWithId>
}

export interface PolymorphicValidationConfig {
	[key: string]: PolymorphicField[]
}

// --- Polymorphic Configuration Helper ---

export function createPolymorphicConfig(tableMapping: Record<string, baseTableWithId>) {
	return {
		createField: (typeField: string, idField: string, allowedEntityTypes: string[]): PolymorphicField => ({
			typeField,
			idField,
			allowedTypes: Object.fromEntries(
				allowedEntityTypes
					.map((entityType) => {
						const table = tableMapping[entityType]
						return table ? [entityType, table] : null
					})
					.filter(Boolean) as [string, baseTableWithId][],
			),
		}),

		forTable: (tableName: string, fields: PolymorphicField[]): PolymorphicValidationConfig => ({
			[tableName]: fields,
		}),
	}
}

// Enhanced polymorphic helper with automatic enum-to-table mapping
export function createEnhancedPolymorphicConfig(tablesCollection: Record<string, Record<string, unknown>>) {
	// Extract all table objects, excluding enums
	const allTables: Record<string, baseTableWithId> = {}

	Object.values(tablesCollection).forEach((tableGroup) => {
		if (tableGroup && typeof tableGroup === "object" && tableGroup !== null) {
			Object.entries(tableGroup).forEach(([key, value]) => {
				// More specific check for Drizzle tables: they should have getSQL method and Symbol.toStringTag
				if (
					key !== "enums" &&
					value &&
					typeof value === "object" &&
					value !== null &&
					!Array.isArray(value) &&
					"getSQL" in value &&
					typeof value.getSQL === "function"
				) {
					allTables[key] = value as baseTableWithId
				}
			})
		}
	})

	// Common enum-to-table name mappings
	const enumToTableMap: Record<string, string> = {
		quest: "quests",
		npc: "npcs",
		narrative_event: "narrativeEvents",
		conflict: "conflicts",
		item: "items",
		narrative_destination: "narrativeDestinations",
		lore: "lore",
		faction: "factions",
		site: "sites",
		quest_stage: "questStages",
		region: "regions",
		area: "areas",
		// For faction influence table
		region_connection: "regionConnections", // This is the exclusion case
	}

	return {
		fromEnums: (
			tableName: string,
			relations: Array<{
				typeField: string
				idField: string
				enumValues: readonly string[]
				exclude?: string[]
			}>,
		): PolymorphicValidationConfig => {
			const polymorphicFields = relations.map(({ typeField, idField, enumValues, exclude = [] }) => {
				const allowedTypes: Record<string, baseTableWithId> = {}

				enumValues
					.filter((value) => !exclude.includes(value))
					.forEach((enumValue) => {
						const tableName = enumToTableMap[enumValue] || enumValue
						const table = allTables[tableName]
						if (table) {
							// Store the mapping from enum value to table
							allowedTypes[enumValue] = table
						}
					})

				return {
					typeField,
					idField,
					allowedTypes,
				}
			})

			return { [tableName]: polymorphicFields }
		},
	}
}

// --- Response Helpers ---

export const createErrorResponse = (message: string): ToolHandlerReturn => {
	logger.error(message)
	return {
		isError: true,
		content: [{ type: "text", text: message }],
	}
}

export const createResponse = (message: string): ToolHandlerReturn => ({
	content: [{ type: "text", text: message }],
})

// --- Polymorphic Entity Validation ---

async function validatePolymorphicRelations(
	data: object,
	tableName: string,
	polymorphicConfig?: PolymorphicValidationConfig,
): Promise<string | null> {
	if (!polymorphicConfig || !polymorphicConfig[tableName]) {
		return null
	}

	// Cast to Record for safe access to properties
	const dataRecord = data as Record<string, unknown>
	const polymorphicFields = polymorphicConfig[tableName]

	for (const field of polymorphicFields) {
		const entityType = dataRecord[field.typeField] as string | undefined
		const entityId = dataRecord[field.idField] as number | undefined

		// Skip validation if both are null/undefined (optional polymorphic relation)
		if (!entityType && !entityId) {
			continue
		}

		// Both must be provided if one is provided
		if (!entityType || !entityId) {
			return `Both ${field.typeField} and ${field.idField} must be provided together`
		}

		// Check if entity type is allowed
		const targetTable = field.allowedTypes[entityType]
		if (!targetTable) {
			const allowedTypes = Object.keys(field.allowedTypes).join(", ")
			return `Invalid ${field.typeField} '${entityType}'. Allowed types: ${allowedTypes}`
		}

		// Validate that the entity exists
		try {
			const existingEntity = await db
				.select({ id: targetTable.id })
				.from(targetTable)
				.where(eq(targetTable.id, entityId))
				.limit(1)

			if (existingEntity.length === 0) {
				return `${entityType} with ID ${entityId} does not exist`
			}
		} catch (error) {
			logger.error(`Error validating polymorphic relation: ${error}`)
			return `Failed to validate ${entityType} with ID ${entityId}`
		}
	}

	return null
}

export function createManageEntityHandler<TS extends Schema<TK[number]>, TK extends readonly [string, ...string[]]>(
	categoryToolName: string,
	tables: Record<TK[number], baseTableWithId>,
	tableEnum: TK,
	schemas: TS,
	polymorphicConfig?: PolymorphicValidationConfig,
): ToolHandler {
	return async (args?: Record<string, unknown>): Promise<ToolHandlerReturn> => {
		logger.info(`Creating manage entity handler for ${categoryToolName} with args ${JSON.stringify(args)}`)
		if (!args) {
			logger.error(`No arguments provided to ${categoryToolName} handler.`)
			return createErrorResponse(`Arguments provided to ${categoryToolName} are malformed`)
		}

		const tableName = z.enum(tableEnum).safeParse(args?.table)

		if (!tableName.success) {
			return createErrorResponse(`Invalid table name '${args?.table}' provided to ${categoryToolName} handler.`)
		}

		const table = tables[tableName.data]

		const operation = z.enum(["create", "update", "delete"]).safeParse(args?.operation)

		if (!operation.success) {
			return createErrorResponse(`Invalid operation '${args?.operation}' provided to ${categoryToolName} handler.`)
		}

		if (operation.data === "delete") {
			const deleteId = z.coerce.number().safeParse(args?.id)

			if (!deleteId.success) {
				return createErrorResponse(`Invalid id '${args?.id}' provided to ${categoryToolName} handler.`)
			}
			logger.info(`Deleting ${tableName.data} (via ${categoryToolName}) with id ${deleteId.data}`)
			const result = await db.delete(table).where(eq(table.id, deleteId.data)).returning({ deletedId: table.id })
			return createResponse(
				result.length > 0
					? `Successfully deleted ${tableName.data} with ID: ${deleteId.data}`
					: `No ${tableName.data} found with ID: ${deleteId.data}`,
			)
		}

		if (operation.data === "create") {
			// Handle string data by attempting to parse as JSON first
			let dataToValidate = args?.data
			if (typeof args?.data === "string") {
				try {
					dataToValidate = JSON.parse(args.data)
				} catch (error: unknown) {
					logger.error(`Error parsing JSON data: ${error}`)
					return createErrorResponse(`Invalid JSON data provided to ${categoryToolName} handler.`)
				}
			}

			const parsedData = schemas[tableName.data].safeParse(dataToValidate)

			if (!parsedData.success) {
				// Use Zod's built-in error formatting for better error messages
				const prettyError = z.prettifyError(parsedData.error)
				return createErrorResponse(`Validation failed for ${tableName.data}:\n${prettyError}`)
			}

			const createData = parsedData.data

			// Validate polymorphic relations
			const polymorphicError = await validatePolymorphicRelations(createData, tableName.data, polymorphicConfig)
			if (polymorphicError) {
				return createErrorResponse(`Relation validation failed: ${polymorphicError}`)
			}

			try {
				logger.info(`Creating ${tableName.data} (via ${categoryToolName}) with data ${JSON.stringify(createData)}`)
				const [result] = await db.insert(table).values(createData).returning({ successfullyCreated: table.id })

				// Get the entity name from the created data if available
				const entityName = createData?.name || tableName.data
				return createResponse(`Successfully created new ${entityName} with ID: ${result?.successfullyCreated}`)
			} catch (error) {
				logger.error(`Database error creating ${tableName.data}: ${error}`)
				return createErrorResponse(`Database error: Failed to create ${tableName.data}`)
			}
		}

		if (operation.data === "update") {
			// Handle string data by attempting to parse as JSON first
			let dataToValidate = args?.data
			if (typeof args?.data === "string") {
				try {
					dataToValidate = JSON.parse(args.data)
				} catch (error: unknown) {
					logger.error(`Error parsing JSON data: ${error}`)
					return createErrorResponse(`Invalid JSON data provided to ${categoryToolName} handler.`)
				}
			}

			const parsedData = schemas[tableName.data].partial().safeParse(dataToValidate)

			if (!parsedData.success) {
				// Use Zod's built-in error formatting for better error messages
				const prettyError = z.prettifyError(parsedData.error)
				return createErrorResponse(`Validation failed for ${tableName.data}:\n${prettyError}`)
			}

			if (args.id === undefined || args.id === null) {
				return createErrorResponse(`An ID must be provided for the 'update' operation in ${categoryToolName}.`)
			}

			const dataToUpdate = parsedData.data

			// Validate polymorphic relations for update
			const polymorphicError = await validatePolymorphicRelations(dataToUpdate, tableName.data, polymorphicConfig)
			if (polymorphicError) {
				return createErrorResponse(`Relation validation failed: ${polymorphicError}`)
			}

			try {
				logger.info(
					`Updating ${tableName.data} (via ${categoryToolName}) with ID ${args.id} and data ${JSON.stringify(dataToUpdate)}`,
				)
				const result = await db
					.update(table)
					.set(dataToUpdate)
					.where(eq(table.id, args.id))
					.returning({ successfullyUpdated: table.id })

				if (result.length !== 1 || result[0] === undefined) {
					logger.error(`No ${tableName.data} found with ID: ${args.id}`)
					return createErrorResponse(`No ${tableName.data} found with ID: ${args.id}`)
				}

				return createResponse(`Successfully updated ${tableName.data} with ID: ${args.id}`)
			} catch (error) {
				logger.error(`Database error updating ${tableName.data}: ${error}`)
				return createErrorResponse(`Database error: Failed to update ${tableName.data}`)
			}
		}
		return createErrorResponse(`An unknown error occurred in ${categoryToolName} handler.`)
	}
}
