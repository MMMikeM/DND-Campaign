import { getTextForEmbedding } from "../../lib/embeddings"
import type { majorConflicts } from "./tables"

export const embeddingTextForMajorConflict = (conflict: typeof majorConflicts.$inferSelect) =>
	getTextForEmbedding(conflict, [
		"name",
		"scope",
		"nature",
		"status",
		"cause",
		"description",
		"stakes",
		"moralDilemma",
		"possibleOutcomes",
		"hiddenTruths",
		"creativePrompts",
	])
