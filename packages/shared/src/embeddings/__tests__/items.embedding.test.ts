import { describe, expect, it } from "vitest"
import type { ItemEmbeddingInput } from "../embedding-input-types"
import { embeddingTextForItem } from "../items.embedding"

describe("Items Embedding Functions", () => {
	describe("embeddingTextForItem", () => {
		const mockItemInput: ItemEmbeddingInput = {
			name: "The Shadowbane Sword",
			itemType: "weapon",
			rarity: "legendary",
			narrativeRole: "quest_reward",
			perceivedSimplicity: "complex_mysterious",
			significance: "campaign_defining",
			loreSignificance: "Forged to defeat the Shadow Lord.",
			mechanicalEffects: [
				"+3 enchanted longsword.",
				"Deals extra radiant damage to undead.",
				"Glows in presence of evil.",
			],
			creationPeriod: "The Age of Heroes",
			placeOfOrigin: "The Celestial Forge",
			description: [
				"A magnificent sword with a blade that seems to absorb light.",
				"Ancient runes glow along the fuller when evil is near.",
			],

			// Resolved fields
			relatedQuestName: "The Shadow Lord's Bane",
		}

		it("should generate comprehensive text for an item with all fields", () => {
			const result = embeddingTextForItem(mockItemInput)

			const expectedText = `Item: The Shadowbane Sword
Overview:
A magnificent sword with a blade that seems to absorb light.
Ancient runes glow along the fuller when evil is near.
Basic Information:
Type: weapon
Rarity: legendary
Narrative Role: quest reward
Perceived Simplicity: complex mysterious
Significance: campaign defining
Related Quest: The Shadow Lord's Bane
Lore & History:
Lore Significance: Forged to defeat the Shadow Lord.
Creation Period: The Age of Heroes
Place of Origin: The Celestial Forge
Mechanical Effects:
- +3 enchanted longsword.
- Deals extra radiant damage to undead.
- Glows in presence of evil.`

			expect(result).toBe(expectedText)
		})

		it("should handle items with minimal data", () => {
			const minimalItem: ItemEmbeddingInput = {
				name: "Simple Dagger",
				itemType: "weapon",
			}

			const result = embeddingTextForItem(minimalItem)
			const expectedMinimalText = `Item: Simple Dagger
Basic Information:
Type: weapon`
			expect(result).toBe(expectedMinimalText)
		})

		it("should handle items with empty arrays gracefully", () => {
			const itemWithEmptyArrays: ItemEmbeddingInput = {
				name: "Basic Item",
				mechanicalEffects: [],
				description: [],
			}

			const result = embeddingTextForItem(itemWithEmptyArrays)
			const expectedEmptyText = "Item: Basic Item"
			expect(result).toBe(expectedEmptyText)
		})

		it("should handle items with null related quest", () => {
			const itemWithNullQuest: ItemEmbeddingInput = {
				name: "Standalone Item",
				itemType: "trinket",
				relatedQuestName: null,
				description: [],
			}

			const result = embeddingTextForItem(itemWithNullQuest)
			const expectedNullQuestText = `Item: Standalone Item
Basic Information:
Type: trinket`
			expect(result).toBe(expectedNullQuestText)
		})

		it("should handle items with complex mechanical effects", () => {
			const complexItem: ItemEmbeddingInput = {
				name: "Staff of Many Powers",
				itemType: "staff",
				mechanicalEffects: [
					"Spell focus: +2 to spell attack rolls.",
					"3 charges per day: cast fireball (3rd level).",
					"Once per week: cast teleport.",
					"Passive: immunity to charm effects.",
				],
				description: [],
			}

			const result = embeddingTextForItem(complexItem)
			const expectedComplexText = `Item: Staff of Many Powers
Basic Information:
Type: staff
Mechanical Effects:
- Spell focus: +2 to spell attack rolls.
- 3 charges per day: cast fireball (3rd level).
- Once per week: cast teleport.
- Passive: immunity to charm effects.`
			expect(result).toBe(expectedComplexText)
		})

		it("should handle items with undefined values by omitting those fields", () => {
			const itemWithUndefined: ItemEmbeddingInput = {
				name: "Undefined Item",
				itemType: undefined,
				rarity: undefined,
				narrativeRole: undefined,
				perceivedSimplicity: undefined,
				significance: undefined,
				loreSignificance: undefined,
				creationPeriod: undefined,
				placeOfOrigin: undefined,
				relatedQuestName: undefined,
				mechanicalEffects: [],
				description: [],
			}

			const result = embeddingTextForItem(itemWithUndefined)
			const expectedUndefinedText = "Item: Undefined Item"
			expect(result).toBe(expectedUndefinedText)
		})
	})
})
