import { getGeminiEmbedding } from "@tome-master/shared"
import { cosineDistance, isNotNull, type SQL } from "drizzle-orm"
import type { baseTable, PgColumn } from "drizzle-orm/pg-core"
import { z } from "zod/v4"
import { db, logger } from "../.."
import type { ToolHandler, ToolHandlerReturn } from "./types"

const embeddingIdSchema = z.object({
	id: z.number().describe("The ID of the entity to generate the embedding for."),
})

type GenerateAndSaveEmbeddingCallback = (id: number) => Promise<string>

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
	table: baseTable & { embedding?: PgColumn }, // Make embedding optional in type but runtime code assumes it exists
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
