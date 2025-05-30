import { describe, expect, it } from "vitest"
import type { ItemEmbeddingInput, RecursiveRequired } from "../embedding-input-types"
import { embeddingTextForItem } from "../entities/items.embedding"

describe("Items Embedding Functions", () => {
	describe("embeddingTextForItem", () => {
		const mockItemInput: RecursiveRequired<ItemEmbeddingInput> = {
			name: "Shadowbane Sword",
			itemType: "weapon",
			rarity: "legendary",
			narrativeRole: "quest_key",
			perceivedSimplicity: "deceptively_simple",
			significance: "Key to defeating the Shadow Lord",
			loreSignificance: "Forged in the first age to combat darkness",
			mechanicalEffects: ["+3 magical weapon", "Deals extra radiant damage to undead", "Glows in presence of evil"],
			creationPeriod: "First Age",
			placeOfOrigin: "The Celestial Forge",
			description: [
				"A blade of gleaming silver with runes that pulse with holy light.",
				"The crossguard is shaped like angel wings.",
				"The pommel contains a fragment of a fallen star.",
			],

			directlyRelatedQuest: {
				name: "The Hunt for Shadowbane",
				type: "main",
			},

			contextualRelationships: [
				{
					relationshipType: "owned_by",
					relationshipDetails: "The sword's most famous wielder",
					description: ["Historical ownership by a legendary paladin"],
					relatedEntity: {
						entityType: "Npc",
						name: "Sir Galahad the Pure",
						details: {
							occupation: "paladin",
							race: "human",
						},
					},
				},
				{
					relationshipType: "connected_to",
					relationshipDetails: "Central to the conflict against darkness",
					description: ["Key weapon in the eternal struggle"],
					relatedEntity: {
						entityType: "Conflict",
						name: "The War of Shadows",
						details: {
							scope: "continental",
							natures: ["mystical", "military"],
						},
					},
				},
			],

			notableHistory: [
				{
					eventDescription: "Forged by the angel Seraphiel",
					timeframe: "First Age",
					npcRoleInEvent: "Creator",
					description: ["The divine creation of the blade"],
					keyNpcInvolved: {
						name: "Seraphiel the Smith",
						occupation: "celestial_smith",
					},
					eventLocation: {
						name: "The Celestial Forge",
						type: "temple",
					},
				},
				{
					eventDescription: "Used to banish the first Shadow Lord",
					timeframe: "War of Shadows",
					npcRoleInEvent: "Wielder",
					description: ["The blade's first great victory"],
					keyNpcInvolved: {
						name: "Sir Galahad the Pure",
						occupation: "paladin",
					},
					eventLocation: {
						name: "The Dark Citadel",
						type: "fortress",
					},
				},
			],
		}

		it("should generate comprehensive text for an item with all fields", () => {
			const result = embeddingTextForItem(mockItemInput)

			expect(result).toContain("Item: Shadowbane Sword")
			expect(result).toContain("A blade of gleaming silver with runes that pulse with holy light.")
			expect(result).toContain("The crossguard is shaped like angel wings.")
			expect(result).toContain("The pommel contains a fragment of a fallen star.")
			expect(result).toContain("type: weapon")
			expect(result).toContain("rarity: legendary")
			expect(result).toContain("narrativeRole: quest_key")
			expect(result).toContain("perceivedSimplicity: deceptively_simple")
			expect(result).toContain("significance: Key to defeating the Shadow Lord")
			expect(result).toContain("loreSignificance: Forged in the first age to combat darkness")
			expect(result).toContain("creationPeriod: First Age")
			expect(result).toContain("placeOfOrigin: The Celestial Forge")
			expect(result).toContain("Mechanical Effects:")
			expect(result).toContain("- +3 magical weapon")
			expect(result).toContain("- Deals extra radiant damage to undead")
			expect(result).toContain("- Glows in presence of evil")
			expect(result).toContain("Related Quest:")
			expect(result).toContain("quest: The Hunt for Shadowbane")
			expect(result).toContain("questType: main")
			expect(result).toContain("Contextual Relationships:")
			expect(result).toContain("Relationship Type: owned_by")
			expect(result).toContain("Related Entity: Sir Galahad the Pure (Npc)")
			expect(result).toContain("NPC Details:")
			expect(result).toContain("Occupation: paladin")
			expect(result).toContain("Race: human")
			expect(result).toContain("Notable History:")
			expect(result).toContain("Event: Forged by the angel Seraphiel")
			expect(result).toContain("Timeframe: First Age")
			expect(result).toContain("NPC Role: Creator")
			expect(result).toContain("Key NPC: Seraphiel the Smith (celestial_smith)")
			expect(result).toContain("Event Location: The Celestial Forge (temple)")
		})

		it("should handle items with minimal data", () => {
			const minimalItem: ItemEmbeddingInput = {
				name: "Simple Dagger",
				itemType: "weapon",
				rarity: "common",
				narrativeRole: "simple_reward",
				perceivedSimplicity: "what_it_seems",
				significance: "A basic weapon",
				loreSignificance: "Common craftsmanship",
				mechanicalEffects: ["+1 weapon"],
				creationPeriod: null,
				placeOfOrigin: null,
				description: ["A plain steel dagger"],
			}

			const result = embeddingTextForItem(minimalItem)

			expect(result).toContain("Item: Simple Dagger")
			expect(result).toContain("A plain steel dagger")
			expect(result).toContain("type: weapon")
			expect(result).toContain("rarity: common")
			expect(result).toContain("narrativeRole: simple_reward")
			expect(result).toContain("- +1 weapon")
			expect(result).not.toContain("Related Quest:")
			expect(result).not.toContain("Contextual Relationships:")
			expect(result).not.toContain("Notable History:")
		})

		it("should handle items with empty arrays gracefully", () => {
			const itemWithEmptyArrays: ItemEmbeddingInput = {
				name: "Empty Item",
				itemType: "tool",
				rarity: "uncommon",
				narrativeRole: "utility_tool",
				perceivedSimplicity: "what_it_seems",
				significance: "A mysterious tool",
				loreSignificance: "Unknown origins",
				mechanicalEffects: [],
				creationPeriod: null,
				placeOfOrigin: null,
				description: [],
				contextualRelationships: [],
				notableHistory: [],
			}

			const result = embeddingTextForItem(itemWithEmptyArrays)

			expect(result).toContain("Item: Empty Item")
			expect(result).toContain("type: tool")
			expect(result).toContain("rarity: uncommon")
			expect(result).not.toContain("Mechanical Effects:")
			expect(result).not.toContain("Contextual Relationships:")
			expect(result).not.toContain("Notable History:")
		})

		it("should handle items with null fields", () => {
			const itemWithNulls: ItemEmbeddingInput = {
				name: "Mysterious Artifact",
				itemType: "treasure",
				rarity: "rare",
				narrativeRole: "thematic_symbol",
				perceivedSimplicity: "obviously_complex",
				significance: "Unknown purpose",
				loreSignificance: "Shrouded in mystery",
				mechanicalEffects: ["Unknown effects"],
				description: ["An artifact of unknown origin"],
				creationPeriod: null,
				placeOfOrigin: null,
				directlyRelatedQuest: undefined,
				contextualRelationships: undefined,
				notableHistory: undefined,
			}

			const result = embeddingTextForItem(itemWithNulls)

			expect(result).toContain("Item: Mysterious Artifact")
			expect(result).toContain("An artifact of unknown origin")
			expect(result).toContain("type: treasure")
			expect(result).toContain("rarity: rare")
			expect(result).toContain("- Unknown effects")
			expect(result).not.toContain("Related Quest:")
			expect(result).not.toContain("Contextual Relationships:")
			expect(result).not.toContain("Notable History:")
		})

		it("should handle items with complex relationships", () => {
			const complexItem: ItemEmbeddingInput = {
				name: "Crown of Kings",
				itemType: "treasure",
				rarity: "artifact",
				narrativeRole: "emotional_anchor",
				perceivedSimplicity: "obviously_complex",
				significance: "Symbol of rightful rule",
				loreSignificance: "Ancient symbol of monarchy",
				mechanicalEffects: ["Grants authority", "Inspires loyalty"],
				creationPeriod: null,
				placeOfOrigin: null,
				description: ["A golden crown adorned with precious gems"],
				contextualRelationships: [
					{
						relationshipType: "owned_by",
						relationshipDetails: "Hereditary symbol of the monarchy",
						description: ["Traditional crown of the royal house"],
						relatedEntity: {
							entityType: "Faction",
							name: "The Royal House",
							details: {
								type: ["noble_house"],
							},
						},
					},
					{
						relationshipType: "sought_by",
						relationshipDetails: "Rightful heir seeking to reclaim his throne",
						description: ["The prince's quest for legitimacy"],
						relatedEntity: {
							entityType: "Npc",
							name: "Prince Aldric",
							details: {
								occupation: "noble",
								race: "human",
							},
						},
					},
				],
			}

			const result = embeddingTextForItem(complexItem)

			expect(result).toContain("Item: Crown of Kings")
			expect(result).toContain("A golden crown adorned with precious gems")
			expect(result).toContain("type: treasure")
			expect(result).toContain("rarity: artifact")
			expect(result).toContain("narrativeRole: emotional_anchor")
			expect(result).toContain("Contextual Relationships:")
			expect(result).toContain("Relationship Type: owned_by")
			expect(result).toContain("Related Entity: The Royal House (Faction)")
			expect(result).toContain("Faction Details:")
			expect(result).toContain("Relationship Type: sought_by")
			expect(result).toContain("Related Entity: Prince Aldric (Npc)")
			expect(result).toContain("NPC Details:")
			expect(result).toContain("Occupation: noble")
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
				mechanicalEffects: undefined,
				creationPeriod: undefined,
				placeOfOrigin: undefined,
				description: undefined,
				directlyRelatedQuest: undefined,
				contextualRelationships: undefined,
				notableHistory: undefined,
			}

			const result = embeddingTextForItem(itemWithUndefined)

			expect(result).toContain("Item: Undefined Item")
			expect(result).not.toContain("Basic Information:")
			expect(result).not.toContain("Mechanical Effects:")
			expect(result).not.toContain("Related Quest:")
			expect(result).not.toContain("Contextual Relationships:")
			expect(result).not.toContain("Notable History:")
		})
	})
})
