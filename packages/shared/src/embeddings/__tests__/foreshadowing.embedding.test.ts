import { describe, expect, it } from "vitest"
import type { ForeshadowingEmbeddingInput, RecursiveRequired } from "../embedding-input-types"
import { embeddingTextForForeshadowingSeed } from "../entities/foreshadowing.embedding"

describe("Foreshadowing Embedding Functions", () => {
	describe("embeddingTextForForeshadowingSeed", () => {
		const mockSeedInput: RecursiveRequired<ForeshadowingEmbeddingInput> = {
			targetEntityType: "Quest",
			targetAbstractDetail: "The ancient evil will return when the stars align.",
			suggestedDeliveryMethods: ["npc_dialogue", "environmental_detail", "document_snippet"],
			subtlety: "subtle",
			narrativeWeight: "major",
			description: ["A seed that hints at the coming darkness.", "Should be planted early in the campaign."],

			targetEntityContext: {
				entityType: "Quest",
				name: "The Return of the Shadow Lord",
				details: {
					type: "main",
				},
			},

			sourceEntityContext: {
				sourceType: "QuestStage",
				name: "Consulting the Oracle",
				details: {
					stageType: "revelation_point",
				},
				parentQuestName: "Seeking Wisdom",
			},
		}

		it("should generate comprehensive text for a foreshadowing seed with all fields", () => {
			const result = embeddingTextForForeshadowingSeed(mockSeedInput)

			expect(result).toContain("Foreshadowing Seed: The Return of the Shadow Lord")
			expect(result).toContain("A seed that hints at the coming darkness.")
			expect(result).toContain("Should be planted early in the campaign.")
			expect(result).toContain("targetEntityType: Quest")
			expect(result).toContain("subtlety: subtle")
			expect(result).toContain("narrativeWeight: major")
			expect(result).toContain("Target Entity:")
			expect(result).toContain("entity: The Return of the Shadow Lord")
			expect(result).toContain("entityType: Quest")
			expect(result).toContain("type: main")
			expect(result).toContain("Source Context:")
			expect(result).toContain("source: Consulting the Oracle")
			expect(result).toContain("sourceType: QuestStage")
			expect(result).toContain("stageType: revelation_point")
			expect(result).toContain("parentQuest: Seeking Wisdom")
			expect(result).toContain("Suggested Delivery Methods:")
			expect(result).toContain("- npc_dialogue")
			expect(result).toContain("- environmental_detail")
			expect(result).toContain("- document_snippet")
		})

		it("should handle seeds with abstract target details", () => {
			const abstractSeed: ForeshadowingEmbeddingInput = {
				targetEntityType: "abstract_theme",
				targetAbstractDetail: "Betrayal comes from within",
				suggestedDeliveryMethods: ["symbol_motif"],
				subtlety: "hidden",
				narrativeWeight: "crucial",
				description: ["Hints at internal faction conflict"],
				targetEntityContext: {
					entityType: "AbstractTheme",
					name: "Betrayal comes from within",
					details: {
						abstractType: "abstract_theme",
					},
				},
			}

			const result = embeddingTextForForeshadowingSeed(abstractSeed)

			expect(result).toContain("Foreshadowing Seed: Betrayal comes from within")
			expect(result).toContain("targetEntityType: abstract_theme")
			expect(result).toContain("subtlety: hidden")
			expect(result).toContain("narrativeWeight: crucial")
			expect(result).toContain("Abstract Target:")
			expect(result).toContain("abstractDetail: Betrayal comes from within")
			expect(result).toContain("abstractType: abstract_theme")
			expect(result).toContain("- symbol_motif")
		})

		it("should handle seeds with NPC target context", () => {
			const npcSeed: ForeshadowingEmbeddingInput = {
				targetEntityType: "Npc",
				targetAbstractDetail: null,
				suggestedDeliveryMethods: ["overheard_conversation"],
				subtlety: "moderate",
				narrativeWeight: "supporting",
				description: ["Hints about the merchant's true nature"],
				targetEntityContext: {
					entityType: "Npc",
					name: "Gareth the Merchant",
					details: {
						occupation: "merchant",
						race: "human",
					},
				},
				sourceEntityContext: {
					sourceType: "Site",
					name: "The Crossroads Inn",
					details: {
						type: "building",
						intendedSiteFunction: "social_interaction_nexus",
					},
				},
			}

			const result = embeddingTextForForeshadowingSeed(npcSeed)

			expect(result).toContain("Foreshadowing Seed: Gareth the Merchant")
			expect(result).toContain("targetEntityType: Npc")
			expect(result).toContain("Target Entity:")
			expect(result).toContain("entity: Gareth the Merchant")
			expect(result).toContain("entityType: Npc")
			expect(result).toContain("occupation: merchant")
			expect(result).toContain("race: human")
			expect(result).toContain("Source Context:")
			expect(result).toContain("source: The Crossroads Inn")
			expect(result).toContain("sourceType: Site")
			expect(result).toContain("type: building")
			expect(result).toContain("intendedSiteFunction: social_interaction_nexus")
		})

		it("should handle seeds with minimal data", () => {
			const minimalSeed: ForeshadowingEmbeddingInput = {
				targetEntityType: "Item",
				targetAbstractDetail: null,
				suggestedDeliveryMethods: ["item_description"],
				subtlety: "obvious",
				narrativeWeight: "minor",
				description: ["Simple foreshadowing"],
			}

			const result = embeddingTextForForeshadowingSeed(minimalSeed)

			expect(result).toContain("Foreshadowing Seed: Item Target")
			expect(result).toContain("Simple foreshadowing")
			expect(result).toContain("targetEntityType: Item")
			expect(result).toContain("subtlety: obvious")
			expect(result).toContain("narrativeWeight: minor")
			expect(result).toContain("- item_description")
			expect(result).not.toContain("Target Entity:")
			expect(result).not.toContain("Source Context:")
		})

		it("should handle seeds with empty arrays gracefully", () => {
			const seedWithEmptyArrays: ForeshadowingEmbeddingInput = {
				targetEntityType: "MajorConflict",
				targetAbstractDetail: null,
				suggestedDeliveryMethods: [],
				subtlety: "subtle",
				narrativeWeight: "major",
				description: [],
			}

			const result = embeddingTextForForeshadowingSeed(seedWithEmptyArrays)

			expect(result).toContain("Foreshadowing Seed: MajorConflict Target")
			expect(result).toContain("targetEntityType: MajorConflict")
			expect(result).toContain("subtlety: subtle")
			expect(result).toContain("narrativeWeight: major")
			expect(result).not.toContain("Suggested Delivery Methods:")
		})

		it("should handle seeds with null fields", () => {
			const seedWithNulls: ForeshadowingEmbeddingInput = {
				targetEntityType: "Faction",
				targetAbstractDetail: null,
				suggestedDeliveryMethods: ["rumor"],
				subtlety: "moderate",
				narrativeWeight: "supporting",
				description: ["Faction-related foreshadowing"],
				targetEntityContext: undefined,
				sourceEntityContext: undefined,
			}

			const result = embeddingTextForForeshadowingSeed(seedWithNulls)

			expect(result).toContain("Foreshadowing Seed: Faction Target")
			expect(result).toContain("Faction-related foreshadowing")
			expect(result).toContain("targetEntityType: Faction")
			expect(result).toContain("- rumor")
			expect(result).not.toContain("Target Entity:")
			expect(result).not.toContain("Source Context:")
			expect(result).not.toContain("Abstract Target:")
		})

		it("should handle seeds with undefined values by omitting those fields", () => {
			const seedWithUndefined: ForeshadowingEmbeddingInput = {
				targetEntityType: undefined,
				targetAbstractDetail: undefined,
				subtlety: undefined,
				narrativeWeight: undefined,
				suggestedDeliveryMethods: undefined,
				description: undefined,
				targetEntityContext: undefined,
				sourceEntityContext: undefined,
			}

			const result = embeddingTextForForeshadowingSeed(seedWithUndefined)

			expect(result).toContain("Foreshadowing Seed: undefined Target")
			expect(result).not.toContain("Foreshadowing Details:")
			expect(result).not.toContain("Target Entity:")
			expect(result).not.toContain("Source Context:")
			expect(result).not.toContain("Suggested Delivery Methods:")
		})
	})
})
