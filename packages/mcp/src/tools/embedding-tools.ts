import { z } from "zod"
import { db, logger } from ".."
import { zodToMCP } from "../zodToMcp"
import {
	type EmbeddableEntityType,
	type EmbeddingTools,
	type SearchableEntityType,
	schemas,
} from "./embedding-tools-schema"
import { type ToolDefinition, type ToolHandler } from "./tool.utils"
import { getGeminiEmbedding, getTextForEntity, tables, type EmbeddedEntityName } from "@tome-master/shared"
import { cosineDistance, eq, isNotNull, type SQL } from "drizzle-orm"
import type { PgTable, PgColumn } from "drizzle-orm/pg-core"

const entityNameToTextKeyMap: Record<EmbeddableEntityType, EmbeddedEntityName> = {
	faction: "factions",
	npc: "npcs",
	quest: "quests",
	quest_stage: "questStages",
	region: "regions",
	site: "sites",
	site_encounter: "siteEncounters",
	site_secret: "siteSecrets",
	item: "items",
	clue: "clues",
}

const entityTableMap: Record<
	EmbeddableEntityType | SearchableEntityType,
	{ table: PgTable & { id: PgColumn; embedding: PgColumn }; nameColumn?: PgColumn }
> = {
	faction: { table: tables.factionTables.factions, nameColumn: tables.factionTables.factions.name },
	npc: { table: tables.npcTables.npcs, nameColumn: tables.npcTables.npcs.name },
	quest: { table: tables.questTables.quests, nameColumn: tables.questTables.quests.name },
	quest_stage: { table: tables.questTables.questStages, nameColumn: tables.questTables.questStages.name },
	region: { table: tables.regionTables.regions, nameColumn: tables.regionTables.regions.name },
	site: { table: tables.regionTables.sites, nameColumn: tables.regionTables.sites.name },
	site_encounter: {
		table: tables.regionTables.siteEncounters,
		nameColumn: tables.regionTables.siteEncounters.name,
	},
	site_secret: { table: tables.regionTables.siteSecrets },
	item: { table: tables.assocationTables.items, nameColumn: tables.assocationTables.items.name },
	clue: { table: tables.assocationTables.clues },
}
// Helper for consistent response formatting
// Define response formatter at module level
const formatResponse = (message: string, isError = false) => ({
	isError,
	content: [{ type: "text", text: message }],
})

const generateEmbeddingHandler: ToolHandler = async (args) => {
	try {
		// 1. Validate input using parse to handle validation errors in catch block
		const { entity_type, id } = schemas.generate_embedding.parse(args)

		const entityConfig = entityTableMap[entity_type]
		if (!entityConfig) {
			return formatResponse(`Unsupported entity_type: ${entity_type}`, true)
		}

		// Define query map inside the function to ensure db is instantiated
		const queryMap = {
			faction: db.query.factions,
			npc: db.query.npcs,
			quest: db.query.quests,
			quest_stage: db.query.questStages,
			region: db.query.regions,
			site: db.query.sites,
			site_encounter: db.query.siteEncounters,
			site_secret: db.query.siteSecrets,
			item: db.query.items,
			clue: db.query.clues,
		} satisfies Record<EmbeddableEntityType, unknown>

		const { table } = entityConfig
		const textKey = entityNameToTextKeyMap[entity_type]
		const queryRunner = queryMap[entity_type]

		if (!queryRunner) {
			return formatResponse(`Unsupported entity_type for query: ${entity_type}`, true)
		}

		logger.info(`Generating embedding for ${entity_type} ID: ${id}`)

		// 2. Fetch the record
		// @ts-ignore
		const record = await queryRunner.findFirst({ where: eq(table.id, id) })
		if (!record) {
			return formatResponse(`${entity_type} with ID ${id} not found.`, true)
		}

		// 3. Extract text and generate embedding
		const combinedText = getTextForEntity(textKey, record as Record<string, unknown>)
		if (!combinedText) {
			return formatResponse(`No text content found for ${entity_type} ID ${id}.`)
		}
		logger.debug(`Text content for ${entity_type} ID ${id}: "${combinedText.substring(0, 100)}..."`) // Log start of text

		const embedding = await getGeminiEmbedding(combinedText)

		// 4. Update the record with new embedding
		await db.update(table).set({ embedding }).where(eq(table.id, id))

		logger.info(`Successfully generated embedding for ${entity_type} ID: ${id}`)
		return formatResponse(`Embedding generated successfully for ${entity_type} ID: ${id}`)
	} catch (error) {
		let errorMessage: string

		if (error instanceof z.ZodError) {
			logger.error("Validation error in generate_embedding", { errors: error.flatten() })
			errorMessage = `Invalid arguments: ${error.message}`
		} else {
			errorMessage = error instanceof Error ? error.message : String(error)
			logger.error(`Error in embedding generation:`, {
				error: errorMessage,
				stack: error instanceof Error ? error.stack : undefined,
				args,
			})
		}

		return formatResponse(`Failed to generate embedding: ${errorMessage}`, true)
	}
}

