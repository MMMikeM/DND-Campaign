import { describe, expect, it } from "vitest"
import type {
	QuestEmbeddingInput,
	QuestStageEmbeddingInput,
	RecursiveRequired,
	StageDecisionEmbeddingInput,
} from "../embedding-input-types"
import {
	embeddingTextForQuest,
	embeddingTextForQuestStage,
	embeddingTextForStageDecision,
} from "../entities/quests.embedding"

describe("Quests Embedding Functions", () => {
	describe("embeddingTextForQuest", () => {
		const mockQuestInput: RecursiveRequired<QuestEmbeddingInput> = {
			name: "The Lost Artifact",
			type: "main",
			urgency: "urgent",
			visibility: "known",
			mood: "mysterious",
			moralSpectrumFocus: "contextual_dilemma",
			intendedPacingRole: "tension_builder",
			primaryPlayerExperienceGoal: "mystery_solving",
			failureOutcomes: ["The artifact falls into wrong hands", "Ancient evil awakens"],
			successOutcomes: ["Artifact secured", "Ancient knowledge preserved"],
			objectives: ["Find the lost temple", "Retrieve the artifact", "Escape safely"],
			rewards: ["Magical artifact", "Ancient knowledge", "Gold reward"],
			themes: ["Ancient mysteries", "Moral choices", "Sacrifice"],
			inspirations: ["Indiana Jones", "Tomb Raider"],
			description: ["A mysterious artifact has been lost for centuries.", "Ancient texts speak of its immense power."],

			primaryRegion: {
				name: "The Forgotten Lands",
				type: "wilderness",
				description: ["A dangerous wilderness filled with ancient ruins"],
			},

			prerequisiteQuest: {
				name: "The Scholar's Request",
				type: "side",
				description: ["A scholar needs help with research"],
			},

			otherUnlockConditionsNotes: "Must have gained the trust of the local tribe",

			participantInvolvement: [
				{
					participantType: "npc",
					npcInfo: {
						name: "Scholar Aldric",
						race: "human",
						occupation: "Archaeologist",
						description: ["An elderly scholar obsessed with ancient artifacts"],
					},
					roleInQuest: "Quest Giver",
					importanceInQuest: "critical",
					involvementDetails: ["Provides initial information", "Offers guidance throughout"],
				},
				{
					participantType: "faction",
					factionInfo: {
						name: "The Shadow Cult",
						type: ["cult", "criminal"],
						description: ["A secretive cult seeking the same artifact"],
					},
					roleInQuest: "Antagonist",
					importanceInQuest: "major",
					involvementDetails: ["Competes for the artifact", "Sets traps and obstacles"],
				},
			],

			questRelationships: [
				{
					relatedQuest: {
						name: "The Temple Guardian",
						type: "side",
						description: ["Dealing with the temple's guardian spirit"],
					},
					relationshipType: "parallel",
					description: ["Both quests occur in the same location"],
				},
			],

			questHooks: [
				{
					source: "Scholar Aldric",
					hookType: "npc_interaction",
					presentationStyle: "urgent",
					hookContent: ["The scholar desperately needs help finding the artifact"],
					discoveryConditions: ["Visit the library", "Speak with the scholar"],
					npcRelationshipToParty: "Friendly acquaintance",
					trustRequired: "low",
					dialogueHint: "I've discovered something that could change everything!",
					deliveryNpc: {
						name: "Scholar Aldric",
						race: "human",
						occupation: "Archaeologist",
						description: ["An elderly scholar obsessed with ancient artifacts"],
					},
					site: {
						name: "The Grand Library",
						type: "building",
						description: ["A vast repository of knowledge"],
					},
					faction: {
						name: "The Scholars Guild",
						type: ["academic"],
						description: ["A guild of learned individuals"],
					},
				},
			],

			questStages: [
				{
					stageOrder: 1,
					name: "Research Phase",
					dramaticQuestion: "Can the party uncover the artifact's location?",
					stageType: "revelation_point",
					intendedComplexityLevel: "medium_complexity_standard",
					objectives: ["Research ancient texts", "Interview local experts"],
					completionPaths: ["Academic research", "Social investigation"],
					encounters: ["Library research challenge", "Conversation with elder"],
					dramaticMoments: ["Discovery of the map", "Revelation of the cult's involvement"],
					sensoryElements: ["Dusty tomes", "Flickering candlelight", "Whispered secrets"],
					stageImportance: "standard",
					description: ["The party must research the artifact's history and location"],
					site: {
						name: "The Grand Library",
						type: "building",
						description: ["A vast repository of knowledge"],
					},
				},
			],
		}

		it("should generate comprehensive text for a quest with all fields", () => {
			const result = embeddingTextForQuest(mockQuestInput)

			expect(result).toContain("Quest: The Lost Artifact")
			expect(result).toContain("A mysterious artifact has been lost for centuries.")
			expect(result).toContain("Ancient texts speak of its immense power.")
			expect(result).toContain("type: main")
			expect(result).toContain("urgency: urgent")
			expect(result).toContain("visibility: known")
			expect(result).toContain("mood: mysterious")
			expect(result).toContain("moralSpectrumFocus: contextual_dilemma")
			expect(result).toContain("intendedPacingRole: tension_builder")
			expect(result).toContain("primaryPlayerExperienceGoal: mystery_solving")
			expect(result).toContain("Primary Region:")
			expect(result).toContain("region: The Forgotten Lands")
			expect(result).toContain("regionType: wilderness")
			expect(result).toContain("Prerequisite Quest:")
			expect(result).toContain("quest: The Scholar's Request")
			expect(result).toContain("questType: side")
			expect(result).toContain("Other Unlock Conditions: Must have gained the trust of the local tribe")
			expect(result).toContain("Objectives:")
			expect(result).toContain("- Find the lost temple")
			expect(result).toContain("- Retrieve the artifact")
			expect(result).toContain("- Escape safely")
			expect(result).toContain("Participant Involvement:")
			expect(result).toContain("Participant: Scholar Aldric")
			expect(result).toContain("Type: NPC")
			expect(result).toContain("Role: Quest Giver")
			expect(result).toContain("Importance: critical")
			expect(result).toContain("Participant: The Shadow Cult")
			expect(result).toContain("Type: Faction")
			expect(result).toContain("Role: Antagonist")
			expect(result).toContain("Quest Relationships:")
			expect(result).toContain("Related Quest: The Temple Guardian")
			expect(result).toContain("Relationship: parallel")
			expect(result).toContain("Quest Hooks:")
			expect(result).toContain("Hook Source: Scholar Aldric")
			expect(result).toContain("Hook Type: npc_interaction")
			expect(result).toContain("Presentation: urgent")
			expect(result).toContain("Quest Stages:")
			expect(result).toContain("Stage: Research Phase")
			expect(result).toContain("Order: 1")
			expect(result).toContain("Type: revelation_point")
		})

		it("should handle quests with minimal data", () => {
			const minimalQuest: QuestEmbeddingInput = {
				name: "Simple Task",
				type: "side",
				urgency: "background",
				visibility: "hidden",
				mood: "neutral",
				moralSpectrumFocus: "clear_right_wrong",
				intendedPacingRole: "release_valve",
				primaryPlayerExperienceGoal: "heroism_clarity",
				failureOutcomes: ["Task remains incomplete"],
				successOutcomes: ["Task completed"],
				objectives: ["Complete the task"],
				rewards: ["Small reward"],
				themes: ["Simple duty"],
				inspirations: ["Basic quest"],
				description: ["A simple task to complete"],
			}

			const result = embeddingTextForQuest(minimalQuest)

			expect(result).toContain("Quest: Simple Task")
			expect(result).toContain("A simple task to complete")
			expect(result).toContain("type: side")
			expect(result).toContain("urgency: background")
			expect(result).not.toContain("Primary Region:")
			expect(result).not.toContain("Prerequisite Quest:")
			expect(result).not.toContain("Other Unlock Conditions:")
			expect(result).not.toContain("Participant Involvement:")
			expect(result).not.toContain("Quest Relationships:")
			expect(result).not.toContain("Quest Hooks:")
			expect(result).not.toContain("Quest Stages:")
		})

		it("should handle quests with empty arrays gracefully", () => {
			const questWithEmptyArrays: QuestEmbeddingInput = {
				name: "Empty Quest",
				type: "generic",
				urgency: "background",
				visibility: "hidden",
				mood: "neutral",
				moralSpectrumFocus: "clear_right_wrong",
				intendedPacingRole: "release_valve",
				primaryPlayerExperienceGoal: "heroism_clarity",
				failureOutcomes: [],
				successOutcomes: [],
				objectives: [],
				rewards: [],
				themes: [],
				inspirations: [],
				description: [],
				participantInvolvement: [],
				questRelationships: [],
				questHooks: [],
				questStages: [],
			}

			const result = embeddingTextForQuest(questWithEmptyArrays)

			expect(result).toContain("Quest: Empty Quest")
			expect(result).toContain("type: generic")
			expect(result).not.toContain("Objectives:")
			expect(result).not.toContain("Participant Involvement:")
			expect(result).not.toContain("Quest Relationships:")
			expect(result).not.toContain("Quest Hooks:")
			expect(result).not.toContain("Quest Stages:")
		})
	})

	describe("embeddingTextForQuestStage", () => {
		const mockStageInput: RecursiveRequired<QuestStageEmbeddingInput> = {
			stageOrder: 2,
			name: "The Temple Exploration",
			dramaticQuestion: "Can the party navigate the temple's deadly traps?",
			stageType: "simple_challenge_point",
			intendedComplexityLevel: "high_complexity_peak",
			objectives: ["Navigate the temple", "Avoid the traps", "Find the inner chamber"],
			completionPaths: ["Stealth approach", "Direct confrontation", "Puzzle solving"],
			encounters: ["Trap room", "Guardian statue", "Ancient puzzle"],
			dramaticMoments: ["Trap activation", "Guardian awakening", "Chamber discovery"],
			sensoryElements: ["Echoing footsteps", "Ancient dust", "Glowing runes"],
			stageImportance: "major_point",
			description: ["The party enters the ancient temple", "Deadly traps await the unwary"],

			parentQuest: {
				name: "The Lost Artifact",
				type: "main",
				description: ["A quest to find an ancient artifact"],
			},

			site: {
				name: "Temple of the Ancients",
				type: "temple",
				description: ["An ancient temple filled with traps and mysteries"],
			},
		}

		it("should generate comprehensive text for a quest stage with all fields", () => {
			const result = embeddingTextForQuestStage(mockStageInput)

			expect(result).toContain("Quest Stage: The Temple Exploration")
			expect(result).toContain("The party enters the ancient temple")
			expect(result).toContain("Deadly traps await the unwary")
			expect(result).toContain("stageOrder: 2")
			expect(result).toContain("stageType: simple_challenge_point")
			expect(result).toContain("complexityLevel: high_complexity_peak")
			expect(result).toContain("importance: major_point")
			expect(result).toContain("dramaticQuestion: Can the party navigate the temple's deadly traps?")
			expect(result).toContain("Parent Quest:")
			expect(result).toContain("quest: The Lost Artifact")
			expect(result).toContain("questType: main")
			expect(result).toContain("Site Context:")
			expect(result).toContain("site: Temple of the Ancients")
			expect(result).toContain("siteType: temple")
			expect(result).toContain("Objectives:")
			expect(result).toContain("- Navigate the temple")
			expect(result).toContain("- Avoid the traps")
			expect(result).toContain("- Find the inner chamber")
			expect(result).toContain("Completion Paths:")
			expect(result).toContain("- Stealth approach")
			expect(result).toContain("- Direct confrontation")
			expect(result).toContain("- Puzzle solving")
			expect(result).toContain("Encounters:")
			expect(result).toContain("- Trap room")
			expect(result).toContain("- Guardian statue")
			expect(result).toContain("- Ancient puzzle")
			expect(result).toContain("Dramatic Moments:")
			expect(result).toContain("- Trap activation")
			expect(result).toContain("- Guardian awakening")
			expect(result).toContain("- Chamber discovery")
			expect(result).toContain("Sensory Elements:")
			expect(result).toContain("- Echoing footsteps")
			expect(result).toContain("- Ancient dust")
			expect(result).toContain("- Glowing runes")
		})

		it("should handle quest stages with minimal data", () => {
			const minimalStage: QuestStageEmbeddingInput = {
				stageOrder: 1,
				name: "Simple Stage",
				dramaticQuestion: "Will the party succeed?",
				stageType: "rest_interaction_point",
				intendedComplexityLevel: "low_complexity_breather",
				objectives: ["Complete the task"],
				completionPaths: ["Direct approach"],
				encounters: ["Simple encounter"],
				dramaticMoments: ["Task completion"],
				sensoryElements: ["Basic environment"],
				stageImportance: "minor_step",
				description: ["A simple stage"],
			}

			const result = embeddingTextForQuestStage(minimalStage)

			expect(result).toContain("Quest Stage: Simple Stage")
			expect(result).toContain("A simple stage")
			expect(result).toContain("stageOrder: 1")
			expect(result).toContain("stageType: rest_interaction_point")
			expect(result).toContain("complexityLevel: low_complexity_breather")
			expect(result).toContain("importance: minor_step")
			expect(result).not.toContain("Parent Quest:")
			expect(result).not.toContain("Site Context:")
		})
	})

	describe("embeddingTextForStageDecision", () => {
		const mockDecisionInput: RecursiveRequired<StageDecisionEmbeddingInput> = {
			name: "The Guardian's Challenge",
			conditionType: "choice",
			decisionType: "moral_choice",
			ambiguityLevel: "truly_ambiguous_no_clear_right",
			conditionValue: "Choose between saving the artifact or the innocent",
			successDescription: ["The party makes a difficult choice", "Consequences follow their decision"],
			failureDescription: ["Indecision leads to disaster", "Both options are lost"],
			narrativeTransition: ["The story branches based on the choice", "New challenges emerge"],
			potentialPlayerReactions: ["Heated debate", "Moral uncertainty", "Character development"],
			options: ["Save the artifact", "Save the innocent", "Attempt to save both"],
			failureLeadsToRetry: false,
			failureLessonLearned: null,
			description: ["A moral dilemma that tests the party's values"],

			parentQuest: {
				name: "The Lost Artifact",
				type: "main",
				description: ["A quest to find an ancient artifact"],
			},

			fromStage: {
				stageOrder: 2,
				name: "The Temple Exploration",
				stageType: "simple_challenge_point",
				description: ["Exploring the ancient temple"],
			},

			toStage: {
				stageOrder: 3,
				name: "The Aftermath",
				stageType: "consequence_point",
				description: ["Dealing with the consequences"],
			},
		}

		it("should generate comprehensive text for a stage decision with all fields", () => {
			const result = embeddingTextForStageDecision(mockDecisionInput)

			expect(result).toContain("Stage Decision: The Guardian's Challenge")
			expect(result).toContain("A moral dilemma that tests the party's values")
			expect(result).toContain("conditionType: choice")
			expect(result).toContain("decisionType: moral_choice")
			expect(result).toContain("ambiguityLevel: truly_ambiguous_no_clear_right")
			expect(result).toContain("conditionValue: Choose between saving the artifact or the innocent")
			expect(result).toContain("failureLeadsToRetry: false")
			expect(result).toContain("Parent Quest:")
			expect(result).toContain("quest: The Lost Artifact")
			expect(result).toContain("questType: main")
			expect(result).toContain("From Stage:")
			expect(result).toContain("stage: The Temple Exploration")
			expect(result).toContain("stageOrder: 2")
			expect(result).toContain("stageType: simple_challenge_point")
			expect(result).toContain("To Stage:")
			expect(result).toContain("stage: The Aftermath")
			expect(result).toContain("stageOrder: 3")
			expect(result).toContain("stageType: consequence_point")
			expect(result).toContain("Success Description:")
			expect(result).toContain("- The party makes a difficult choice")
			expect(result).toContain("- Consequences follow their decision")
			expect(result).toContain("Failure Description:")
			expect(result).toContain("- Indecision leads to disaster")
			expect(result).toContain("- Both options are lost")
			expect(result).toContain("Options:")
			expect(result).toContain("- Save the artifact")
			expect(result).toContain("- Save the innocent")
			expect(result).toContain("- Attempt to save both")
		})

		it("should handle stage decisions with minimal data", () => {
			const minimalDecision: StageDecisionEmbeddingInput = {
				name: "Simple Choice",
				conditionType: "skill_check",
				decisionType: "tactical_decision",
				ambiguityLevel: "clear_best_option_obvious_tradeoff",
				conditionValue: "DC 15 Athletics check",
				successDescription: ["Success"],
				failureDescription: ["Failure"],
				narrativeTransition: ["Story continues"],
				potentialPlayerReactions: ["Relief or disappointment"],
				options: ["Attempt the check"],
				failureLeadsToRetry: true,
				failureLessonLearned: "Try a different approach",
				description: ["A simple skill check"],
			}

			const result = embeddingTextForStageDecision(minimalDecision)

			expect(result).toContain("Stage Decision: Simple Choice")
			expect(result).toContain("A simple skill check")
			expect(result).toContain("conditionType: skill_check")
			expect(result).toContain("decisionType: tactical_decision")
			expect(result).toContain("ambiguityLevel: clear_best_option_obvious_tradeoff")
			expect(result).toContain("failureLeadsToRetry: true")
			expect(result).toContain("Failure Lesson: Try a different approach")
			expect(result).not.toContain("Parent Quest:")
			expect(result).not.toContain("From Stage:")
			expect(result).not.toContain("To Stage:")
		})

		it("should handle stage decisions with undefined values", () => {
			const decisionWithUndefined: StageDecisionEmbeddingInput = {
				name: "Undefined Decision",
				conditionType: "custom_event",
				decisionType: "identity_question",
				ambiguityLevel: "balanced_valid_options",
				conditionValue: "Custom trigger",
				successDescription: ["Custom success"],
				failureDescription: ["Custom failure"],
				narrativeTransition: ["Custom transition"],
				potentialPlayerReactions: ["Custom reactions"],
				options: ["Custom option"],
				failureLeadsToRetry: false,
				failureLessonLearned: null,
				description: ["A custom decision"],
				parentQuest: undefined,
				fromStage: undefined,
				toStage: undefined,
			}

			const result = embeddingTextForStageDecision(decisionWithUndefined)

			expect(result).toContain("Stage Decision: Undefined Decision")
			expect(result).toContain("A custom decision")
			expect(result).toContain("conditionType: custom_event")
			expect(result).toContain("decisionType: identity_question")
			expect(result).toContain("failureLeadsToRetry: false")
			expect(result).not.toContain("Failure Lesson:")
			expect(result).not.toContain("Parent Quest:")
			expect(result).not.toContain("From Stage:")
			expect(result).not.toContain("To Stage:")
		})
	})
})
