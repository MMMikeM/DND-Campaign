import { describe, expect, it } from "vitest"
import type {
	NarrativeDestinationEmbeddingInput,
	RecursiveRequired,
	WorldConceptEmbeddingInput,
} from "../embedding-input-types"
import { embeddingTextForNarrativeDestination, embeddingTextForWorldConcept } from "../entities/narrative.embedding"

describe("Narrative Embedding Functions", () => {
	describe("embeddingTextForNarrativeDestination", () => {
		const mockDestinationInput: RecursiveRequired<NarrativeDestinationEmbeddingInput> = {
			name: "The Shadow War",
			type: "main",
			status: "in_progress",
			promise: "Uncover the truth behind the mysterious attacks",
			payoff: "Reveal and defeat the Shadow Lord's conspiracy",
			themes: ["betrayal", "redemption", "sacrifice"],
			foreshadowingElements: [
				"Strange shadows moving independently",
				"Reports of missing persons in remote villages",
				"Ancient prophecies speaking of a return",
			],
			intendedEmotionalArc: "triumph_over_adversity",
			description: [
				"A multi-session arc about uncovering a conspiracy.",
				"Players must navigate political intrigue and ancient mysteries.",
				"The truth will challenge their assumptions about allies and enemies.",
			],

			region: {
				name: "The Northern Reaches",
				type: "wilderness",
				dangerLevel: "high",
			},

			conflict: {
				name: "The War of Shadows",
				scope: "regional",
				status: "escalating",
				moralDilemma: "Can darkness be fought with darkness?",
			},

			questRoles: [
				{
					quest: {
						name: "Investigate the Attacks",
						type: "main",
					},
					role: "introduction",
					sequenceInArc: 1,
					contributionDetails: ["Sets up the mystery and introduces key NPCs"],
					description: ["Opening quest that establishes the threat"],
				},
				{
					quest: {
						name: "Infiltrate the Shadow Cult",
						type: "main",
					},
					role: "rising_action",
					sequenceInArc: 2,
					contributionDetails: ["Reveals the true scope of the conspiracy"],
					description: ["Stealth and investigation focused quest"],
				},
				{
					quest: {
						name: "Confront the Shadow Lord",
						type: "main",
					},
					role: "climax",
					sequenceInArc: 3,
					contributionDetails: ["Final confrontation and resolution"],
					description: ["Epic boss battle and story conclusion"],
				},
			],

			participantInvolvement: [
				{
					npc: {
						name: "Lord Blackthorne",
						occupation: "Noble",
					},
					roleInArc: "Primary antagonist",
					arcImportance: "central",
					involvementDetails: ["Mastermind behind the shadow conspiracy"],
					description: ["The main villain of the arc"],
				},
				{
					faction: {
						name: "The Shadow Cult",
						type: ["cult", "criminal"],
					},
					roleInArc: "Enemy organization",
					arcImportance: "major",
					involvementDetails: ["Serves as the primary opposition force"],
					description: ["Secret organization working for the Shadow Lord"],
				},
				{
					npc: {
						name: "Captain Sarah",
						occupation: "Guard Captain",
					},
					roleInArc: "Ally and information source",
					arcImportance: "supporting",
					involvementDetails: ["Provides crucial intelligence and support"],
					description: ["Trusted ally who helps the party"],
				},
			],

			destinationRelationships: [
				{
					relatedDestination: {
						name: "The Ancient Prophecy",
					},
					relationshipType: "prerequisite",
					relationshipDetails: ["Must understand the prophecy to defeat the Shadow Lord"],
					description: ["Previous arc that sets up this storyline"],
				},
			],
		}

		it("should generate comprehensive text for a narrative destination with all fields", () => {
			const result = embeddingTextForNarrativeDestination(mockDestinationInput)

			expect(result).toContain("Narrative Destination: The Shadow War")
			expect(result).toContain("A multi-session arc about uncovering a conspiracy.")
			expect(result).toContain("Players must navigate political intrigue and ancient mysteries.")
			expect(result).toContain("The truth will challenge their assumptions about allies and enemies.")
			expect(result).toContain("type: main")
			expect(result).toContain("status: in_progress")
			expect(result).toContain("promise: Uncover the truth behind the mysterious attacks")
			expect(result).toContain("payoff: Reveal and defeat the Shadow Lord's conspiracy")
			expect(result).toContain("intendedEmotionalArc: triumph_over_adversity")
			expect(result).toContain("Primary Region:")
			expect(result).toContain("region: The Northern Reaches")
			expect(result).toContain("regionType: wilderness")
			expect(result).toContain("dangerLevel: high")
			expect(result).toContain("Related Conflict:")
			expect(result).toContain("conflict: The War of Shadows")
			expect(result).toContain("scope: regional")
			expect(result).toContain("status: escalating")
			expect(result).toContain("moralDilemma: Can darkness be fought with darkness?")
			expect(result).toContain("Core Themes:")
			expect(result).toContain("- betrayal")
			expect(result).toContain("- redemption")
			expect(result).toContain("- sacrifice")
			expect(result).toContain("Foreshadowing Elements:")
			expect(result).toContain("- Strange shadows moving independently")
			expect(result).toContain("- Reports of missing persons in remote villages")
			expect(result).toContain("- Ancient prophecies speaking of a return")
			expect(result).toContain("Quest Roles:")
			expect(result).toContain("Quest: Investigate the Attacks")
			expect(result).toContain("Quest Type: main")
			expect(result).toContain("Role: introduction")
			expect(result).toContain("Sequence in Arc: 1")
			expect(result).toContain("Quest: Infiltrate the Shadow Cult")
			expect(result).toContain("Role: rising_action")
			expect(result).toContain("Sequence in Arc: 2")
			expect(result).toContain("Quest: Confront the Shadow Lord")
			expect(result).toContain("Role: climax")
			expect(result).toContain("Sequence in Arc: 3")
			expect(result).toContain("Participant Involvement:")
			expect(result).toContain("Participant: Lord Blackthorne")
			expect(result).toContain("Participant Type: NPC")
			expect(result).toContain("Occupation: Noble")
			expect(result).toContain("Arc Importance: central")
			expect(result).toContain("Role in Arc: Primary antagonist")
			expect(result).toContain("Participant: The Shadow Cult")
			expect(result).toContain("Participant Type: Faction")
			expect(result).toContain("Faction Type: cult, criminal")
			expect(result).toContain("Arc Importance: major")
			expect(result).toContain("Role in Arc: Enemy organization")
			expect(result).toContain("Participant: Captain Sarah")
			expect(result).toContain("Occupation: Guard Captain")
			expect(result).toContain("Arc Importance: supporting")
			expect(result).toContain("Role in Arc: Ally and information source")
			expect(result).toContain("Destination Relationships:")
			expect(result).toContain("Related Destination: The Ancient Prophecy")
			expect(result).toContain("Relationship Type: prerequisite")
		})

		it("should handle destinations with minimal data", () => {
			const minimalDestination: NarrativeDestinationEmbeddingInput = {
				name: "Simple Arc",
				type: "side",
				status: "planned",
				promise: "A simple side quest",
				payoff: "Small reward",
				themes: [],
				foreshadowingElements: [],
				intendedEmotionalArc: "hopeful_new_beginning",
				description: [],
			}

			const result = embeddingTextForNarrativeDestination(minimalDestination)

			expect(result).toContain("Narrative Destination: Simple Arc")
			expect(result).toContain("type: side")
			expect(result).toContain("status: planned")
			expect(result).toContain("promise: A simple side quest")
			expect(result).toContain("payoff: Small reward")
			expect(result).toContain("intendedEmotionalArc: hopeful_new_beginning")
			expect(result).not.toContain("Primary Region:")
			expect(result).not.toContain("Related Conflict:")
			expect(result).not.toContain("Quest Roles:")
			expect(result).not.toContain("Participant Involvement:")
			expect(result).not.toContain("Destination Relationships:")
		})

		it("should handle destinations with empty arrays gracefully", () => {
			const destinationWithEmptyArrays: NarrativeDestinationEmbeddingInput = {
				name: "Empty Arc",
				type: "character",
				status: "completed",
				promise: "Character development",
				payoff: "Personal growth",
				themes: [],
				foreshadowingElements: [],
				intendedEmotionalArc: "redemption_journey",
				description: [],
				questRoles: [],
				participantInvolvement: [],
				destinationRelationships: [],
			}

			const result = embeddingTextForNarrativeDestination(destinationWithEmptyArrays)

			expect(result).toContain("Narrative Destination: Empty Arc")
			expect(result).toContain("type: character")
			expect(result).toContain("status: completed")
			expect(result).toContain("promise: Character development")
			expect(result).toContain("payoff: Personal growth")
			expect(result).toContain("intendedEmotionalArc: redemption_journey")
			expect(result).not.toContain("Core Themes:")
			expect(result).not.toContain("Foreshadowing Elements:")
			expect(result).not.toContain("Quest Roles:")
			expect(result).not.toContain("Participant Involvement:")
			expect(result).not.toContain("Destination Relationships:")
		})

		it("should handle destinations with undefined values by omitting those fields", () => {
			const destinationWithUndefined: NarrativeDestinationEmbeddingInput = {
				name: "Mysterious Arc",
				type: "faction",
				status: "abandoned",
				promise: "Unknown promise",
				payoff: "Unknown payoff",
				themes: ["mystery"],
				foreshadowingElements: ["Unknown signs"],
				intendedEmotionalArc: "bittersweet_resolution",
				description: ["A mysterious abandoned storyline"],
				region: undefined,
				conflict: undefined,
				questRoles: undefined,
				participantInvolvement: undefined,
				destinationRelationships: undefined,
			}

			const result = embeddingTextForNarrativeDestination(destinationWithUndefined)

			expect(result).toContain("Narrative Destination: Mysterious Arc")
			expect(result).toContain("A mysterious abandoned storyline")
			expect(result).toContain("type: faction")
			expect(result).toContain("status: abandoned")
			expect(result).toContain("promise: Unknown promise")
			expect(result).toContain("payoff: Unknown payoff")
			expect(result).toContain("intendedEmotionalArc: bittersweet_resolution")
			expect(result).toContain("Core Themes:")
			expect(result).toContain("- mystery")
			expect(result).toContain("Foreshadowing Elements:")
			expect(result).toContain("- Unknown signs")
			expect(result).not.toContain("Primary Region:")
			expect(result).not.toContain("Related Conflict:")
			expect(result).not.toContain("Quest Roles:")
			expect(result).not.toContain("Participant Involvement:")
			expect(result).not.toContain("Destination Relationships:")
		})
	})

	describe("embeddingTextForWorldConcept", () => {
		const mockConceptInput: RecursiveRequired<WorldConceptEmbeddingInput> = {
			name: "The Guild System",
			conceptType: "social_institution",
			complexityProfile: "layered_nuance",
			moralClarity: "contextual_grey",
			scope: "continental",
			status: "active",
			timeframe: "Current Era",
			startYear: 1200,
			endYear: null,
			modernRelevance: "Highly relevant to current politics and economics",
			currentEffectiveness: "thriving",
			summary: "A complex network of professional organizations that govern trade and crafts",
			surfaceImpression: "Organized and beneficial trade associations",
			livedRealityDetails: "Often corrupt and exclusionary in practice",
			hiddenTruthsOrDepths: "Some guilds are fronts for criminal organizations",
			socialStructure: "Hierarchical with masters, journeymen, and apprentices",
			structure: "Decentralized federation of autonomous guilds",
			purpose: "Regulate trade, maintain quality standards, and protect member interests",
			coreValues: ["craftsmanship", "tradition", "mutual aid", "exclusivity"],
			additionalDetails: [
				"Each guild has its own customs and traditions",
				"Guild membership is often hereditary",
				"Inter-guild politics can be complex and contentious",
			],
			definingCharacteristics: [
				"Strict hierarchy and apprenticeship systems",
				"Monopolistic control over specific trades",
				"Strong political influence in urban areas",
			],
			traditions: [
				"Annual guild festivals and competitions",
				"Elaborate initiation ceremonies",
				"Secret knowledge passed down through generations",
			],
			languages: ["Common", "Guild Cant", "Trade Tongue"],
			adaptationStrategies: [
				"Embracing new technologies while maintaining traditions",
				"Forming alliances with other guilds for mutual benefit",
				"Adapting to changing economic conditions",
			],
			majorEvents: [
				"The Great Guild War of 1456",
				"Formation of the Continental Guild Alliance",
				"The Merchant's Rebellion of 1523",
			],
			lastingInstitutions: ["The Guild Council", "The Apprenticeship System", "Guild Courts for trade disputes"],
			conflictingNarratives: [
				"Guilds as protectors vs. guilds as oppressors",
				"Tradition vs. innovation debates",
				"Local autonomy vs. centralized control",
			],
			historicalGrievances: [
				"Exclusion of certain groups from membership",
				"Price fixing and market manipulation",
				"Suppression of independent craftsmen",
			],
			endingCauses: [],
			historicalLessons: [
				"The importance of adapting to change",
				"The dangers of unchecked monopolistic power",
				"The value of collective organization",
			],
			membership: ["Craftsmen and artisans", "Merchants and traders", "Some nobles and wealthy patrons"],
			rules: [
				"Strict quality standards for all products",
				"Prohibition on undercutting guild prices",
				"Mandatory participation in guild activities",
			],
			modernAdaptations: [
				"Incorporation of magical techniques",
				"Expansion into new markets and territories",
				"Development of guild banks and insurance",
			],
			institutionalChallenges: [
				"Competition from independent craftsmen",
				"Pressure from government regulation",
				"Internal corruption and power struggles",
			],
			culturalEvolution: [
				"Gradual inclusion of previously excluded groups",
				"Evolution from purely economic to political entities",
				"Development of guild-specific cultural identities",
			],
			currentChallenges: [
				"Adapting to magical automation",
				"Dealing with international competition",
				"Maintaining relevance in changing economy",
			],
			modernConsequences: [
				"Significant influence on urban politics",
				"Creation of distinct social classes",
				"Impact on innovation and technological progress",
			],
			questHooks: [
				"Investigate corruption within a powerful guild",
				"Mediate a dispute between rival guilds",
				"Help an outsider gain guild membership",
			],
			description: [
				"A comprehensive system of trade organizations",
				"Shapes economic and social life across the continent",
				"Both beneficial and problematic in different contexts",
			],

			conceptRelationships: [
				{
					targetConcept: {
						name: "The Merchant Class",
					},
					relationshipType: "supports",
					strength: "strong",
					isBidirectional: true,
					relationshipDetails: "Guilds provide structure and protection for merchants",
					description: ["Symbiotic relationship between guilds and merchants"],
				},
				{
					targetConcept: {
						name: "Noble Houses",
					},
					relationshipType: "rivals",
					strength: "moderate",
					isBidirectional: true,
					relationshipDetails: "Competition for political and economic influence",
					description: ["Ongoing tension between guild and noble power"],
				},
			],

			worldConceptLinks: [
				{
					linkedNpc: {
						name: "Guildmaster Aldric",
						occupation: "Guildmaster",
					},
					linkRoleOrTypeText: "Leader and representative",
					linkStrength: "defining",
					linkDetailsText: "Embodies the guild system's values and challenges",
					description: ["Key figure in guild politics"],
				},
				{
					linkedFaction: {
						name: "The Artisan's Guild",
						type: ["guild", "economic"],
					},
					linkRoleOrTypeText: "Primary example",
					linkStrength: "strong",
					linkDetailsText: "Largest and most influential guild in the system",
					description: ["Represents the guild system at its most powerful"],
				},
				{
					linkedQuest: {
						name: "The Guild War",
						type: "faction",
					},
					linkRoleOrTypeText: "Central conflict",
					linkStrength: "defining",
					linkDetailsText: "Quest explores the dark side of guild politics",
					description: ["Major storyline involving guild corruption"],
				},
				{
					linkedRegion: {
						name: "The Trade Cities",
						type: "urban",
					},
					linkRoleOrTypeText: "Primary location",
					linkStrength: "strong",
					linkDetailsText: "Where guild influence is strongest",
					description: ["Urban centers dominated by guild politics"],
				},
				{
					linkedConflict: {
						name: "The Economic War",
						scope: "regional",
					},
					linkRoleOrTypeText: "Contributing factor",
					linkStrength: "moderate",
					linkDetailsText: "Guild policies influence the broader economic conflict",
					description: ["Guild actions affect regional stability"],
				},
			],
		}

		it("should generate comprehensive text for a world concept with all fields", () => {
			const result = embeddingTextForWorldConcept(mockConceptInput)

			expect(result).toContain("World Concept: The Guild System")
			expect(result).toContain("A comprehensive system of trade organizations")
			expect(result).toContain("Shapes economic and social life across the continent")
			expect(result).toContain("Both beneficial and problematic in different contexts")
			expect(result).toContain("type: social_institution")
			expect(result).toContain("complexity: layered_nuance")
			expect(result).toContain("moralClarity: contextual_grey")
			expect(result).toContain("scope: continental")
			expect(result).toContain("status: active")
			expect(result).toContain("timeframe: Current Era")
			expect(result).toContain("modernRelevance: Highly relevant to current politics and economics")
			expect(result).toContain("currentEffectiveness: thriving")
			expect(result).toContain("Start Year: 1200")
			expect(result).not.toContain("End Year:")
			expect(result).toContain("summary: A complex network of professional organizations that govern trade and crafts")
			expect(result).toContain("surfaceImpression: Organized and beneficial trade associations")
			expect(result).toContain("livedReality: Often corrupt and exclusionary in practice")
			expect(result).toContain("hiddenDepths: Some guilds are fronts for criminal organizations")
			expect(result).toContain("socialStructure: Hierarchical with masters, journeymen, and apprentices")
			expect(result).toContain("structure: Decentralized federation of autonomous guilds")
			expect(result).toContain("purpose: Regulate trade, maintain quality standards, and protect member interests")
			expect(result).toContain("Core Values:")
			expect(result).toContain("- craftsmanship")
			expect(result).toContain("- tradition")
			expect(result).toContain("- mutual aid")
			expect(result).toContain("- exclusivity")
			expect(result).toContain("Additional Details:")
			expect(result).toContain("- Each guild has its own customs and traditions")
			expect(result).toContain("- Guild membership is often hereditary")
			expect(result).toContain("- Inter-guild politics can be complex and contentious")
			expect(result).toContain("Defining Characteristics:")
			expect(result).toContain("- Strict hierarchy and apprenticeship systems")
			expect(result).toContain("- Monopolistic control over specific trades")
			expect(result).toContain("- Strong political influence in urban areas")
			expect(result).toContain("Traditions:")
			expect(result).toContain("- Annual guild festivals and competitions")
			expect(result).toContain("- Elaborate initiation ceremonies")
			expect(result).toContain("- Secret knowledge passed down through generations")
			expect(result).toContain("Languages:")
			expect(result).toContain("- Common")
			expect(result).toContain("- Guild Cant")
			expect(result).toContain("- Trade Tongue")
			expect(result).toContain("Adaptation Strategies:")
			expect(result).toContain("- Embracing new technologies while maintaining traditions")
			expect(result).toContain("- Forming alliances with other guilds for mutual benefit")
			expect(result).toContain("- Adapting to changing economic conditions")
			expect(result).toContain("Major Events:")
			expect(result).toContain("- The Great Guild War of 1456")
			expect(result).toContain("- Formation of the Continental Guild Alliance")
			expect(result).toContain("- The Merchant's Rebellion of 1523")
			expect(result).toContain("Lasting Institutions:")
			expect(result).toContain("- The Guild Council")
			expect(result).toContain("- The Apprenticeship System")
			expect(result).toContain("- Guild Courts for trade disputes")
			expect(result).toContain("Conflicting Narratives:")
			expect(result).toContain("- Guilds as protectors vs. guilds as oppressors")
			expect(result).toContain("- Tradition vs. innovation debates")
			expect(result).toContain("- Local autonomy vs. centralized control")
			expect(result).toContain("Historical Grievances:")
			expect(result).toContain("- Exclusion of certain groups from membership")
			expect(result).toContain("- Price fixing and market manipulation")
			expect(result).toContain("- Suppression of independent craftsmen")
			expect(result).toContain("Historical Lessons:")
			expect(result).toContain("- The importance of adapting to change")
			expect(result).toContain("- The dangers of unchecked monopolistic power")
			expect(result).toContain("- The value of collective organization")
			expect(result).toContain("Membership:")
			expect(result).toContain("- Craftsmen and artisans")
			expect(result).toContain("- Merchants and traders")
			expect(result).toContain("- Some nobles and wealthy patrons")
			expect(result).toContain("Rules:")
			expect(result).toContain("- Strict quality standards for all products")
			expect(result).toContain("- Prohibition on undercutting guild prices")
			expect(result).toContain("- Mandatory participation in guild activities")
			expect(result).toContain("Modern Adaptations:")
			expect(result).toContain("- Incorporation of magical techniques")
			expect(result).toContain("- Expansion into new markets and territories")
			expect(result).toContain("- Development of guild banks and insurance")
			expect(result).toContain("Institutional Challenges:")
			expect(result).toContain("- Competition from independent craftsmen")
			expect(result).toContain("- Pressure from government regulation")
			expect(result).toContain("- Internal corruption and power struggles")
			expect(result).toContain("Cultural Evolution:")
			expect(result).toContain("- Gradual inclusion of previously excluded groups")
			expect(result).toContain("- Evolution from purely economic to political entities")
			expect(result).toContain("- Development of guild-specific cultural identities")
			expect(result).toContain("Current Challenges:")
			expect(result).toContain("- Adapting to magical automation")
			expect(result).toContain("- Dealing with international competition")
			expect(result).toContain("- Maintaining relevance in changing economy")
			expect(result).toContain("Modern Consequences:")
			expect(result).toContain("- Significant influence on urban politics")
			expect(result).toContain("- Creation of distinct social classes")
			expect(result).toContain("- Impact on innovation and technological progress")
			expect(result).toContain("Quest Hooks:")
			expect(result).toContain("- Investigate corruption within a powerful guild")
			expect(result).toContain("- Mediate a dispute between rival guilds")
			expect(result).toContain("- Help an outsider gain guild membership")
			expect(result).toContain("Concept Relationships:")
			expect(result).toContain("Related Concept: The Merchant Class")
			expect(result).toContain("Relationship Type: supports")
			expect(result).toContain("Strength: strong")
			expect(result).toContain("Direction: bidirectional")
			expect(result).toContain("Related Concept: Noble Houses")
			expect(result).toContain("Relationship Type: rivals")
			expect(result).toContain("Strength: moderate")
			expect(result).toContain("Entity Links:")
			expect(result).toContain("Linked Entity: Guildmaster Aldric")
			expect(result).toContain("Entity Type: NPC")
			expect(result).toContain("Occupation: Guildmaster")
			expect(result).toContain("Link Role: Leader and representative")
			expect(result).toContain("Link Strength: defining")
			expect(result).toContain("Linked Entity: The Artisan's Guild")
			expect(result).toContain("Entity Type: Faction")
			expect(result).toContain("Faction Type: guild, economic")
			expect(result).toContain("Link Role: Primary example")
			expect(result).toContain("Link Strength: strong")
			expect(result).toContain("Linked Entity: The Guild War")
			expect(result).toContain("Entity Type: Quest")
			expect(result).toContain("Quest Type: faction")
			expect(result).toContain("Link Role: Central conflict")
			expect(result).toContain("Linked Entity: The Trade Cities")
			expect(result).toContain("Entity Type: Region")
			expect(result).toContain("Region Type: urban")
			expect(result).toContain("Link Role: Primary location")
			expect(result).toContain("Linked Entity: The Economic War")
			expect(result).toContain("Entity Type: Conflict")
			expect(result).toContain("Scope: regional")
			expect(result).toContain("Link Role: Contributing factor")
		})

		it("should handle world concepts with minimal data", () => {
			const minimalConcept: WorldConceptEmbeddingInput = {
				name: "Simple Tradition",
				conceptType: "cultural",
				complexityProfile: "simple_clear",
				moralClarity: "clear_good_evil_spectrum",
				scope: "local",
				status: "active",
				timeframe: "Ancient",
				modernRelevance: "Limited relevance",
				currentEffectiveness: "stable",
				summary: "A simple local tradition",
				coreValues: [],
				additionalDetails: [],
				definingCharacteristics: [],
				traditions: [],
				languages: [],
				adaptationStrategies: [],
				majorEvents: [],
				lastingInstitutions: [],
				conflictingNarratives: [],
				historicalGrievances: [],
				endingCauses: [],
				historicalLessons: [],
				membership: [],
				rules: [],
				modernAdaptations: [],
				institutionalChallenges: [],
				culturalEvolution: [],
				currentChallenges: [],
				modernConsequences: [],
				questHooks: [],
				description: [],
			}

			const result = embeddingTextForWorldConcept(minimalConcept)

			expect(result).toContain("World Concept: Simple Tradition")
			expect(result).toContain("type: cultural")
			expect(result).toContain("complexity: simple_clear")
			expect(result).toContain("moralClarity: clear_good_evil_spectrum")
			expect(result).toContain("scope: local")
			expect(result).toContain("status: active")
			expect(result).toContain("timeframe: Ancient")
			expect(result).toContain("modernRelevance: Limited relevance")
			expect(result).toContain("currentEffectiveness: stable")
			expect(result).toContain("summary: A simple local tradition")
			expect(result).not.toContain("Start Year:")
			expect(result).not.toContain("End Year:")
			expect(result).not.toContain("Core Values:")
			expect(result).not.toContain("Concept Relationships:")
			expect(result).not.toContain("Entity Links:")
		})

		it("should handle world concepts with empty arrays gracefully", () => {
			const conceptWithEmptyArrays: WorldConceptEmbeddingInput = {
				name: "Empty Concept",
				conceptType: "political",
				complexityProfile: "layered_nuance",
				moralClarity: "inherently_ambiguous",
				scope: "regional",
				status: "declining",
				timeframe: "Modern",
				modernRelevance: "Highly relevant",
				currentEffectiveness: "struggling",
				summary: "A declining political concept",
				coreValues: [],
				additionalDetails: [],
				definingCharacteristics: [],
				traditions: [],
				languages: [],
				adaptationStrategies: [],
				majorEvents: [],
				lastingInstitutions: [],
				conflictingNarratives: [],
				historicalGrievances: [],
				endingCauses: [],
				historicalLessons: [],
				membership: [],
				rules: [],
				modernAdaptations: [],
				institutionalChallenges: [],
				culturalEvolution: [],
				currentChallenges: [],
				modernConsequences: [],
				questHooks: [],
				description: [],
				conceptRelationships: [],
				worldConceptLinks: [],
			}

			const result = embeddingTextForWorldConcept(conceptWithEmptyArrays)

			expect(result).toContain("World Concept: Empty Concept")
			expect(result).toContain("type: political")
			expect(result).toContain("complexity: layered_nuance")
			expect(result).toContain("moralClarity: inherently_ambiguous")
			expect(result).toContain("scope: regional")
			expect(result).toContain("status: declining")
			expect(result).toContain("timeframe: Modern")
			expect(result).toContain("modernRelevance: Highly relevant")
			expect(result).toContain("currentEffectiveness: struggling")
			expect(result).toContain("summary: A declining political concept")
			expect(result).not.toContain("Core Values:")
			expect(result).not.toContain("Additional Details:")
			expect(result).not.toContain("Concept Relationships:")
			expect(result).not.toContain("Entity Links:")
		})

		it("should handle world concepts with undefined values by omitting those fields", () => {
			const conceptWithUndefined: WorldConceptEmbeddingInput = {
				name: "Undefined Concept",
				conceptType: "mythic",
				complexityProfile: "deep_mystery",
				moralClarity: "inherently_ambiguous",
				scope: "world",
				status: "dormant",
				timeframe: "Primordial",
				modernRelevance: "Unknown relevance",
				currentEffectiveness: "failing",
				summary: "A mysterious primordial concept",
				coreValues: ["mystery"],
				additionalDetails: ["Unknown origins"],
				definingCharacteristics: ["Incomprehensible"],
				traditions: ["Ancient rituals"],
				languages: ["Primordial"],
				adaptationStrategies: ["Unknown"],
				majorEvents: ["The Great Forgetting"],
				lastingInstitutions: ["None"],
				conflictingNarratives: ["Truth vs myth"],
				historicalGrievances: ["Lost knowledge"],
				endingCauses: ["Unknown"],
				historicalLessons: ["Some things are beyond understanding"],
				membership: ["Unknown"],
				rules: ["Unknowable"],
				modernAdaptations: ["None"],
				institutionalChallenges: ["Complete mystery"],
				culturalEvolution: ["Forgotten"],
				currentChallenges: ["Rediscovery"],
				modernConsequences: ["Confusion"],
				questHooks: ["Uncover the truth"],
				description: ["A concept lost to time"],
				startYear: undefined,
				endYear: undefined,
				surfaceImpression: undefined,
				livedRealityDetails: undefined,
				hiddenTruthsOrDepths: undefined,
				socialStructure: undefined,
				structure: undefined,
				purpose: undefined,
				conceptRelationships: undefined,
				worldConceptLinks: undefined,
			}

			const result = embeddingTextForWorldConcept(conceptWithUndefined)

			expect(result).toContain("World Concept: Undefined Concept")
			expect(result).toContain("A concept lost to time")
			expect(result).toContain("type: mythic")
			expect(result).toContain("complexity: deep_mystery")
			expect(result).toContain("moralClarity: inherently_ambiguous")
			expect(result).toContain("scope: world")
			expect(result).toContain("status: dormant")
			expect(result).toContain("timeframe: Primordial")
			expect(result).toContain("modernRelevance: Unknown relevance")
			expect(result).toContain("currentEffectiveness: failing")
			expect(result).toContain("summary: A mysterious primordial concept")
			expect(result).toContain("Core Values:")
			expect(result).toContain("- mystery")
			expect(result).toContain("Additional Details:")
			expect(result).toContain("- Unknown origins")
			expect(result).toContain("Quest Hooks:")
			expect(result).toContain("- Uncover the truth")
			expect(result).not.toContain("Start Year:")
			expect(result).not.toContain("End Year:")
			expect(result).not.toContain("surfaceImpression:")
			expect(result).not.toContain("livedReality:")
			expect(result).not.toContain("hiddenDepths:")
			expect(result).not.toContain("socialStructure:")
			expect(result).not.toContain("structure:")
			expect(result).not.toContain("purpose:")
			expect(result).not.toContain("Concept Relationships:")
			expect(result).not.toContain("Entity Links:")
		})
	})
})
