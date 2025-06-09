/**
 * Help Prompt Data
 *
 * Configuration data for all available prompts including descriptions,
 * arguments, benefits, and examples.
 */

import type { EntityTypeInfo, PromptHelpData } from "./types"

export const PROMPT_HELP_DATA: Record<string, PromptHelpData> = {
	"create-npc-enhanced": {
		description: "Create NPCs with rich campaign context and relationship suggestions",
		purpose: "Generate detailed NPCs that automatically integrate with your existing campaign",
		arguments: {
			name: "NPC name (required)",
			occupation: "Their job or role (optional but recommended)",
			location_hint: "Where they live/work (helps with context)",
			faction_hint: "Which faction they might belong to",
			role_hint: "Their role in your campaign (ally, enemy, neutral, etc.)",
		},
		benefits: [
			"Automatic relationship suggestions with existing NPCs",
			"Faction integration and political positioning",
			"Location-based context and community ties",
			"Ready-to-use quest hooks and story connections",
		],
		example: {
			input: {
				name: "Elena Brightforge",
				occupation: "blacksmith",
				location_hint: "Harbor District",
				faction_hint: "Crafters Guild",
				role_hint: "ally",
			},
			expected_output: "Detailed NPC with personality, relationships, goals, secrets, and campaign integration",
		},
	},

	"create-faction-enhanced": {
		description: "Create factions with political context and territorial relationships",
		purpose: "Generate detailed factions that naturally fit into your campaign's power structure",
		arguments: {
			name: "Faction name (required)",
			type_hint: "Type of organization (military, trade, religious, criminal, etc.)",
			location_hint: "Where they're based or operate",
			alignment_hint: "Moral alignment preference",
			role_hint: "Role in campaign (ally, enemy, neutral, etc.)",
		},
		benefits: [
			"Automatic relationship suggestions with existing factions",
			"Territory and resource analysis",
			"Leadership structure and key members",
			"Integration with active conflicts and quests",
		],
		example: {
			input: {
				name: "Order of the Silver Dawn",
				type_hint: "religious",
				location_hint: "Cathedral District",
				alignment_hint: "lawful_good",
				role_hint: "ally",
			},
			expected_output: "Complete faction with hierarchy, goals, relationships, and political positioning",
		},
	},

	"create-location-enhanced": {
		description: "Create locations with geographic context and faction control",
		purpose: "Generate detailed locations that seamlessly integrate with your world geography",
		arguments: {
			name: "Location name (required)",
			type_hint: "Type of place (city, town, village, fortress, dungeon, etc.)",
			region_hint: "Which region or area it's in",
			size_hint: "Relative size (small, medium, large, etc.)",
			purpose_hint: "Primary function (trade hub, military outpost, etc.)",
		},
		benefits: [
			"Automatic connections to existing locations",
			"Faction control and political dynamics",
			"Economic and strategic importance",
			"Cultural details and adventure hooks",
		],
		example: {
			input: {
				name: "Thornwall Keep",
				type_hint: "fortress",
				region_hint: "Northern Borderlands",
				size_hint: "medium",
				purpose_hint: "military outpost",
			},
			expected_output: "Detailed location with geography, population, politics, and strategic importance",
		},
	},

	"create-quest-enhanced": {
		description: "Create quests with narrative connections and multi-layered complexity",
		purpose: "Generate detailed quests that tie into your existing campaign storylines",
		arguments: {
			name: "Quest name (required)",
			type_hint: "Quest type (main, side, faction, personal, etc.)",
			level_hint: "Difficulty or character level range",
			location_hint: "Primary location or region",
			faction_hint: "Faction involved or requesting",
			theme_hint: "Quest theme (investigation, combat, diplomacy, etc.)",
		},
		benefits: [
			"Automatic integration with existing NPCs and factions",
			"Multiple solution paths and complications",
			"Connection to ongoing storylines and conflicts",
			"Political consequences and future story hooks",
		],
		example: {
			input: {
				name: "The Merchant's Gambit",
				type_hint: "faction",
				level_hint: "3-5",
				location_hint: "Trade Quarter",
				faction_hint: "Merchants Guild",
				theme_hint: "investigation",
			},
			expected_output: "Multi-stage quest with NPC involvement, political implications, and story connections",
		},
	},
}

export const ENTITY_TYPES: EntityTypeInfo[] = [
	{
		type: "npc",
		prompt: "create-npc-enhanced",
		title: "📝 NPCs (Non-Player Characters)",
		description: "Create rich, connected NPCs with automatic relationship suggestions",
	},
	{
		type: "faction",
		prompt: "create-faction-enhanced",
		title: "⚔️ Factions (Organizations)",
		description: "Generate political organizations with territory and power dynamics",
	},
	{
		type: "location",
		prompt: "create-location-enhanced",
		title: "🏰 Locations (Places)",
		description: "Build detailed locations with geographic and political integration",
	},
	{
		type: "quest",
		prompt: "create-quest-enhanced",
		title: "⚡ Quests (Adventures)",
		description: "Design multi-layered quests with narrative consequences",
	},
]
