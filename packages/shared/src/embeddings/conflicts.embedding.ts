import { EmbeddingBuilder } from "./embedding-helpers"
import type { MajorConflictEmbeddingInput } from "./embedding-input-types"

export const embeddingTextForMajorConflict = (conflict: MajorConflictEmbeddingInput): string => {
	return new EmbeddingBuilder()
		.title("Conflict", conflict.name)
		.overview(conflict.description)
		.fields([
			{ label: "Scope", value: conflict.scope },
			{ label: "Current Status", value: conflict.status },
			{ label: "Tension Level", value: conflict.currentTensionLevel },
			{ label: "Primary Location", value: conflict.primaryRegionName },
			{ label: "Primary Cause", value: conflict.cause },
		])
		.lists([
			{ title: "Nature of Conflict", items: conflict.natures },
			{ title: "Key Stakes", items: conflict.stakes },
		])
		.fields([
			{ label: "Moral Dilemma", value: conflict.moralDilemma },
			{ label: "Moral Clarity", value: conflict.clarityOfRightWrong },
		])
		.lists([
			{ title: "Hidden Truths or Secrets", items: conflict.hiddenTruths },
			{ title: "Potential Outcomes", items: conflict.possibleOutcomes },
			{ title: "Key Participants", items: conflict.participantSummaries },
		])
		.build()
}
