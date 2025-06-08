/**
 * Prompt Template System
 *
 * Provides template prompts for rapid campaign development:
 * - "template-npc" - Common character archetypes (tavern keeper, guard captain)
 * - "template-faction" - Standard organizations (thieves guild, merchant guild)
 * - "template-location" - Typical places (frontier town, ancient ruins)
 * - "template-quest" - Adventure hooks (missing person, political intrigue)
 * - "template-scenario" - Complete multi-entity setups
 */

import { z } from "zod/v4"
import { logger } from ".."
import { createTypedHandler } from "./types"
import type { PromptDefinition } from "./utils"

const templateSchema = z.object({
	template_name: z.string().describe("Name of the template to use"),
	customizations: z.record(z.string(), z.string()).optional().describe("Custom values to override template defaults"),
})

// Template definitions for common scenarios
const templateDefinitions = {
	// NPC Templates
	"tavern-keeper": {
		prompt: "create-npc-enhanced",
		args: {
			name: "Tobias Brewmaster",
			occupation: "tavern keeper",
			location_hint: "Main Street Tavern",
			role_hint: "neutral",
		},
		description: "A friendly tavern keeper who serves as an information hub for adventurers",
	},

	"town-guard": {
		prompt: "create-npc-enhanced",
		args: {
			name: "Sergeant Helena Cross",
			occupation: "guard captain",
			faction_hint: "City Guard",
			role_hint: "ally",
		},
		description: "A dutiful guard captain who maintains law and order",
	},

	"mysterious-merchant": {
		prompt: "create-npc-enhanced",
		args: {
			name: "Zara the Wanderer",
			occupation: "merchant",
			location_hint: "Market Square",
			role_hint: "neutral",
		},
		description: "A traveling merchant with exotic goods and mysterious connections",
	},

	"village-elder": {
		prompt: "create-npc-enhanced",
		args: {
			name: "Elder Bramblebeard",
			occupation: "village leader",
			location_hint: "Village Center",
			role_hint: "ally",
		},
		description: "A wise village elder who knows local history and secrets",
	},

	// Faction Templates
	"thieves-guild": {
		prompt: "create-faction-enhanced",
		args: {
			name: "The Shadow Collective",
			type_hint: "criminal",
			alignment_hint: "chaotic_neutral",
			location_hint: "Underground",
			role_hint: "enemy",
		},
		description: "A secretive criminal organization operating from the shadows",
	},

	"merchant-guild": {
		prompt: "create-faction-enhanced",
		args: {
			name: "Golden Coin Trading Company",
			type_hint: "trade",
			alignment_hint: "lawful_neutral",
			location_hint: "Market District",
			role_hint: "neutral",
		},
		description: "A powerful merchant guild controlling trade routes and commerce",
	},

	"religious-order": {
		prompt: "create-faction-enhanced",
		args: {
			name: "Order of the Dawn",
			type_hint: "religious",
			alignment_hint: "lawful_good",
			location_hint: "Temple District",
			role_hint: "ally",
		},
		description: "A holy order dedicated to protecting the innocent and fighting evil",
	},

	"rebel-movement": {
		prompt: "create-faction-enhanced",
		args: {
			name: "The Free Folk",
			type_hint: "political",
			alignment_hint: "chaotic_good",
			location_hint: "Hidden Camps",
			role_hint: "ally",
		},
		description: "A rebel movement fighting against tyrannical rule",
	},

	// Location Templates
	"frontier-town": {
		prompt: "create-location-enhanced",
		args: {
			name: "Crosswinds",
			type_hint: "town",
			region_hint: "Frontier",
			size_hint: "small",
			purpose_hint: "trade hub",
		},
		description: "A small frontier town serving as a last stop before the wilderness",
	},

	"ancient-ruins": {
		prompt: "create-location-enhanced",
		args: {
			name: "Shadowmere Keep",
			type_hint: "ruins",
			region_hint: "Ancient Lands",
			size_hint: "large",
			purpose_hint: "archaeological site",
		},
		description: "Ancient ruins holding secrets and treasures from a lost civilization",
	},

	"trading-post": {
		prompt: "create-location-enhanced",
		args: {
			name: "Windfall Crossing",
			type_hint: "settlement",
			region_hint: "Trade Routes",
			size_hint: "small",
			purpose_hint: "trade hub",
		},
		description: "A bustling trading post where merchants from different regions meet",
	},

	"hidden-sanctuary": {
		prompt: "create-location-enhanced",
		args: {
			name: "Moonwell Grove",
			type_hint: "sanctuary",
			region_hint: "Deep Forest",
			size_hint: "small",
			purpose_hint: "religious site",
		},
		description: "A hidden sanctuary sacred to nature spirits and druids",
	},

	// Quest Templates
	"missing-person": {
		prompt: "create-quest-enhanced",
		args: {
			name: "The Vanished Scholar",
			type_hint: "investigation",
			level_hint: "1-3",
			theme_hint: "mystery",
		},
		description: "A scholar has gone missing under mysterious circumstances",
	},

	"bandit-trouble": {
		prompt: "create-quest-enhanced",
		args: {
			name: "Highway Robbers",
			type_hint: "combat",
			level_hint: "2-4",
			theme_hint: "action",
		},
		description: "Bandits are threatening trade routes and local travelers",
	},

	"political-intrigue": {
		prompt: "create-quest-enhanced",
		args: {
			name: "The Ambassador's Secret",
			type_hint: "faction",
			level_hint: "4-6",
			theme_hint: "diplomacy",
		},
		description: "Navigate complex political relationships and hidden agendas",
	},

	"ancient-artifact": {
		prompt: "create-quest-enhanced",
		args: {
			name: "The Lost Crown of Kings",
			type_hint: "exploration",
			level_hint: "5-8",
			theme_hint: "adventure",
		},
		description: "Seek out an ancient artifact with powerful magical properties",
	},

	// Scenario Templates (Multiple entities)
	"starter-village": {
		entities: [
			{ template: "village-elder", name: "Elder Goodberry" },
			{ template: "tavern-keeper", name: "Marta Strongale" },
			{ template: "town-guard", name: "Guard Captain Finn" },
			{ template: "frontier-town", name: "Greendale" },
			{ template: "missing-person", name: "The Missing Merchant" },
		],
		description: "Complete starter village with key NPCs, location, and introductory quest",
	},

	"urban-intrigue": {
		entities: [
			{ template: "thieves-guild", name: "The Crimson Daggers" },
			{ template: "merchant-guild", name: "Silver Coin Syndicate" },
			{ template: "mysterious-merchant", name: "Vex the Broker" },
			{ template: "political-intrigue", name: "The Stolen Documents" },
		],
		description: "Urban intrigue scenario with competing factions and shadowy dealings",
	},

	"frontier-adventure": {
		entities: [
			{ template: "trading-post", name: "Last Stop Trading Post" },
			{ template: "ancient-ruins", name: "The Fallen Spire" },
			{ template: "rebel-movement", name: "The Frontier Rangers" },
			{ template: "ancient-artifact", name: "The Shard of Elements" },
		],
		description: "Frontier exploration with ancient mysteries and freedom fighters",
	},
}

