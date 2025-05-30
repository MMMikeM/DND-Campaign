import { describe, expect, it } from "vitest"
import type { MajorConflictEmbeddingInput, RecursiveRequired } from "../embedding-input-types"
import { embeddingTextForMajorConflict } from "../entities/conflicts.embedding"

describe("Conflicts Embedding Functions", () => {
	describe("embeddingTextForMajorConflict", () => {
		const mockConflictInput: RecursiveRequired<MajorConflictEmbeddingInput> = {
			name: "The War of the Broken Crown",
			scope: "regional",
			natures: ["political", "military"],
			status: "active",
			cause: "Disputed succession after the king's death",
			stakes: ["Control of the kingdom", "Legitimacy of royal bloodline", "Trade route dominance"],
			moralDilemma: "Both claimants have legitimate rights to the throne",
			possibleOutcomes: [
				"Eldest son claims throne through military might",
				"Daughter proves legitimacy through ancient law",
				"Kingdom splits into two separate realms",
				"Foreign power intervenes and claims control",
			],
			hiddenTruths: [
				"The king was poisoned by his advisor",
				"Ancient treaty gives neighboring kingdom claim to throne",
				"Royal bloodline is actually illegitimate",
			],
			clarityOfRightWrong: "competing_legitimate_grievances",
			currentTensionLevel: "high",
			description: [
				"A bitter succession war tears the kingdom apart",
				"Noble houses choose sides based on old alliances",
				"Common folk suffer as armies march across their lands",
			],
			primaryRegion: {
				name: "Kingdom of Valdris",
				type: "grassland",
			},
			participants: [
				{
					participantType: "Faction",
					factionInfo: {
						name: "House Blackwater",
						size: "large",
						type: ["noble_house"],
					},
					role: "instigator",
					motivation: "Support for traditional male succession",
					publicStance: "Prince Marcus is the rightful heir by ancient law",
					secretStance: "Will accept any ruler who grants them more power",
					description: ["Ancient noble house with vast military resources"],
				},
				{
					participantType: "NPC",
					npcInfo: {
						name: "Lord Advisor Theron",
						alignment: "lawful_neutral",
						occupation: "Royal Advisor",
					},
					role: "neutral",
					motivation: "Preserve the kingdom's stability",
					publicStance: "Calls for peaceful resolution",
					secretStance: "Secretly orchestrated the king's death",
					description: ["Elderly advisor who has served three kings"],
				},
			],
			narrativeDestinations: [
				{
					name: "The Succession Crisis Arc",
					type: "main",
					status: "in_progress",
					description: ["Primary narrative arc driving the conflict"],
				},
			],
			consequences: [
				{
					name: "Kingdom Divided",
					consequenceType: "political_shift",
					severity: "major",
					playerImpactFeel: "challenging_setback",
					description: ["Noble houses declare for different claimants"],
				},
			],
			affectedByConsequences: [
				{
					name: "Economic Collapse",
					consequenceType: "resource_availability_change",
					severity: "moderate",
					playerImpactFeel: "challenging_setback",
					description: ["Trade routes disrupted by warfare"],
				},
			],
			worldConceptLinks: [
				{
					linkRoleOrTypeText: "Ideological foundation",
					linkStrength: "defining",
					linkDetailsText: "The conflict challenges traditional succession laws",
					description: ["Core belief system being questioned by the conflict"],
					associatedConcept: {
						name: "Divine Right of Kings",
						conceptType: "political",
					},
				},
			],
		}

		it("should generate comprehensive embedding text for a major conflict", () => {
			const result = embeddingTextForMajorConflict(mockConflictInput)
			console.clear()
			console.log(result)

			// Check for basic conflict information
			expect(result).toContain("The War of the Broken Crown")
			expect(result).toContain("regional")
			expect(result).toContain("political")
			expect(result).toContain("military")
			expect(result).toContain("active")
			expect(result).toContain("high")
		})

		it("should include conflict cause and location", () => {
			const result = embeddingTextForMajorConflict(mockConflictInput)

			expect(result).toContain("Disputed succession")
			expect(result).toContain("Kingdom of Valdris")
		})

		it("should include stakes and moral elements", () => {
			const result = embeddingTextForMajorConflict(mockConflictInput)

			expect(result).toContain("Control of the kingdom")
			expect(result).toContain("Both claimants have legitimate rights")
			expect(result).toContain("competing legitimate grievances")
		})

		it("should include hidden truths and possible outcomes", () => {
			const result = embeddingTextForMajorConflict(mockConflictInput)

			expect(result).toContain("king was poisoned")
			expect(result).toContain("Kingdom splits into two")
			expect(result).toContain("Foreign power intervenes")
		})

		it("should include participant summaries when provided", () => {
			const result = embeddingTextForMajorConflict(mockConflictInput)

			expect(result).toContain("House Blackwater")
			expect(result).toContain("Lord Advisor Theron")
			expect(result).toContain("NPC Details")
			expect(result).toContain("Royal Advisor")
			expect(result).toContain("instigator")
		})

		it("should handle minimal conflict input gracefully", () => {
			const minimalInput: MajorConflictEmbeddingInput = {
				name: "Simple Conflict",
				scope: "local",
				natures: ["social"],
				status: "brewing",
				cause: "Resource dispute",
				stakes: ["Water rights"],
				moralDilemma: "Both sides need the resource",
				possibleOutcomes: ["Negotiated settlement"],
				hiddenTruths: ["Ancient claim exists"],
				clarityOfRightWrong: "clear_aggressor_victim",
				currentTensionLevel: "low",
				description: ["A minor dispute over water rights"],
			}

			const result = embeddingTextForMajorConflict(minimalInput)

			expect(result).toContain("Simple Conflict")
			expect(result).toContain("local")
			expect(result).toContain("Resource dispute")
			expect(result).toContain("Water rights")
		})

		it("should handle missing optional fields", () => {
			const inputWithoutOptionals: MajorConflictEmbeddingInput = {
				name: "Basic Conflict",
				scope: "regional",
				natures: ["military"],
				status: "active",
				cause: "Border dispute",
				stakes: ["Territory"],
				moralDilemma: "Both have historical claims",
				possibleOutcomes: ["Military victory"],
				hiddenTruths: ["Secret alliance"],
				clarityOfRightWrong: "competing_legitimate_grievances",
				currentTensionLevel: "building",
				description: ["Two nations clash over borders"],
			}

			const result = embeddingTextForMajorConflict(inputWithoutOptionals)

			expect(result).toContain("Basic Conflict")
			expect(result).toContain("Border dispute")
			// Should not throw errors for missing optional fields
			expect(result).toBeDefined()
			expect(result.length).toBeGreaterThan(0)
		})

		it("should include all major structural elements in embedding", () => {
			const result = embeddingTextForMajorConflict(mockConflictInput)

			// Check for section headers/labels that should be present
			expect(result).toContain("Conflict")
			expect(result).toContain("Scope")
			expect(result).toContain("Status")
			expect(result).toContain("Tension Level")
			expect(result).toContain("Primary Cause")
			expect(result).toContain("Nature of Conflict")
			expect(result).toContain("Key Stakes")
			expect(result).toContain("Moral Dilemma")
			expect(result).toContain("Hidden Truths or Secrets")
			expect(result).toContain("Potential Outcomes")
			expect(result).toContain("Key Participants")
		})

		it("should handle empty arrays gracefully", () => {
			const inputWithEmptyArrays: MajorConflictEmbeddingInput = {
				name: "Empty Arrays Conflict",
				scope: "local",
				natures: [], // Empty array
				status: "brewing",
				cause: "Unknown cause",
				stakes: [], // Empty array
				moralDilemma: "Unclear",
				possibleOutcomes: [], // Empty array
				hiddenTruths: [], // Empty array
				clarityOfRightWrong: "inherently_ambiguous",
				currentTensionLevel: "low",
				description: [], // Empty array
			}

			const result = embeddingTextForMajorConflict(inputWithEmptyArrays)

			expect(result).toContain("Empty Arrays Conflict")
			expect(result).toContain("Unknown cause")
			expect(result).toBeDefined()
			expect(result.length).toBeGreaterThan(0)
		})

		it("should include narrative destinations when provided", () => {
			const result = embeddingTextForMajorConflict(mockConflictInput)

			expect(result).toContain("The Succession Crisis Arc")
			expect(result).toContain("Related Narrative Arcs")
		})

		it("should include consequences when provided", () => {
			const result = embeddingTextForMajorConflict(mockConflictInput)

			expect(result).toContain("Kingdom Divided")
			expect(result).toContain("Economic Collapse")
			expect(result).toContain("Triggered Consequences")
			expect(result).toContain("Affecting Consequences")
		})

		it("should include world concept links when provided", () => {
			const result = embeddingTextForMajorConflict(mockConflictInput)

			expect(result).toContain("Divine Right of Kings")
			expect(result).toContain("Related World Concepts")
			expect(result).toContain("defining")
		})
	})
})
