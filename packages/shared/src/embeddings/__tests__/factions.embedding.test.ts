import { describe, expect, it } from "vitest"
import type { FactionAgendaEmbeddingInput, FactionEmbeddingInput } from "../embedding-input-types"
import { embeddingTextForFaction, embeddingTextForFactionAgenda } from "../factions.embedding"

describe("Factions Embedding Functions", () => {
	describe("embeddingTextForFaction", () => {
		const mockFactionInput: FactionEmbeddingInput = {
			name: "The Circle of Mages",
			publicAlignment: "neutral_good",
			secretAlignment: "lawful_neutral",
			size: "medium",
			wealth: "wealthy",
			reach: "regional",
			type: ["academic", "magical", "guild"],
			publicGoal: "Advance magical knowledge for the betterment of all.",
			secretGoal: "Maintain control over dangerous magical artifacts.",
			publicPerception: "Respected scholars and protectors.",
			transparencyLevel: "selective",
			values: ["Knowledge", "Responsibility", "Order"],
			history: ["Founded after the Great Magical War.", "Survived the Purge of Wizards."],
			symbols: ["Silver staff with crystal orb.", "Blue robes with star patterns."],
			rituals: ["Monthly gathering under the full moon.", "Initiation ceremony with binding oath."],
			taboos: ["Sharing forbidden knowledge.", "Using necromancy."],
			aesthetics: ["Elegant towers.", "Crystal decorations.", "Flowing robes."],
			jargon: "The Art (referring to magic).",
			recognitionSigns: ["Subtle hand gestures.", "Crystal pendants."],
			description: ["A prestigious organization of mages.", "Guardians of magical knowledge."],

			// Resolved fields
			primaryHqSiteName: "The Arcane Spire",
			keyAllyFactionNames: ["The Royal Guard", "The Scholars' Guild"],
			keyEnemyFactionNames: ["The Shadow Cult", "The Anti-Magic League"],
			areasOfInfluence: [
				"Dominates Arcanum City (Area)",
				"Strong influence in The Royal Academy (Site)",
				"Moderate presence in Border Towns (Region)",
			],
		}

		it("should generate comprehensive text for a faction with all fields", () => {
			const result = embeddingTextForFaction(mockFactionInput)

			const expectedText = `Faction: The Circle of Mages
Overview:
A prestigious organization of mages.
Guardians of magical knowledge.
Basic Information:
Type: academic, magical, guild
Size: medium
Wealth: wealthy
Reach: regional
Headquarters: The Arcane Spire
Alignment & Goals:
Public Alignment: neutral good
Secret Alignment: lawful neutral
Public Goal: Advance magical knowledge for the betterment of all.
Secret Goal: Maintain control over dangerous magical artifacts.
Public Perception: Respected scholars and protectors.
Transparency Level: selective
Core Values:
- Knowledge
- Responsibility
- Order
Culture & Identity:
History:
- Founded after the Great Magical War.
- Survived the Purge of Wizards.
Symbols:
- Silver staff with crystal orb.
- Blue robes with star patterns.
Rituals:
- Monthly gathering under the full moon.
- Initiation ceremony with binding oath.
Taboos:
- Sharing forbidden knowledge.
- Using necromancy.
Aesthetics:
- Elegant towers.
- Crystal decorations.
- Flowing robes.
Jargon: The Art (referring to magic).
Recognition Signs:
- Subtle hand gestures.
- Crystal pendants.
Relationships:
Allied Factions:
- The Royal Guard
- The Scholars' Guild
Enemy Factions:
- The Shadow Cult
- The Anti-Magic League
Areas of Influence:
- Dominates Arcanum City (Area)
- Strong influence in The Royal Academy (Site)
- Moderate presence in Border Towns (Region)`

			expect(result).toBe(expectedText)
		})

		it("should handle factions with minimal data", () => {
			const minimalFaction: FactionEmbeddingInput = {
				name: "Simple Guild",
				type: ["trade"],
			}

			const result = embeddingTextForFaction(minimalFaction)
			const expectedMinimalText = `Faction: Simple Guild
Basic Information:
Type: trade`
			expect(result).toBe(expectedMinimalText)
		})

		it("should handle factions with empty arrays gracefully", () => {
			const factionWithEmptyArrays: FactionEmbeddingInput = {
				name: "Isolated Faction",
				type: [],
				values: [],
				history: [],
				symbols: [],
				rituals: [],
				taboos: [],
				aesthetics: [],
				recognitionSigns: [],
				keyAllyFactionNames: [],
				keyEnemyFactionNames: [],
				areasOfInfluence: [],
				description: [],
			}

			const result = embeddingTextForFaction(factionWithEmptyArrays)
			const expectedEmptyText = "Faction: Isolated Faction"
			expect(result).toBe(expectedEmptyText)
		})

		it("should handle factions with undefined values by omitting those fields", () => {
			const factionWithUndefined: FactionEmbeddingInput = {
				name: "Undefined Faction",
				publicAlignment: undefined,
				secretAlignment: undefined,
				size: undefined,
				wealth: undefined,
				reach: undefined,
				publicGoal: undefined,
				secretGoal: undefined,
				publicPerception: undefined,
				transparencyLevel: undefined,
				jargon: undefined,
				primaryHqSiteName: undefined,
				type: [],
				values: [],
				description: [],
			}

			const result = embeddingTextForFaction(factionWithUndefined)
			const expectedUndefinedText = "Faction: Undefined Faction"
			expect(result).toBe(expectedUndefinedText)
		})
	})

	describe("embeddingTextForFactionAgenda", () => {
		const mockAgendaInput: FactionAgendaEmbeddingInput = {
			name: "Secure the Ancient Artifacts",
			agendaType: "acquisition",
			currentStage: "investigation",
			importance: "critical",
			ultimateAim: "Prevent dangerous artifacts from falling into wrong hands.",
			moralAmbiguity: "ends_justify_means",
			approach: ["Diplomatic negotiation.", "Covert operations.", "Academic research."],
			storyHooks: [
				"Artifacts are being stolen from museums.",
				"Rival factions are also seeking the same items.",
				"Some artifacts may be cursed.",
			],
			description: ["A long-term plan to secure magical artifacts.", "Involves multiple operations across the realm."],

			// Resolved fields
			parentFactionName: "The Circle of Mages",
		}

		it("should generate comprehensive text for a faction agenda", () => {
			const result = embeddingTextForFactionAgenda(mockAgendaInput)

			const expectedText = `Faction Agenda: Secure the Ancient Artifacts
Overview:
A long-term plan to secure magical artifacts.
Involves multiple operations across the realm.
Faction: The Circle of Mages
Type: acquisition
Current Stage: investigation
Importance: critical
Ultimate Aim: Prevent dangerous artifacts from falling into wrong hands.
Moral Ambiguity: ends justify means
Approach:
- Diplomatic negotiation.
- Covert operations.
- Academic research.
Story Hooks:
- Artifacts are being stolen from museums.
- Rival factions are also seeking the same items.
- Some artifacts may be cursed.`

			expect(result).toBe(expectedText)
		})

		it("should handle agendas with minimal data", () => {
			const minimalAgenda: FactionAgendaEmbeddingInput = {
				name: "Simple Plan",
				parentFactionName: "Test Faction",
			}

			const result = embeddingTextForFactionAgenda(minimalAgenda)
			const expectedMinimalText = `Faction Agenda: Simple Plan
Faction: Test Faction`
			expect(result).toBe(expectedMinimalText)
		})

		it("should handle agendas with empty arrays gracefully", () => {
			const agendaWithEmptyArrays: FactionAgendaEmbeddingInput = {
				name: "Basic Agenda",
				parentFactionName: "Test Faction",
				approach: [],
				storyHooks: [],
				description: [],
			}

			const result = embeddingTextForFactionAgenda(agendaWithEmptyArrays)
			const expectedEmptyText = `Faction Agenda: Basic Agenda
Faction: Test Faction`
			expect(result).toBe(expectedEmptyText)
		})

		it("should handle agendas with undefined values by omitting those fields", () => {
			const agendaWithUndefined: FactionAgendaEmbeddingInput = {
				name: "Undefined Agenda",
				parentFactionName: "Test Faction",
				agendaType: undefined,
				currentStage: undefined,
				importance: undefined,
				ultimateAim: undefined,
				moralAmbiguity: undefined,
				approach: [],
				storyHooks: [],
				description: [],
			}

			const result = embeddingTextForFactionAgenda(agendaWithUndefined)
			const expectedUndefinedText = `Faction Agenda: Undefined Agenda
Faction: Test Faction`
			expect(result).toBe(expectedUndefinedText)
		})
	})
})