async function templateHandler(args: z.infer<typeof templateSchema>) {
	logger.info("Processing template request", args)

	const { template_name, customizations = {} } = args

	const template = templateDefinitions[template_name as keyof typeof templateDefinitions]
	if (!template) {
		return {
			messages: [
				{
					role: "user" as const,
					content: {
						type: "text" as const,
						text: `❌ Template '${template_name}' not found.\n\nAvailable templates:\n${Object.keys(templateDefinitions)
							.map((name) => `- ${name}`)
							.join("\n")}\n\nUse the template list command to see all available templates with descriptions.`,
					},
				},
			],
		}
	}

	if ("entities" in template) {
		// Multi-entity scenario template
		return {
			messages: [
				{
					role: "user" as const,
					content: {
						type: "text" as const,
						text: generateScenarioTemplate(template_name, template as any, customizations || {}),
					},
				},
			],
		}
	} else {
		// Single entity template
		return {
			messages: [
				{
					role: "user" as const,
					content: {
						type: "text" as const,
						text: generateSingleTemplate(template_name, template as any, customizations || {}),
					},
				},
			],
		}
	}
}

function generateSingleTemplate(templateName: string, template: any, customizations: Record<string, string>) {
	const finalArgs = { ...template.args, ...customizations }

	let output = `# 📋 Template: ${templateName}\n\n`
	output += `**Description:** ${template.description}\n\n`
	output += `## 🚀 Ready to Use\n\n`
	output += `\`\`\`json\n`
	output += `{\n`
	output += `  "prompt": "${template.prompt}",\n`
	output += `  "args": ${JSON.stringify(finalArgs, null, 4)}\n`
	output += `}\n`
	output += `\`\`\`\n\n`

	output += `## 🎨 Customization Options\n\n`
	output += `You can customize any of these values:\n`
	Object.entries(finalArgs).forEach(([key, value]) => {
		output += `- **${key}**: Currently "${value}"\n`
	})
	output += `\n`

	output += `**Example with customizations:**\n`
	output += `\`\`\`json\n`
	output += `{\n`
	output += `  "template_name": "${templateName}",\n`
	output += `  "customizations": {\n`
	output += `    "name": "Your Custom Name",\n`
	output += `    "location_hint": "Your Custom Location"\n`
	output += `  }\n`
	output += `}\n`
	output += `\`\`\`\n`

	return output
}

