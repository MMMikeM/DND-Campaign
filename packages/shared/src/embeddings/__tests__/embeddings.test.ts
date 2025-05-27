import { describe, expect, it } from "vitest"
import type { majorConflicts } from "../../schemas/conflict/tables"
import type { items } from "../../schemas/items/tables"
import type { npcRelationships, npcs } from "../../schemas/npc/tables"
import type { quests } from "../../schemas/quests/tables"
import { embeddingTextForMajorConflict } from "../conflicts.embedding"
import { getTextForEntity } from "../index"
import { embeddingTextForItem } from "../items.embedding"
import { embeddingTextForCharacterRelationship, embeddingTextForNpc } from "../npcs.embedding"
import { embeddingTextForQuest } from "../quests.embedding"

type Items = typeof items.$inferSelect
type Npcs = typeof npcs.$inferSelect
type Relationships = typeof npcRelationships.$inferSelect
type Quests = typeof quests.$inferSelect
type MajorConflicts = typeof majorConflicts.$inferSelect

// Mock data for testing
const mockItem: Items = {
	id: 1,
	name: "Sword of Testing",
	itemType: "weapon",
	description: ["A magical sword used for testing purposes"],
	significance: "Legendary artifact with plot significance",
	creativePrompts: [],
	gmNotes: [],
	tags: [],
	rarity: "legendary",
	narrativeRole: "quest_key",
	perceivedSimplicity: "what_it_seems",
	loreSignificance: "Ancient weapon of power",
	mechanicalEffects: ["Deals extra damage", "Glows in darkness"],
	creationPeriod: null,
	placeOfOrigin: null,
	relatedQuestId: null,
	embeddingId: null,
} as const

const mockNpc: Npcs = {
	id: 1,
	name: "Elara Moonwhisper",
	race: "elf",
	gender: "female",
	age: "Adult",
	occupation: "Wizard",
	alignment: "chaotic_good",
	disposition: "Friendly",
	attitude: "Helpful",
	personalityTraits: ["Curious", "Brave", "Scholarly"],
	drives: ["Knowledge", "Justice"],
	fears: ["Undeath", "Losing friends"],
	background: ["Former court wizard turned adventurer"],
	knowledge: ["Arcane lore", "Ancient history"],
	secrets: ["Has a secret library", "Knows the location of a lost artifact"],
	quirk: "Always carries a small crystal",
	appearance: ["Tall with silver hair and green eyes"],
	mannerisms: ["Taps fingers when thinking", "Quotes ancient texts"],
	biases: ["Distrusts necromancers"],
	socialStatus: "Respected scholar",
	wealth: "comfortable",
	voiceNotes: ["Speaks with a melodic tone"],
	creativePrompts: [],
	description: [],
	gmNotes: [],
	tags: [],
	trustLevel: "trusted",
	adaptability: "flexible",
	complexityProfile: "contextual_flawed_understandable",
	playerPerceptionGoal: "trustworthy_ally_anchor",
	availability: "often",
	currentLocationId: null,
	currentGoals: [],
	avoidTopics: [],
	dialogue: [],
	preferredTopics: [],
	rumours: [],
	capability: "high",
	proactivity: "high",
	relatability: "high",
	embeddingId: null,
}

const mockRelationship: Relationships = {
	id: 1,
	npcId: 1,
	relatedNpcId: 2,
	relationshipType: "ally",
	strength: "strong",
	isBidirectional: true,
	history: ["Fought together in the war", "Saved each other's lives"],
	description: ["Close friends and trusted allies"],
	narrativeTensions: ["Different approaches to justice"],
	sharedGoals: ["Protect the realm", "Defeat the dark lord"],
	relationshipDynamics: ["Mutual respect", "Friendly rivalry"],
	creativePrompts: [],
	gmNotes: [],
	tags: [],
}

