import { describe, expect, it } from "vitest"
import type { AreaEmbeddingInput, RegionEmbeddingInput } from "../embedding-input-types"
import { embeddingTextForArea, embeddingTextForRegion } from "../regions.embedding"

describe("Regions Embedding Functions", () => {
	describe("embeddingTextForRegion", () => {
		const mockRegionInput: RegionEmbeddingInput = {
			name: "The Shadowlands",
			dangerLevel: "high",
			type: "wasteland",
			atmosphereType: "dark_foreboding",
			revelationLayersSummary: [
				"Surface: Barren wasteland with twisted trees.",
				"Hidden: Ancient battlefield with restless spirits.",
				"Deep: Portal to the shadow realm.",
			],
			economy: "Subsistence scavenging and dark magic trade.",
			history: "Once a prosperous kingdom, destroyed in the Great War.",
			population: "Sparse - mostly outcasts and dark cultists.",
			culturalNotes: ["Death is revered.", "Magic is feared and respected.", "Survival of the fittest."],
			hazards: ["Undead creatures.", "Toxic mists.", "Unstable magic."],
			pointsOfInterest: ["The Bone Cathedral.", "Whispering Gorge.", "The Shadow Gate."],
			rumors: ["The dead walk at night.", "Treasure lies in the ruins.", "A lich rules from the shadows."],
			secrets: ["The lich is actually trying to prevent a greater evil.", "The portal can be sealed."],
			security: "Minimal - ruled by fear and dark magic.",
			description: ["A cursed land where shadows have substance.", "Death and decay permeate everything."],
		}

		it("should generate comprehensive text for a region with all fields", () => {
			const result = embeddingTextForRegion(mockRegionInput)

			const expectedText = `Region: The Shadowlands
Overview:
A cursed land where shadows have substance.
Death and decay permeate everything.
Basic Information:
Type: wasteland
Danger Level: high
Atmosphere: dark foreboding
Economy: Subsistence scavenging and dark magic trade.
Population: Sparse - mostly outcasts and dark cultists.
Security: Minimal - ruled by fear and dark magic.
History: Once a prosperous kingdom, destroyed in the Great War.
Revelation Layers:
- Surface: Barren wasteland with twisted trees.
- Hidden: Ancient battlefield with restless spirits.
- Deep: Portal to the shadow realm.
Cultural Notes:
- Death is revered.
- Magic is feared and respected.
- Survival of the fittest.
Hazards:
- Undead creatures.
- Toxic mists.
- Unstable magic.
Points of Interest:
- The Bone Cathedral.
- Whispering Gorge.
- The Shadow Gate.
Rumors:
- The dead walk at night.
- Treasure lies in the ruins.
- A lich rules from the shadows.
Secrets:
- The lich is actually trying to prevent a greater evil.
- The portal can be sealed.`

			expect(result).toBe(expectedText)
		})

		it("should handle regions with minimal data", () => {
			const minimalRegion: RegionEmbeddingInput = {
				name: "Simple Plains",
				type: "grassland",
			}

			const result = embeddingTextForRegion(minimalRegion)
			const expectedMinimalText = `Region: Simple Plains
Basic Information:
Type: grassland`
			expect(result).toBe(expectedMinimalText)
		})

		it("should handle regions with empty arrays gracefully", () => {
			const regionWithEmptyArrays: RegionEmbeddingInput = {
				name: "Empty Region",
				culturalNotes: [],
				hazards: [],
				pointsOfInterest: [],
				rumors: [],
				secrets: [],
				revelationLayersSummary: [],
				description: [],
			}

			const result = embeddingTextForRegion(regionWithEmptyArrays)
			const expectedEmptyText = "Region: Empty Region"
			expect(result).toBe(expectedEmptyText)
		})

		it("should handle regions with null values by omitting those fields", () => {
			const regionWithNulls: RegionEmbeddingInput = {
				name: "Null Region",
				dangerLevel: null,
				type: null,
				atmosphereType: null,
				economy: null,
				history: null,
				population: null,
				security: null,
				culturalNotes: [],
				hazards: [],
				pointsOfInterest: [],
				rumors: [],
				secrets: [],
				revelationLayersSummary: [],
				description: [],
			}

			const result = embeddingTextForRegion(regionWithNulls)
			const expectedNullText = "Region: Null Region"
			expect(result).toBe(expectedNullText)
		})
	})

	describe("embeddingTextForArea", () => {
		const mockAreaInput: AreaEmbeddingInput = {
			name: "Port Blackwater",
			type: "port_city",
			dangerLevel: "moderate",
			atmosphereType: "gritty_urban",
			revelationLayersSummary: [
				"Surface: Bustling port with merchant ships.",
				"Hidden: Smuggling operations in the docks.",
				"Deep: Secret pirate council controls the city.",
			],
			leadership: "Corrupt harbor master in league with pirates.",
			population: "Mixed - merchants, sailors, smugglers, and pirates.",
			primaryActivity: "Maritime trade and smuggling.",
			culturalNotes: ["Money talks.", "Don't ask questions.", "Loyalty is bought."],
			hazards: ["Press gangs.", "Corrupt guards.", "Dangerous taverns."],
			pointsOfInterest: ["The Salty Anchor Tavern.", "Blackwater Docks.", "The Lighthouse."],
			rumors: ["Ships disappear in the fog.", "The lighthouse keeper is a ghost.", "Treasure maps for sale."],
			defenses: "City watch (corrupt), harbor patrol boats.",
			description: ["A rough port city where anything can be bought.", "Pirates and merchants mingle freely."],

			// Resolved fields
			parentRegionName: "The Coastal Reaches",
		}

		it("should generate comprehensive text for an area with all fields", () => {
			const result = embeddingTextForArea(mockAreaInput)

			const expectedText = `Area: Port Blackwater
Overview:
A rough port city where anything can be bought.
Pirates and merchants mingle freely.
Basic Information:
Type: port city
Danger Level: moderate
Atmosphere: gritty urban
Region: The Coastal Reaches
Leadership: Corrupt harbor master in league with pirates.
Population: Mixed - merchants, sailors, smugglers, and pirates.
Primary Activity: Maritime trade and smuggling.
Defenses: City watch (corrupt), harbor patrol boats.
Revelation Layers:
- Surface: Bustling port with merchant ships.
- Hidden: Smuggling operations in the docks.
- Deep: Secret pirate council controls the city.
Cultural Notes:
- Money talks.
- Don't ask questions.
- Loyalty is bought.
Hazards:
- Press gangs.
- Corrupt guards.
- Dangerous taverns.
Points of Interest:
- The Salty Anchor Tavern.
- Blackwater Docks.
- The Lighthouse.
Rumors:
- Ships disappear in the fog.
- The lighthouse keeper is a ghost.
- Treasure maps for sale.`

			expect(result).toBe(expectedText)
		})

		it("should handle areas with minimal data", () => {
			const minimalArea: AreaEmbeddingInput = {
				name: "Small Village",
				type: "village",
				parentRegionName: "Test Region",
			}

			const result = embeddingTextForArea(minimalArea)
			const expectedMinimalText = `Area: Small Village
Basic Information:
Type: village
Region: Test Region`
			expect(result).toBe(expectedMinimalText)
		})

		it("should handle areas with empty arrays gracefully", () => {
			const areaWithEmptyArrays: AreaEmbeddingInput = {
				name: "Empty Area",
				parentRegionName: "Test Region",
				culturalNotes: [],
				hazards: [],
				pointsOfInterest: [],
				rumors: [],
				revelationLayersSummary: [],
				description: [],
			}

			const result = embeddingTextForArea(areaWithEmptyArrays)
			const expectedEmptyText = `Area: Empty Area
Basic Information:
Region: Test Region`
			expect(result).toBe(expectedEmptyText)
		})

		it("should handle areas without parent region", () => {
			const areaWithoutRegion: AreaEmbeddingInput = {
				name: "Standalone Area",
				type: "settlement",
				parentRegionName: "",
				description: [],
			}

			const result = embeddingTextForArea(areaWithoutRegion)
			const expectedStandaloneText = `Area: Standalone Area
Basic Information:
Type: settlement`
			expect(result).toBe(expectedStandaloneText)
		})

		it("should handle areas with null values by omitting those fields", () => {
			const areaWithNulls: AreaEmbeddingInput = {
				name: "Null Area",
				type: null,
				dangerLevel: null,
				atmosphereType: null,
				leadership: null,
				population: null,
				primaryActivity: null,
				defenses: null,
				parentRegionName: null,
				culturalNotes: [],
				hazards: [],
				pointsOfInterest: [],
				rumors: [],
				revelationLayersSummary: [],
				description: [],
			}

			const result = embeddingTextForArea(areaWithNulls)
			const expectedNullText = "Area: Null Area"
			expect(result).toBe(expectedNullText)
		})
	})
})
