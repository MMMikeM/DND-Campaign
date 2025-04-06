import type { EmbeddedEntityName } from "@tome-master/shared"
import { cosineDistance, eq, isNotNull, type SQL } from "drizzle-orm"
import { z } from "zod"
import { db, logger } from "../index"
import { PgTable, PgColumn } from "drizzle-orm/pg-core"
import { ToolHandler, ToolHandlerReturn } from "./utils/types" // Import ToolHandler type
import { getGeminiEmbedding, getTextForEntity } from "@tome-master/shared"

type EmbeddingConfig = {
	entityNameForEmbedding: EmbeddedEntityName
	enabledEnvVar: string
}

export const id = z.coerce.number()
export const optionalId = z.coerce.number().optional()

export const createEntityActionDescription = (entity: string): string =>
	`
Manage ${entity} entities through create, update, or delete operations.

OPERATIONS:
- CREATE: Omit the 'id' field to create a new ${entity}
- UPDATE: Include 'id' and fields to update an existing ${entity}
- DELETE: Include ONLY the 'id' field to delete an ${entity}

For parameter details and required fields, use help({tool: 'manage_${entity.replace(/-/g, "_")}'})
`.trim()

const createErrorResponse = (message: string): ToolHandlerReturn => ({
	isError: true,
	content: [{ type: "text", text: message }],
})

const createResponse = (message: string): ToolHandlerReturn => ({
	content: [{ type: "text", text: message }],
})

// Helper to format Zod validation errors
const formatZodErrors = (error: z.ZodError, entityName: string, args: Record<string, unknown>): ToolHandlerReturn => {
	const errors = error.errors.map((err) => `- '${err.path.join(".")}': ${err.message}`).join("\n")

	const operation = "id" in args ? "update" : "create"
	logger.error(`Validation error ${operation}ing ${entityName}:`, { errors })

	return createErrorResponse(
		`Error ${operation}ing ${entityName}:\n${errors}\n\nUse help({tool: 'manage_${entityName.replace(/-/g, "_")}'}) for details on required parameters.`,
	)
}

