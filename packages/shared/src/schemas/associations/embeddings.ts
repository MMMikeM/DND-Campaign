import { getTextForEmbedding } from "../../lib/embeddings"
import type { clues, items } from "./tables"

// Embedding text generators
export const embeddingTextForItem = (item: typeof items.$inferSelect) =>
	getTextForEmbedding(item, ["name", "type", "description", "significance", "creativePrompts"])

export const embeddingTextForClue = (clue: typeof clues.$inferSelect) =>
	getTextForEmbedding(clue, ["description", "creativePrompts", "discoveryCondition", "reveals"])
