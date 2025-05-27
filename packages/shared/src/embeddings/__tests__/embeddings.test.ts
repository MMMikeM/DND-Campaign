import { describe, expect, it } from "vitest"
import type { majorConflicts } from "../../schemas/conflict/tables"
import type { items } from "../../schemas/items/tables"
import type { npcRelationships, npcs } from "../../schemas/npc/tables"
import type { quests } from "../../schemas/quests/tables"
import { embeddingTextGenerators, getTextForEntity } from "../index"

type Items = typeof items.$inferSelect
type Npcs = typeof npcs.$inferSelect
type Relationships = typeof npcRelationships.$inferSelect
type Quests = typeof quests.$inferSelect
type MajorConflicts = typeof majorConflicts.$inferSelect

// Minimal mock data for integration testing
const mockItem: Items = {
	id: 1,
	name: "Test Sword",
	itemType: "weapon",
	description: ["A test weapon"],
	significance: "Test significance",
	creativePrompts: [],
	gmNotes: [],
	tags: [],
	rarity: "common",
	narrativeRole: "minor",
	perceivedSimplicity: "what_it_seems",
	loreSignificance: "Some lore",
	mechanicalEffects: [],
	creationPeriod: null,
	placeOfOrigin: null,
	relatedQuestId: null,
	embeddingId: null,
} as const

const mockNpc: Npcs = {
	id: 1,
	name: "Test NPC",
	race: "human",
	gender: "male",
	age: "Adult",
	occupation: "Guard",
	alignment: "lawful_neutral",
	disposition: "Neutral",
	attitude: "Professional",
	personalityTraits: ["Dutiful"],
	drives: ["Order"],
	fears: ["Chaos"],
	background: ["Former soldier"],
	knowledge: ["Local laws"],
	secrets: [],
	quirk: "Some quirk",
	appearance: ["Average height"],
	mannerisms: [],
	biases: [],
	socialStatus: "working_class",
	wealth: "poor",
	voiceNotes: [],
	creativePrompts: [],
	description: [],
	gmNotes: [],
	tags: [],
	trustLevel: "neutral",
	adaptability: "rigid",
	complexityProfile: "simple_clear",
	playerPerceptionGoal: "functional_npc",
	availability: "sometimes",
	currentLocationId: null,
	currentGoals: [],
	avoidTopics: [],
	dialogue: [],
	preferredTopics: [],
	rumours: [],
	capability: "medium",
	proactivity: "low",
	relatability: "medium",
	embeddingId: null,
}

const mockRelationship: Relationships = {
	id: 1,
	npcId: 1,
	relatedNpcId: 2,
	relationshipType: "colleague",
	strength: "weak",
	isBidirectional: true,
	history: [],
	description: ["Work together"],
	narrativeTensions: [],
	sharedGoals: [],
	relationshipDynamics: [],
	creativePrompts: [],
	gmNotes: [],
	tags: [],
}

describe("Embedding Integration Tests", () => {
	describe("getTextForEntity", () => {
		it("should route to correct embedding function for items", () => {
			const result = getTextForEntity("items", mockItem)

			// Should use the items embedding function
			expect(result).toContain("Item: Test Sword")
			expect(result).toContain("Type: weapon")
		})

		it("should route to correct embedding function for npcs", () => {
			const result = getTextForEntity("npcs", mockNpc)

			// Should use the npcs embedding function
			expect(result).toContain("Character: Test NPC")
			expect(result).toContain("Race: human")
		})

		it("should handle character relationships with additional data", () => {
			const additionalData = {
				npc1Name: "Alice",
				npc2Name: "Bob",
			}

			const result = getTextForEntity("characterRelationships", mockRelationship, additionalData)

			// Should pass additional data to the relationship function
			expect(result).toContain("Character Relationship: Alice and Bob")
		})

		it("should fallback to JSON for unknown entity types", () => {
			const result = getTextForEntity("unknownEntity" as any, mockItem)

			// Should return JSON representation
			expect(result).toContain('"name":"Test Sword"')
			expect(result).toContain('"itemType":"weapon"')
		})

		it("should handle errors gracefully and fallback to JSON", () => {
			// Test with malformed data that might cause errors
			const malformedData = {
				name: null,
				description: undefined,
				invalidField: Symbol("test"), // This will cause JSON.stringify to fail in some cases
			}

			const result = getTextForEntity("items", malformedData)

			// Should not throw and should return some result
			expect(typeof result).toBe("string")
			expect(result.length).toBeGreaterThan(0)
		})
	})

	describe("embeddingTextGenerators Registry", () => {
		it("should have generators for all supported entity types", () => {
			const expectedEntityTypes = [
				"areas",
				"factionAgendas",
				"factions",
				"foreshadowingSeeds",
				"items",
				"majorConflicts",
				"narrativeDestinations",
				"narrativeEvents",
				"npcs",
				"quests",
				"questStages",
				"regions",
				"siteEncounters",
				"sites",
				"siteSecrets",
				"worldConcepts",
				"consequences",
				"stageDecisions",
				"characterRelationships",
			]

			expectedEntityTypes.forEach((entityType) => {
				expect(embeddingTextGenerators).toHaveProperty(entityType)
				expect(typeof embeddingTextGenerators[entityType as keyof typeof embeddingTextGenerators]).toBe("function")
			})
		})

		it("should have generators that return strings", () => {
			// Test a few key generators
			const itemGenerator = embeddingTextGenerators.items
			const npcGenerator = embeddingTextGenerators.npcs

			expect(typeof itemGenerator(mockItem)).toBe("string")
			expect(typeof npcGenerator(mockNpc)).toBe("string")
		})
	})

	// Note: generateEmbeddingsForEntities tests are skipped as they require API mocking
	// The function is tested indirectly through the text generation tests above

	describe("Error Handling and Edge Cases", () => {
		it("should handle entities with missing required fields", () => {
			const incompleteItem = { name: "Incomplete" } as any

			const result = getTextForEntity("items", incompleteItem)

			// Should not throw and should return some result
			expect(typeof result).toBe("string")
			expect(result).toContain("Incomplete")
		})

		it("should handle null and undefined values gracefully", () => {
			const itemWithNulls = {
				...mockItem,
				description: null,
				significance: undefined,
				mechanicalEffects: null,
			}

			const result = getTextForEntity("items", itemWithNulls)

			// Should not throw and should return valid text
			expect(typeof result).toBe("string")
			expect(result).toContain("Item: Test Sword")
		})

		it("should handle empty arrays and objects", () => {
			const emptyItem = {
				...mockItem,
				description: [],
				mechanicalEffects: [],
				tags: [],
			}

			const result = getTextForEntity("items", emptyItem)

			// Should not throw and should return valid text
			expect(typeof result).toBe("string")
			expect(result).toContain("Item: Test Sword")
		})
	})
})
