import { getTextForEmbedding } from "../../lib/embeddings"
import type { narrativeEvents } from "./tables"

export const embeddingTextForNarrativeEvent = (event: typeof narrativeEvents.$inferSelect) =>
	getTextForEmbedding(event, [
		"name",
		"eventType",
		"description",
		"narrativePlacement",
		"impactSeverity",
		"complication_details",
		"escalation_details",
		"twist_reveal_details",
		"creativePrompts",
		"gmNotes",
	])