export const createEntityHandler = (
	table: PgTable,
	schema: z.ZodType<any>,
	entityName: string,
	embeddingConfig?: EmbeddingConfig,
): ToolHandler => {
	// Response formatting helpers

	// Helper for generating embeddings that handles its own errors
	const generateEmbedding = async (data: any): Promise<{ embedding?: number[] }> => {
		if (!embeddingConfig || process.env[embeddingConfig.enabledEnvVar] !== "true") {
			return {}
		}

		try {
			logger.info(`Generating embedding for ${entityName} ID: ${data.id ?? "(new)"}`)

			const textToEmbed = getTextForEntity(embeddingConfig.entityNameForEmbedding, data)
			if (!textToEmbed) {
				logger.warn(`No text content for ${entityName} ID: ${data.id ?? "(new)"}. Skipping embedding.`)
				return {}
			}

			const embeddingVector = await getGeminiEmbedding(textToEmbed)
			logger.info(`Embedding generated for ${entityName} ID: ${data.id ?? "(new)"}`)

			return { embedding: embeddingVector }
		} catch (error) {
			if (error instanceof Error) {
				logger.error(`Failed to generate embedding for ${entityName} ID ${data.id ?? "(new)"}:`, {
					message: error.message,
					stack: error.stack,
				})
			}
			return {} // Continue without embedding on error
		}
	}

	// Database operation helpers
	const deleteRecord = async (id: number): Promise<ToolHandlerReturn> => {
		if (!id) {
			return createErrorResponse("Error: Valid ID is required for delete operations.")
		}

		logger.info(`Deleting ${entityName} with id ${id}`)

		const result = await db
			.delete(table)
			.where(eq((table as any).id, id))
			.returning({ deletedId: (table as any).id })

		return createResponse(
			result.length > 0 ? `Successfully deleted ${entityName} with ID: ${id}` : `No ${entityName} found with ID: ${id}`,
		)
	}

	// Main handler function with a single try/catch
	return async (args?: Record<string, unknown>): Promise<ToolHandlerReturn> => {
		try {
			logger.info(`Received request to manage ${entityName} witth ${JSON.stringify(args)}`)
			// Handle missing arguments
			if (!args) {
				return createResponse(
					`Please provide parameters to manage ${entityName}. Use help({tool: 'manage_${entityName.replace(/-/g, "_")}'}) for details.`,
				)
			}

			logger.info(`Managing ${entityName}`, args)

			// Handle delete operation (when only id is provided)
			if (Object.keys(args).length === 1 && "id" in args) {
				return await deleteRecord(args.id as number)
			}

			// Validate input data
			const parsedResult = schema.safeParse(args)
			if (!parsedResult.success) {
				return formatZodErrors(parsedResult.error, entityName, args)
			}

			const parsedData = parsedResult.data
			const operation = parsedData.id ? "Updating" : "Creating"
			logger.info(`${operation} ${entityName}`, { args: parsedData })

			// Generate embedding (handles its own errors internally)
			const embeddingData = await generateEmbedding(parsedData)

			// Prepare data and save to database
			const dataToSave = { ...parsedData, ...embeddingData }

			if (dataToSave.id) {
				// Update existing entity
				const result = await db
					.update(table)
					.set(dataToSave)
					.where(eq((table as any).id, dataToSave.id))
					.returning({ successfullyUpdated: (table as any).id })

				return createResponse(
					result.length > 0
						? `Successfully updated ${entityName} with ID: ${dataToSave.id}`
						: `No ${entityName} found with ID: ${dataToSave.id}`,
				)
			} else {
				logger.debug(`Creating new ${entityName}`, { data: dataToSave })
				// Create new entity
				const { id, ...insertData } = dataToSave
				const result = await db
					.insert(table)
					.values(insertData as Record<string, unknown>)
					.returning({ successfullyCreated: (table as any).id })

				const newId = result[0]?.successfullyCreated
				return createResponse(`Successfully created new ${entityName} with ID: ${newId}`)
			}
		} catch (error) {
			logger.error(`Error in ${entityName} handler with args:`, args, error)

			// Special handling for Zod errors that might be thrown directly
			if (error instanceof z.ZodError) {
				return formatZodErrors(error, entityName, args || {})
			}

			// Generic error handling
			return createErrorResponse(
				`Error processing ${entityName}: ${error instanceof Error ? error.message : String(error)}\n\nUse help({tool: 'manage_${entityName.replace(/-/g, "_")}'}) for usage details.`,
			)
		}
	}
}

// --- Entity Query Handler ---

// Type for defining relationships to load for an entity
export type EntityRelationConfig = {
	[key: string]: boolean | EntityRelationConfig
}

// Type for entity mapping
export type EntityMapping = {
	[entityType: string]: {
		table: PgTable
		queryName: string
		// Optional relations config to specify which relations to load for entity by ID queries
		relations?: EntityRelationConfig
	}
}

export const createEntityQueryHandler = (entityMap: EntityMapping, schema: z.ZodType<any>): ToolHandler => {
	return async (args?: Record<string, unknown>): Promise<ToolHandlerReturn> => {
		try {
			if (!args) {
				return {
					isError: true,
					content: [
						{
							type: "text",
							text: "Please provide entity type to query.",
						},
					],
				}
			}

			const parseResult = schema.safeParse(args)
			if (!parseResult.success) {
				return {
					isError: true,
					content: [
						{
							type: "text",
							text: `Invalid query parameters: ${parseResult.error.message}`,
						},
					],
				}
			}

			const { entity_type, id } = parseResult.data

			logger.info(`Getting ${entity_type}${id ? ` by ID: ${id}` : "s"}`)

			const entityInfo = entityMap[entity_type]

			if (!entityInfo) {
				return {
					isError: true,
					content: [{ type: "text", text: `Invalid entity type: ${entity_type}` }],
				}
			}

			// Handle ID-specific query
			if (id) {
				// If the entity has specific relations config, use it
				if (entityInfo.relations) {
					// This effectively calls db.query[queryName].findFirst with the relations
					// while avoiding TS errors with explicit any
					const queryTable = entityInfo.queryName as keyof typeof db.query
					return (
						(await (db.query[queryTable] as any).findFirst({
							where: eq((entityInfo.table as any).id, id),
							with: entityInfo.relations,
						})) ?? {
							isError: true,
							content: [{ type: "text", text: `${entity_type} not found` }],
						}
					)
				}

				// Fallback to basic query if no relations specified
				const queryTable = entityInfo.queryName as keyof typeof db.query
				return (
					(await (db.query[queryTable] as any).findFirst({
						where: eq((entityInfo.table as any).id, id),
					})) ?? {
						isError: true,
						content: [{ type: "text", text: `${entity_type} not found` }],
					}
				)
			}

			// Handle get all entities query
			const queryTable = entityInfo.queryName as keyof typeof db.query
			return await (db.query[queryTable] as any).findMany()
		} catch (error) {
			logger.error(`Error in entity query handler:`, error)
			return {
				isError: true,
				content: [
					{
						type: "text",
						text: `Error querying entity: ${error instanceof Error ? error.message : String(error)}`,
					},
				],
			}
		}
	}
}

