import { describe, expect, it } from "vitest"
import type { ForeshadowingSeedEmbeddingInput } from "../embedding-input-types"
import { embeddingTextForForeshadowingSeed } from "../foreshadowing.embedding"

describe("Foreshadowing Embedding Functions", () => {
	describe("embeddingTextForForeshadowingSeed", () => {
		const mockSeedInput: ForeshadowingSeedEmbeddingInput = {
			targetEntityType: "quest",
			targetAbstractDetail: "The ancient evil will return when the stars align.",
			suggestedDeliveryMethods: [
				"Cryptic prophecy in an old book.",
				"Dying words of a mysterious stranger.",
				"Strange dreams that plague the party.",
			],
			subtlety: "subtle",
			narrativeWeight: "major",
			description: ["A seed that hints at the coming darkness.", "Should be planted early in the campaign."],

			// Resolved fields
			targetEntityName: "The Return of the Shadow Lord",
			sourceContextSummary:
				"Can be delivered by the Oracle during the 'Seeking Wisdom' quest at the Temple of Foresight.",
		}

		it("should generate comprehensive text for a foreshadowing seed with all fields", () => {
			const result = embeddingTextForForeshadowingSeed(mockSeedInput)

			const expectedText = `Foreshadowing Seed: The Return of the Shadow Lord
Overview:
A seed that hints at the coming darkness.
Should be planted early in the campaign.
Target Entity Type: quest
Target Entity: The Return of the Shadow Lord
Target Detail: The ancient evil will return when the stars align.
Subtlety: subtle
Narrative Weight: major
Source Context: Can be delivered by the Oracle during the 'Seeking Wisdom' quest at the Temple of Foresight.
Suggested Delivery Methods:
- Cryptic prophecy in an old book.
- Dying words of a mysterious stranger.
- Strange dreams that plague the party.`

			expect(result).toBe(expectedText)
		})

		it("should handle seeds with minimal data", () => {
			const minimalSeed: ForeshadowingSeedEmbeddingInput = {
				targetEntityType: "npc",
				targetAbstractDetail: "A betrayal is coming.",
			}

			const result = embeddingTextForForeshadowingSeed(minimalSeed)
			const expectedMinimalText = `Foreshadowing Seed: Unknown Target
Target Entity Type: npc
Target Detail: A betrayal is coming.`
			expect(result).toBe(expectedMinimalText)
		})

		it("should handle seeds with empty arrays gracefully", () => {
			const seedWithEmptyArrays: ForeshadowingSeedEmbeddingInput = {
				targetEntityType: "conflict",
				suggestedDeliveryMethods: [],
				description: [],
			}

			const result = embeddingTextForForeshadowingSeed(seedWithEmptyArrays)
			const expectedEmptyText = `Foreshadowing Seed: Unknown Target
Target Entity Type: conflict`
			expect(result).toBe(expectedEmptyText)
		})

		it("should handle seeds with null resolved fields", () => {
			const seedWithNullResolved: ForeshadowingSeedEmbeddingInput = {
				targetEntityType: "item",
				targetAbstractDetail: "A powerful artifact will be needed.",
				targetEntityName: null,
				sourceContextSummary: "",
				description: [],
			}

			const result = embeddingTextForForeshadowingSeed(seedWithNullResolved)
			const expectedNullText = `Foreshadowing Seed: Unknown Target
Target Entity Type: item
Target Detail: A powerful artifact will be needed.`
			expect(result).toBe(expectedNullText)
		})

		it("should handle seeds with complex delivery methods", () => {
			const complexSeed: ForeshadowingSeedEmbeddingInput = {
				targetEntityType: "narrative_destination",
				targetAbstractDetail: "The final battle will be fought where it all began.",
				suggestedDeliveryMethods: [
					"Environmental storytelling: ancient battlefield markers.",
					"NPC dialogue: old veteran mentions the historic site.",
					"Item description: weapon forged at the original battle site.",
					"Quest reward: map showing the convergence of ley lines.",
				],
				subtlety: "moderate",
				narrativeWeight: "climactic",
				description: [],
			}

			const result = embeddingTextForForeshadowingSeed(complexSeed)
			const expectedComplexText = `Foreshadowing Seed: Unknown Target
Target Entity Type: narrative destination
Target Detail: The final battle will be fought where it all began.
Subtlety: moderate
Narrative Weight: climactic
Suggested Delivery Methods:
- Environmental storytelling: ancient battlefield markers.
- NPC dialogue: old veteran mentions the historic site.
- Item description: weapon forged at the original battle site.
- Quest reward: map showing the convergence of ley lines.`
			expect(result).toBe(expectedComplexText)
		})

		it("should handle seeds with undefined values by omitting those fields", () => {
			const seedWithUndefined: ForeshadowingSeedEmbeddingInput = {
				targetEntityType: undefined,
				targetAbstractDetail: undefined,
				subtlety: undefined,
				narrativeWeight: undefined,
				targetEntityName: undefined,
				sourceContextSummary: undefined,
				suggestedDeliveryMethods: undefined,
				description: undefined,
			}

			const result = embeddingTextForForeshadowingSeed(seedWithUndefined)
			const expectedUndefinedText = `Foreshadowing Seed: Unknown Target`
			expect(result).toBe(expectedUndefinedText)
		})
	})
})
