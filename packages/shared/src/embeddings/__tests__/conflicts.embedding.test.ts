import { describe, expect, it } from "vitest"
import { embeddingTextForMajorConflict } from "../conflicts.embedding"
import type { MajorConflictEmbeddingInput } from "../embedding-input-types"

describe("Conflicts Embedding Functions", () => {
	describe("embeddingTextForMajorConflict", () => {
		const mockConflictInput: MajorConflictEmbeddingInput = {
			name: "The War of the Broken Crown",
			scope: "regional",
			natures: ["political", "succession", "territorial"],
			status: "escalating",
			cause: "The rightful heir was murdered, leaving multiple claimants to the throne.",
			stakes: ["Control of the kingdom.", "Lives of thousands of civilians.", "Balance of power in the region."],
			moralDilemma: "Supporting the rightful heir means backing a weak ruler during wartime.",
			possibleOutcomes: [
				"United kingdom under strong leadership.",
				"Fractured realm with multiple small kingdoms.",
				"Foreign invasion during the chaos.",
			],
			hiddenTruths: [
				"The murder was orchestrated by a foreign power.",
				"One claimant is actually illegitimate.",
				"Ancient magic is involved in the succession.",
			],
			clarityOfRightWrong: "morally_ambiguous",
			currentTensionLevel: "high",
			description: [
				"A devastating civil war that threatens to tear the kingdom apart.",
				"Multiple factions vie for control while the people suffer.",
			],

			// Resolved fields
			primaryRegionName: "The Kingdom of Aldermere",
			participantSummaries: [
				"Prince Aldric (Rightful Heir, NPC)",
				"Duke Blackwood (Usurper, NPC)",
				"The Royal Army (Loyalist, Faction)",
				"The Rebel Alliance (Opposition, Faction)",
			],
		}

		it("should generate comprehensive text for a major conflict with all fields", () => {
			const result = embeddingTextForMajorConflict(mockConflictInput)

			const expectedText = `Conflict: The War of the Broken Crown
Overview:
A devastating civil war that threatens to tear the kingdom apart.
Multiple factions vie for control while the people suffer.
Scope: regional
Current Status: escalating
Tension Level: high
Primary Location: The Kingdom of Aldermere
Primary Cause: The rightful heir was murdered, leaving multiple claimants to the throne.
Nature of Conflict:
- political
- succession
- territorial
Key Stakes:
- Control of the kingdom.
- Lives of thousands of civilians.
- Balance of power in the region.
Moral Dilemma: Supporting the rightful heir means backing a weak ruler during wartime.
Moral Clarity: morally ambiguous
Hidden Truths or Secrets:
- The murder was orchestrated by a foreign power.
- One claimant is actually illegitimate.
- Ancient magic is involved in the succession.
Potential Outcomes:
- United kingdom under strong leadership.
- Fractured realm with multiple small kingdoms.
- Foreign invasion during the chaos.
Key Participants:
- Prince Aldric (Rightful Heir, NPC)
- Duke Blackwood (Usurper, NPC)
- The Royal Army (Loyalist, Faction)
- The Rebel Alliance (Opposition, Faction)`

			expect(result).toBe(expectedText)
		})

		it("should handle conflicts with minimal data", () => {
			const minimalConflict: MajorConflictEmbeddingInput = {
				name: "Simple Dispute",
				scope: "local",
			}

			const result = embeddingTextForMajorConflict(minimalConflict)
			const expectedMinimalText = `Conflict: Simple Dispute
Scope: local`
			expect(result).toBe(expectedMinimalText)
		})

		it("should handle conflicts with empty arrays gracefully", () => {
			const conflictWithEmptyArrays: MajorConflictEmbeddingInput = {
				name: "Basic Conflict",
				natures: [],
				stakes: [],
				possibleOutcomes: [],
				hiddenTruths: [],
				participantSummaries: [],
				description: [],
			}

			const result = embeddingTextForMajorConflict(conflictWithEmptyArrays)
			const expectedEmptyArrayText = "Conflict: Basic Conflict"
			expect(result).toBe(expectedEmptyArrayText)
		})

		it("should handle conflicts with undefined values by omitting those fields", () => {
			const conflictWithUndefined: MajorConflictEmbeddingInput = {
				name: "Undefined Conflict",
				scope: undefined,
				cause: undefined,
				moralDilemma: undefined,
				primaryRegionName: undefined,
				description: [],
				natures: [],
				stakes: [],
				possibleOutcomes: [],
				hiddenTruths: [],
				participantSummaries: [],
			}

			const result = embeddingTextForMajorConflict(conflictWithUndefined)
			const expectedUndefinedText = "Conflict: Undefined Conflict"
			expect(result).toBe(expectedUndefinedText)
		})

		it("should handle conflicts with only resolved fields", () => {
			const conflictWithOnlyResolved: MajorConflictEmbeddingInput = {
				name: "Resolved Only",
				primaryRegionName: "Test Region",
				participantSummaries: ["Test Participant (Role, Type)"],
			}

			const result = embeddingTextForMajorConflict(conflictWithOnlyResolved)
			const expectedResolvedText = `Conflict: Resolved Only
Primary Location: Test Region
Key Participants:
- Test Participant (Role, Type)`
			expect(result).toBe(expectedResolvedText)
		})
	})
})
