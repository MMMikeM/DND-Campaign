import { beforeEach, describe, expect, it, vi } from "vitest"
import type { majorConflicts } from "../../schemas/conflict/tables"
import type { npcRelationships } from "../../schemas/npc/tables"
import type { quests } from "../../schemas/quests/tables"
import {
	createHydrationHelper,
	createRelationshipHydrationHelper,
	hydrateMajorConflict,
	hydrateNpcRelationship,
	hydrateQuest,
} from "../hydration"

// Mock functions for database operations
const mockFetchRegionName = vi.fn()
const mockFetchParticipantNames = vi.fn()
const mockFetchNpcName = vi.fn()
const mockFetchQuestNpcs = vi.fn()

type Conflict = typeof majorConflicts.$inferSelect
type Relationship = typeof npcRelationships.$inferSelect
type Quest = typeof quests.$inferSelect

// Mock data
const mockConflict: Conflict = {
	id: 1,
	creativePrompts: [],
	description: [],
	gmNotes: [],
	tags: [],
	primaryRegionId: 1,
	name: "The Goblin Uprising",
	scope: "regional",
	natures: ["political"],
	status: "active",
	cause: "Territorial dispute over ancient ruins",
	stakes: ["Control of magical artifacts", "Regional stability"],
	moralDilemma: "Both sides have legitimate claims to the territory",
	possibleOutcomes: ["Peaceful resolution", "Military victory", "Mutual destruction"],
	hiddenTruths: ["The ruins contain a powerful artifact"],
	clarityOfRightWrong: "competing_legitimate_grievances",
	currentTensionLevel: "high",
	embeddingId: null,
}

const mockRelationship: Relationship = {
	id: 1,
	creativePrompts: [],
	description: [],
	gmNotes: [],
	tags: [],
	npcId: 1,
	relatedNpcId: 2,
	relationshipType: "ally",
	strength: "strong",
	history: [],
	narrativeTensions: [],
	sharedGoals: [],
	relationshipDynamics: [],
	isBidirectional: false,
}

const mockQuest: Quest = {
	id: 1,
	creativePrompts: [],
	description: [],
	gmNotes: [],
	tags: [],
	name: "The Lost Artifact",
	regionId: 1,
	type: "main",
	urgency: "developing",
	visibility: "known",
	mood: "mysterious",
	moralSpectrumFocus: "clear_right_wrong",
	intendedPacingRole: "tension_builder",
	primaryPlayerExperienceGoal: "mystery_solving",
	failureOutcomes: [],
	successOutcomes: [],
	objectives: [],
	rewards: [],
	themes: [],
	inspirations: [],
	prerequisiteQuestId: null,
	otherUnlockConditionsNotes: null,
	embeddingId: null,
}

describe("Hydration Functions", () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe("hydrateMajorConflict", () => {
		it("should hydrate conflict with region name", async () => {
			mockFetchRegionName.mockResolvedValue("Darkwood Forest")
			mockFetchParticipantNames.mockResolvedValue(["Goblin King", "Orc Warlord"])

			const result = await hydrateMajorConflict(mockConflict, mockFetchRegionName, mockFetchParticipantNames)

			expect(result).toEqual({
				...mockConflict,
				primaryRegionName: "Darkwood Forest",
				participantNames: ["Goblin King", "Orc Warlord"],
			})

			expect(mockFetchRegionName).toHaveBeenCalledWith(1)
			expect(mockFetchParticipantNames).toHaveBeenCalledWith(1)
		})

		it("should handle missing region gracefully", async () => {
			mockFetchRegionName.mockResolvedValue(null)
			mockFetchParticipantNames.mockResolvedValue([])

			const result = await hydrateMajorConflict(mockConflict, mockFetchRegionName, mockFetchParticipantNames)

			expect(result).toEqual(mockConflict)
			expect(result.primaryRegionName).toBeUndefined()
			expect(result.participantNames).toBeUndefined()
		})

		it("should handle conflicts without primaryRegionId", async () => {
			const conflictWithoutRegion = { ...mockConflict, primaryRegionId: null }

			const result = await hydrateMajorConflict(conflictWithoutRegion, mockFetchRegionName, mockFetchParticipantNames)

			expect(mockFetchRegionName).not.toHaveBeenCalled()
			expect(result.primaryRegionName).toBeUndefined()
		})
	})

	describe("hydrateNpcRelationship", () => {
		it("should hydrate relationship with NPC names", async () => {
			mockFetchNpcName.mockResolvedValueOnce("Elara Moonwhisper").mockResolvedValueOnce("Gareth Ironforge")

			const result = await hydrateNpcRelationship(mockRelationship, mockFetchNpcName)

			expect(result).toEqual({
				relationship: mockRelationship,
				additionalData: {
					npc1Name: "Elara Moonwhisper",
					npc2Name: "Gareth Ironforge",
				},
			})

			expect(mockFetchNpcName).toHaveBeenCalledWith(1)
			expect(mockFetchNpcName).toHaveBeenCalledWith(2)
		})

		it("should handle missing NPCs gracefully", async () => {
			mockFetchNpcName.mockResolvedValue(null)

			const result = await hydrateNpcRelationship(mockRelationship, mockFetchNpcName)

			expect(result).toEqual({
				relationship: mockRelationship,
				additionalData: {},
			})
		})

		it("should handle partial NPC data", async () => {
			mockFetchNpcName.mockResolvedValueOnce("Elara Moonwhisper").mockResolvedValueOnce(null)

			const result = await hydrateNpcRelationship(mockRelationship, mockFetchNpcName)

			expect(result.additionalData).toEqual({
				npc1Name: "Elara Moonwhisper",
			})
		})
	})

	describe("hydrateQuest", () => {
		it("should hydrate quest with region and NPC names", async () => {
			mockFetchRegionName.mockResolvedValue("Ancient Ruins")
			mockFetchQuestNpcs.mockResolvedValue([1, 2])
			mockFetchNpcName.mockResolvedValueOnce("Quest Giver").mockResolvedValueOnce("Important NPC")

			const result = await hydrateQuest(mockQuest, mockFetchNpcName, mockFetchRegionName, mockFetchQuestNpcs)

			expect(result).toEqual({
				...mockQuest,
				primaryRegionName: "Ancient Ruins",
				relatedNpcNames: ["Quest Giver", "Important NPC"],
			})
		})

		it("should filter out null NPC names", async () => {
			mockFetchRegionName.mockResolvedValue("Ancient Ruins")
			mockFetchQuestNpcs.mockResolvedValue([1, 2, 3])
			mockFetchNpcName
				.mockResolvedValueOnce("Valid NPC")
				.mockResolvedValueOnce(null)
				.mockResolvedValueOnce("Another Valid NPC")

			const result = await hydrateQuest(mockQuest, mockFetchNpcName, mockFetchRegionName, mockFetchQuestNpcs)

			expect(result.relatedNpcNames).toEqual(["Valid NPC", "Another Valid NPC"])
		})
	})
})