function generateScenarioTemplate(templateName: string, template: any, customizations: Record<string, string>) {
	let output = `# 🌟 Scenario Template: ${templateName}\n\n`
	output += `**Description:** ${template.description}\n\n`
	output += `This scenario includes ${template.entities.length} connected entities:\n\n`

	template.entities.forEach((entity: any, index: number) => {
		const entityTemplate = templateDefinitions[entity.template as keyof typeof templateDefinitions] as any
		output += `## ${index + 1}. ${entity.name}\n`
		output += `**Template:** ${entity.template}\n`
		output += `**Type:** ${(entityTemplate.prompt || "unknown").replace("create-", "").replace("-enhanced", "")}\n`
		output += `**Description:** ${entityTemplate.description}\n\n`

		const finalArgs = { ...entityTemplate.args, name: entity.name, ...customizations }
		output += `\`\`\`json\n`
		output += `{\n`
		output += `  "prompt": "${entityTemplate.prompt}",\n`
		output += `  "args": ${JSON.stringify(finalArgs, null, 4)}\n`
		output += `}\n`
		output += `\`\`\`\n\n`
	})

	output += `## 🎯 Usage Instructions\n\n`
	output += `1. **Create entities in order** - each builds on the previous ones\n`
	output += `2. **Use the exact JSON** provided above for each entity\n`
	output += `3. **Customize names and hints** as needed for your campaign\n`
	output += `4. **Follow relationship suggestions** from the AI to connect entities\n\n`

	output += `This scenario creates a complete, interconnected set of campaign elements ready for immediate use!\n`

	return output
}

// Template listing function
const templateListSchema = z.object({
	category: z
		.enum(["npc", "faction", "location", "quest", "scenario", "all"])
		.optional()
		.default("all")
		.describe("Filter templates by category"),
})

async function templateListHandler(args: z.infer<typeof templateListSchema>) {
	const { category } = args

	let output = `# 📚 Enhanced Prompt Templates\n\n`
	output += `Quick-start templates for common D&D campaign scenarios.\n\n`

	const categories = {
		npc: { title: "📝 NPC Templates", filter: (t: any) => t.prompt === "create-npc-enhanced" },
		faction: { title: "⚔️ Faction Templates", filter: (t: any) => t.prompt === "create-faction-enhanced" },
		location: { title: "🏰 Location Templates", filter: (t: any) => t.prompt === "create-location-enhanced" },
		quest: { title: "⚡ Quest Templates", filter: (t: any) => t.prompt === "create-quest-enhanced" },
		scenario: { title: "🌟 Multi-Entity Scenarios", filter: (t: any) => "entities" in t },
	}

	const showCategories = category === "all" ? Object.keys(categories) : [category]

	showCategories.forEach((cat) => {
		const categoryInfo = categories[cat as keyof typeof categories]
		output += `## ${categoryInfo.title}\n\n`

		Object.entries(templateDefinitions)
			.filter(([_, template]) => categoryInfo.filter(template))
			.forEach(([name, template]) => {
				output += `### ${name}\n`
				output += `${template.description}\n\n`
				output += `**Usage:** \`{ "template_name": "${name}" }\`\n\n`
			})
	})

	output += `## 🚀 How to Use Templates\n\n`
	output += `1. **Choose a template** from the list above\n`
	output += `2. **Use the template name** with optional customizations\n`
	output += `3. **Get ready-to-use prompts** with sensible defaults\n\n`

	output += `**Example:**\n`
	output += `\`\`\`json\n`
	output += `{\n`
	output += `  "template_name": "tavern-keeper",\n`
	output += `  "customizations": {\n`
	output += `    "name": "Gareth Alefellow",\n`
	output += `    "location_hint": "The Prancing Pony"\n`
	output += `  }\n`
	output += `}\n`
	output += `\`\`\`\n`

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

export const templatePromptDefinitions: Record<string, PromptDefinition> = {
	template: {
		description: "Use a predefined template for quick entity creation with sensible defaults",
		schema: templateSchema,
		handler: createTypedHandler(templateSchema, templateHandler),
	},
	"template-list": {
		description: "List all available templates for entity creation",
		schema: templateListSchema,
		handler: createTypedHandler(templateListSchema, templateListHandler),
	},
}
