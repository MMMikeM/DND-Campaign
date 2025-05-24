import { getTextForEmbedding } from "../../lib/embeddings"
import type { npcs } from "./tables"

export const embeddingTextForNpc = (npc: typeof npcs.$inferSelect) =>
	getTextForEmbedding(npc, [
		"name",
		"race",
		"gender",
		"age",
		"occupation",
		"alignment",
		"disposition",
		"attitude",
		"personalityTraits",
		"drives",
		"fears",
		"background",
		"knowledge",
		"secrets",
		"quirk",
		"appearance",
		"mannerisms",
		"biases",
		"socialStatus",
		"wealth",
		"voiceNotes",
	])
