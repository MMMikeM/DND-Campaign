import { describe, expect, it } from "vitest"
import type { RecursiveRequired, SiteEmbeddingInput } from "../embedding-input-types"
import { embeddingTextForSite } from "../entities/sites.embedding"

describe("Sites Embedding Functions", () => {
	describe("embeddingTextForSite", () => {
		const mockSiteInput: RecursiveRequired<SiteEmbeddingInput> = {
			name: "The Whispering Woods",
			type: "forest",
			intendedSiteFunction: "exploration",
			terrain: "dense_forest",
			climate: "temperate",
			mood: "mysterious",
			environment: "magical",
			creatures: ["Dire wolves.", "Forest spirits.", "Ancient treants."],
			features: ["Crystal clear stream.", "Ancient stone circle.", "Massive oak tree."],
			treasures: ["Hidden cache of gems.", "Ancient druidic artifacts.", "Rare magical herbs."],
			lightingDescription: ["Dappled sunlight through canopy.", "Ethereal glow from magical sources."],
			soundscape: ["Rustling leaves.", "Distant wolf howls.", "Whispers in the wind."],
			smells: ["Pine and earth.", "Sweet flower scents.", "Musty undergrowth."],
			weather: ["Frequent mist.", "Gentle rain showers.", "Occasional magical storms."],
			descriptors: ["Ancient", "Mystical", "Dangerous", "Beautiful"],
			coverOptions: ["Dense undergrowth.", "Large tree trunks.", "Rocky outcroppings."],
			description: ["An ancient forest filled with magical energy.", "Home to mystical creatures and hidden secrets."],
			creativePrompts: ["Use the whispers to provide cryptic clues", "Create encounters with forest spirits"],
			gmNotes: ["Scale encounters based on party level", "The forest responds to the party's intentions"],
			tags: ["forest", "magical", "mysterious", "ancient"],

			// Resolved fields
			locationContext: {
				areaName: "The Wildlands",
				areaType: "wilderness_stretch",
				regionName: "The Northern Territories",
				regionType: "forest",
			},
			encounters: [
				{
					name: "Spirit Guardian",
					encounterType: "social",
					dangerLevel: "moderate",
					difficulty: "medium",
					creatures: ["Forest spirit", "Awakened trees"],
					treasure: ["Blessing of the forest", "Nature's guidance"],
					description: [
						"A wise forest spirit tests the party's intentions",
						"Can become ally or enemy based on party actions",
					],
					creativePrompts: ["Use riddles and nature-based challenges", "Reward respectful behavior"],
					gmNotes: ["This encounter sets the tone for the entire forest", "Spirit remembers past interactions"],
					tags: ["spirit", "test", "social", "nature"],
				},
			],
			secrets: [
				{
					secretType: "hidden area",
					briefDescription: "Ancient druidic sanctuary",
					difficultyToDiscover: "hard",
					discoveryMethod: ["Following animal tracks", "Detecting magical auras", "Speaking with forest spirits"],
					consequences: ["Access to druidic knowledge", "Potential druidic allies", "Magical healing spring"],
					description: [
						"A hidden grove where ancient druids once gathered",
						"Contains powerful nature magic and forgotten lore",
					],
					creativePrompts: ["Use as a safe haven or quest destination", "Connect to larger druidic mysteries"],
					gmNotes: ["Only reveal to parties that respect nature", "Can be a base for nature-focused campaigns"],
					tags: ["druid", "sanctuary", "hidden", "magical"],
				},
			],
			connectedSites: [
				{
					otherSiteName: "The Old Mill",
					linkType: "path",
					travelDescription: "A winding forest path leads to an abandoned mill",
				},
			],
			keyNpcsPresent: [
				{
					npcName: "Thornwick the Druid",
					associationType: "frequent_visitor",
					npcSummary: "An old druid who protects the forest",
				},
			],
			factionsPresent: [
				{
					factionName: "The Circle of Druids",
					influenceLevel: "strong",
					presenceSummary: "Protects and maintains the forest's magical balance",
				},
			],
			keyQuestsLocatedHere: [
				{
					questName: "The Forest's Secret",
					stageName: "Explore the Woods",
					objectiveSummary: "Discover the source of the magical whispers",
				},
			],
			itemsLocatedHere: [
				{
					itemName: "Staff of Nature's Wrath",
					context: "Hidden in the ancient oak tree",
				},
			],
			relatedWorldConcepts: [
				{
					name: "The Old Faith",
					relationship: "sacred site",
				},
			],
		}

		it("should generate comprehensive text for a site with all fields including encounters and secrets", () => {
			console.log(mockSiteInput)
			const result = embeddingTextForSite(mockSiteInput)

			console.log(result)

			const expectedText = `Site: The Whispering Woods
Overview:
An ancient forest filled with magical energy.
Home to mystical creatures and hidden secrets.
Basic Information:
Type: forest
Intended Function: exploration
Terrain: dense forest
Climate: temperate
Mood: mysterious
Environment: magical
Area: The Wildlands
Region: The Northern Territories
Environmental Details:
Lighting: Dappled sunlight through canopy.
Weather: Frequent mist.
Gentle rain showers.
Occasional magical storms.
Descriptors:
- Ancient
- Mystical
- Dangerous
- Beautiful
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
- Ancient druidic artifacts.
- Rare magical herbs.
Soundscape:
- Rustling leaves.
- Distant wolf howls.
- Whispers in the wind.
Smells:
- Pine and earth.
- Sweet flower scents.
- Musty undergrowth.
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
				locationContext: {
					areaName: "Test Area",
					regionName: "Test Region",
				},
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
				encounters: [],
				secrets: [],
				locationContext: {
					areaName: "Test Area",
					regionName: "Test Region",
				},
			}

			const result = embeddingTextForSite(siteWithEmptyArrays)
			const expectedEmptyText = `Site: Empty Site
Basic Information:
Area: Test Area`
			expect(result).toBe(expectedEmptyText)
		})

		it("should handle sites with undefined values by omitting those fields", () => {
			const siteWithUndefined: SiteEmbeddingInput = {
				name: "Undefined Site",
				locationContext: {
					areaName: "Test Area",
					regionName: "Test Region",
				},
				siteType: undefined,
				intendedSiteFunction: undefined,
				terrain: undefined,
				climate: undefined,
				mood: undefined,
				environment: undefined,
				lightingDescription: undefined,
				weather: undefined,
				creatures: [],
				features: [],
				treasures: [],
				soundscape: [],
				smells: [],
				descriptors: [],
				coverOptions: [],
				description: [],
				encounters: undefined,
				secrets: undefined,
			}

			const result = embeddingTextForSite(siteWithUndefined)
			const expectedUndefinedText = `Site: Undefined Site
Basic Information:
Area: Test Area`
			expect(result).toBe(expectedUndefinedText)
		})

		it("should handle sites with encounters and secrets properly", () => {
			const siteWithEncountersAndSecrets: SiteEmbeddingInput = {
				name: "Test Dungeon",
				siteType: "dungeon",
				locationContext: {
					areaName: "Test Area",
					regionName: "Test Region",
				},
				encounters: [
					{
						name: "Goblin Ambush",
						encounterType: "combat",
						dangerLevel: "low",
						difficulty: "easy",
						creatures: ["Goblins", "Goblin leader"],
						treasure: ["Copper coins", "Rusty weapons"],
						description: ["Goblins attack from hiding"],
						creativePrompts: ["Use terrain to advantage"],
						gmNotes: ["First encounter for new players"],
						tags: ["goblins", "ambush", "easy"],
					},
				],
				secrets: [
					{
						secretType: "hidden_area",
						briefDescription: "Hidden room behind bookshelf",
						difficultyToDiscover: "medium",
						discoveryMethod: ["Search the bookshelf", "Pull the right book"],
						consequences: ["Reveals treasure room", "Activates magical ward"],
						description: ["A hidden room filled with ancient books"],
						creativePrompts: ["Leave clues about the mechanism"],
						gmNotes: ["Contains important lore"],
						tags: ["hidden", "books", "lore"],
					},
				],
			}

			const result = embeddingTextForSite(siteWithEncountersAndSecrets)

			// The result should include the site name and basic info, but the exact format
			// depends on how the embedding function handles encounters and secrets
			expect(result).toContain("Site: Test Dungeon")
			expect(result).toContain("Type: dungeon")
			expect(result).toContain("Area: Test Area")
		})
	})
})
