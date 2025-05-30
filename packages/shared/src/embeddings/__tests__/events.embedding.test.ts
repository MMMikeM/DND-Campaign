import { describe, expect, it } from "vitest"
import type { NarrativeEventEmbeddingInput, RecursiveRequired } from "../embedding-input-types"
import { embeddingTextForNarrativeEvent } from "../entities/events.embedding"

describe("Events Embedding Functions", () => {
	describe("embeddingTextForNarrativeEvent", () => {
		const mockEventInput: RecursiveRequired<NarrativeEventEmbeddingInput> = {
			name: "The Dragon's Awakening",
			eventType: "escalation",
			intendedRhythmEffect: "spike_tension",
			narrativePlacement: "climax",
			impactSeverity: "major",
			complication_details: "The dragon's awakening disrupts all magical wards in the region.",
			escalation_details: "Ancient magic surges uncontrollably, affecting all spellcasters.",
			twist_reveal_details: "The dragon was actually protecting the realm from a greater threat.",
			description: [
				"A massive ancient dragon awakens from centuries of slumber.",
				"Its awakening sends shockwaves through the magical fabric of reality.",
			],

			relatedQuest: {
				name: "The Sleeping Giant",
				type: "main",
			},

			questStage: {
				name: "Investigate the Tremors",
				stageType: "revelation_point",
			},

			triggeringDecision: {
				name: "Enter the Dragon's Lair",
				decisionType: "tactical_decision",
				description: ["The party decides to venture into the ancient lair"],
			},

			triggeredConsequences: [
				{
					name: "Magical Chaos",
					consequenceType: "environmental_change",
					severity: "major",
					playerImpactFeel: "challenging_setback",
					conflictImpactDescription: "Disrupts the balance of magical forces",
					description: ["Wild magic surges affect the entire region"],
				},
			],
		}

		it("should generate comprehensive text for a narrative event with all fields", () => {
			const result = embeddingTextForNarrativeEvent(mockEventInput)

			expect(result).toContain("Narrative Event: The Dragon's Awakening")
			expect(result).toContain("A massive ancient dragon awakens from centuries of slumber.")
			expect(result).toContain("Its awakening sends shockwaves through the magical fabric of reality.")
			expect(result).toContain("type: escalation")
			expect(result).toContain("rhythmEffect: spike_tension")
			expect(result).toContain("narrativePlacement: climax")
			expect(result).toContain("impactSeverity: major")
			expect(result).toContain("Related Quest:")
			expect(result).toContain("quest: The Sleeping Giant")
			expect(result).toContain("questType: main")
			expect(result).toContain("Quest Stage:")
			expect(result).toContain("stage: Investigate the Tremors")
			expect(result).toContain("stageType: revelation_point")
			expect(result).toContain("Triggering Decision:")
			expect(result).toContain("decision: Enter the Dragon's Lair")
			expect(result).toContain("decisionType: tactical_decision")
			expect(result).toContain("Complication Details: The dragon's awakening disrupts all magical wards in the region.")
			expect(result).toContain("Escalation Details: Ancient magic surges uncontrollably, affecting all spellcasters.")
			expect(result).toContain(
				"Twist/Reveal Details: The dragon was actually protecting the realm from a greater threat.",
			)
			expect(result).toContain("Triggered Consequences:")
			expect(result).toContain("Consequence: Magical Chaos")
			expect(result).toContain("Type: environmental_change")
			expect(result).toContain("Severity: major")
			expect(result).toContain("Player Impact: challenging_setback")
			expect(result).toContain("Conflict Impact: Disrupts the balance of magical forces")
		})

		it("should handle events with minimal data", () => {
			const minimalEvent: NarrativeEventEmbeddingInput = {
				name: "Simple Event",
				eventType: "complication",
				intendedRhythmEffect: "introduce_mystery",
				narrativePlacement: "early",
				impactSeverity: "minor",
				description: ["A simple complication arises"],
			}

			const result = embeddingTextForNarrativeEvent(minimalEvent)

			expect(result).toContain("Narrative Event: Simple Event")
			expect(result).toContain("A simple complication arises")
			expect(result).toContain("type: complication")
			expect(result).toContain("rhythmEffect: introduce_mystery")
			expect(result).toContain("narrativePlacement: early")
			expect(result).toContain("impactSeverity: minor")
			expect(result).not.toContain("Related Quest:")
			expect(result).not.toContain("Quest Stage:")
			expect(result).not.toContain("Triggering Decision:")
			expect(result).not.toContain("Triggered Consequences:")
		})

		it("should handle events with empty arrays gracefully", () => {
			const eventWithEmptyArrays: NarrativeEventEmbeddingInput = {
				name: "Empty Event",
				eventType: "complication",
				intendedRhythmEffect: "introduce_mystery",
				narrativePlacement: "early",
				impactSeverity: "minor",
				description: [],
				triggeredConsequences: [],
			}

			const result = embeddingTextForNarrativeEvent(eventWithEmptyArrays)

			expect(result).toContain("Narrative Event: Empty Event")
			expect(result).toContain("type: complication")
			expect(result).not.toContain("Triggered Consequences:")
		})

		it("should handle events with undefined values by omitting those fields", () => {
			const eventWithUndefined: NarrativeEventEmbeddingInput = {
				name: "Undefined Event",
				eventType: "complication",
				intendedRhythmEffect: "introduce_mystery",
				narrativePlacement: "early",
				impactSeverity: "minor",
				complication_details: undefined,
				escalation_details: undefined,
				twist_reveal_details: undefined,
				relatedQuest: undefined,
				questStage: undefined,
				triggeringDecision: undefined,
				triggeredConsequences: undefined,
				description: [],
			}

			const result = embeddingTextForNarrativeEvent(eventWithUndefined)

			expect(result).toContain("Narrative Event: Undefined Event")
			expect(result).toContain("type: complication")
			expect(result).not.toContain("Related Quest:")
			expect(result).not.toContain("Quest Stage:")
			expect(result).not.toContain("Triggering Decision:")
			expect(result).not.toContain("Complication Details:")
			expect(result).not.toContain("Escalation Details:")
			expect(result).not.toContain("Twist/Reveal Details:")
			expect(result).not.toContain("Triggered Consequences:")
		})
	})
})
