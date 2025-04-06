import type { EmbeddedEntityName, RunResult } from "@tome-master/shared"
import { cosineDistance, eq, isNotNull, type SQL } from "drizzle-orm"
import { z } from "zod"
import { db, logger } from "../index"
import zodToJsonSchema from "zod-to-json-schema"
import { PgTable, PgColumn } from "drizzle-orm/pg-core"
import { getGeminiEmbedding, getTextForEntity } from "@tome-master/shared"

export type ToolHandlerReturn = RunResult | Record<string, unknown> | Record<string, unknown>[]

export type ToolDefinition = {
	description: string
	inputSchema: ReturnType<typeof zodToJsonSchema>
	handler: ToolHandler
}

export type ToolHandler = (args?: Record<string, unknown>) => Promise<ToolHandlerReturn>

export type ToolHandlers<T extends PropertyKey> = Record<T, ToolHandler>

type EmbeddingConfig = {
	entityNameForEmbedding: EmbeddedEntityName
	enabledEnvVar: string
}

export const jsonArray = z.array(z.string()).max(5)
export const id = z.coerce.number()
export const optionalId = z.coerce.number().optional()

export type CamelToSnakeCase<S extends string> = S extends `${infer T}${infer U}`
	? `${T extends Capitalize<T> ? "_" : ""}${Lowercase<T>}${CamelToSnakeCase<U>}`
	: S

export const createEntityActionDescription = (entity: string): string =>
	`
Manage ${entity} entities through create, update, or delete operations.

OPERATIONS:
- CREATE: Omit the 'id' field to create a new ${entity}
- UPDATE: Include 'id' and fields to update an existing ${entity}
- DELETE: Include ONLY the 'id' field to delete an ${entity}

For parameter details and required fields, use help({tool: 'manage_${entity.replace(/-/g, "_")}'})
`.trim()

export const createEntityHandler = (
	table: PgTable,
	schema: z.ZodType<any>,
	entityName: string,
	embeddingConfig?: EmbeddingConfig,
): ToolHandler => {
	return async (args?: Record<string, unknown>): Promise<ToolHandlerReturn> => {
		try {
			if (!args) {
				return {
					content: [
						{
							type: "text",
							text: `Please provide parameters to manage ${entityName}. Use help({tool: 'manage_${entityName.replace(/-/g, "_")}'}) for details.`,
						},
					],
				}
			}
			logger.info(`Managing ${entityName}`, args)

			if (Object.keys(args).length === 1 && "id" in args) {
				const { id } = args as { id: number }

				if (!id) {
					return {
						isError: true,
						content: [
							{
								type: "text",
								text: "Error: Valid ID is required for delete operations.",
							},
						],
					}
				}

				logger.info(`Deleting ${entityName} with id ${id}`)

				const result = await db
					.delete(table)
					.where(eq(table.id as any, id))
					.returning({ deletedId: table.id as any })

				return {
					content: [
						{
							type: "text",
							text:
								result.length > 0
									? `Successfully deleted ${entityName} with ID: ${id}`
									: `No ${entityName} found with ID: ${id}`,
						},
					],
				}
			}

			try {
				const parsedResult = schema.safeParse(args)
				if (!parsedResult.success) {
					const errors = parsedResult.error.errors.map((err) => `- '${err.path.join(".")}': ${err.message}`).join("\n")
					const operation = "id" in args ? "update" : "create"
					logger.error(`Validation error ${operation}ing ${entityName}:`, { errors })
					return {
						isError: true,
						content: [
							{
								type: "text",
								text: `Error ${operation}ing ${entityName}:\n${errors}\n\nUse help({tool: 'manage_${entityName.replace(/-/g, "_")}'}) for details.`,
							},
						],
					}
				}

				const parsedData = parsedResult.data
				const operation = parsedData.id ? "Updating" : "Creating"
				logger.info(`${operation} ${entityName}`, { args: parsedData })

				// --- Embedding Generation Logic ---
				let embeddingData: { embedding?: number[] } = {}

				if (embeddingConfig && process.env[embeddingConfig.enabledEnvVar] === "true") {
					try {
						logger.info(
							`${embeddingConfig.enabledEnvVar} is true. Generating embedding for ${entityName} ID: ${parsedData.id ?? "(new)"}`,
						)
						const textToEmbed = getTextForEntity(embeddingConfig.entityNameForEmbedding, parsedData)
						if (textToEmbed) {
							const embeddingVector = await getGeminiEmbedding(textToEmbed)
							embeddingData.embedding = embeddingVector
							logger.info(`Embedding generated for ${entityName} ID: ${parsedData.id ?? "(new)"}`)
						} else {
							logger.warn(
								`No text content generated for ${entityName} ID: ${parsedData.id ?? "(new)"}. Skipping embedding.`,
							)
						}
					} catch (embedError) {
						if (embedError instanceof Error) {
							logger.error(
								`Failed to generate embedding during ${operation} ${entityName} ID ${parsedData.id ?? "(new)"}:`,
								{ message: embedError.message, stack: embedError.stack },
							)
						}
					}
				}
				// --- End Embedding Generation Logic ---

				const dataToSave = { ...parsedData, ...embeddingData }

				if (dataToSave.id) {
					const result = await db
						.update(table)
						.set(dataToSave)
						.where(eq(table.id as any, dataToSave.id))
						.returning({
							successfullyUpdated: table.id as any,
						})
					return {
						content: [
							{
								type: "text",
								text:
									result.length > 0
										? `Successfully updated ${entityName} with ID: ${dataToSave.id}`
										: `No ${entityName} found with ID: ${dataToSave.id}`,
							},
						],
					}
				} else {
					const { id, ...insertData } = dataToSave
					const result = await db
						.insert(table)
						.values(insertData as Record<string, unknown>)
						.returning({
							successfullyCreated: table.id as any,
						})
					const newId = result[0]?.successfullyCreated
					return {
						content: [{ type: "text", text: `Successfully created new ${entityName} with ID: ${newId}` }],
					}
				}
			} catch (validationError) {
				if (validationError instanceof z.ZodError) {
					const errors = validationError.errors
						.map((err) => {
							const path = err.path.join(".")
							return `- '${path}': ${err.message}`
						})
						.join("\n")

					const operation = "id" in args ? "update" : "create"

					return {
						isError: true,
						content: [
							{
								type: "text",
								text: `Error ${operation}ing ${entityName}:\n${errors}\n\nUse help({tool: 'manage_${entityName.replace(/-/g, "_")}'}) for details on required parameters.`,
							},
						],
					}
				}

				throw validationError
			}
		} catch (error) {
			logger.error(`Error in ${entityName} handler:`, error)

			return {
				isError: true,
				content: [
					{
						type: "text",
						text: `Error processing ${entityName}: ${error instanceof Error ? error.message : String(error)}\n\nUse help({tool: 'manage_${entityName.replace(/-/g, "_")}'}) for usage details.`,
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
