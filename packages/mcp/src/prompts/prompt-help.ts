// Enhanced Prompt Help and Discovery System
import { z } from "zod/v4"
import { logger } from ".."
import type { PromptDefinition } from "./prompt-utils"

const promptHelpSchema = z.object({
	prompt_name: z.string().optional().describe("Specific prompt to get help for (optional)"),
	category: z.enum(["npc", "faction", "location", "quest", "all"]).optional().describe("Filter by entity type"),
	show_examples: z.boolean().optional().default(false).describe("Include usage examples"),
})

async function promptHelpHandler(args: z.infer<typeof promptHelpSchema>) {
	logger.info("Providing prompt help", args)

	const { prompt_name, category, show_examples } = args

	if (prompt_name) {
		return getSpecificPromptHelp(prompt_name, show_examples)
	}

	return getPromptDiscovery(category, show_examples)
}

function getSpecificPromptHelp(promptName: string, includeExamples: boolean) {
	const promptHelp: Record<string, any> = {
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
				"8.3x richer content than basic prompts",
				"Automatic relationship suggestions with existing NPCs",
				"Faction integration and political positioning",
				"Location-based context and community ties",
				"Ready-to-use quest hooks and story connections",
			],
			example: includeExamples
				? {
						input: {
							name: "Elena Brightforge",
							occupation: "blacksmith",
							location_hint: "Harbor District",
							faction_hint: "Crafters Guild",
							role_hint: "ally",
						},
						expected_output: "Detailed NPC with personality, relationships, goals, secrets, and campaign integration",
					}
				: undefined,
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
				"11x richer content with political complexity",
				"Automatic relationship suggestions with existing factions",
				"Territory and resource analysis",
				"Leadership structure and key members",
				"Integration with active conflicts and quests",
			],
			example: includeExamples
				? {
						input: {
							name: "Order of the Silver Dawn",
							type_hint: "religious",
							location_hint: "Cathedral District",
							alignment_hint: "lawful_good",
							role_hint: "ally",
						},
						expected_output: "Complete faction with hierarchy, goals, relationships, and political positioning",
					}
				: undefined,
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
				"12.3x richer content with geographic detail",
				"Automatic connections to existing locations",
				"Faction control and political dynamics",
				"Economic and strategic importance",
				"Cultural details and adventure hooks",
			],
			example: includeExamples
				? {
						input: {
							name: "Thornwall Keep",
							type_hint: "fortress",
							region_hint: "Northern Borderlands",
							size_hint: "medium",
							purpose_hint: "military outpost",
						},
						expected_output: "Detailed location with geography, population, politics, and strategic importance",
					}
				: undefined,
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
				"11.4x richer content with narrative depth",
				"Automatic integration with existing NPCs and factions",
				"Multiple solution paths and complications",
				"Connection to ongoing storylines and conflicts",
				"Political consequences and future story hooks",
			],
			example: includeExamples
				? {
						input: {
							name: "The Merchant's Gambit",
							type_hint: "faction",
							level_hint: "3-5",
							location_hint: "Trade Quarter",
							faction_hint: "Merchants Guild",
							theme_hint: "investigation",
						},
						expected_output: "Multi-stage quest with NPC involvement, political implications, and story connections",
					}
				: undefined,
		},
	}

	const help = promptHelp[promptName]
	if (!help) {
		return {
			messages: [
				{
					role: "user" as const,
					content: {
						type: "text" as const,
						text: `❌ Prompt '${promptName}' not found. Use the prompt help without a name to see all available prompts.`,
					},
				},
			],
		}
	}

	let output = `# 📖 ${promptName} - Enhanced Entity Creation\n\n`
	output += `## 🎯 Purpose\n${help.purpose}\n\n`
	output += `## 📝 Description\n${help.description}\n\n`

	output += `## 🔧 Arguments\n`
	Object.entries(help.arguments).forEach(([key, desc]) => {
		output += `- **${key}**: ${desc}\n`
	})
	output += `\n`

	output += `## ✅ Benefits\n`
	help.benefits.forEach((benefit: string) => {
		output += `- ${benefit}\n`
	})
	output += `\n`

	if (help.example && includeExamples) {
		output += `## 💡 Example Usage\n\n`
		output += `**Input:**\n\`\`\`json\n${JSON.stringify(help.example.input, null, 2)}\n\`\`\`\n\n`
		output += `**Expected Output:** ${help.example.expected_output}\n\n`
	}

	output += `## 🚀 Why Enhanced Prompts?\n`
	output += `Enhanced prompts automatically gather campaign context and provide:\n`
	output += `- **10x richer content** compared to basic prompts\n`
	output += `- **Automatic relationship suggestions** with existing entities\n`
	output += `- **Campaign consistency** through context integration\n`
	output += `- **Ready-to-use story hooks** and narrative connections\n\n`

	output += `**Phase 2 POC Results:** Enhanced approach won 4/4 entity types with 974.3% content improvement!\n`

	return {
		messages: [
			{
				role: "user" as const,
				content: {
					type: "text" as const,
					text: output,
				},
			},
		],
	}
}

