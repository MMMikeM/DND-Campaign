import { describe, expect, it } from "vitest"
import type { ConsequenceEmbeddingInput, NarrativeEventEmbeddingInput } from "../embedding-input-types"
import { embeddingTextForConsequence, embeddingTextForNarrativeEvent } from "../events.embedding"

describe("Events Embedding Functions", () => {
	describe("embeddingTextForNarrativeEvent", () => {
		const mockEventInput: NarrativeEventEmbeddingInput = {
			name: "The Dragon's Awakening",
			eventType: "escalation",
			intendedRhythmEffect: "tension_spike",
			narrativePlacement: "mid_campaign",
			impactSeverity: "major",
			complication_details: "The dragon's awakening disrupts all magical wards in the region.",
			escalation_details: "Ancient magic surges, affecting all spellcasters.",
			twist_reveal_details: "The dragon was actually protecting the realm from a greater threat.",
			description: [
				"A massive ancient dragon awakens from centuries of slumber.",
				"Its roar shakes the very foundations of the world.",
			],

			// Resolved fields
			relatedQuestName: "The Ancient Prophecy",
			questStageName: "Investigate the Tremors",
			triggeringDecisionName: "Enter the Dragon's Lair",
		}

		it("should generate comprehensive text for a narrative event with all fields", () => {
			const result = embeddingTextForNarrativeEvent(mockEventInput)

			const expectedText = `Narrative Event: The Dragon's Awakening
Overview:
A massive ancient dragon awakens from centuries of slumber.
Its roar shakes the very foundations of the world.
Type: escalation
Rhythm Effect: tension spike
Narrative Placement: mid campaign
Impact Severity: major
Related Quest: The Ancient Prophecy
Quest Stage: Investigate the Tremors
Triggering Decision: Enter the Dragon's Lair
Complication Details: The dragon's awakening disrupts all magical wards in the region.
Escalation Details: Ancient magic surges, affecting all spellcasters.
Twist/Reveal Details: The dragon was actually protecting the realm from a greater threat.`

			expect(result).toBe(expectedText)
		})

		it("should handle events with minimal data", () => {
			const minimalEvent: NarrativeEventEmbeddingInput = {
				name: "Simple Event",
				eventType: "complication",
			}

			const result = embeddingTextForNarrativeEvent(minimalEvent)
			const expectedMinimalText = `Narrative Event: Simple Event
Type: complication`
			expect(result).toBe(expectedMinimalText)
		})

		it("should handle events with null resolved fields", () => {
			const eventWithNullResolved: NarrativeEventEmbeddingInput = {
				name: "Standalone Event",
				eventType: "twist",
				relatedQuestName: null,
				questStageName: null,
				triggeringDecisionName: null,
				description: [],
			}

			const result = embeddingTextForNarrativeEvent(eventWithNullResolved)
			const expectedNullText = `Narrative Event: Standalone Event
Type: twist`
			expect(result).toBe(expectedNullText)
		})

		it("should handle events with empty arrays gracefully", () => {
			const eventWithEmptyArrays: NarrativeEventEmbeddingInput = {
				name: "Empty Event",
				eventType: "complication",
				description: [],
			}

			const result = embeddingTextForNarrativeEvent(eventWithEmptyArrays)
			const expectedEmptyText = `Narrative Event: Empty Event
Type: complication`
			expect(result).toBe(expectedEmptyText)
		})
	})

	describe("embeddingTextForConsequence", () => {
		const mockConsequenceInput: ConsequenceEmbeddingInput = {
			name: "The Kingdom Falls to Chaos",
			consequenceType: "political",
			severity: "catastrophic",
			visibility: "public",
			timeframe: "immediate",
			sourceType: "player_action",
			playerImpactFeel: "regret",
			conflictImpactDescription: "The civil war intensifies as leadership crumbles.",
			description: ["The royal family is overthrown.", "Anarchy spreads throughout the land."],

			// Resolved fields
			triggerDecisionName: "Assassinate the King",
			triggerQuestName: "The Royal Conspiracy",
			triggerConflictName: "The War of Succession",
			affectedFactionName: "The Royal Guard",
			affectedRegionName: "The Capital Kingdom",
			affectedAreaName: "The Royal District",
			affectedSiteName: "The Royal Palace",
			affectedNpcName: "Queen Isabella",
			affectedDestinationName: "The Golden Age",
			affectedConflictNameAsEffect: "The Peasant Uprising",
			futureQuestName: "Restore Order",
		}

		it("should generate comprehensive text for a consequence with all fields", () => {
			const result = embeddingTextForConsequence(mockConsequenceInput)

			const expectedText = `Consequence: The Kingdom Falls to Chaos
Overview:
The royal family is overthrown.
Anarchy spreads throughout the land.
Type: political
Severity: catastrophic
Visibility: public
Timeframe: immediate
Source Type: player action
Player Impact Feel: regret
Conflict Impact: The civil war intensifies as leadership crumbles.
Triggers:
Triggered by Decision: Assassinate the King
Triggered by Quest: The Royal Conspiracy
Triggered by Conflict: The War of Succession
Effects:
Affected Faction: The Royal Guard
Affected Region: The Capital Kingdom
Affected Area: The Royal District
Affected Site: The Royal Palace
Affected NPC: Queen Isabella
Affected Destination: The Golden Age
Affected Conflict: The Peasant Uprising
Future Quest: Restore Order`

			expect(result).toBe(expectedText)
		})

		it("should handle consequences with minimal data", () => {
			const minimalConsequence: ConsequenceEmbeddingInput = {
				name: "Simple Outcome",
				consequenceType: "social",
			}

			const result = embeddingTextForConsequence(minimalConsequence)
			const expectedMinimalText = `Consequence: Simple Outcome
Type: social`
			expect(result).toBe(expectedMinimalText)
		})

		it("should handle consequences with some null resolved fields", () => {
			const partialConsequence: ConsequenceEmbeddingInput = {
				name: "Partial Consequence",
				consequenceType: "economic",
				severity: "moderate",
				triggerDecisionName: "Trade Agreement",
				affectedFactionName: "Merchant Guild",
				description: [],
			}

			const result = embeddingTextForConsequence(partialConsequence)
			const expectedPartialText = `Consequence: Partial Consequence
Type: economic
Severity: moderate
Triggers:
Triggered by Decision: Trade Agreement
Effects:
Affected Faction: Merchant Guild`
			expect(result).toBe(expectedPartialText)
		})

		it("should handle consequences with empty arrays gracefully", () => {
			const consequenceWithEmptyArrays: ConsequenceEmbeddingInput = {
				name: "Empty Consequence",
				consequenceType: "environmental",
				description: [],
			}

			const result = embeddingTextForConsequence(consequenceWithEmptyArrays)
			const expectedEmptyText = `Consequence: Empty Consequence
Type: environmental`
			expect(result).toBe(expectedEmptyText)
		})

		it("should handle consequences with undefined values by omitting those fields", () => {
			const consequenceWithUndefined: ConsequenceEmbeddingInput = {
				name: "Undefined Consequence",
				consequenceType: undefined,
				severity: undefined,
				visibility: undefined,
				timeframe: undefined,
				sourceType: undefined,
				playerImpactFeel: undefined,
				conflictImpactDescription: undefined,
				triggerDecisionName: undefined,
				triggerQuestName: undefined,
				description: undefined,
			}

			const result = embeddingTextForConsequence(consequenceWithUndefined)
			const expectedUndefinedText = `Consequence: Undefined Consequence`
			expect(result).toBe(expectedUndefinedText)
		})
	})
})
