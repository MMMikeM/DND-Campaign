import type { EmbeddedEntityName } from "@tome-master/shared"
import { cosineDistance, eq, isNotNull, type SQL } from "drizzle-orm"
import { z } from "zod"
import { db, logger } from "../index"
import { PgTable, PgColumn } from "drizzle-orm/pg-core"
import { ToolHandler, ToolHandlerReturn } from "./utils/types"
import { getGeminiEmbedding, getTextForEntity } from "@tome-master/shared"
import { type ColumnBaseConfig, type ColumnDataType } from "drizzle-orm"

type EmbeddingConfig = {
	entityNameForEmbedding: EmbeddedEntityName
	enabledEnvVar: string
}

// Utility function to convert camelCase to snake_case
export const camelToSnakeCase = (str: string) => str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)

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
	schema: z.ZodObject<z.ZodRawShape>,
	entityName: string,
	embeddingConfig?: EmbeddingConfig,
): ToolHandler => {
	const generateEmbedding = async (data: Record<string, unknown>): Promise<{ embedding?: number[] }> => {
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
			return {}
		}
	}

	const deleteRecord = async (id: number): Promise<ToolHandlerReturn> => {
		if (!id) {
			return createErrorResponse("Error: Valid ID is required for delete operations.")
		}

		logger.info(`Deleting ${entityName} with id ${id}`)

		// @ts-ignore - table structure is dynamic, assume 'id' column exists
		const result = await db.delete(table).where(eq(table.id, id)).returning({ deletedId: table.id })

		return createResponse(
			result.length > 0 ? `Successfully deleted ${entityName} with ID: ${id}` : `No ${entityName} found with ID: ${id}`,
		)
	}

	return async (args?: Record<string, unknown>): Promise<ToolHandlerReturn> => {
		try {
			logger.info(`Received request to manage ${entityName} witth ${JSON.stringify(args)}`)

			if (!args) {
				return createResponse(
					`Please provide parameters to manage ${entityName}. Use help({tool: 'manage_${entityName.replace(/-/g, "_")}'}) for details.`,
				)
			}

			logger.info(`Managing ${entityName}`, args)

			if (Object.keys(args).length === 1 && "id" in args) {
				return await deleteRecord(args.id as number)
			}

			const parsedResult = schema.safeParse(args)
			if (!parsedResult.success) {
				return formatZodErrors(parsedResult.error, entityName, args)
			}

			const parsedData = parsedResult.data as { id?: number; [key: string]: unknown }
			const operation = parsedData.id ? "Updating" : "Creating"
			logger.info(`${operation} ${entityName}`, { args: parsedData })

			const embeddingData = await generateEmbedding(parsedData)

			const dataToSave: Record<string, unknown> = { ...parsedData, ...embeddingData }

			if (parsedData.id) {
				const result = await db
					.update(table)
					.set(dataToSave)
					// @ts-ignore - table structure is dynamic, assume 'id' column exists
					.where(eq(table.id, parsedData.id))
					// @ts-ignore - table structure is dynamic, assume 'id' column exists
					.returning({ successfullyUpdated: table.id })

				return createResponse(
					result.length > 0
						? `Successfully updated ${entityName} with ID: ${parsedData.id}`
						: `No ${entityName} found with ID: ${parsedData.id}`,
				)
			} else {
				logger.debug(`Creating new ${entityName}`, { data: dataToSave })

				const { id, ...insertData } = dataToSave

				// @ts-ignore - table structure is dynamic, assume 'id' column exists
				const result = await db.insert(table).values(insertData).returning({ successfullyCreated: table.id })

				// @ts-ignore - result structure depends on returning clause
				const newId = result[0]?.successfullyCreated
				return createResponse(`Successfully created new ${entityName} with ID: ${newId}`)
			}
		} catch (error) {
			logger.error(`Error in ${entityName} handler with args:`, args, error)

			if (error instanceof z.ZodError) {
				return formatZodErrors(error, entityName, args || {})
			}

			return createErrorResponse(
				`Error processing ${entityName}: ${error instanceof Error ? error.message : String(error)}\n\nUse help({tool: 'manage_${entityName.replace(/-/g, "_")}'}) for usage details.`,
			)
		}
	}
}

