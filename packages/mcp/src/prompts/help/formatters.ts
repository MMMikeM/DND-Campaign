/**
 * Help Prompt Formatters
 *
 * Functions for formatting help output messages and content.
 */

import { ENTITY_TYPES, PROMPT_HELP_DATA } from "./data"

export function formatSpecificPromptHelp(promptName: string, includeExamples: boolean): string {
	const help = PROMPT_HELP_DATA[promptName]
	if (!help) {
		return `❌ Prompt '${promptName}' not found. Use the prompt help without a name to see all available prompts.`
	}

	let output = `# 📖 ${promptName} - Enhanced Entity Creation\n\n`
	output += `## 🎯 Purpose\n${help.purpose}\n\n`
	output += `## 📝 Description\n${help.description}\n\n`

	output += `## 🔧 Arguments\n`
	for (const [key, desc] of Object.entries(help.arguments)) {
		output += `- **${key}**: ${desc}\n`
	}
	output += `\n`

	output += `## ✅ Benefits\n`
	for (const benefit of help.benefits) {
		output += `- ${benefit}\n`
	}
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

	return output
}

export function formatPromptDiscovery(category?: string, includeExamples?: boolean): string {
	let output = `# 🌟 Enhanced Campaign Entity Creation Prompts\n\n`

	output += `## 🎯 Overview\n`
	output += `Transform your D&D campaign entity creation with **context-aware, relationship-rich** prompts that automatically integrate new entities with your existing campaign data.\n\n`

	output += `**✅ Proven Results:** Phase 2 POC validated 4/4 entity types with **974.3% content improvement** over basic prompts!\n\n`

	const filtered = category && category !== "all" ? ENTITY_TYPES.filter((e) => e.type === category) : ENTITY_TYPES

	for (const entity of filtered) {
		output += `## ${entity.title}\n`
		output += `**Prompt:** \`${entity.prompt}\`\n\n`
		output += `${entity.description}\n\n`

		if (includeExamples) {
			output += `**Quick Start:** Get help with \`prompt_name: "${entity.prompt}"\` and \`show_examples: true\`\n\n`
		}
	}

	output += `## 🚀 Key Features\n\n`
	output += `### 🔄 Auto-Context Gathering\n`
	output += `- Existing entities for relationship opportunities\n`
	output += `- Name conflict detection\n`
	output += `- Geographic and political context\n`
	output += `- Campaign themes and active storylines\n\n`

	output += `## 📚 Getting Started\n\n`
	output += `1. **Choose an entity type** from the list above\n`
	output += `2. **Get detailed help:** Use the prompt name with \`show_examples: true\`\n`
	output += `3. **Start creating:** Use the enhanced prompts for 10x better results!\n\n`

	output += `**Need specific help?** Use \`prompt_name\` parameter with any prompt name above.\n`

	return output
}
