import { describe, expect, it } from "vitest"
import type { FactionEmbeddingInput, RecursiveRequired } from "../embedding-input-types"
import { embeddingTextForFaction } from "../entities/factions.embedding"

describe("Factions Embedding Functions", () => {
	describe("embeddingTextForFaction", () => {
		const mockFactionInput: RecursiveRequired<FactionEmbeddingInput> = {
			name: "The Circle of Mages",
			publicAlignment: "neutral_good",
			secretAlignment: "lawful_neutral",
			size: "medium",
			wealth: "wealthy",
			reach: "regional",
			type: ["academic", "magical", "guild"],
			publicGoal: "Advance magical knowledge for the betterment of society",
			secretGoal: "Control dangerous magical artifacts",
			publicPerception: "Respected scholars and protectors",
			transparencyLevel: "secretive",
			values: ["Knowledge", "Responsibility", "Order"],
			history: ["Founded after the Great Magical War", "Established the Academy of Arcane Arts"],
			symbols: ["Silver staff crossed with a quill", "Blue and silver robes"],
			rituals: ["Monthly gathering under the full moon", "Initiation ceremony with magical binding"],
			taboos: ["Sharing forbidden knowledge with outsiders", "Using magic for personal gain"],
			aesthetics: ["Clean lines", "Scholarly atmosphere", "Magical lighting"],
			jargon: ["The Weave", "Arcane protocols", "Magical resonance"],
			recognitionSigns: ["Touching temple with index finger", "Specific hand gestures"],
			description: [
				"A prestigious organization of mages and scholars.",
				"Dedicated to magical research and education.",
			],

			primaryHqSite: {
				name: "The Arcane Sanctum",
				type: "tower",
				description: ["The Arcane Sanctum is a towering structure that houses the Academy of Arcane Arts."],
			},

			relationships: [
				{
					otherFaction: {
						name: "The Royal Guard",
						type: ["military", "royal"],
					},
					diplomaticStatus: "ally",
					strength: "moderate",
					description: ["Mutual protection of the realm"],
				},
			],

			influence: [
				{
					scope: "Area",
					areaInfo: {
						name: "Arcanum City",
						type: "city",
						description: ["Arcanum City is a bustling city that houses the Academy of Arcane Arts."],
					},
					influenceLevel: "strong",
					presenceTypes: ["magical_academy", "research_facilities"],
					presenceDetails: ["Controls the magical district", "Operates the main academy"],
					priorities: ["magical_education", "artifact_security"],
					description: ["Controls the magical district and academy"],
				},
			],

			agendas: [
				{
					name: "Artifact Recovery",
					agendaType: "occult",
					currentStage: "active",
					importance: "central",
					ultimateAim: "Secure all dangerous magical artifacts",
					moralAmbiguity: "Questionable methods for good intentions",
					approach: ["Covert operations", "Academic research", "Political influence"],
					storyHooks: ["Hire adventurers to retrieve artifacts", "Compete with other factions"],
					description: ["Systematic recovery of dangerous magical items", "Preventing magical catastrophes"],
				},
			],
			members: [],
			questParticipation: [],
			worldConceptLinks: [],
		}

		it("should generate comprehensive text for a faction with all fields", () => {
			const result = embeddingTextForFaction(mockFactionInput)

			expect(result).toContain("Faction: The Circle of Mages")
			expect(result).toContain("A prestigious organization of mages and scholars.")
			expect(result).toContain("Dedicated to magical research and education.")
			expect(result).toContain("type: academic, magical, guild")
			expect(result).toContain("size: medium")
			expect(result).toContain("wealth: wealthy")
			expect(result).toContain("reach: regional")
			expect(result).toContain("publicAlignment: neutral_good")
			expect(result).toContain("transparencyLevel: secretive")
			expect(result).toContain("Headquarters:")
			expect(result).toContain("site: The Arcane Sanctum")
			expect(result).toContain("siteType: tower")
			expect(result).toContain("publicGoal: Advance magical knowledge for the betterment of society")
			expect(result).toContain("publicPerception: Respected scholars and protectors")
			expect(result).toContain("Secret Alignment: lawful_neutral")
			expect(result).toContain("Secret Goal: Control dangerous magical artifacts")
			expect(result).toContain("Core Values:")
			expect(result).toContain("- Knowledge")
			expect(result).toContain("- Responsibility")
			expect(result).toContain("- Order")
			expect(result).toContain("History:")
			expect(result).toContain("- Founded after the Great Magical War")
			expect(result).toContain("- Established the Academy of Arcane Arts")
			expect(result).toContain("Diplomatic Relationships:")
			expect(result).toContain("Faction: The Royal Guard")
			expect(result).toContain("Status: ally")
			expect(result).toContain("Strength: moderate")
			expect(result).toContain("Areas of Influence:")
			expect(result).toContain("Location: Arcanum City")
			expect(result).toContain("Location Type: Area")
			expect(result).toContain("Influence Level: strong")
			expect(result).toContain("Active Agendas:")
			expect(result).toContain("Agenda: Artifact Recovery")
			expect(result).toContain("Type: occult")
			expect(result).toContain("Stage: active")
			expect(result).toContain("Importance: central")
		})

		it("should handle factions with minimal data", () => {
			const minimalFaction: FactionEmbeddingInput = {
				name: "Simple Guild",
				publicAlignment: "true_neutral",
				secretAlignment: null,
				secretGoal: null,
				size: "small",
				wealth: "moderate",
				reach: "local",
				type: ["trade"],
				publicGoal: "Facilitate trade",
				publicPerception: "Helpful merchants",
				transparencyLevel: "transparent",
				values: ["Commerce"],
				history: ["Founded by merchants"],
				symbols: ["Golden scales"],
				rituals: ["Annual trade fair"],
				taboos: ["Cheating customers"],
				aesthetics: ["Practical"],
				jargon: ["Fair trade"],
				recognitionSigns: ["Handshake"],
				description: ["A simple trading guild"],
			}

			const result = embeddingTextForFaction(minimalFaction)

			expect(result).toContain("Faction: Simple Guild")
			expect(result).toContain("A simple trading guild")
			expect(result).toContain("type: trade")
			expect(result).toContain("size: small")
			expect(result).toContain("wealth: moderate")
			expect(result).not.toContain("Headquarters:")
			expect(result).not.toContain("Secret Alignment:")
			expect(result).not.toContain("Secret Goal:")
			expect(result).not.toContain("Diplomatic Relationships:")
			expect(result).not.toContain("Areas of Influence:")
			expect(result).not.toContain("Active Agendas:")
		})

		it("should handle factions with empty arrays gracefully", () => {
			const factionWithEmptyArrays: FactionEmbeddingInput = {
				name: "Isolated Faction",
				publicAlignment: "true_neutral",
				secretAlignment: null,
				secretGoal: null,
				size: "tiny",
				wealth: "poor",
				reach: "local",
				type: [],
				publicGoal: "Survive",
				publicPerception: "Unknown",
				transparencyLevel: "secretive",
				values: [],
				history: [],
				symbols: [],
				rituals: [],
				taboos: [],
				aesthetics: [],
				jargon: [],
				recognitionSigns: [],
				description: [],
				relationships: [],
				influence: [],
				agendas: [],
			}

			const result = embeddingTextForFaction(factionWithEmptyArrays)

			expect(result).toContain("Faction: Isolated Faction")
			expect(result).toContain("size: tiny")
			expect(result).toContain("wealth: poor")
			expect(result).not.toContain("Core Values:")
			expect(result).not.toContain("History:")
			expect(result).not.toContain("Diplomatic Relationships:")
			expect(result).not.toContain("Areas of Influence:")
			expect(result).not.toContain("Active Agendas:")
		})

		it("should handle factions with undefined values by omitting those fields", () => {
			const factionWithUndefined: FactionEmbeddingInput = {
				name: "Undefined Faction",
				publicAlignment: "true_neutral",
				secretAlignment: null,
				secretGoal: null,
				size: "medium",
				wealth: "moderate",
				reach: "local",
				type: ["unknown"],
				publicGoal: "Unknown goals",
				publicPerception: "Mysterious",
				transparencyLevel: "secretive",
				values: ["Mystery"],
				history: ["Unknown origins"],
				symbols: ["Question mark"],
				rituals: ["Secret ceremonies"],
				taboos: ["Revealing secrets"],
				aesthetics: ["Dark"],
				jargon: ["Coded language"],
				recognitionSigns: ["Secret signs"],
				description: ["A mysterious faction"],
				primaryHqSite: undefined,
				relationships: undefined,
			}

			const result = embeddingTextForFaction(factionWithUndefined)

			expect(result).toContain("Faction: Undefined Faction")
			expect(result).toContain("A mysterious faction")
			expect(result).toContain("type: unknown")
			expect(result).not.toContain("Secret Alignment:")
			expect(result).not.toContain("Secret Goal:")
			expect(result).not.toContain("Headquarters:")
			expect(result).not.toContain("Diplomatic Relationships:")
			expect(result).not.toContain("Areas of Influence:")
			expect(result).not.toContain("Active Agendas:")
		})
	})
})