export type EntityRelationConfig = {
	[key: string]: boolean | EntityRelationConfig
}

export type EntityMapping = {
	[entityType: string]: {
		table: PgTable
		queryName: string

		relations?: EntityRelationConfig
	}
}

export const createEntityQueryHandler = (entityMap: EntityMapping, schema: z.ZodObject<z.ZodRawShape>): ToolHandler => {
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

			if (id) {
				// @ts-ignore - table structure is dynamic, assume 'id' column exists
				const tableIdColumn = entityInfo.table.id
				if (entityInfo.relations) {
					const queryTable = entityInfo.queryName as keyof typeof db.query
					const queryRunner = db.query[queryTable]
					return (
						// @ts-ignore - query runner type is dynamic
						(await queryRunner.findFirst({
							where: eq(tableIdColumn, id),
							with: entityInfo.relations,
						})) ?? {
							isError: true,
							content: [{ type: "text", text: `${entity_type} not found` }],
						}
					)
				}

				const queryTable = entityInfo.queryName as keyof typeof db.query
				const queryRunner = db.query[queryTable]
				return (
					// @ts-ignore - query runner type is dynamic
					(await queryRunner.findFirst({
						where: eq(tableIdColumn, id),
					})) ?? {
						isError: true,
						content: [{ type: "text", text: `${entity_type} not found` }],
					}
				)
			}

			const queryTable = entityInfo.queryName as keyof typeof db.query
			const queryRunner = db.query[queryTable]
			// @ts-ignore - query runner type is dynamic
			return await queryRunner.findMany()
		} catch (error) {
			logger.error(`Error in entity query handler:`, error instanceof Error ? error.message : error)
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

const embeddingIdSchema = z.object({
	id: z.number().describe("The ID of the entity to generate the embedding for."),
})

type GenerateAndSaveEmbeddingCallback = (id: number) => Promise<string>

export const createEmbeddingGenerationHandler = (
	entityName: string,
	generateAndSaveEmbeddingCallback: GenerateAndSaveEmbeddingCallback,
): ToolHandler => {
	return async (args?: Record<string, unknown>): Promise<ToolHandlerReturn> => {
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

			const successMessage = await generateAndSaveEmbeddingCallback(id)

			logger.info(`Successfully generated and saved embedding for ${entityName} ID: ${id}`)
			return { content: [{ type: "text", text: successMessage }] }
		} catch (error) {
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

export const similaritySearchSchema = z.object({
	query: z.string().describe("Text to search for similar items"),
	limit: z.number().int().positive().optional().default(5).describe("Maximum number of results to return (default 5)"),
})

export const createSimilaritySearchHandler = (
	table: PgTable & { embedding?: PgColumn<ColumnBaseConfig<ColumnDataType, string>, object, object> },
	entityName: string,
	selectColumns: Record<string, PgColumn | SQL<unknown>>,
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

		if (!table.embedding) {
			logger.error(`Similarity search not supported for ${entityName} without embedding column`)
			return {
				isError: true,
				content: [{ type: "text", text: `Similarity search not supported for ${entityName} without embedding column` }],
			}
		}

		const { query, limit } = parseResult.data

		try {
			logger.info(`Searching for ${entityName}s similar to query: "${query}" (limit: ${limit})`)

			const queryEmbedding = await getGeminiEmbedding(query)

			const columnsToSelect = {
				...selectColumns,
				...(!("similarity" in selectColumns)
					? {
							similarity: cosineDistance(table.embedding, queryEmbedding),
						}
					: {}),
			}

			const results = await db
				.select(columnsToSelect)
				.from(table)
				.where(isNotNull(table.embedding))
				.orderBy(cosineDistance(table.embedding, queryEmbedding))
				.limit(limit)

			logger.info(`Found ${results.length} similar ${entityName}(s) for query: "${query}"`)
			if (results.length === 0) {
				return { content: [{ type: "text", text: `No similar ${entityName}s found for query: "${query}"` }] }
			}

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
