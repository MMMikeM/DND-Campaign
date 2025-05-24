import { getTextForEmbedding } from "../../lib/embeddings"
import type { narrativeDestinations } from "./tables"

export const embeddingTextForNarrativeDestination = (destination: typeof narrativeDestinations.$inferSelect) =>
	getTextForEmbedding(destination, [
		"name",
		"type",
		"promise",
		"payoff",
		"description",
		"themes",
		"foreshadowingElements",
		"creativePrompts",
	])