const mockQuest: Quests = {
	id: 1,
	name: "The Lost Artifact",
	type: "main",
	description: ["Find the ancient artifact before it falls into evil hands"],
	objectives: ["Locate the artifact", "Defeat the guardians", "Return safely"],
	themes: ["Adventure", "Mystery", "Heroism"],
	mood: "Urgent",
	urgency: "urgent",
	visibility: "known",
	successOutcomes: ["Artifact secured", "Evil plot foiled"],
	failureOutcomes: ["Artifact stolen", "Darkness spreads"],
	rewards: ["Gold", "Magic item", "Reputation"],
	inspirations: ["Indiana Jones", "Lord of the Rings"],
	creativePrompts: [],
	gmNotes: [],
	tags: [],
	regionId: null,
	moralSpectrumFocus: "clear_right_wrong",
	intendedPacingRole: "action_peak",
	primaryPlayerExperienceGoal: "heroism_clarity",
	prerequisiteQuestId: null,
	otherUnlockConditionsNotes: null,
	embeddingId: null,
}

const mockConflict: MajorConflicts = {
	id: 1,
	name: "The Goblin Uprising",
	scope: "regional",
	status: "active",
	cause: "Displacement from their ancestral lands",
	description: ["Goblins have united under a charismatic leader"],
	stakes: ["Control of the northern trade routes"],
	moralDilemma: "The goblins have legitimate grievances",
	hiddenTruths: ["The leader is being manipulated", "Ancient magic is involved"],
	possibleOutcomes: ["Peaceful resolution", "Military victory", "Escalation"],
	primaryRegionId: 1,
	creativePrompts: [],
	gmNotes: [],
	tags: [],
	natures: ["political", "military"],
	clarityOfRightWrong: "competing_legitimate_grievances",
	currentTensionLevel: "high",
	embeddingId: null,
}

describe("Individual Embedding Functions", () => {
	describe("embeddingTextForItem", () => {
		it("should generate proper text for an item", () => {
			const result = embeddingTextForItem(mockItem)

			expect(result).toContain("Name: Sword of Testing")
			expect(result).toContain("Item Type: weapon")
			expect(result).toContain("Description: A magical sword used for testing purposes")
			expect(result).toContain("Significance: Legendary artifact with plot significance")
		})

		it("should handle items with missing optional fields", () => {
			const minimalItem = {
				...mockItem,
				mechanicalEffects: [],
			}

			const result = embeddingTextForItem(minimalItem)
			expect(result).toContain("Name: Sword of Testing")
			expect(result).not.toContain("Mechanical Effects:")
		})
	})

	describe("embeddingTextForNpc", () => {
		it("should generate comprehensive text for an NPC", () => {
			const result = embeddingTextForNpc(mockNpc)

			expect(result).toContain("Name: Elara Moonwhisper")
			expect(result).toContain("Race: elf")
			expect(result).toContain("Occupation: Wizard")
			expect(result).toContain("Personality Traits:")
			expect(result).toContain("- Personality Trait: Curious")
			expect(result).toContain("- Drive: Knowledge")
			expect(result).toContain("- Fear: Undeath")
			expect(result).toContain("- Knowledge: Arcane lore")
			expect(result).toContain("- Secret: Has a secret library")
		})

		it("should not include voiceNotes in embeddings", () => {
			const result = embeddingTextForNpc(mockNpc)
			expect(result).not.toContain("Voice Notes")
			expect(result).not.toContain("melodic tone")
		})
	})

	describe("embeddingTextForCharacterRelationship", () => {
		it("should generate basic relationship text without NPC names", () => {
			const result = embeddingTextForCharacterRelationship(mockRelationship)

			expect(result).toContain("Strength: strong")
			expect(result).toContain("Description: Close friends and trusted allies")
			expect(result).toContain("Narrative Tensions: Narrative Tension: Different approaches to justice")
			expect(result).toContain("- Shared Goal: Protect the realm")
		})

		it("should generate enhanced text with NPC names", () => {
			const result = embeddingTextForCharacterRelationship(mockRelationship, "Elara Moonwhisper", "Gareth Ironforge")

			expect(result).toContain("Relationship between Elara Moonwhisper and Gareth Ironforge:")
			expect(result).toContain("Type: ally")
			expect(result).toContain("Direction: Bidirectional relationship")
			expect(result).toContain("Strength: strong")
		})

		it("should handle one-way relationships", () => {
			const oneWayRelationship = {
				...mockRelationship,
				isBidirectional: false,
			}

			const result = embeddingTextForCharacterRelationship(oneWayRelationship, "Elara", "Gareth")

			expect(result).toContain("Direction: One-way relationship")
		})
	})

	describe("embeddingTextForQuest", () => {
		it("should generate comprehensive quest text", () => {
			const result = embeddingTextForQuest(mockQuest)

			expect(result).toContain("Name: The Lost Artifact")
			expect(result).toContain("Type: main")
			expect(result).toContain("Objectives:")
			expect(result).toContain("- Objective: Locate the artifact")
			expect(result).toContain("- Theme: Adventure")
			expect(result).toContain("- Success Outcome: Artifact secured")
			expect(result).toContain("- Reward: Gold")
		})
	})

	describe("embeddingTextForMajorConflict", () => {
		it("should generate conflict text without hydration", () => {
			const result = embeddingTextForMajorConflict(mockConflict)

			expect(result).toContain("Name: The Goblin Uprising")
			expect(result).toContain("Scope: regional")
			expect(result).toContain("Status: active")
			expect(result).toContain("- Hidden Truth: The leader is being manipulated")
			expect(result).toContain("- Possible Outcome: Peaceful resolution")
		})

		it("should include hydrated region information", () => {
			const hydratedConflict = {
				...mockConflict,
				primaryRegionName: "Darkwood Forest",
			}

			const result = embeddingTextForMajorConflict(hydratedConflict)

			expect(result).toContain("Name: The Goblin Uprising")
			expect(result).toContain("Primary Location: The conflict is centered in Darkwood Forest.")
		})
	})
})

