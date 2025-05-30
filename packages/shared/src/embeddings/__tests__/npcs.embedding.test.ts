import { describe, expect, it } from "vitest"
import type { NpcEmbeddingInput, RecursiveRequired } from "../embedding-input-types"
import { embeddingTextForNpc } from "../entities/npcs.embedding"

describe("NPCs Embedding Functions", () => {
	describe("embeddingTextForNpc", () => {
		const mockNpcInput: RecursiveRequired<NpcEmbeddingInput> = {
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
			avoidTopics: ["Personal failures", "Dark magic experiments"],
			dialogue: ["Knowledge is power, but wisdom is knowing how to use it.", "The arcane flows through all things."],
			preferredTopics: ["Ancient history", "Magical theory", "Teaching"],
			rumours: ["Some say she has a secret apprentice.", "Rumored to know forbidden spells."],
			voiceNotes: ["Speaks with measured cadence", "Slight elven accent"],

			currentLocation: {
				name: "The Arcane Tower",
				siteType: "tower",
				intendedSiteFunction: "information_node_lore",
			},

			factionMemberships: [
				{
					faction: {
						name: "The Circle of Mages",
					},
					role: "elder",
					rank: "Elder",
					loyalty: "high",
					justification: "Believes in the faction's mission",
					secrets: ["Knows about the faction's secret agenda"],
					description: ["Senior member with significant influence"],
				},
			],

			siteAssociations: [
				{
					site: {
						name: "The Arcane Tower",
						siteType: "tower",
					},
					associationType: "residence",
					description: ["Lives and works here"],
				},
				{
					site: {
						name: "The Academy",
						siteType: "building",
					},
					associationType: "workplace",
					description: ["Teaches here regularly"],
				},
			],

			characterRelationships: [
				{
					relatedNpc: {
						name: "Gareth Ironforge",
						race: "dwarf",
						occupation: "Warrior",
					},
					relationshipType: "ally",
					strength: "strong",
					history: ["Met during the goblin raids.", "Fought side by side in the war."],
					narrativeTensions: ["Different approaches to justice.", "Competing for the same resources."],
					sharedGoals: ["Protect the realm.", "Defeat the dark lord."],
					relationshipDynamics: ["Mutual respect.", "Friendly rivalry."],
					isBidirectional: true,
					description: ["Close friends and trusted allies.", "Often work together on missions."],
				},
			],
		}

		it("should generate comprehensive text for an NPC with all fields", () => {
			const result = embeddingTextForNpc(mockNpcInput)

			expect(result).toContain("Character: Elara Moonwhisper")
			expect(result).toContain("A wise and powerful elven wizard.")
			expect(result).toContain("Known for her vast knowledge.")
			expect(result).toContain("race: elf")
			expect(result).toContain("gender: female")
			expect(result).toContain("age: 150")
			expect(result).toContain("occupation: Wizard")
			expect(result).toContain("alignment: chaotic_good")
			expect(result).toContain("socialStatus: respected")
			expect(result).toContain("wealth: comfortable")
			expect(result).toContain("Current Location:")
			expect(result).toContain("site: The Arcane Tower")
			expect(result).toContain("siteType: tower")
			expect(result).toContain("function: information_node_lore")
			expect(result).toContain("disposition: friendly")
			expect(result).toContain("attitude: helpful")
			expect(result).toContain("trustLevel: high")
			expect(result).toContain("adaptability: flexible")
			expect(result).toContain("complexityProfile: deeply_complex_contradictory")
			expect(result).toContain("playerPerceptionGoal: trustworthy_ally_anchor")
			expect(result).toContain("availability: often")
			expect(result).toContain("capability: high")
			expect(result).toContain("proactivity: high")
			expect(result).toContain("relatability: high")
			expect(result).toContain("Personality Traits:")
			expect(result).toContain("- Curious")
			expect(result).toContain("- Brave")
			expect(result).toContain("- Scholarly")
			expect(result).toContain("Drives & Motivations:")
			expect(result).toContain("- Knowledge")
			expect(result).toContain("- Justice")
			expect(result).toContain("Fears:")
			expect(result).toContain("- Undeath")
			expect(result).toContain("- Ignorance")
			expect(result).toContain("Current Goals:")
			expect(result).toContain("- Find the lost tome.")
			expect(result).toContain("- Train new apprentices.")
			expect(result).toContain("Background:")
			expect(result).toContain("- Studied at the Arcane Academy.")
			expect(result).toContain("- Lost her mentor to dark magic.")
			expect(result).toContain("Knowledge & Expertise:")
			expect(result).toContain("- Arcane lore.")
			expect(result).toContain("- Ancient history.")
			expect(result).toContain("Secrets:")
			expect(result).toContain("- Has a secret library.")
			expect(result).toContain("- Knows the location of a powerful artifact.")
			expect(result).toContain("Quirk: Always carries a small crystal that glows when magic is near.")
			expect(result).toContain("Physical Appearance:")
			expect(result).toContain("- Silver hair.")
			expect(result).toContain("- Piercing blue eyes.")
			expect(result).toContain("- Elegant robes.")
			expect(result).toContain("Mannerisms:")
			expect(result).toContain("- Taps fingers when thinking.")
			expect(result).toContain("- Quotes ancient texts.")
			expect(result).toContain("Voice Notes:")
			expect(result).toContain("- Speaks with measured cadence")
			expect(result).toContain("- Slight elven accent")
			expect(result).toContain("Dialogue Examples:")
			expect(result).toContain("- Knowledge is power, but wisdom is knowing how to use it.")
			expect(result).toContain("- The arcane flows through all things.")
			expect(result).toContain("Preferred Topics:")
			expect(result).toContain("- Ancient history")
			expect(result).toContain("- Magical theory")
			expect(result).toContain("- Teaching")
			expect(result).toContain("Avoid Topics:")
			expect(result).toContain("- Personal failures")
			expect(result).toContain("- Dark magic experiments")
			expect(result).toContain("Biases:")
			expect(result).toContain("- Distrusts necromancers.")
			expect(result).toContain("- Favors scholarly types.")
			expect(result).toContain("Rumors:")
			expect(result).toContain("- Some say she has a secret apprentice.")
			expect(result).toContain("- Rumored to know forbidden spells.")
			expect(result).toContain("Faction Memberships:")
			expect(result).toContain("Faction: The Circle of Mages")
			expect(result).toContain("Role: elder")
			expect(result).toContain("Rank: Elder")
			expect(result).toContain("Loyalty: high")
			expect(result).toContain("Justification: Believes in the faction's mission")
			expect(result).toContain("Site Associations:")
			expect(result).toContain("Site: The Arcane Tower")
			expect(result).toContain("Site Type: tower")
			expect(result).toContain("Association Type: residence")
			expect(result).toContain("Site: The Academy")
			expect(result).toContain("Site Type: building")
			expect(result).toContain("Association Type: workplace")
			expect(result).toContain("Character Relationships:")
			expect(result).toContain("Character: Gareth Ironforge")
			expect(result).toContain("Character Occupation: Warrior")
			expect(result).toContain("Type: ally")
			expect(result).toContain("Strength: strong")
			expect(result).toContain("Direction: bidirectional")
		})

		it("should handle NPCs with minimal data", () => {
			const minimalNpc: NpcEmbeddingInput = {
				name: "Simple Guard",
				race: "human",
				gender: "male",
				age: "30",
				occupation: "Guard",
				alignment: "lawful_neutral",
				disposition: "neutral",
				attitude: "professional",
				socialStatus: "common",
				wealth: "poor",
				trustLevel: "medium",
				adaptability: "reluctant",
				complexityProfile: "simple_what_you_see",
				playerPerceptionGoal: "relatable_everyman",
				availability: "sometimes",
				capability: "medium",
				proactivity: "low",
				relatability: "medium",
				personalityTraits: ["Dutiful"],
				drives: ["Duty"],
				fears: ["Losing job"],
				currentGoals: ["Keep the peace"],
				background: ["Joined the guard young"],
				knowledge: ["Local laws"],
				secrets: ["None"],
				appearance: ["Plain uniform"],
				mannerisms: ["Stands at attention"],
				voiceNotes: ["Gruff voice"],
				dialogue: ["Move along"],
				preferredTopics: ["Work"],
				avoidTopics: ["Personal life"],
				biases: ["Suspicious of strangers"],
				rumours: ["Just a regular guard"],
				description: ["A simple town guard"],
			}

			const result = embeddingTextForNpc(minimalNpc)

			expect(result).toContain("Character: Simple Guard")
			expect(result).toContain("A simple town guard")
			expect(result).toContain("race: human")
			expect(result).toContain("occupation: Guard")
			expect(result).toContain("alignment: lawful_neutral")
			expect(result).not.toContain("Current Location:")
			expect(result).not.toContain("Faction Memberships:")
			expect(result).not.toContain("Site Associations:")
			expect(result).not.toContain("Character Relationships:")
		})

		it("should handle NPCs with empty arrays gracefully", () => {
			const npcWithEmptyArrays: NpcEmbeddingInput = {
				name: "Empty NPC",
				race: "human",
				gender: "female",
				age: "25",
				occupation: "Merchant",
				alignment: "true_neutral",
				disposition: "neutral",
				attitude: "business-like",
				socialStatus: "common",
				wealth: "moderate",
				trustLevel: "medium",
				adaptability: "flexible",
				complexityProfile: "simple_what_you_see",
				playerPerceptionGoal: "relatable_everyman",
				availability: "often",
				capability: "medium",
				proactivity: "medium",
				relatability: "medium",
				personalityTraits: [],
				drives: [],
				fears: [],
				currentGoals: [],
				background: [],
				knowledge: [],
				secrets: [],
				appearance: [],
				mannerisms: [],
				voiceNotes: [],
				dialogue: [],
				preferredTopics: [],
				avoidTopics: [],
				biases: [],
				rumours: [],
				description: [],
				factionMemberships: [],
				siteAssociations: [],
				characterRelationships: [],
			}

			const result = embeddingTextForNpc(npcWithEmptyArrays)

			expect(result).toContain("Character: Empty NPC")
			expect(result).toContain("race: human")
			expect(result).toContain("occupation: Merchant")
			expect(result).not.toContain("Personality Traits:")
			expect(result).not.toContain("Drives & Motivations:")
			expect(result).not.toContain("Faction Memberships:")
			expect(result).not.toContain("Site Associations:")
			expect(result).not.toContain("Character Relationships:")
		})

		it("should handle NPCs with undefined values by omitting those fields", () => {
			const npcWithUndefined: NpcEmbeddingInput = {
				name: "Undefined NPC",
				race: "human",
				gender: "male",
				age: "40",
				occupation: "Unknown",
				alignment: "true_neutral",
				disposition: "mysterious",
				attitude: "secretive",
				socialStatus: "unknown",
				wealth: "unknown",
				trustLevel: "low",
				adaptability: "rigid",
				complexityProfile: "intriguing_mystery_figure",
				playerPerceptionGoal: "intriguing_mystery_figure",
				availability: "rarely",
				capability: "unknown",
				proactivity: "unknown",
				relatability: "low",
				personalityTraits: ["Mysterious"],
				drives: ["Unknown"],
				fears: ["Unknown"],
				currentGoals: ["Unknown"],
				background: ["Unknown past"],
				knowledge: ["Unknown"],
				secrets: ["Many"],
				appearance: ["Hooded figure"],
				mannerisms: ["Speaks in riddles"],
				voiceNotes: ["Whispered voice"],
				dialogue: ["All is not as it seems"],
				preferredTopics: ["Mysteries"],
				avoidTopics: ["Direct questions"],
				biases: ["Unknown"],
				rumours: ["Very mysterious"],
				description: ["A mysterious figure"],
				quirk: undefined,
				currentLocation: undefined,
				factionMemberships: undefined,
				siteAssociations: undefined,
				characterRelationships: undefined,
			}

			const result = embeddingTextForNpc(npcWithUndefined)

			expect(result).toContain("Character: Undefined NPC")
			expect(result).toContain("A mysterious figure")
			expect(result).toContain("race: human")
			expect(result).toContain("occupation: Unknown")
			expect(result).not.toContain("Quirk:")
			expect(result).not.toContain("Current Location:")
			expect(result).not.toContain("Faction Memberships:")
			expect(result).not.toContain("Site Associations:")
			expect(result).not.toContain("Character Relationships:")
		})
	})
})
