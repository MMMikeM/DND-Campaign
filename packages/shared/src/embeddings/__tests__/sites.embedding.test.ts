import { describe, expect, it } from "vitest"
import type {
	SiteEmbeddingInput,
	SiteEncounterEmbeddingInput,
	SiteSecretEmbeddingInput,
} from "../embedding-input-types"
import { embeddingTextForSite, embeddingTextForSiteEncounter, embeddingTextForSiteSecret } from "../sites.embedding"

describe("Sites Embedding Functions", () => {
	describe("embeddingTextForSite", () => {
		const mockSiteInput: SiteEmbeddingInput = {
			name: "The Whispering Woods",
			siteType: "forest",
			intendedSiteFunction: "exploration",
			terrain: "dense_forest",
			climate: "temperate",
			mood: "mysterious",
			environment: "magical",
			creatures: ["Dire wolves.", "Forest spirits.", "Ancient treants."],
			features: ["Crystal clear stream.", "Ancient stone circle.", "Massive oak tree."],
			treasures: ["Hidden cache of gems.", "Magical bow.", "Ancient scroll."],
			lightingDescription: "Dappled sunlight filtering through thick canopy.",
			soundscape: ["Rustling leaves.", "Distant wolf howls.", "Babbling brook."],
			smells: ["Pine needles.", "Damp earth.", "Wildflowers."],
			weather: "Light mist in the morning, clear afternoons.",
			descriptors: ["Ancient", "Mystical", "Untamed"],
			coverOptions: ["Dense undergrowth.", "Large tree trunks.", "Rocky outcroppings."],
			description: [
				"An ancient forest filled with magic and mystery.",
				"Home to creatures both beautiful and dangerous.",
			],

			// Resolved fields
			parentAreaName: "The Northern Wilderness",
			parentRegionName: "The Frontier Lands",
		}

		it("should generate comprehensive text for a site with all fields", () => {
			const result = embeddingTextForSite(mockSiteInput)

			const expectedText = `Site: The Whispering Woods
Overview:
An ancient forest filled with magic and mystery.
Home to creatures both beautiful and dangerous.
Basic Information:
Type: forest
Intended Function: exploration
Terrain: dense forest
Climate: temperate
Mood: mysterious
Environment: magical
Area: The Northern Wilderness
Region: The Frontier Lands
Environmental Details:
Lighting: Dappled sunlight filtering through thick canopy.
Weather: Light mist in the morning, clear afternoons.
Descriptors:
- Ancient
- Mystical
- Untamed
Creatures:
- Dire wolves.
- Forest spirits.
- Ancient treants.
Features:
- Crystal clear stream.
- Ancient stone circle.
- Massive oak tree.
Treasures:
- Hidden cache of gems.
- Magical bow.
- Ancient scroll.
Soundscape:
- Rustling leaves.
- Distant wolf howls.
- Babbling brook.
Smells:
- Pine needles.
- Damp earth.
- Wildflowers.
Cover Options:
- Dense undergrowth.
- Large tree trunks.
- Rocky outcroppings.`

			expect(result).toBe(expectedText)
		})

		it("should handle sites with minimal data", () => {
			const minimalSite: SiteEmbeddingInput = {
				name: "Simple Cave",
				siteType: "cave",
				parentAreaName: "Test Area",
			}

			const result = embeddingTextForSite(minimalSite)
			const expectedMinimalText = `Site: Simple Cave
Basic Information:
Type: cave
Area: Test Area`
			expect(result).toBe(expectedMinimalText)
		})

		it("should handle sites with empty arrays gracefully", () => {
			const siteWithEmptyArrays: SiteEmbeddingInput = {
				name: "Empty Site",
				creatures: [],
				features: [],
				treasures: [],
				soundscape: [],
				smells: [],
				descriptors: [],
				coverOptions: [],
				description: [],
				parentAreaName: "Test Area",
			}

			const result = embeddingTextForSite(siteWithEmptyArrays)
			const expectedEmptyText = `Site: Empty Site
Basic Information:
Area: Test Area`
			expect(result).toBe(expectedEmptyText)
		})

		it("should handle sites with null values by omitting those fields", () => {
			const siteWithNulls: SiteEmbeddingInput = {
				name: "Null Site",
				siteType: null,
				intendedSiteFunction: null,
				terrain: null,
				climate: null,
				mood: null,
				environment: null,
				lightingDescription: null,
				weather: null,
				parentAreaName: null,
				parentRegionName: null,
				creatures: [],
				features: [],
				treasures: [],
				soundscape: [],
				smells: [],
				descriptors: [],
				coverOptions: [],
				description: [],
			}

			const result = embeddingTextForSite(siteWithNulls)
			const expectedNullText = "Site: Null Site"
			expect(result).toBe(expectedNullText)
		})
	})

	describe("embeddingTextForSiteEncounter", () => {
		const mockEncounterInput: SiteEncounterEmbeddingInput = {
			name: "The Guardian's Challenge",
			encounterType: "combat",
			dangerLevel: "moderate",
			difficulty: "challenging",
			creatures: ["Ancient Stone Guardian.", "Animated vines."],
			treasure: ["Guardian's crystal heart.", "Ancient weapon."],
			description: ["A massive stone guardian blocks the path.", "Vines animate to assist in the defense."],

			// Resolved fields
			parentSiteName: "The Ancient Temple",
		}

		it("should generate comprehensive text for a site encounter", () => {
			const result = embeddingTextForSiteEncounter(mockEncounterInput)

			const expectedText = `Site Encounter: The Guardian's Challenge
Overview:
A massive stone guardian blocks the path.
Vines animate to assist in the defense.
Basic Information:
Type: combat
Danger Level: moderate
Difficulty: challenging
Site: The Ancient Temple
Creatures:
- Ancient Stone Guardian.
- Animated vines.
Treasure:
- Guardian's crystal heart.
- Ancient weapon.`

			expect(result).toBe(expectedText)
		})

		it("should handle encounters with minimal data", () => {
			const minimalEncounter: SiteEncounterEmbeddingInput = {
				name: "Simple Fight",
				parentSiteName: "Test Site",
			}

			const result = embeddingTextForSiteEncounter(minimalEncounter)
			const expectedMinimalText = `Site Encounter: Simple Fight
Basic Information:
Site: Test Site`
			expect(result).toBe(expectedMinimalText)
		})

		it("should handle encounters with empty arrays gracefully", () => {
			const encounterWithEmptyArrays: SiteEncounterEmbeddingInput = {
				name: "Empty Encounter",
				parentSiteName: "Test Site",
				creatures: [],
				treasure: [],
				description: [],
			}

			const result = embeddingTextForSiteEncounter(encounterWithEmptyArrays)
			const expectedEmptyText = `Site Encounter: Empty Encounter
Basic Information:
Site: Test Site`
			expect(result).toBe(expectedEmptyText)
		})

		it("should handle encounters with null values by omitting those fields", () => {
			const encounterWithNulls: SiteEncounterEmbeddingInput = {
				name: "Null Encounter",
				encounterType: null,
				dangerLevel: null,
				difficulty: null,
				parentSiteName: null,
				creatures: [],
				treasure: [],
				description: [],
			}

			const result = embeddingTextForSiteEncounter(encounterWithNulls)
			const expectedNullText = "Site Encounter: Null Encounter"
			expect(result).toBe(expectedNullText)
		})
	})

	describe("embeddingTextForSiteSecret", () => {
		const mockSecretInput: SiteSecretEmbeddingInput = {
			secretType: "hidden_treasure",
			difficultyToDiscover: "hard",
			discoveryMethod: ["Careful examination of the walls.", "Solving the ancient riddle."],
			consequences: ["Reveals hidden passage.", "Triggers ancient trap.", "Alerts guardians."],
			description: ["A secret compartment behind the altar.", "Contains artifacts from a lost civilization."],

			// Resolved fields
			parentSiteName: "The Forgotten Shrine",
		}

		it("should generate comprehensive text for a site secret", () => {
			const result = embeddingTextForSiteSecret(mockSecretInput)

			const expectedText = `Site Secret: The Forgotten Shrine Secret
Overview:
A secret compartment behind the altar.
Contains artifacts from a lost civilization.
Basic Information:
Type: hidden treasure
Difficulty to Discover: hard
Site: The Forgotten Shrine
Discovery Methods:
- Careful examination of the walls.
- Solving the ancient riddle.
Consequences:
- Reveals hidden passage.
- Triggers ancient trap.
- Alerts guardians.`

			expect(result).toBe(expectedText)
		})

		it("should handle secrets with minimal data", () => {
			const minimalSecret: SiteSecretEmbeddingInput = {
				parentSiteName: "Test Site",
			}

			const result = embeddingTextForSiteSecret(minimalSecret)
			const expectedMinimalText = `Site Secret: Test Site Secret
Basic Information:
Site: Test Site`
			expect(result).toBe(expectedMinimalText)
		})

		it("should handle secrets with empty arrays gracefully", () => {
			const secretWithEmptyArrays: SiteSecretEmbeddingInput = {
				parentSiteName: "Test Site",
				discoveryMethod: [],
				consequences: [],
				description: [],
			}

			const result = embeddingTextForSiteSecret(secretWithEmptyArrays)
			const expectedEmptyText = `Site Secret: Test Site Secret
Basic Information:
Site: Test Site`
			expect(result).toBe(expectedEmptyText)
		})

		it("should handle secrets with null values by omitting those fields", () => {
			const secretWithNulls: SiteSecretEmbeddingInput = {
				secretType: null,
				difficultyToDiscover: null,
				parentSiteName: null,
				discoveryMethod: [],
				consequences: [],
				description: [],
			}

			const result = embeddingTextForSiteSecret(secretWithNulls)
			const expectedNullText = `Site Secret: Unknown Site Secret
Basic Information:`
			expect(result).toBe(expectedNullText)
		})
	})
})