// --- Embedding Generation Handler ---

// Schema for the ID input, used internally by the handler
const embeddingIdSchema = z.object({
	id: z.number().describe("The ID of the entity to generate the embedding for."),
})

// Type for the callback function
type GenerateAndSaveEmbeddingCallback = (id: number) => Promise<string> // Returns success message or throws error

export const createEmbeddingGenerationHandler = (
	entityName: string,
	generateAndSaveEmbeddingCallback: GenerateAndSaveEmbeddingCallback,
): ToolHandler => {
	return async (args?: Record<string, unknown>): Promise<ToolHandlerReturn> => {
		// 1. Parse Arguments
		const parseResult = embeddingIdSchema.safeParse(args)
		if (!parseResult.success) {
			const toolName = `generate_${entityName.toLowerCase().replace(/ /g, "_")}_embedding`
			logger.error(`Invalid arguments for ${toolName}`, { errors: parseResult.error.flatten() })
			return {
				isError: true,
				content: [{ type: "text", text: `Invalid arguments: ${parseResult.error.message}` }],
			}
		}
		const { id } = parseResult.data

		try {
			logger.info(`Attempting to generate embedding for ${entityName} ID: ${id}`)

			// 2. Call the entity-specific callback
			const successMessage = await generateAndSaveEmbeddingCallback(id)

			// 3. Log and Return Success from callback
			logger.info(`Successfully generated and saved embedding for ${entityName} ID: ${id}`)
			return { content: [{ type: "text", text: successMessage }] }
		} catch (error) {
			// 4. Catch Errors (from callback or elsewhere)
			logger.error(`Error during embedding generation for ${entityName} ID ${id}:`, {
				error: error instanceof Error ? error.message : String(error),
				stack: error instanceof Error ? error.stack : undefined,
			})
			return {
				isError: true,
				content: [
					{
						type: "text",
						text: `Failed to generate embedding for ${entityName} ID ${id}: ${error instanceof Error ? error.message : String(error)}`,
					},
				],
			}
		}
	}
}

// --- Generic Similarity Search Handler ---

// Define a standard schema for similarity search input
export const similaritySearchSchema = z.object({
	query: z.string().describe("Text to search for similar items"),
	limit: z.number().int().positive().optional().default(5).describe("Maximum number of results to return (default 5)"),
})

export const createSimilaritySearchHandler = (
	table: PgTable & { embedding?: PgColumn }, // Make embedding optional in type but runtime code assumes it exists
	entityName: string,
	selectColumns: Record<string, PgColumn | SQL<any>>, // Keep original signature for compatibility
): ToolHandler => {
	return async (args?: Record<string, unknown>): Promise<ToolHandlerReturn> => {
		const parseResult = similaritySearchSchema.safeParse(args)
		if (!parseResult.success) {
			logger.error(`Invalid arguments for ${entityName} similarity search`, { errors: parseResult.error.flatten() })
			return {
				isError: true,
				content: [{ type: "text", text: `Invalid arguments: ${parseResult.error.message}` }],
			}
		}
		const { query, limit } = parseResult.data

		try {
			logger.info(`Searching for ${entityName}s similar to query: "${query}" (limit: ${limit})`)

			// 1. Generate embedding for the query
			const queryEmbedding = await getGeminiEmbedding(query)

			// 2. Include all the original select columns, optionally adding similarity
			const columnsToSelect = {
				...selectColumns,
				// Only add similarity if it's not already provided
				...(!("similarity" in selectColumns)
					? {
							similarity: cosineDistance(table.embedding as PgColumn, queryEmbedding),
						}
					: {}),
			}

			// 3. Perform the similarity search
			const results = await db
				.select(columnsToSelect)
				.from(table)
				.where(isNotNull(table.embedding as PgColumn)) // Only search items with embeddings
				.orderBy(cosineDistance(table.embedding as PgColumn, queryEmbedding)) // Order by similarity
				.limit(limit)

			logger.info(`Found ${results.length} similar ${entityName}(s) for query: "${query}"`)
			if (results.length === 0) {
				return { content: [{ type: "text", text: `No similar ${entityName}s found for query: "${query}"` }] }
			}

			// Return results directly
			return results
		} catch (error) {
			logger.error(`Error during ${entityName} similarity search for query "${query}":`, {
				error: error instanceof Error ? error.message : String(error),
				stack: error instanceof Error ? error.stack : undefined,
			})
			return {
				isError: true,
				content: [
					{
						type: "text",
						text: `Failed to perform similarity search for ${entityName}s: ${error instanceof Error ? error.message : String(error)}`,
					},
				],
			}
		}
	}
}

