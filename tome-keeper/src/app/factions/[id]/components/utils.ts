import type { FactionTypeStyle } from "./types"

// Get faction type icon/color
export const getFactionTypeStyle = (type: string): FactionTypeStyle => {
	const typeMap: Record<string, FactionTypeStyle> = {
		"Cult Front Organization": {
			icon: "🔮",
			bgClass: "bg-purple-100 dark:bg-purple-900/30",
			textClass: "text-purple-800 dark:text-purple-300",
		},
		Guild: {
			icon: "⚒️",
			bgClass: "bg-amber-100 dark:bg-amber-900/30",
			textClass: "text-amber-800 dark:text-amber-300",
		},
		Government: {
			icon: "👑",
			bgClass: "bg-blue-100 dark:bg-blue-900/30",
			textClass: "text-blue-800 dark:text-blue-300",
		},
		Military: {
			icon: "⚔️",
			bgClass: "bg-red-100 dark:bg-red-900/30",
			textClass: "text-red-800 dark:text-red-300",
		},
		Criminal: {
			icon: "🗡️",
			bgClass: "bg-slate-100 dark:bg-slate-900/30",
			textClass: "text-slate-800 dark:text-slate-300",
		},
		Religious: {
			icon: "✨",
			bgClass: "bg-yellow-100 dark:bg-yellow-900/30",
			textClass: "text-yellow-800 dark:text-yellow-300",
		},
		// Default fallback
		default: {
			icon: "🏛️",
			bgClass: "bg-gray-100 dark:bg-gray-800/30",
			textClass: "text-gray-800 dark:text-gray-300",
		},
	}

	return typeMap[type] || typeMap.default
}
