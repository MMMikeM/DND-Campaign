import { getTextForEmbedding } from "../../lib/embeddings"
import type { narrativeForeshadowing } from "./tables"

export const embeddingTextForNarrativeForeshadowing = (foreshadowing: typeof narrativeForeshadowing.$inferSelect) =>
	getTextForEmbedding(foreshadowing, [
		"name",
		"type",
		"description",
		"discoveryCondition",
		"subtlety",
		"narrativeWeight",
		"foreshadowsElement",
		"playerNotes",
		"gmNotes",
	])
