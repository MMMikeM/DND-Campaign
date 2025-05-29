import { createEmbeddingBuilder } from "../embedding-helpers"
import type { ItemEmbeddingInput } from "../embedding-input-types"

export const embeddingTextForItem = (item: ItemEmbeddingInput): string => {
	const builder = createEmbeddingBuilder()

	builder.setEntity("Item", item.name, item.description)

	builder.addFields("Basic Information", {
		type: item.itemType,
		rarity: item.rarity,
		narrativeRole: item.narrativeRole,
		perceivedSimplicity: item.perceivedSimplicity,
		significance: item.significance,
		relatedQuest: item.relatedQuestName,
	})

	builder.addFields("Lore & History", {
		loreSignificance: item.loreSignificance,
		creationPeriod: item.creationPeriod,
		placeOfOrigin: item.placeOfOrigin,
	})

	builder.addList("Mechanical Effects", item.mechanicalEffects)

	return builder.build()
}
