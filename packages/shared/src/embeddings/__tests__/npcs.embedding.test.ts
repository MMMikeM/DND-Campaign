import { describe, expect, it } from "vitest"
import type { NpcEmbeddingInput, NpcRelationshipEmbeddingInput } from "../embedding-input-types"
import { embeddingTextForCharacterRelationship, embeddingTextForNpc } from "../npcs.embedding"

describe("NPCs Embedding Functions", () => {
	describe("embeddingTextForNpc", () => {
		const mockNpcInput: NpcEmbeddingInput = {
			name: "Elara Moonwhisper",
			race: "elf",
			gender: "female",
			age: "150",
			occupation: "Wizard",
			alignment: "chaotic_good",
			disposition: "friendly",
			attitude: "helpful",
			personalityTraits: ["Curious", "Brave", "Scholarly"],
			drives: ["Knowledge", "Justice"],
			fears: ["Undeath", "Ignorance"],
			background: ["Studied at the Arcane Academy.", "Lost her mentor to dark magic."],
			knowledge: ["Arcane lore.", "Ancient history."],
			secrets: ["Has a secret library.", "Knows the location of a powerful artifact."],
			quirk: "Always carries a small crystal that glows when magic is near.",
			appearance: ["Silver hair.", "Piercing blue eyes.", "Elegant robes."],
			mannerisms: ["Taps fingers when thinking.", "Quotes ancient texts."],
			biases: ["Distrusts necromancers.", "Favors scholarly types."],
			socialStatus: "respected",
			wealth: "comfortable",
			trustLevel: "high",
			adaptability: "flexible",
			complexityProfile: "deeply_complex_contradictory",
			playerPerceptionGoal: "trustworthy_ally_anchor",
			availability: "often",
			currentGoals: ["Find the lost tome.", "Train new apprentices."],
			capability: "high",
			proactivity: "high",
			relatability: "high",
			description: ["A wise and powerful elven wizard.", "Known for her vast knowledge."],

			// Resolved fields
			currentLocationSiteName: "The Arcane Tower",
			primaryFactionNameAndRole: "The Circle of Mages (Elder)",
			keySiteAssociations: ["Resides at The Arcane Tower", "Teaches at The Academy"],
			keyRelationshipSummaries: ["Ally (Strong) with Gareth Ironforge", "Mentor to young wizards"],
		}

		it("should generate comprehensive text for an NPC with all fields", () => {
			const result = embeddingTextForNpc(mockNpcInput)

			const expectedText = `Character: Elara Moonwhisper
Overview:
A wise and powerful elven wizard.
Known for her vast knowledge.
Basic Information:
Race: elf
Gender: female
Age: 150
Occupation: Wizard
Alignment: chaotic good
Current Location: The Arcane Tower
Primary Faction: The Circle of Mages (Elder)
Personality & Behavior:
Disposition: friendly
Attitude: helpful
Social Status: respected
Wealth: comfortable
Trust Level: high
Adaptability: flexible
Complexity: deeply complex contradictory
Player Perception Goal: trustworthy ally anchor
Availability: often
Capability: high
Proactivity: high
Relatability: high
Personality Traits:
- Curious
- Brave
- Scholarly
Drives & Motivations:
- Knowledge
- Justice
Fears:
- Undeath
- Ignorance
Current Goals:
- Find the lost tome.
- Train new apprentices.
Background:
- Studied at the Arcane Academy.
- Lost her mentor to dark magic.
Knowledge & Expertise:
- Arcane lore.
- Ancient history.
Secrets:
- Has a secret library.
- Knows the location of a powerful artifact.
Quirk: Always carries a small crystal that glows when magic is near.
Physical Appearance:
- Silver hair.
- Piercing blue eyes.
- Elegant robes.
Mannerisms:
- Taps fingers when thinking.
- Quotes ancient texts.
Biases:
- Distrusts necromancers.
- Favors scholarly types.
Site Associations:
- Resides at The Arcane Tower
- Teaches at The Academy
Key Relationships:
- Ally (Strong) with Gareth Ironforge
- Mentor to young wizards`

			expect(result).toBe(expectedText)
		})

		it("should handle NPCs with minimal data", () => {
			const minimalNpc: NpcEmbeddingInput = {
				name: "Simple Guard",
				race: "human",
				occupation: "Guard",
			}

			const result = embeddingTextForNpc(minimalNpc)
			const expectedMinimalText = `Character: Simple Guard
Basic Information:
Race: human
Occupation: Guard`
			expect(result).toBe(expectedMinimalText)
		})

		it("should handle NPCs with empty arrays gracefully", () => {
			const npcWithEmptyArrays: NpcEmbeddingInput = {
				name: "Test NPC",
				personalityTraits: [],
				drives: [],
				fears: [],
				keySiteAssociations: [],
				keyRelationshipSummaries: [],
				background: [],
				knowledge: [],
				secrets: [],
				appearance: [],
				mannerisms: [],
				biases: [],
				currentGoals: [],
				description: [],
			}

			const result = embeddingTextForNpc(npcWithEmptyArrays)
			const expectedEmptyText = "Character: Test NPC"
			expect(result).toBe(expectedEmptyText)
		})

		it("should handle NPCs with undefined values by omitting those fields", () => {
			const npcWithUndefined: NpcEmbeddingInput = {
				name: "Undefined NPC",
				race: undefined,
				gender: undefined,
				age: undefined,
				occupation: undefined,
				alignment: undefined,
				disposition: undefined,
				attitude: undefined,
				quirk: undefined,
				socialStatus: undefined,
				wealth: undefined,
				trustLevel: undefined,
				currentLocationSiteName: undefined,
				primaryFactionNameAndRole: undefined,
				personalityTraits: [],
				drives: [],
				fears: [],
				description: [],
			}

			const result = embeddingTextForNpc(npcWithUndefined)
			const expectedUndefinedText = "Character: Undefined NPC"
			expect(result).toBe(expectedUndefinedText)
		})
	})

	describe("embeddingTextForCharacterRelationship", () => {
		const mockRelationshipInput: NpcRelationshipEmbeddingInput = {
			relationshipType: "ally",
			strength: "strong",
			history: ["Met during the goblin raids.", "Fought side by side in the war."],
			narrativeTensions: ["Different approaches to justice.", "Competing for the same resources."],
			sharedGoals: ["Protect the realm.", "Defeat the dark lord."],
			relationshipDynamics: ["Mutual respect.", "Friendly rivalry."],
			isBidirectional: true,
			description: ["Close friends and trusted allies.", "Often work together on missions."],

			// Resolved fields
			npc1Name: "Elara Moonwhisper",
			npc2Name: "Gareth Ironforge",
		}

		it("should generate comprehensive relationship text", () => {
			const result = embeddingTextForCharacterRelationship(mockRelationshipInput)

			const expectedText = `Character Relationship: Elara Moonwhisper and Gareth Ironforge
Overview:
Close friends and trusted allies.
Often work together on missions.
Type: ally
Strength: strong
Direction: bidirectional
History:
- Met during the goblin raids.
- Fought side by side in the war.
Narrative Tensions:
- Different approaches to justice.
- Competing for the same resources.
Shared Goals:
- Protect the realm.
- Defeat the dark lord.
Relationship Dynamics:
- Mutual respect.
- Friendly rivalry.`

			expect(result).toBe(expectedText)
		})

		it("should handle one-way relationships", () => {
			const oneWayRelationship: NpcRelationshipEmbeddingInput = {
				npc1Name: "Alice",
				npc2Name: "Bob",
				relationshipType: "admires",
				isBidirectional: false,
			}

			const result = embeddingTextForCharacterRelationship(oneWayRelationship)
			const expectedOneWayText = `Character Relationship: Alice and Bob
Type: admires
Direction: one-way`
			expect(result).toBe(expectedOneWayText)
		})

		it("should handle relationships with minimal data", () => {
			const minimalRelationship: NpcRelationshipEmbeddingInput = {
				npc1Name: "Alice",
				npc2Name: "Bob",
				relationshipType: "friend",
			}

			const result = embeddingTextForCharacterRelationship(minimalRelationship)
			const expectedMinimalText = `Character Relationship: Alice and Bob
Type: friend`
			expect(result).toBe(expectedMinimalText)
		})

		it("should handle relationships without NPC names", () => {
			const relationshipWithoutNames: NpcRelationshipEmbeddingInput = {
				relationshipType: "enemy",
				strength: "moderate",
				npc1Name: "",
				npc2Name: "",
			}

			const result = embeddingTextForCharacterRelationship(relationshipWithoutNames)
			const expectedNoNamesText = `Character Relationship: Unknown Characters
Type: enemy
Strength: moderate`
			expect(result).toBe(expectedNoNamesText)
		})

		it("should handle relationships with empty arrays gracefully", () => {
			const relationshipWithEmptyArrays: NpcRelationshipEmbeddingInput = {
				npc1Name: "Alice",
				npc2Name: "Bob",
				relationshipType: "colleague",
				history: [],
				narrativeTensions: [],
				sharedGoals: [],
				relationshipDynamics: [],
				description: [],
			}

			const result = embeddingTextForCharacterRelationship(relationshipWithEmptyArrays)
			const expectedEmptyArraysText = `Character Relationship: Alice and Bob
Type: colleague`
			expect(result).toBe(expectedEmptyArraysText)
		})

		it("should handle null boolean values gracefully", () => {
			const relationshipWithNullBoolean: NpcRelationshipEmbeddingInput = {
				npc1Name: "Alice",
				npc2Name: "Bob",
				relationshipType: "neutral",
				isBidirectional: null,
			}

			const result = embeddingTextForCharacterRelationship(relationshipWithNullBoolean)
			const expectedNullBooleanText = `Character Relationship: Alice and Bob
Type: neutral`
			expect(result).toBe(expectedNullBooleanText)
		})
	})
})
