import { getGeminiEmbedding, tables } from "@tome-master/shared"

import { cosineDistance, eq } from "drizzle-orm"
import { db, logger } from ".."
import zodToMcp from "../zodToMcp"
import { contextSchemas } from "./context-tools.schema"
import type { ToolDefinition, ToolHandler } from "./utils/types"

// Utility function to format entity context
const formatEntityContext = (entityType: string, entity: any, relationships: any[] = []) => {
	const sections = [`## ${entityType.toUpperCase()}: ${entity.name || entity.id}`]

	// Add entity details
	if (entity.description) {
		sections.push(
			`**Description:** ${Array.isArray(entity.description) ? entity.description.join(" ") : entity.description}`,
		)
	}

	// Add type-specific details
	switch (entityType) {
		case "npc":
			if (entity.occupation) sections.push(`**Occupation:** ${entity.occupation}`)
			if (entity.alignment) sections.push(`**Alignment:** ${entity.alignment}`)
			if (entity.motivations)
				sections.push(
					`**Motivations:** ${Array.isArray(entity.motivations) ? entity.motivations.join(", ") : entity.motivations}`,
				)
			break
		case "faction":
			if (entity.type) sections.push(`**Type:** ${entity.type}`)
			if (entity.alignment) sections.push(`**Alignment:** ${entity.alignment}`)
			if (entity.goals)
				sections.push(`**Goals:** ${Array.isArray(entity.goals) ? entity.goals.join(", ") : entity.goals}`)
			break
		case "quest":
			if (entity.status) sections.push(`**Status:** ${entity.status}`)
			if (entity.priority) sections.push(`**Priority:** ${entity.priority}`)
			break
	}

	// Add relationships if provided
	if (relationships.length > 0) {
		sections.push(`**Related Entities:**`)
		relationships.forEach((rel) => {
			sections.push(`- ${rel.type}: ${rel.name || rel.id}`)
		})
	}

	return sections.join("\n")
}

// Handler: Gather comprehensive context for any entity
const gatherEntityContextHandler: ToolHandler = async (args) => {
	try {
		const { entity_type, entity_id, include_related, include_geographic, context_radius } =
			contextSchemas.gather_entity_context.parse(args)

		logger.info(`Gathering context for ${entity_type} ID: ${entity_id}`)

		let mainEntity: any
		const contextSections: string[] = []

		// Fetch main entity based on type
		switch (entity_type) {
			case "npc":
				mainEntity = await db.query.npcs.findFirst({
					where: eq(tables.npcTables.npcs.id, entity_id),
					with: { relatedFactions: true },
				})
				break
			case "faction":
				mainEntity = await db.query.factions.findFirst({
					where: eq(tables.factionTables.factions.id, entity_id),
					with: { members: { limit: 5 } },
				})
				break
			case "quest":
				mainEntity = await db.query.quests.findFirst({
					where: eq(tables.questTables.quests.id, entity_id),
					with: { stages: true },
				})
				break
			// Add other entity types as needed
		}

		if (!mainEntity) {
			return {
				isError: true,
				content: [{ type: "text", text: `${entity_type} with ID ${entity_id} not found` }],
			}
		}

		// Add main entity context
		contextSections.push(formatEntityContext(entity_type, mainEntity))

		// Add semantically related entities if requested
		if (include_related && mainEntity.embeddingId) {
			try {
				const embedding = await db.query.embeddings.findFirst({
					where: eq(tables.embeddingTables.embeddings.id, mainEntity.embeddingId),
				})

				if (embedding?.embedding) {
					// Find similar entities across all types
					const similarEntities = await db
						.select({
							id: tables.embeddingTables.embeddings.id,
							similarity: cosineDistance(tables.embeddingTables.embeddings.embedding, embedding.embedding),
						})
						.from(tables.embeddingTables.embeddings)
						.where(eq(tables.embeddingTables.embeddings.id, mainEntity.embeddingId))
						.orderBy(cosineDistance(tables.embeddingTables.embeddings.embedding, embedding.embedding))
						.limit(context_radius)

					if (similarEntities.length > 0) {
						contextSections.push("\n## SEMANTICALLY RELATED ENTITIES")
						// Note: You'd need to implement entity lookup by embedding ID
						contextSections.push("(Related entities found via semantic similarity)")
					}
				}
			} catch (error) {
				logger.warn("Failed to fetch semantic relationships", { error })
			}
		}

		// Add geographic context if requested
		if (include_geographic) {
			// Implementation would depend on your location relationships
			contextSections.push("\n## GEOGRAPHIC CONTEXT")
			contextSections.push("(Entities in same location/region)")
		}

		const fullContext = contextSections.join("\n\n")

		return {
			content: [
				{
					type: "text",
					text: `# CONTEXT FOR ${entity_type.toUpperCase()} CREATION/INTERACTION\n\n${fullContext}\n\n---\n*Use this context when creating content related to ${mainEntity.name || entity_id}*`,
				},
			],
		}
	} catch (error) {
		logger.error("Error gathering entity context", { error })
		return {
			isError: true,
			content: [
				{ type: "text", text: `Failed to gather context: ${error instanceof Error ? error.message : String(error)}` },
			],
		}
	}
}

// Handler: Gather thematic context via semantic search
const gatherThematicContextHandler: ToolHandler = async (args) => {
	try {
		const { theme, entity_types, max_results } = contextSchemas.gather_thematic_context.parse(args)

		logger.info(`Gathering thematic context for: "${theme}"`)

		// Get embedding for the theme
		const themeEmbedding = await getGeminiEmbedding(theme)

		// Search for entities matching the theme
		const similarEntities = await db
			.select({
				id: tables.embeddingTables.embeddings.id,
				similarity: cosineDistance(tables.embeddingTables.embeddings.embedding, themeEmbedding),
			})
			.from(tables.embeddingTables.embeddings)
			.orderBy(cosineDistance(tables.embeddingTables.embeddings.embedding, themeEmbedding))
			.limit(max_results)

		let contextText = `# THEMATIC CONTEXT: "${theme}"\n\n`
		contextText += `Found ${similarEntities.length} entities matching this theme:\n\n`

		// Note: You'd need to implement reverse lookup from embedding ID to entities
		contextText += "(Implementation note: Add reverse lookup from embedding ID to source entities)\n\n"
		contextText += "---\n*Use this thematic context when creating content related to: " + theme + "*"

		return {
			content: [{ type: "text", text: contextText }],
		}
	} catch (error) {
		logger.error("Error gathering thematic context", { error })
		return {
			isError: true,
			content: [
				{
					type: "text",
					text: `Failed to gather thematic context: ${error instanceof Error ? error.message : String(error)}`,
				},
			],
		}
	}
}

// Export tool definitions
export const contextToolDefinitions: Record<string, ToolDefinition> = {
	gather_entity_context: {
		description: "Gather comprehensive context for any entity including related entities and geographic context",
		inputSchema: zodToMcp(contextSchemas.gather_entity_context),
		handler: gatherEntityContextHandler,
	},
	gather_thematic_context: {
		description: "Find entities and context related to a specific theme using semantic search",
		inputSchema: zodToMcp(contextSchemas.gather_thematic_context),
		handler: gatherThematicContextHandler,
	},
} satisfies Record<string, ToolDefinition>
