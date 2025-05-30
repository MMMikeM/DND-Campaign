import { describe, expect, it } from "vitest"
import type { AreaEmbeddingInput, RecursiveRequired, RegionEmbeddingInput } from "../embedding-input-types"
import { embeddingTextForArea, embeddingTextForRegion } from "../entities/regions.embedding"

describe("Regions Embedding Functions", () => {
	describe("embeddingTextForRegion", () => {
		const mockRegionInput: RecursiveRequired<RegionEmbeddingInput> = {
			name: "The Whispering Woods",
			type: "forest",
			dangerLevel: "moderate",
			atmosphereType: "mysterious_intriguing",
			economy: "Logging and herb gathering",
			population: "Scattered settlements of woodcutters and druids",
			history: "Ancient forest home to elven ruins and druidic circles",
			revelationLayersSummary: [
				"Surface: Peaceful logging community",
				"Hidden: Ancient elven magic still lingers",
				"Secret: Portal to the Feywild exists deep within",
			],
			culturalNotes: [
				"Respect for nature is paramount",
				"Old elven customs still observed",
				"Druids serve as spiritual guides",
			],
			hazards: [
				"Dire wolves roam the deeper woods",
				"Magical mists can cause disorientation",
				"Ancient traps protect elven ruins",
			],
			pointsOfInterest: [
				"The Great Oak - massive ancient tree",
				"Moonwell - sacred druidic site",
				"Ruined Elven Tower - mysterious structure",
			],
			rumors: [
				"Strange lights seen dancing between the trees",
				"A hermit wizard lives in the deepest part",
				"The trees whisper secrets to those who listen",
			],
			secrets: [
				"The Great Oak is actually a sleeping treant",
				"Elven portal network still partially functional",
				"Ancient curse affects those who harm the forest",
			],
			security: [
				"Ranger patrols monitor the main paths",
				"Druidic wards protect sacred sites",
				"Natural barriers limit access to deep woods",
			],
			description: [
				"A vast ancient forest filled with towering trees and mystical energy.",
				"Sunlight filters through the canopy creating an otherworldly atmosphere.",
			],

			connections: [
				{
					otherRegion: {
						name: "Millhaven",
						type: "grassland",
						description: ["A peaceful farming region"],
					},
					connectionType: "trade",
					routeType: "road",
					travelDifficulty: "easy",
					travelTime: "2 days by cart",
					travelHazards: ["Occasional bandits", "Seasonal flooding"],
					pointsOfInterest: ["Trading post at forest edge", "Old stone bridge"],
					controllingFaction: {
						name: "Merchant's Guild",
						type: ["trade"],
						description: ["Controls trade routes"],
					},
					description: ["Well-maintained trade route connects the regions"],
				},
			],

			areas: [
				{
					name: "Eldergrove",
					type: "village",
					dangerLevel: "low",
					atmosphereType: "safe_haven_rest",
					leadership: "Elder Thalion, respected druid",
					population: "200 humans and half-elves",
					primaryActivity: "Sustainable logging and herb cultivation",
					description: ["A peaceful village built around the Great Oak"],
				},
				{
					name: "The Deep Woods",
					type: "wilderness_stretch",
					dangerLevel: "high",
					atmosphereType: "wild_dangerous_challenging",
					leadership: "No formal leadership",
					population: "Unknown creatures and hermits",
					primaryActivity: "Untamed wilderness",
					description: ["The darkest, most dangerous part of the forest"],
				},
			],
		}

		it("should generate comprehensive text for a region with all fields", () => {
			const result = embeddingTextForRegion(mockRegionInput)

			expect(result).toContain("Region: The Whispering Woods")
			expect(result).toContain("A vast ancient forest filled with towering trees and mystical energy.")
			expect(result).toContain("Sunlight filters through the canopy creating an otherworldly atmosphere.")
			expect(result).toContain("type: forest")
			expect(result).toContain("dangerLevel: moderate")
			expect(result).toContain("atmosphereType: mysterious_intriguing")
			expect(result).toContain("economy: Logging and herb gathering")
			expect(result).toContain("population: Scattered settlements of woodcutters and druids")
			expect(result).toContain("history: Ancient forest home to elven ruins and druidic circles")
			expect(result).toContain("Revelation Layers:")
			expect(result).toContain("- Surface: Peaceful logging community")
			expect(result).toContain("- Hidden: Ancient elven magic still lingers")
			expect(result).toContain("- Secret: Portal to the Feywild exists deep within")
			expect(result).toContain("Cultural Notes:")
			expect(result).toContain("- Respect for nature is paramount")
			expect(result).toContain("- Old elven customs still observed")
			expect(result).toContain("- Druids serve as spiritual guides")
			expect(result).toContain("Hazards:")
			expect(result).toContain("- Dire wolves roam the deeper woods")
			expect(result).toContain("- Magical mists can cause disorientation")
			expect(result).toContain("Points of Interest:")
			expect(result).toContain("- The Great Oak - massive ancient tree")
			expect(result).toContain("- Moonwell - sacred druidic site")
			expect(result).toContain("Rumors:")
			expect(result).toContain("- Strange lights seen dancing between the trees")
			expect(result).toContain("- A hermit wizard lives in the deepest part")
			expect(result).toContain("Secrets:")
			expect(result).toContain("- The Great Oak is actually a sleeping treant")
			expect(result).toContain("- Elven portal network still partially functional")
			expect(result).toContain("Security:")
			expect(result).toContain("- Ranger patrols monitor the main paths")
			expect(result).toContain("- Druidic wards protect sacred sites")
			expect(result).toContain("Regional Connections:")
			expect(result).toContain("Connected Region: Millhaven")
			expect(result).toContain("Region Type: grassland")
			expect(result).toContain("Connection Type: trade")
			expect(result).toContain("Route Type: road")
			expect(result).toContain("Travel Difficulty: easy")
			expect(result).toContain("Travel Time: 2 days by cart")
			expect(result).toContain("Controlling Faction: Merchant's Guild")
			expect(result).toContain("Areas:")
			expect(result).toContain("Area: Eldergrove")
			expect(result).toContain("Type: village")
			expect(result).toContain("Danger Level: low")
			expect(result).toContain("Leadership: Elder Thalion, respected druid")
			expect(result).toContain("Area: The Deep Woods")
			expect(result).toContain("Type: wilderness_stretch")
			expect(result).toContain("Danger Level: high")
		})

		it("should handle regions with minimal data", () => {
			const minimalRegion: RegionEmbeddingInput = {
				name: "Simple Plains",
				type: "grassland",
				dangerLevel: "safe",
				atmosphereType: "mundane_stable",
				economy: "Farming",
				population: "Rural farmers",
				history: "Peaceful farming region",
				revelationLayersSummary: ["Simple farming community"],
				culturalNotes: ["Hard-working people"],
				hazards: ["Occasional storms"],
				pointsOfInterest: ["Market town"],
				rumors: ["Good harvests this year"],
				secrets: ["Hidden treasure"],
				security: ["Local militia"],
				description: ["Rolling grasslands perfect for farming"],
			}

			const result = embeddingTextForRegion(minimalRegion)

			expect(result).toContain("Region: Simple Plains")
			expect(result).toContain("Rolling grasslands perfect for farming")
			expect(result).toContain("type: grassland")
			expect(result).toContain("dangerLevel: safe")
			expect(result).toContain("atmosphereType: mundane_stable")
			expect(result).not.toContain("Regional Connections:")
			expect(result).not.toContain("Areas:")
		})

		it("should handle regions with empty arrays gracefully", () => {
			const regionWithEmptyArrays: RegionEmbeddingInput = {
				name: "Empty Region",
				type: "desert",
				dangerLevel: "high",
				atmosphereType: "oppressive_tense",
				economy: "None",
				population: "Uninhabited",
				history: "Barren wasteland",
				revelationLayersSummary: [],
				culturalNotes: [],
				hazards: [],
				pointsOfInterest: [],
				rumors: [],
				secrets: [],
				security: [],
				description: [],
				connections: [],
				areas: [],
			}

			const result = embeddingTextForRegion(regionWithEmptyArrays)

			expect(result).toContain("Region: Empty Region")
			expect(result).toContain("type: desert")
			expect(result).toContain("dangerLevel: high")
			expect(result).not.toContain("Revelation Layers:")
			expect(result).not.toContain("Cultural Notes:")
			expect(result).not.toContain("Hazards:")
			expect(result).not.toContain("Regional Connections:")
			expect(result).not.toContain("Areas:")
		})

		it("should handle regions with undefined values", () => {
			const regionWithUndefined: RegionEmbeddingInput = {
				name: "Undefined Region",
				type: "mountain",
				dangerLevel: "moderate",
				atmosphereType: "wonder_awe",
				economy: "Mining",
				population: "Mountain dwellers",
				history: "Ancient peaks",
				revelationLayersSummary: ["Mysterious mountains"],
				culturalNotes: ["Mountain traditions"],
				hazards: ["Avalanches"],
				pointsOfInterest: ["High peaks"],
				rumors: ["Dragons in the peaks"],
				secrets: ["Hidden caves"],
				security: ["Natural barriers"],
				description: ["Towering mountain range"],
				connections: undefined,
				areas: undefined,
			}

			const result = embeddingTextForRegion(regionWithUndefined)

			expect(result).toContain("Region: Undefined Region")
			expect(result).toContain("Towering mountain range")
			expect(result).toContain("type: mountain")
			expect(result).not.toContain("Regional Connections:")
			expect(result).not.toContain("Areas:")
		})
	})

	describe("embeddingTextForArea", () => {
		const mockAreaInput: RecursiveRequired<AreaEmbeddingInput> = {
			name: "Thornwick Village",
			type: "village",
			dangerLevel: "low",
			atmosphereType: "safe_haven_rest",
			leadership: "Mayor Aldric Thornwick",
			population: "150 humans and halflings",
			primaryActivity: "Farming and crafting",
			revelationLayersSummary: [
				"Surface: Peaceful farming village",
				"Hidden: Secret smuggling operation",
				"Deep: Ancient burial ground beneath",
			],
			culturalNotes: ["Strong community bonds", "Annual harvest festival", "Respect for elders"],
			hazards: ["Occasional wolf attacks", "Flooding during spring"],
			pointsOfInterest: ["The Old Mill", "Village Green", "Thornwick Manor"],
			rumors: [
				"Strange noises from the old mill at night",
				"The mayor has a secret treasure",
				"Ghosts walk the cemetery",
			],
			defenses: ["Wooden palisade", "Village watch", "Militia training"],
			description: [
				"A quaint village nestled in a valley surrounded by rolling hills.",
				"Smoke rises from chimneys and children play in the streets.",
			],

			parentRegion: {
				name: "The Greenlands",
				type: "grassland",
				description: ["Fertile farming region"],
			},

			sites: [
				{
					name: "The Old Mill",
					siteType: "building",
					intendedSiteFunction: "challenge_hub_obstacle",
					terrain: "riverside",
					climate: "temperate",
					mood: "mysterious",
					environment: "rural",
					description: ["An old watermill with creaking wheels and dark corners"],
				},
				{
					name: "Village Green",
					siteType: "town_square",
					intendedSiteFunction: "social_interaction_nexus",
					terrain: "grassy",
					climate: "temperate",
					mood: "peaceful",
					environment: "rural",
					description: ["The heart of village life where people gather"],
				},
			],
		}

		it("should generate comprehensive text for an area with all fields", () => {
			const result = embeddingTextForArea(mockAreaInput)

			expect(result).toContain("Area: Thornwick Village")
			expect(result).toContain("A quaint village nestled in a valley surrounded by rolling hills.")
			expect(result).toContain("Smoke rises from chimneys and children play in the streets.")
			expect(result).toContain("type: village")
			expect(result).toContain("dangerLevel: low")
			expect(result).toContain("atmosphereType: safe_haven_rest")
			expect(result).toContain("leadership: Mayor Aldric Thornwick")
			expect(result).toContain("population: 150 humans and halflings")
			expect(result).toContain("primaryActivity: Farming and crafting")
			expect(result).toContain("Parent Region:")
			expect(result).toContain("region: The Greenlands")
			expect(result).toContain("regionType: grassland")
			expect(result).toContain("Revelation Layers:")
			expect(result).toContain("- Surface: Peaceful farming village")
			expect(result).toContain("- Hidden: Secret smuggling operation")
			expect(result).toContain("- Deep: Ancient burial ground beneath")
			expect(result).toContain("Cultural Notes:")
			expect(result).toContain("- Strong community bonds")
			expect(result).toContain("- Annual harvest festival")
			expect(result).toContain("Hazards:")
			expect(result).toContain("- Occasional wolf attacks")
			expect(result).toContain("- Flooding during spring")
			expect(result).toContain("Points of Interest:")
			expect(result).toContain("- The Old Mill")
			expect(result).toContain("- Village Green")
			expect(result).toContain("- Thornwick Manor")
			expect(result).toContain("Rumors:")
			expect(result).toContain("- Strange noises from the old mill at night")
			expect(result).toContain("- The mayor has a secret treasure")
			expect(result).toContain("Defenses:")
			expect(result).toContain("- Wooden palisade")
			expect(result).toContain("- Village watch")
			expect(result).toContain("Sites:")
			expect(result).toContain("Site: The Old Mill")
			expect(result).toContain("Type: building")
			expect(result).toContain("Function: challenge_hub_obstacle")
			expect(result).toContain("Terrain: riverside")
			expect(result).toContain("Climate: temperate")
			expect(result).toContain("Mood: mysterious")
			expect(result).toContain("Environment: rural")
			expect(result).toContain("Site: Village Green")
			expect(result).toContain("Type: town_square")
			expect(result).toContain("Function: social_interaction_nexus")
		})

		it("should handle areas with minimal data", () => {
			const minimalArea: AreaEmbeddingInput = {
				name: "Simple Farm",
				type: "farmland_district",
				dangerLevel: "safe",
				atmosphereType: "mundane_stable",
				leadership: "Farmer Joe",
				population: "One family",
				primaryActivity: "Farming",
				revelationLayersSummary: ["Just a farm"],
				culturalNotes: ["Hard work"],
				hazards: ["Bad weather"],
				pointsOfInterest: ["Barn"],
				rumors: ["Good crops"],
				defenses: ["Scarecrow"],
				description: ["A simple farm"],
			}

			const result = embeddingTextForArea(minimalArea)

			expect(result).toContain("Area: Simple Farm")
			expect(result).toContain("A simple farm")
			expect(result).toContain("type: farmland_district")
			expect(result).toContain("dangerLevel: safe")
			expect(result).toContain("leadership: Farmer Joe")
			expect(result).not.toContain("Parent Region:")
			expect(result).not.toContain("Sites:")
		})

		it("should handle areas with empty arrays gracefully", () => {
			const areaWithEmptyArrays: AreaEmbeddingInput = {
				name: "Empty Area",
				type: "outpost",
				dangerLevel: "moderate",
				atmosphereType: "oppressive_tense",
				leadership: "None",
				population: "Abandoned",
				primaryActivity: "None",
				revelationLayersSummary: [],
				culturalNotes: [],
				hazards: [],
				pointsOfInterest: [],
				rumors: [],
				defenses: [],
				description: [],
				sites: [],
			}

			const result = embeddingTextForArea(areaWithEmptyArrays)

			expect(result).toContain("Area: Empty Area")
			expect(result).toContain("type: outpost")
			expect(result).toContain("dangerLevel: moderate")
			expect(result).not.toContain("Revelation Layers:")
			expect(result).not.toContain("Cultural Notes:")
			expect(result).not.toContain("Sites:")
		})

		it("should handle areas with undefined values", () => {
			const areaWithUndefined: AreaEmbeddingInput = {
				name: "Undefined Area",
				type: "hamlet",
				dangerLevel: "low",
				atmosphereType: "safe_haven_rest",
				leadership: "Village Elder",
				population: "Small community",
				primaryActivity: "Subsistence",
				revelationLayersSummary: ["Simple life"],
				culturalNotes: ["Traditional ways"],
				hazards: ["Natural dangers"],
				pointsOfInterest: ["Old well"],
				rumors: ["Local legends"],
				defenses: ["Community watch"],
				description: ["A small hamlet"],
				parentRegion: undefined,
				sites: undefined,
			}

			const result = embeddingTextForArea(areaWithUndefined)

			expect(result).toContain("Area: Undefined Area")
			expect(result).toContain("A small hamlet")
			expect(result).toContain("type: hamlet")
			expect(result).not.toContain("Parent Region:")
			expect(result).not.toContain("Sites:")
		})
	})
})