function getPromptDiscovery(category?: string, includeExamples?: boolean) {
	let output = `# 🌟 Enhanced Campaign Entity Creation Prompts\n\n`

	output += `## 🎯 Overview\n`
	output += `Transform your D&D campaign entity creation with **context-aware, relationship-rich** prompts that automatically integrate new entities with your existing campaign data.\n\n`

	output += `**✅ Proven Results:** Phase 2 POC validated 4/4 entity types with **974.3% content improvement** over basic prompts!\n\n`

	const entityTypes = [
		{
			type: "npc",
			prompt: "create-npc-enhanced",
			title: "📝 NPCs (Non-Player Characters)",
			description: "Create rich, connected NPCs with automatic relationship suggestions",
			stats: "8.3x content improvement • 1.0KB context • 157ms",
		},
		{
			type: "faction",
			prompt: "create-faction-enhanced",
			title: "⚔️ Factions (Organizations)",
			description: "Generate political organizations with territory and power dynamics",
			stats: "11x content improvement • 1.3KB context • 137ms",
		},
		{
			type: "location",
			prompt: "create-location-enhanced",
			title: "🏰 Locations (Places)",
			description: "Build detailed locations with geographic and political integration",
			stats: "12.3x content improvement • 0.9KB context • 247ms",
		},
		{
			type: "quest",
			prompt: "create-quest-enhanced",
			title: "⚡ Quests (Adventures)",
			description: "Design multi-layered quests with narrative consequences",
			stats: "11.4x content improvement • 1.4KB context • 233ms",
		},
	]

	const filtered = category && category !== "all" ? entityTypes.filter((e) => e.type === category) : entityTypes

	filtered.forEach((entity) => {
		output += `## ${entity.title}\n`
		output += `**Prompt:** \`${entity.prompt}\`\n\n`
		output += `${entity.description}\n\n`
		output += `**Performance:** ${entity.stats}\n\n`

		if (includeExamples) {
			output += `**Quick Start:** Get help with \`prompt_name: "${entity.prompt}"\` and \`show_examples: true\`\n\n`
		}
	})

	output += `## 🚀 Key Features\n\n`
	output += `### 🔄 Auto-Context Gathering\n`
	output += `- Existing entities for relationship opportunities\n`
	output += `- Name conflict detection\n`
	output += `- Geographic and political context\n`
	output += `- Campaign themes and active storylines\n\n`

	output += `### 🎨 Resource Embedding\n`
	output += `- 1.2KB average context per entity\n`
	output += `- Campaign URIs (\`campaign://creation-context/...\`)\n`
	output += `- JSON-structured context data\n`
	output += `- Universal pattern across all entity types\n\n`

	output += `### ⚡ Performance\n`
	output += `- 194ms average speed penalty for 10x content improvement\n`
	output += `- Acceptable trade-off for massive quality gain\n`
	output += `- Proven scalability across all entity types\n\n`

	output += `## 📚 Getting Started\n\n`
	output += `1. **Choose an entity type** from the list above\n`
	output += `2. **Get detailed help:** Use the prompt name with \`show_examples: true\`\n`
	output += `3. **Start creating:** Use the enhanced prompts for 10x better results!\n\n`

	output += `**Need specific help?** Use \`prompt_name\` parameter with any prompt name above.\n`

	return {
		messages: [
			{
				role: "user" as const,
				content: {
					type: "text" as const,
					text: output,
				},
			},
		],
	}
}

export const promptHelpDefinitions: Record<string, PromptDefinition> = {
	"prompt-help": {
		description: "Get help and examples for enhanced entity creation prompts",
		schema: promptHelpSchema,
		handler: promptHelpHandler,
	},
}