describe("getTextForEntity Integration", () => {
	it("should route to correct embedding function", () => {
		const result = getTextForEntity("items", mockItem)
		expect(result).toContain("Name: Sword of Testing")
		expect(result).toContain("Item Type: weapon")
	})

	it("should handle character relationships with additional data", () => {
		const additionalData = {
			npc1Name: "Elara",
			npc2Name: "Gareth",
		}

		const result = getTextForEntity("characterRelationships", mockRelationship, additionalData)
		expect(result).toContain("Relationship between Elara and Gareth:")
	})

	it("should fallback to JSON for unknown entity types", () => {
		const result = getTextForEntity("unknownEntity" as any, mockItem)
		expect(result).toContain('"name":"Sword of Testing"')
	})

	it("should handle errors gracefully", () => {
		// Test with malformed data that might cause errors
		const malformedData = {
			name: null,
			description: undefined,
		}

		const result = getTextForEntity("items", malformedData)
		// Should not throw and should return some result
		expect(typeof result).toBe("string")
	})
})

describe("Field Configuration", () => {
	it("should format arrays with item type names", () => {
		const result = embeddingTextForNpc(mockNpc)

		// Check that arrays are formatted with type names
		expect(result).toContain("- Personality Trait:")
		expect(result).toContain("- Drive:")
		expect(result).toContain("- Fear:")
		expect(result).not.toContain("Personality Traits: Curious. Brave. Scholarly")
	})

	it("should format boolean values descriptively", () => {
		const result = embeddingTextForCharacterRelationship(mockRelationship, "Elara", "Gareth")

		expect(result).toContain("Direction: Bidirectional relationship")
	})
})

describe("Field Selection", () => {
	it("should exclude GM-only fields", () => {
		const result = embeddingTextForNpc(mockNpc)

		// Should not include GM-only fields
		expect(result).not.toContain("voiceNotes")
		expect(result).not.toContain("creativePrompts")
		expect(result).not.toContain("gmNotes")
	})

	it("should include core semantic fields", () => {
		const result = embeddingTextForQuest(mockQuest)

		// Should include important semantic fields
		expect(result).toContain("Name:")
		expect(result).toContain("Type:")
		expect(result).toContain("Description:")
		expect(result).toContain("Objectives:")
		expect(result).toContain("Themes:")
	})
})
