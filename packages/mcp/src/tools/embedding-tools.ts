import { type EmbeddedEntityName, getGeminiEmbedding, getTextForEntity, tables } from "@tome-master/shared"
import { cosineDistance, eq, inArray } from "drizzle-orm"
import type { PgColumn, PgTable } from "drizzle-orm/pg-core"
import { z } from "zod/v4"
import { db, logger } from ".."
import { zodToMCP } from "../zodToMcp"
import {
	type EmbeddableEntityType,
	type EmbeddingTools,
	type SearchableEntityType,
	schemas,
} from "./embedding-tools-schema"
import type { ToolDefinition, ToolHandler } from "./utils/types"

const {
	embeddingTables: { embeddings },
} = tables

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

type EntityTableConfig = {
	table: PgTable & { id: PgColumn; embeddingId: PgColumn | null }
	nameColumn?: PgColumn
}

const entityTableMap: Record<EmbeddableEntityType | SearchableEntityType, EntityTableConfig> = {
	faction: {
		table: tables.factionTables.factions as EntityTableConfig["table"],
		nameColumn: tables.factionTables.factions.name,
	},
	npc: { table: tables.npcTables.npcs as EntityTableConfig["table"], nameColumn: tables.npcTables.npcs.name },
	quest: { table: tables.questTables.quests as EntityTableConfig["table"], nameColumn: tables.questTables.quests.name },
	quest_stage: {
		table: tables.questTables.questStages as EntityTableConfig["table"],
		nameColumn: tables.questTables.questStages.name,
	},
	region: {
		table: tables.regionTables.regions as EntityTableConfig["table"],
		nameColumn: tables.regionTables.regions.name,
	},
	site: { table: tables.regionTables.sites as EntityTableConfig["table"], nameColumn: tables.regionTables.sites.name },
	site_encounter: {
		table: tables.regionTables.siteEncounters as EntityTableConfig["table"],
		nameColumn: tables.regionTables.siteEncounters.name,
	},
	site_secret: { table: tables.regionTables.siteSecrets as EntityTableConfig["table"] },
	item: {
		table: tables.associationTables.items as EntityTableConfig["table"],
		nameColumn: tables.associationTables.items.name,
	},
	clue: { table: tables.associationTables.clues as EntityTableConfig["table"] },
}

const formatResponse = (message: string, isError = false) => ({
	isError,
	content: [{ type: "text", text: message }],
})

const generateEmbeddingHandler: ToolHandler = async (args) => {
	try {
		const { entity_type, id } = schemas.generate_embedding.parse(args)

		const entityConfig = entityTableMap[entity_type]
		if (!entityConfig) {
			return formatResponse(`Unsupported entity_type: ${entity_type}`, true)
		}

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
		} satisfies Record<EmbeddableEntityType, any>

		const { table } = entityConfig
		const textKey = entityNameToTextKeyMap[entity_type]
		const queryRunner = queryMap[entity_type]

		if (!queryRunner) {
			return formatResponse(`Unsupported entity_type for query: ${entity_type}`, true)
		}

		logger.info(`Generating embedding for ${entity_type} ID: ${id}`)

		const record = await queryRunner.findFirst({ where: eq(table.id, id) })
		if (!record) {
			return formatResponse(`${entity_type} with ID ${id} not found.`, true)
		}

		const combinedText = getTextForEntity(textKey, record as Record<string, unknown>)
		if (!combinedText) {
			return formatResponse(`No text content found for ${entity_type} ID ${id}.`)
		}
		logger.debug(`Text content for ${entity_type} ID ${id}: "${combinedText.substring(0, 100)}..."`)

		const embeddingVector = await getGeminiEmbedding(combinedText)

		let embeddingIdToLink: number | undefined = record.embeddingId ?? undefined

		if (embeddingIdToLink) {
			logger.debug(`Updating existing embedding ID: ${embeddingIdToLink} for ${entity_type} ID: ${id}`)
			await db.update(embeddings).set({ embedding: embeddingVector }).where(eq(embeddings.id, embeddingIdToLink))
		} else {
			logger.debug(`Inserting new embedding for ${entity_type} ID: ${id}`)
			const [newEmbedding] = await db
				.insert(embeddings)
				.values({ embedding: embeddingVector })
				.returning({ id: embeddings.id })
			if (!newEmbedding?.id) {
				throw new Error("Failed to insert new embedding record.")
			}
			embeddingIdToLink = newEmbedding.id
			logger.debug(`New embedding ID: ${embeddingIdToLink}. Linking to ${entity_type} ID: ${id}`)

			await db.update(table).set({ embeddingId: embeddingIdToLink }).where(eq(table.id, id))
		}

		logger.info(`Successfully generated and linked embedding for ${entity_type} ID: ${id}`)
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

		const queryEmbedding = await getGeminiEmbedding(query)

		const embeddingResults = await db
			.select({
				id: embeddings.id,
				similarity: cosineDistance(embeddings.embedding, queryEmbedding),
			})
			.from(embeddings)
			.orderBy(cosineDistance(embeddings.embedding, queryEmbedding))
			.limit(limit)

		if (embeddingResults.length === 0) {
			logger.info(`No similar embeddings found for query: "${query}"`)
			return { content: [{ type: "text", text: `No similar ${entity_type}s found for query: "${query}"` }] }
		}

		const embeddingIds = embeddingResults.map((r) => r.id)
		const similarityMap = new Map(embeddingResults.map((r) => [r.id, r.similarity]))

		logger.debug(`Found ${embeddingIds.length} similar embedding IDs:`, embeddingIds)

		const entityResults = await db
			.select({
				id: table.id,
				...(nameColumn && { name: nameColumn }),
				embeddingId: table.embeddingId,
			})
			.from(table)
			.where(inArray(table.embeddingId, embeddingIds))

		const finalResults = entityResults
			.map((entity) => {
				const similarity = entity.embeddingId ? similarityMap.get(entity.embeddingId) : null
				return {
					...entity,
					similarity: similarity,
				}
			})
			.sort((a, b) => (a.similarity ?? 1) - (b.similarity ?? 1))

		logger.info(`Found ${finalResults.length} similar ${entity_type}(s) for query: "${query}"`)
		logger.debug(`Similarity search results for "${query}":`, {
			results: finalResults.map((r) => ({ id: r.id, name: r.name, similarity: r.similarity })),
		})

		return finalResults.map(({ embeddingId, ...rest }) => rest)
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