const searchBySimilarityHandler: ToolHandler = async (args) => {
	const parseResult = schemas.search_by_similarity.safeParse(args)
	if (!parseResult.success) {
		logger.error("Invalid arguments for search_by_similarity", { errors: parseResult.error.flatten() })
		return { isError: true, content: [{ type: "text", text: `Invalid arguments: ${parseResult.error.message}` }] }
	}
	const { entity_type, query, limit } = parseResult.data

	const entityConfig = entityTableMap[entity_type]
	if (!entityConfig) {
		return { isError: true, content: [{ type: "text", text: `Unsupported entity_type for search: ${entity_type}` }] }
	}
	const { table, nameColumn } = entityConfig

	try {
		logger.info(`Searching for ${entity_type}s similar to query: "${query}" (limit: ${limit})`)

		// 1. Generate embedding for the query
		const queryEmbedding = await getGeminiEmbedding(query)

		const columnsToSelect: Record<string, PgColumn | SQL<unknown>> = {
			id: table.id,
			similarity: cosineDistance(table.embedding, queryEmbedding),
		}
		if (nameColumn) {
			columnsToSelect.name = nameColumn
		}

		// 3. Perform the similarity search
		const results = await db
			.select(columnsToSelect)
			.from(table)
			.where(isNotNull(table.embedding))
			.orderBy(cosineDistance(table.embedding, queryEmbedding))
			.limit(limit)

		logger.info(`Found ${results.length} similar ${entity_type}(s) for query: "${query}"`)
		if (results.length === 0) {
			return { content: [{ type: "text", text: `No similar ${entity_type}s found for query: "${query}"` }] }
		}

		// Log the results at debug level
		logger.debug(`Similarity search results for "${query}":`, {
			results: results.map((r) => ({ id: r.id, similarity: r.similarity })), // Log only ID and similarity
		})

		return results
	} catch (error) {
		logger.error(`Error during ${entity_type} similarity search for query "${query}":`, {
			error: error instanceof Error ? error.message : String(error),
			stack: error instanceof Error ? error.stack : undefined,
		})
		return {
			isError: true,
			content: [
				{
					type: "text",
					text: `Failed to perform similarity search for ${entity_type}s: ${error instanceof Error ? error.message : String(error)}`,
				},
			],
		}
	}
}

export const embeddingToolDefinitions: Record<EmbeddingTools, ToolDefinition> = {
	generate_embedding: {
		description: schemas.generate_embedding.description ?? "Generate embedding for an entity",
		inputSchema: zodToMCP(schemas.generate_embedding),
		handler: generateEmbeddingHandler,
	},
	search_by_similarity: {
		description: schemas.search_by_similarity.description ?? "Search entities by similarity",
		inputSchema: zodToMCP(schemas.search_by_similarity),
		handler: searchBySimilarityHandler,
	},
}
