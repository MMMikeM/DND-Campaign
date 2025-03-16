import type { NpcsFile } from "@/server/schemas/generated/npcsSchema"

// Types for our components
export type NPCData = NpcsFile
export type NPC = NPCData["npcs"][number]

// Format name function to properly capitalize
export const formatName = (name: string) => {
	return name
		.split(/[-_]/)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ")
}

// Get NPC role style (icon and colors)
export const getNPCRoleStyle = (role: string) => {
	const roleMap: Record<
		string,
		{ icon: string; bgClass: string; textClass: string }
	> = {
		"Quest Giver": {
			icon: "📜",
			bgClass: "bg-amber-100 dark:bg-amber-900/30",
			textClass: "text-amber-800 dark:text-amber-300",
		},
		Merchant: {
			icon: "💰",
			bgClass: "bg-emerald-100 dark:bg-emerald-900/30",
			textClass: "text-emerald-800 dark:text-emerald-300",
		},
		Ally: {
			icon: "🤝",
			bgClass: "bg-blue-100 dark:bg-blue-900/30",
			textClass: "text-blue-800 dark:text-blue-300",
		},
		Villain: {
			icon: "😈",
			bgClass: "bg-red-100 dark:bg-red-900/30",
			textClass: "text-red-800 dark:text-red-300",
		},
		"Information Source": {
			icon: "ℹ️",
			bgClass: "bg-indigo-100 dark:bg-indigo-900/30",
			textClass: "text-indigo-800 dark:text-indigo-300",
		},
		"Faction Leader": {
			icon: "👑",
			bgClass: "bg-purple-100 dark:bg-purple-900/30",
			textClass: "text-purple-800 dark:text-purple-300",
		},
		// Default fallback
		default: {
			icon: "👤",
			bgClass: "bg-gray-100 dark:bg-gray-800/30",
			textClass: "text-gray-800 dark:text-gray-300",
		},
	}

	return roleMap[role] || roleMap.default
}
