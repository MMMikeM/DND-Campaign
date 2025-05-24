import { describe, expect, it } from "vitest"
import { buildStageTree, type RawQuestStage, type StageNode } from "./entities"

// Create a mock of RawQuestStage type for testing
type MockRawQuestStage = {
	id: number
	name: string
	stage: number
	dramatic_question: string
	location: { id: number; name: string } | null
	outgoingDecisions: Array<{
		id: number
		name: string
		decision_type: string
		conditionType: string
		consequences: unknown[]
		fromStageId: number
		toStageId: number | null
		conditionValue: string
		toStage?: { id: number } | null
	}>
	// Add minimal required properties that would exist in the real RawQuestStage
	incomingDecisions: unknown[]
}

// Helper type guard to distinguish between regular stage nodes and cycle markers
// Uses the StageBaseProps & { branches: ...} structure from the updated type
function isStageWithBranches(node: StageNode): node is Extract<
	StageNode,
	{
		branches: Array<{
			decision: {
				id: number
				name: string
				decision_type: string
				conditionType: string
				consequences: unknown[]
				fromStageId: number
				toStageId: number | null
				conditionValue: string
				toStage?: { id: number } | null
			}
			nextStage: StageNode | { id: number; isCycle: true } | null
		}>
	}
> {
	return node !== null && !("isCycle" in node)
}