/**
 * Generic entity handler factory that works with any set of tables
 */
/**
 * Creates a handler for entity retrieval operations
 */
// Define the schema for the get_entity tool's arguments
const getEntitySchema = z.object({
	entity_type: z.string().describe("The type of entity to retrieve (e.g., 'region', 'area', 'site')"),
	id: z.coerce.number().optional().describe("The optional ID of the specific entity to retrieve"),
})

export function createGetEntityHandler<EntityGetters extends Record<string, (...args: any[]) => Promise<any>>>(
	name: string,
	entityGetters: EntityGetters,
): ToolHandler {
	// Explicitly type the return as ToolHandler
	return async (args?: Record<string, unknown>) => {
		// Validate input arguments
		const parseResult = getEntitySchema.safeParse(args)
		if (!parseResult.success) {
			logger.error(`Invalid arguments for get_${name}`, { errors: parseResult.error.flatten() })
			return {
				isError: true,
				content: [{ type: "text", text: `Invalid arguments: ${parseResult.error.message}` }],
			}
		}

		const { entity_type, id } = parseResult.data
		let getterKey: string

		try {
			if (id !== undefined) {
				// Get by ID
				logger.info(`Getting ${entity_type} by ID: ${id}`)
				getterKey = `${entity_type}_by_id`
				if (!(getterKey in entityGetters)) {
					logger.warn(`Invalid entity type for get by ID: ${entity_type}`)
					return {
						isError: true,
						content: [{ type: "text", text: `Invalid entity type for getting by ID: ${entity_type}` }],
					}
				}

				const getter = entityGetters[getterKey as keyof typeof entityGetters]!
				const result = await getter(id)

				if (!result) {
					logger.info(`${entity_type} with ID ${id} not found.`)
					return {
						content: [{ type: "text", text: `${entity_type} with ID ${id} not found.` }],
					}
				}
				return result // Return the found entity directly
			} else {
				// Get all
				logger.info(`Getting all ${entity_type}s`)
				// Attempt to pluralize, common pattern but might need adjustment for irregular plurals
				const pluralEntityType = entity_type.endsWith("s") ? entity_type : `${entity_type}s`
				getterKey = `all_${pluralEntityType}`

				if (!(getterKey in entityGetters)) {
					// Fallback to non-pluralized if plural doesn't exist (e.g., 'all_region_connections')
					getterKey = `all_${entity_type}`
					if (!(getterKey in entityGetters)) {
						logger.warn(`Invalid entity type for get all: ${entity_type}`)
						return {
							isError: true,
							content: [{ type: "text", text: `Invalid entity type for getting all: ${entity_type}` }],
						}
					}
				}

				const getter = entityGetters[getterKey as keyof typeof entityGetters]!
				const results = await getter()
				logger.info(`Found ${results.length} ${entity_type}(s)`)
				return results // Return the array of entities
			}
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error)
			logger.error(`Error fetching ${entity_type}${id ? ` by ID ${id}` : "s"}:`, error)
			return {
				isError: true,
				content: [
					{
						type: "text",
						text: id
							? `Error fetching ${entity_type} by ID ${id}: ${errorMessage}`
							: `Error fetching all ${entity_type}s: ${errorMessage}`,
					},
				],
			}
		}
	}
}
