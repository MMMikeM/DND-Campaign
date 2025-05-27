import { describe, expect, it } from "vitest"
import type { NarrativeDestinationEmbeddingInput, WorldConceptEmbeddingInput } from "../embedding-input-types"
import { embeddingTextForNarrativeDestination, embeddingTextForWorldConcept } from "../narrative.embedding"

describe("Narrative Embedding Functions", () => {
	describe("embeddingTextForNarrativeDestination", () => {
		const mockDestinationInput: NarrativeDestinationEmbeddingInput = {
			name: "The Golden Age of Peace",
			type: "utopian_future",
			status: "potential",
			promise: "A world where all conflicts are resolved through wisdom and understanding.",
			payoff: "The realm achieves lasting peace and prosperity for all its inhabitants.",
			themes: ["Unity", "Wisdom", "Redemption", "Hope"],
			foreshadowingElements: [
				"Ancient prophecies speak of a time of great harmony.",
				"Wise leaders emerge in times of crisis.",
				"Old enemies find common ground.",
			],
			intendedEmotionalArc: "From despair through struggle to triumphant hope.",
			description: ["The ultimate goal of the campaign.", "A future where wisdom triumphs over violence."],

			// Resolved fields
			primaryRegionName: "The United Kingdoms",
			relatedConflictName: "The War of the Broken Crown",
			keyQuestNamesInArc: ["Unite the Fractured Nobles", "The Wisdom of the Ancients", "The Final Reconciliation"],
		}

		it("should generate comprehensive text for a narrative destination with all fields", () => {
			const result = embeddingTextForNarrativeDestination(mockDestinationInput)

			const expectedText = `Narrative Destination: The Golden Age of Peace
Overview:
The ultimate goal of the campaign.
A future where wisdom triumphs over violence.
Type: utopian future
Status: potential
Primary Location: The United Kingdoms
Promise: A world where all conflicts are resolved through wisdom and understanding.
Payoff: The realm achieves lasting peace and prosperity for all its inhabitants.
Intended Emotional Arc: From despair through struggle to triumphant hope.
Core Themes:
- Unity
- Wisdom
- Redemption
- Hope
Foreshadowing Elements:
- Ancient prophecies speak of a time of great harmony.
- Wise leaders emerge in times of crisis.
- Old enemies find common ground.
Related Conflict: The War of the Broken Crown
Key Quests in Arc:
- Unite the Fractured Nobles
- The Wisdom of the Ancients
- The Final Reconciliation`

			expect(result).toBe(expectedText)
		})

		it("should handle destinations with minimal data", () => {
			const minimalDestination: NarrativeDestinationEmbeddingInput = {
				name: "Simple Goal",
				type: "achievement",
			}

			const result = embeddingTextForNarrativeDestination(minimalDestination)
			const expectedMinimalText = `Narrative Destination: Simple Goal
Type: achievement`
			expect(result).toBe(expectedMinimalText)
		})

		it("should handle destinations with empty arrays gracefully", () => {
			const destinationWithEmptyArrays: NarrativeDestinationEmbeddingInput = {
				name: "Empty Destination",
				themes: [],
				foreshadowingElements: [],
				keyQuestNamesInArc: [],
				description: [],
			}

			const result = embeddingTextForNarrativeDestination(destinationWithEmptyArrays)
			const expectedEmptyArrayText = "Narrative Destination: Empty Destination"
			expect(result).toBe(expectedEmptyArrayText)
		})

		it("should handle destinations with undefined values by omitting those fields", () => {
			const destinationWithUndefined: NarrativeDestinationEmbeddingInput = {
				name: "Undefined Destination",
				type: undefined,
				status: undefined,
				promise: undefined,
				payoff: undefined,
				intendedEmotionalArc: undefined,
				primaryRegionName: undefined,
				relatedConflictName: undefined,
				themes: [],
				foreshadowingElements: [],
				keyQuestNamesInArc: [],
				description: [],
			}

			const result = embeddingTextForNarrativeDestination(destinationWithUndefined)
			const expectedUndefinedText = "Narrative Destination: Undefined Destination"
			expect(result).toBe(expectedUndefinedText)
		})
	})

	describe("embeddingTextForWorldConcept", () => {
		const mockConceptInput: WorldConceptEmbeddingInput = {
			name: "The Great Library Tradition",
			conceptType: "cultural_institution",
			complexityProfile: "layered_with_hidden_depths",
			moralClarity: "morally_neutral_tool",
			summary: "A network of great libraries that preserve knowledge across the realm.",
			surfaceImpression: "Peaceful scholars dedicated to preserving knowledge.",
			livedRealityDetails: "Librarians wield significant political influence through information control.",
			hiddenTruthsOrDepths: "Some libraries contain forbidden knowledge that could reshape reality.",
			additionalDetails: [
				"Each library specializes in different types of knowledge.",
				"Librarians undergo rigorous training and take binding oaths.",
			],
			socialStructure: "Hierarchical order based on knowledge and wisdom.",
			coreValues: ["Knowledge", "Preservation", "Neutrality", "Truth"],
			scope: "realm_wide",
			status: "established",
			timeframe: "ongoing",
			startYear: 1247,
			endYear: null,
			modernRelevance: "Still the primary source of historical and magical knowledge.",
			currentChallenges: [
				"Pressure to share forbidden knowledge.",
				"Funding shortages in remote areas.",
				"Political pressure from various factions.",
			],
			modernConsequences: [
				"Information inequality between regions.",
				"Growing tension between knowledge and power.",
				"Emergence of underground knowledge networks.",
			],
			questHooks: [
				"Retrieve a stolen ancient tome.",
				"Investigate corruption in a local library.",
				"Gain access to forbidden archives.",
			],
			description: ["A cornerstone of civilized society.", "The guardians of accumulated wisdom."],

			// Resolved fields
			keyRelatedConceptNamesAndTypes: [
				"The Scholar's Guild (Influenced By)",
				"The Forbidden Arts (Contains Knowledge Of)",
				"The Great Purge (Survived)",
			],
			primaryRegionNamesWhereRelevant: ["The Capital Kingdoms", "The Academic Provinces", "The Border Territories"],
			keyFactionNamesRepresentingConcept: ["The Order of Librarians", "The Knowledge Keepers", "The Archive Guardians"],
		}

		it("should generate comprehensive text for a world concept with all fields", () => {
			const result = embeddingTextForWorldConcept(mockConceptInput)

			const expectedText = `World Concept: The Great Library Tradition
Overview:
A cornerstone of civilized society.
The guardians of accumulated wisdom.
Type: cultural institution
Complexity: layered with hidden depths
Moral Clarity: morally neutral tool
Scope: realm wide
Status: established
Timeframe: ongoing
Start Year: 1247
Modern Relevance: Still the primary source of historical and magical knowledge.
Summary: A network of great libraries that preserve knowledge across the realm.
Surface Impression: Peaceful scholars dedicated to preserving knowledge.
Lived Reality: Librarians wield significant political influence through information control.
Hidden Depths: Some libraries contain forbidden knowledge that could reshape reality.
Social Structure: Hierarchical order based on knowledge and wisdom.
Core Values:
- Knowledge
- Preservation
- Neutrality
- Truth
Additional Details:
- Each library specializes in different types of knowledge.
- Librarians undergo rigorous training and take binding oaths.
Current Challenges:
- Pressure to share forbidden knowledge.
- Funding shortages in remote areas.
- Political pressure from various factions.
Modern Consequences:
- Information inequality between regions.
- Growing tension between knowledge and power.
- Emergence of underground knowledge networks.
Quest Hooks:
- Retrieve a stolen ancient tome.
- Investigate corruption in a local library.
- Gain access to forbidden archives.
Related Concepts:
- The Scholar's Guild (Influenced By)
- The Forbidden Arts (Contains Knowledge Of)
- The Great Purge (Survived)
Primary Regions:
- The Capital Kingdoms
- The Academic Provinces
- The Border Territories
Key Factions:
- The Order of Librarians
- The Knowledge Keepers
- The Archive Guardians`

			expect(result).toBe(expectedText)
		})

		it("should handle concepts with minimal data", () => {
			const minimalConcept: WorldConceptEmbeddingInput = {
				name: "Simple Tradition",
				conceptType: "custom",
			}

			const result = embeddingTextForWorldConcept(minimalConcept)
			const expectedMinimalText = `World Concept: Simple Tradition
Type: custom`
			expect(result).toBe(expectedMinimalText)
		})

		it("should handle concepts with null end year", () => {
			const ongoingConcept: WorldConceptEmbeddingInput = {
				name: "Ongoing Tradition",
				conceptType: "cultural",
				startYear: 1000,
				endYear: null,
				timeframe: "ongoing",
			}

			const result = embeddingTextForWorldConcept(ongoingConcept)
			const expectedOngoingText = `World Concept: Ongoing Tradition
Type: cultural
Timeframe: ongoing
Start Year: 1000`
			expect(result).toBe(expectedOngoingText)
		})

		it("should handle concepts with historical timeframe", () => {
			const historicalConcept: WorldConceptEmbeddingInput = {
				name: "Ancient Empire",
				conceptType: "political_system",
				startYear: 500,
				endYear: 1200,
				timeframe: "historical",
				status: "ended",
			}

			const result = embeddingTextForWorldConcept(historicalConcept)
			const expectedHistoricalText = `World Concept: Ancient Empire
Type: political system
Status: ended
Timeframe: historical
Start Year: 500
End Year: 1200`
			expect(result).toBe(expectedHistoricalText)
		})

		it("should handle concepts with empty arrays gracefully", () => {
			const conceptWithEmptyArrays: WorldConceptEmbeddingInput = {
				name: "Empty Concept",
				coreValues: [],
				additionalDetails: [],
				currentChallenges: [],
				modernConsequences: [],
				questHooks: [],
				keyRelatedConceptNamesAndTypes: [],
				primaryRegionNamesWhereRelevant: [],
				keyFactionNamesRepresentingConcept: [],
				description: [],
			}

			const result = embeddingTextForWorldConcept(conceptWithEmptyArrays)
			const expectedEmptyText = "World Concept: Empty Concept"
			expect(result).toBe(expectedEmptyText)
		})
	})
})
