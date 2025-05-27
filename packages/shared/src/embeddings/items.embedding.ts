import { EmbeddingBuilder } from "./embedding-helpers"
import type { ItemEmbeddingInput } from "./embedding-input-types"

export const embeddingTextForItem = (item: ItemEmbeddingInput): string => {
	return new EmbeddingBuilder()
		.title("Item", item.name)
		.overview(item.description)
		.basicInfoSection([
			{ label: "Type", value: item.itemType },
			{ label: "Rarity", value: item.rarity },
			{ label: "Narrative Role", value: item.narrativeRole },
			{ label: "Perceived Simplicity", value: item.perceivedSimplicity },
			{ label: "Significance", value: item.significance },
			{ label: "Related Quest", value: item.relatedQuestName },
		])
		.basicInfoSection(
			[
				{ label: "Lore Significance", value: item.loreSignificance },
				{ label: "Creation Period", value: item.creationPeriod },
				{ label: "Place of Origin", value: item.placeOfOrigin },
			],
			"Lore & History",
		)
		.list("Mechanical Effects", item.mechanicalEffects)
		.build()
}