describe("Hydration Helpers", () => {
	describe("createHydrationHelper", () => {
		it("should create a helper function that applies hydration", async () => {
			const mockHydrateFunction = vi.fn().mockResolvedValue({ hydrated: true })
			const helper = createHydrationHelper(mockHydrateFunction)

			const testRecord = { id: "test" }
			const result = await helper(testRecord)

			expect(mockHydrateFunction).toHaveBeenCalledWith(testRecord)
			expect(result).toEqual({ hydrated: true })
		})
	})

	describe("createRelationshipHydrationHelper", () => {
		it("should create a helper that extracts additional data", async () => {
			const mockHydrateFunction = vi.fn().mockResolvedValue({
				relationship: mockRelationship,
				additionalData: { npc1Name: "Test NPC" },
			})

			const helper = createRelationshipHydrationHelper(mockHydrateFunction)
			const result = await helper(mockRelationship)

			expect(result).toEqual({ npc1Name: "Test NPC" })
		})
	})
})

describe("Integration with generateEmbeddingsForEntities", () => {
	it("should work with hydration helpers", async () => {
		// Test the hydration helper functionality without calling the actual embedding API
		const mockHydrateFunction = vi.fn().mockImplementation(async (conflict) => ({
			...conflict,
			primaryRegionName: "Test Region",
		}))

		const helper = createHydrationHelper(mockHydrateFunction)

		// Test that the helper correctly applies hydration
		const result = await helper(mockConflict)
		expect(result).toEqual({
			...mockConflict,
			primaryRegionName: "Test Region",
		})
		expect(mockHydrateFunction).toHaveBeenCalledWith(mockConflict)
	})

	it("should work with relationship hydration helpers", async () => {
		// Test the relationship hydration helper functionality
		const mockHydrateFunction = vi.fn().mockResolvedValue({
			relationship: mockRelationship,
			additionalData: { npc1Name: "Elara", npc2Name: "Gareth" },
		})

		const helper = createRelationshipHydrationHelper(mockHydrateFunction)

		// Test that the helper correctly extracts additional data
		const result = await helper(mockRelationship)
		expect(result).toEqual({ npc1Name: "Elara", npc2Name: "Gareth" })
		expect(mockHydrateFunction).toHaveBeenCalledWith(mockRelationship)
	})
})

describe("Error Handling", () => {
	it("should handle hydration function errors gracefully", async () => {
		const errorHydrateFunction = vi.fn().mockRejectedValue(new Error("Database error"))

		await expect(hydrateMajorConflict(mockConflict, errorHydrateFunction, mockFetchParticipantNames)).rejects.toThrow(
			"Database error",
		)
	})

	it("should handle partial hydration failures", async () => {
		mockFetchRegionName.mockResolvedValue("Valid Region")
		mockFetchParticipantNames.mockRejectedValue(new Error("Participants fetch failed"))

		await expect(hydrateMajorConflict(mockConflict, mockFetchRegionName, mockFetchParticipantNames)).rejects.toThrow(
			"Participants fetch failed",
		)
	})
})
