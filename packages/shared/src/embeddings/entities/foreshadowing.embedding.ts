import { createEmbeddingBuilder } from "../embedding-helpers"
import type { ForeshadowingSeedEmbeddingInput } from "../embedding-input-types"

export const embeddingTextForForeshadowingSeed = (seed: ForeshadowingSeedEmbeddingInput): string => {
	const builder = createEmbeddingBuilder()

	builder.setEntity("Foreshadowing Seed", seed.targetEntityName || "Unknown Target", seed.description)

	builder.addFields("Target Details", {
		targetEntityType: seed.targetEntityType,
		targetEntity: seed.targetEntityName,
		targetDetail: seed.targetAbstractDetail,
		subtlety: seed.subtlety,
		narrativeWeight: seed.narrativeWeight,
		sourceContext: seed.sourceContextSummary,
	})

	builder.addList("Suggested Delivery Methods", seed.suggestedDeliveryMethods)

	return builder.build()
}
