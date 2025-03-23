import type { Tool } from "@modelcontextprotocol/sdk/types.js"

export const helpTool: Tool = {
	name: "help",
	description: "Get help with available tools, organized by category",
	inputSchema: {
		type: "object",
		properties: {
			category: {
				type: "string",
				description:
					"Optional category to filter tools (npcs, factions, locations, quests, associations)",
			},
		},
	},
}

// Handler for the help tool
export const helpToolHandler = async (allTools: Tool[], args?: Record<string, unknown>) => {
	const category = args?.category as string | undefined

	// Organize all tools by category
	const categories = {
		npcs: allTools.filter((t) => t.name.includes("npc") && !t.name.includes("associate")),
		factions: allTools.filter((t) => t.name.includes("faction") && !t.name.includes("associate")),
		locations: allTools.filter((t) => t.name.includes("location") && !t.name.includes("associate")),
		quests: allTools.filter((t) => t.name.includes("quest") && !t.name.includes("associate")),
		associations: allTools.filter((t) => t.name.includes("associate")),
		utility: [helpTool], // Include self-reference
	}

	// If category specified, return just that category
	if (category && category in categories) {
		return {
			content: [
				{
					type: "text",
					text: `# ${category.toUpperCase()} Tools\n\n${categories[
						category as keyof typeof categories
					]
						.map((t) => `- **${t.name}**: ${t.description}`)
						.join("\n")}`,
				},
			],
		}
	}

	// Otherwise return all categories
	return {
		content: [
			{
				type: "text",
				text: `# Available Tool Categories\n\n${Object.entries(categories)
					.map(
						([cat, tools]) =>
							`## ${cat.toUpperCase()} (${tools.length})\n${tools.map((t) => `- **${t.name}**: ${t.description}`).join("\n")}`,
					)
					.join(
						"\n\n",
					)}\n\nUse \`help({category: 'category_name'})\` for more details on a specific category.`,
			},
		],
	}
}
