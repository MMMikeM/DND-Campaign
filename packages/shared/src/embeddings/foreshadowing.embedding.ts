import { EmbeddingBuilder } from "./embedding-helpers"
import type { ForeshadowingSeedEmbeddingInput } from "./embedding-input-types"

export const embeddingTextForForeshadowingSeed = (seed: ForeshadowingSeedEmbeddingInput): string => {
	return new EmbeddingBuilder()
		.title("Foreshadowing Seed", seed.targetEntityName || "Unknown Target")
		.overview(seed.description)
		.fields([
			{ label: "Target Entity Type", value: seed.targetEntityType },
			{ label: "Target Entity", value: seed.targetEntityName },
			{ label: "Target Detail", value: seed.targetAbstractDetail },
			{ label: "Subtlety", value: seed.subtlety },
			{ label: "Narrative Weight", value: seed.narrativeWeight },
			{ label: "Source Context", value: seed.sourceContextSummary },
		])
		.list("Suggested Delivery Methods", seed.suggestedDeliveryMethods)
		.build()
}
