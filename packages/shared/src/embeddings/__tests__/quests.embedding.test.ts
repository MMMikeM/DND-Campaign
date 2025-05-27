import { describe, expect, it } from "vitest"
import type {
	QuestEmbeddingInput,
	QuestStageEmbeddingInput,
	StageDecisionEmbeddingInput,
} from "../embedding-input-types"
import { embeddingTextForQuest, embeddingTextForQuestStage, embeddingTextForStageDecision } from "../quests.embedding"

describe("Quests Embedding Functions", () => {
	describe("embeddingTextForQuest", () => {
		const mockQuestInput: QuestEmbeddingInput = {
			name: "The Lost Artifact",
			type: "main",
			urgency: "high",
			visibility: "public",
			mood: "mysterious",
			moralSpectrumFocus: "clear_good_vs_evil",
			intendedPacingRole: "climactic",
			primaryPlayerExperienceGoal: "discovery",
			failureOutcomes: ["Artifact falls into wrong hands.", "Ancient evil awakens."],
			successOutcomes: ["Artifact secured.", "Knowledge gained.", "Evil prevented."],
			objectives: ["Locate the artifact.", "Defeat the guardians.", "Return safely."],
			rewards: ["Gold.", "Magic item.", "Experience."],
			themes: ["Adventure", "Discovery", "Good vs Evil"],
			inspirations: ["Indiana Jones", "Lord of the Rings"],
			otherUnlockConditionsNotes: "Must complete the preliminary research quest.",
			description: ["An ancient artifact has been lost.", "The party must find it before evil forces do."],

			// Resolved fields
			regionName: "The Darkwood Forest",
			prerequisiteQuestName: "Research the Ancient Texts",
			keyParticipantSummaries: [
				"Elara Moonwhisper (Quest Giver)",
				"Dark Cultists (Antagonist, Faction)",
				"Ancient Guardian (Boss, NPC)",
			],
		}

		it("should generate comprehensive text for a quest with all fields", () => {
			const result = embeddingTextForQuest(mockQuestInput)

			const expectedText = `Quest: The Lost Artifact
Overview:
An ancient artifact has been lost.
The party must find it before evil forces do.
Type: main
Urgency: high
Visibility: public
Mood: mysterious
Region: The Darkwood Forest
Moral Focus: clear good vs evil
Pacing Role: climactic
Player Experience Goal: discovery
Prerequisite Quest: Research the Ancient Texts
Unlock Conditions: Must complete the preliminary research quest.
Objectives:
- Locate the artifact.
- Defeat the guardians.
- Return safely.
Success Outcomes:
- Artifact secured.
- Knowledge gained.
- Evil prevented.
Failure Outcomes:
- Artifact falls into wrong hands.
- Ancient evil awakens.
Rewards:
- Gold.
- Magic item.
- Experience.
Themes:
- Adventure
- Discovery
- Good vs Evil
Inspirations:
- Indiana Jones
- Lord of the Rings
Key Participants:
- Elara Moonwhisper (Quest Giver)
- Dark Cultists (Antagonist, Faction)
- Ancient Guardian (Boss, NPC)`

			expect(result).toBe(expectedText)
		})

		it("should handle quests with minimal data", () => {
			const minimalQuest: QuestEmbeddingInput = {
				name: "Simple Task",
				type: "side",
			}

			const result = embeddingTextForQuest(minimalQuest)
			const expectedMinimalText = `Quest: Simple Task
Type: side`
			expect(result).toBe(expectedMinimalText)
		})

		it("should handle quests with empty arrays gracefully", () => {
			const questWithEmptyArrays: QuestEmbeddingInput = {
				name: "Empty Quest",
				objectives: [],
				successOutcomes: [],
				failureOutcomes: [],
				rewards: [],
				themes: [],
				inspirations: [],
				keyParticipantSummaries: [],
				description: [],
			}

			const result = embeddingTextForQuest(questWithEmptyArrays)
			const expectedEmptyText = "Quest: Empty Quest"
			expect(result).toBe(expectedEmptyText)
		})

		it("should handle quests with null values by omitting those fields", () => {
			const questWithNulls: QuestEmbeddingInput = {
				name: "Null Quest",
				type: null,
				urgency: null,
				visibility: null,
				mood: null,
				regionName: null,
				prerequisiteQuestName: null,
				otherUnlockConditionsNotes: null,
				objectives: [],
				description: [],
			}

			const result = embeddingTextForQuest(questWithNulls)
			const expectedNullText = "Quest: Null Quest"
			expect(result).toBe(expectedNullText)
		})
	})

	describe("embeddingTextForQuestStage", () => {
		const mockStageInput: QuestStageEmbeddingInput = {
			stageOrder: 1,
			name: "Investigate the Library",
			dramatic_question: "What secrets lie hidden in the ancient texts?",
			stageType: "investigation",
			intendedComplexityLevel: "moderate",
			objectives: ["Search the restricted section.", "Find the reference to the artifact."],
			completionPaths: ["Stealth approach.", "Social approach.", "Magic approach."],
			encounters: ["Library Guardian.", "Trapped bookshelf.", "Rival researcher."],
			dramatic_moments: ["Discovery of the hidden chamber.", "Confrontation with the guardian."],
			sensory_elements: ["Musty smell of old books.", "Flickering candlelight.", "Whispered incantations."],
			stageImportance: "critical",
			description: ["The party must research the artifact.", "Ancient knowledge holds the key."],

			// Resolved fields
			parentQuestName: "The Lost Artifact",
			siteName: "The Grand Library of Arcanum",
		}

		it("should generate comprehensive text for a quest stage", () => {
			const result = embeddingTextForQuestStage(mockStageInput)

			const expectedText = `Quest Stage: Investigate the Library
Overview:
The party must research the artifact.
Ancient knowledge holds the key.
Quest: The Lost Artifact
Stage Order: 1
Location: The Grand Library of Arcanum
Stage Type: investigation
Complexity Level: moderate
Importance: critical
Dramatic Question: What secrets lie hidden in the ancient texts?
Objectives:
- Search the restricted section.
- Find the reference to the artifact.
Completion Paths:
- Stealth approach.
- Social approach.
- Magic approach.
Encounters:
- Library Guardian.
- Trapped bookshelf.
- Rival researcher.
Dramatic Moments:
- Discovery of the hidden chamber.
- Confrontation with the guardian.
Sensory Elements:
- Musty smell of old books.
- Flickering candlelight.
- Whispered incantations.`

			expect(result).toBe(expectedText)
		})

		it("should handle stages with minimal data", () => {
			const minimalStage: QuestStageEmbeddingInput = {
				name: "Simple Step",
				parentQuestName: "Test Quest",
			}

			const result = embeddingTextForQuestStage(minimalStage)
			const expectedMinimalText = `Quest Stage: Simple Step
Quest: Test Quest`
			expect(result).toBe(expectedMinimalText)
		})

		it("should handle stages with empty arrays gracefully", () => {
			const stageWithEmptyArrays: QuestStageEmbeddingInput = {
				name: "Empty Stage",
				parentQuestName: "Test Quest",
				objectives: [],
				completionPaths: [],
				encounters: [],
				dramatic_moments: [],
				sensory_elements: [],
				description: [],
			}

			const result = embeddingTextForQuestStage(stageWithEmptyArrays)
			const expectedEmptyText = `Quest Stage: Empty Stage
Quest: Test Quest`
			expect(result).toBe(expectedEmptyText)
		})
	})

	describe("embeddingTextForStageDecision", () => {
		const mockDecisionInput: StageDecisionEmbeddingInput = {
			conditionType: "skill_check",
			decisionType: "branching",
			name: "Decipher the Ancient Text",
			ambiguityLevel: "moderate",
			conditionValue: "DC 15 Arcana",
			successDescription: ["The text reveals the artifact's location.", "A map appears in your mind."],
			failureDescription: ["The text remains cryptic.", "You feel a sense of foreboding."],
			narrativeTransition: ["The party gains crucial information.", "New paths open up."],
			potential_player_reactions: ["Excitement at the discovery.", "Concern about the dangers ahead."],
			options: ["Attempt the check.", "Seek help from a scholar.", "Use magic to enhance understanding."],
			failure_leads_to_retry: true,
			failure_lesson_learned: "Ancient texts require patience and wisdom.",
			description: ["A critical moment in the research.", "Success or failure shapes the quest."],

			// Resolved fields
			parentQuestName: "The Lost Artifact",
			fromStageName: "Investigate the Library",
			toStageName: "Journey to the Ruins",
		}

		it("should generate comprehensive text for a stage decision", () => {
			const result = embeddingTextForStageDecision(mockDecisionInput)

			const expectedText = `Stage Decision: Decipher the Ancient Text
Overview:
A critical moment in the research.
Success or failure shapes the quest.
Quest: The Lost Artifact
From Stage: Investigate the Library
To Stage: Journey to the Ruins
Decision Type: branching
Condition Type: skill check
Condition Value: DC 15 Arcana
Ambiguity Level: moderate
Failure Leads to Retry: yes
Failure Lesson: Ancient texts require patience and wisdom.
Success Outcomes:
- The text reveals the artifact's location.
- A map appears in your mind.
Failure Outcomes:
- The text remains cryptic.
- You feel a sense of foreboding.
Narrative Transitions:
- The party gains crucial information.
- New paths open up.
Player Reactions:
- Excitement at the discovery.
- Concern about the dangers ahead.
Options:
- Attempt the check.
- Seek help from a scholar.
- Use magic to enhance understanding.`

			expect(result).toBe(expectedText)
		})

		it("should handle decisions with minimal data", () => {
			const minimalDecision: StageDecisionEmbeddingInput = {
				name: "Simple Choice",
				parentQuestName: "Test Quest",
				fromStageName: "Start",
			}

			const result = embeddingTextForStageDecision(minimalDecision)
			const expectedMinimalText = `Stage Decision: Simple Choice
Quest: Test Quest
From Stage: Start`
			expect(result).toBe(expectedMinimalText)
		})

		it("should handle decisions without target stage", () => {
			const decisionWithoutTarget: StageDecisionEmbeddingInput = {
				name: "Final Decision",
				parentQuestName: "Test Quest",
				fromStageName: "Final Stage",
				toStageName: null,
			}

			const result = embeddingTextForStageDecision(decisionWithoutTarget)
			const expectedNoTargetText = `Stage Decision: Final Decision
Quest: Test Quest
From Stage: Final Stage`
			expect(result).toBe(expectedNoTargetText)
		})

		it("should handle decisions with empty arrays gracefully", () => {
			const decisionWithEmptyArrays: StageDecisionEmbeddingInput = {
				name: "Empty Decision",
				parentQuestName: "Test Quest",
				fromStageName: "Start",
				successDescription: [],
				failureDescription: [],
				narrativeTransition: [],
				potential_player_reactions: [],
				options: [],
				description: [],
			}

			const result = embeddingTextForStageDecision(decisionWithEmptyArrays)
			const expectedEmptyText = `Stage Decision: Empty Decision
Quest: Test Quest
From Stage: Start`
			expect(result).toBe(expectedEmptyText)
		})

		it("should handle boolean values correctly", () => {
			const decisionWithBooleans: StageDecisionEmbeddingInput = {
				name: "Boolean Test",
				parentQuestName: "Test Quest",
				fromStageName: "Start",
				failure_leads_to_retry: false,
			}

			const result = embeddingTextForStageDecision(decisionWithBooleans)
			const expectedBooleanText = `Stage Decision: Boolean Test
Quest: Test Quest
From Stage: Start
Failure Leads to Retry: no`
			expect(result).toBe(expectedBooleanText)
		})
	})
})
