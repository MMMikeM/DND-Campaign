import { getTextForEmbedding } from "../../lib/embeddings"
import type { worldStateChanges } from "./tables"

export const embeddingTextForWorldStateChange = (change: typeof worldStateChanges.$inferSelect) =>
	getTextForEmbedding(change, [
		"name",
		"changeType",
		"severity",
		"visibility",
		"timeframe",
		"sourceType",
		"description",
		"gmNotes",
		"creativePrompts",
	])
