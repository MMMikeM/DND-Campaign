import { z } from "zod"
import { id } from "./tool.utils"
import { similaritySearchSchema } from "./utils/embeddingHandlers"

const embeddableEntityTypes = [
	"faction",
	"npc",
	"quest",
	"quest_stage",
	"region",
	"site",
	"site_encounter",
	"site_secret",
	"item",
	"clue",
] as const

const searchableEntityTypes = ["faction", "npc", "quest", "quest_stage", "region", "site"] as const

export type EmbeddableEntityType = (typeof embeddableEntityTypes)[number]
export type SearchableEntityType = (typeof searchableEntityTypes)[number]

export const schemas = {
	generate_embedding: z
		.object({
			entity_type: z.enum(embeddableEntityTypes).describe("The type of entity to generate the embedding for."),
			id: id.describe("The unique ID of the entity record."), // Changed to use id
		})
		.strict()
		.describe("Generate and save the vector embedding for a specific entity based on its combined text fields."),

	search_by_similarity: similaritySearchSchema
		.extend({
			entity_type: z.enum(searchableEntityTypes).describe("The type of entity to search for."),
		})
		.strict()
		.describe("Search for entities whose descriptions are semantically similar to the provided query text."),
}

export type EmbeddingTools = keyof typeof schemas