describe("buildStageTree", () => {
	// Test case 1: Basic tree with a single stage (no branches)
	it("should build a simple tree with no branches", () => {
		// Mock data setup
		const stageMap = new Map<number, MockRawQuestStage>([
			[
				1,
				{
					id: 1,
					name: "Introduction",
					stage: 1,
					dramatic_question: "How will the heroes begin their journey?",
					location: { id: 101, name: "Village Square" },
					outgoingDecisions: [],
					incomingDecisions: [],
				},
			],
		])

		// Execute test with a more specific cast
		const result = buildStageTree(1, stageMap as unknown as Map<number, RawQuestStage>)

		// Assertions
		expect(result).toEqual({
			id: 1,
			name: "Introduction",
			stage: 1,
			dramatic_question: "How will the heroes begin their journey?",
			location: { id: 101, name: "Village Square" },
			branches: [],
		})
	})

	// Test case 2: Linear tree with multiple stages
	it("should build a linear tree with multiple stages", () => {
		// Mock data setup
		const stageMap = new Map<number, MockRawQuestStage>([
			[
				1,
				{
					id: 1,
					name: "Introduction",
					stage: 1,
					dramatic_question: "How will the heroes begin?",
					location: { id: 101, name: "Village Square" },
					outgoingDecisions: [
						{
							id: 201,
							name: "Travel to the Forest",
							decision_type: "tactical_decision",
							conditionType: "choice",
							consequences: [],
							fromStageId: 1,
							toStageId: 2,
							conditionValue: "Travel to the forest",
							toStage: { id: 2 },
						},
					],
					incomingDecisions: [],
				},
			],
			[
				2,
				{
					id: 2,
					name: "Forest Encounter",
					stage: 2,
					dramatic_question: "What lurks in the forest?",
					location: { id: 102, name: "Dark Forest" },
					outgoingDecisions: [],
					incomingDecisions: [],
				},
			],
		])

		// Execute test with a more specific cast
		const result = buildStageTree(1, stageMap as unknown as Map<number, RawQuestStage>)

		// Verify the structure is as expected
		expect(result).not.toBeNull()
		expect(isStageWithBranches(result)).toBeTruthy()

		if (isStageWithBranches(result)) {
			expect(result.id).toBe(1)
			expect(result.name).toBe("Introduction")
			expect(result.branches.length).toBe(1)
			expect(result.branches[0].decision.name).toBe("Travel to the Forest")

			if (result.branches[0].nextStage && isStageWithBranches(result.branches[0].nextStage)) {
				expect(result.branches[0].nextStage.id).toBe(2)
				expect(result.branches[0].nextStage.name).toBe("Forest Encounter")
			}
		}
	})

	// Test case 3: Branching tree with multiple paths
	it("should build a branching tree with multiple paths", () => {
		// Mock data setup - a quest with choice of two paths
		const stageMap = new Map<number, MockRawQuestStage>([
			[
				1,
				{
					id: 1,
					name: "Crossroads",
					stage: 1,
					dramatic_question: "Which path to take?",
					location: { id: 101, name: "Crossroads" },
					outgoingDecisions: [
						{
							id: 201,
							name: "Take Mountain Path",
							decision_type: "tactical_decision",
							conditionType: "choice",
							consequences: [],
							fromStageId: 1,
							toStageId: 2,
							conditionValue: "Mountain",
							toStage: { id: 2 },
						},
						{
							id: 202,
							name: "Take Forest Path",
							decision_type: "tactical_decision",
							conditionType: "choice",
							consequences: [],
							fromStageId: 1,
							toStageId: 3,
							conditionValue: "Forest",
							toStage: { id: 3 },
						},
					],
					incomingDecisions: [],
				},
			],
			[
				2,
				{
					id: 2,
					name: "Mountain Pass",
					stage: 2,
					dramatic_question: "Can they survive the mountain?",
					location: { id: 102, name: "Mountain Pass" },
					outgoingDecisions: [],
					incomingDecisions: [],
				},
			],
			[
				3,
				{
					id: 3,
					name: "Dark Forest",
					stage: 3,
					dramatic_question: "What lurks in the shadows?",
					location: { id: 103, name: "Dark Forest" },
					outgoingDecisions: [],
					incomingDecisions: [],
				},
			],
		])

		// Execute test with a more specific cast
		const result = buildStageTree(1, stageMap as unknown as Map<number, RawQuestStage>)

		// Type guard check
		expect(result).not.toBeNull()
		expect(isStageWithBranches(result)).toBeTruthy()

		if (isStageWithBranches(result)) {
			// Check structure
			expect(result.id).toBe(1)
			expect(result.name).toBe("Crossroads")
			expect(result.branches.length).toBe(2)

			// Check first path
			const mountainPath = result.branches[0]
			expect(mountainPath.decision.name).toBe("Take Mountain Path")

			if (mountainPath.nextStage && isStageWithBranches(mountainPath.nextStage)) {
				expect(mountainPath.nextStage.id).toBe(2)
				expect(mountainPath.nextStage.name).toBe("Mountain Pass")
			} else {
				throw new Error("Expected mountain path to lead to a stage")
			}

			// Check second path
			const forestPath = result.branches[1]
			expect(forestPath.decision.name).toBe("Take Forest Path")

			if (forestPath.nextStage && isStageWithBranches(forestPath.nextStage)) {
				expect(forestPath.nextStage.id).toBe(3)
				expect(forestPath.nextStage.name).toBe("Dark Forest")
			} else {
				throw new Error("Expected forest path to lead to a stage")
			}
		}
	})

	// Test case 4: Cycle detection
	it("should detect cycles in the stage tree", () => {
		// Mock data setup - stage 2 links back to stage 1
		const stageMap = new Map<number, MockRawQuestStage>([
			[
				1,
				{
					id: 1,
					name: "Start",
					stage: 1,
					dramatic_question: "How to begin?",
					location: { id: 101, name: "Town" },
					outgoingDecisions: [
						{
							id: 201,
							name: "Go to dungeon",
							decision_type: "tactical_decision",
							conditionType: "choice",
							consequences: [],
							fromStageId: 1,
							toStageId: 2,
							conditionValue: "Enter",
							toStage: { id: 2 },
						},
					],
					incomingDecisions: [],
				},
			],
			[
				2,
				{
					id: 2,
					name: "Dungeon",
					stage: 2,
					dramatic_question: "What's in the dungeon?",
					location: { id: 102, name: "Dungeon" },
					outgoingDecisions: [
						{
							id: 202,
							name: "Return to town",
							decision_type: "tactical_decision",
							conditionType: "choice",
							consequences: [],
							fromStageId: 2,
							toStageId: 1,
							conditionValue: "Leave",
							toStage: { id: 1 },
						},
					],
					incomingDecisions: [],
				},
			],
		])

		// Execute test with a more specific cast
		const result = buildStageTree(1, stageMap as unknown as Map<number, RawQuestStage>)

		// Ensure proper type checking
		expect(result).not.toBeNull()
		expect(isStageWithBranches(result)).toBeTruthy()

		if (isStageWithBranches(result)) {
			// Check that stage 1 links to stage 2
			expect(result.id).toBe(1)
			const toDungeon = result.branches[0]

			expect(toDungeon.nextStage).not.toBeNull()
			if (toDungeon.nextStage && isStageWithBranches(toDungeon.nextStage)) {
				expect(toDungeon.nextStage.id).toBe(2)

				// Check that stage 2's link back to stage 1 is marked as a cycle
				const backToTown = toDungeon.nextStage.branches[0]
				expect(backToTown.nextStage).toEqual({ id: 1, isCycle: true })
			} else {
				throw new Error("Expected to find a stage, not a cycle marker")
			}
		}
	})

	// Test case 5: Edge case - missing stage in map
	it("should handle missing stages gracefully", () => {
		// Mock data with reference to a non-existent stage
		const stageMap = new Map<number, MockRawQuestStage>([
			[
				1,
				{
					id: 1,
					name: "Start",
					stage: 1,
					dramatic_question: "Where to go?",
					location: { id: 101, name: "Town" },
					outgoingDecisions: [
						{
							id: 201,
							name: "Go to unknown",
							decision_type: "tactical_decision",
							conditionType: "choice",
							consequences: [],
							fromStageId: 1,
							toStageId: 999, // This ID doesn't exist in our map
							conditionValue: "Go",
							toStage: { id: 999 },
						},
					],
					incomingDecisions: [],
				},
			],
		])

		// Execute test with a more specific cast
		const result = buildStageTree(1, stageMap as unknown as Map<number, RawQuestStage>)

		expect(result).not.toBeNull()
		expect(isStageWithBranches(result)).toBeTruthy()

		if (isStageWithBranches(result)) {
			// Check structure
			expect(result.id).toBe(1)
			expect(result.branches.length).toBe(1)

			// The next stage should be null since ID 999 doesn't exist
			expect(result.branches[0].nextStage).toBeNull()
		}
	})

	// Test case 6: Edge case - non-existent starting stage
	it("should return null for non-existent starting stage", () => {
		const stageMap = new Map<number, MockRawQuestStage>([
			[
				1,
				{
					id: 1,
					name: "Start",
					stage: 1,
					dramatic_question: "Where to go?",
					location: { id: 101, name: "Town" },
					outgoingDecisions: [],
					incomingDecisions: [],
				},
			],
		])

		// Try to build tree starting from a non-existent stage with a more specific cast
		const result = buildStageTree(999, stageMap as unknown as Map<number, RawQuestStage>)

		// Should return null
		expect(result).toBeNull()
	})
})
