import type { LocationsFile } from "@/server/schemas"

// Types for our components
export type LocationData = LocationsFile
export type Location = LocationData["locations"][string]

// Format name function to properly capitalize
export const formatName = (name: string) => {
	return name
		.split(/[-_]/)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ")
}

// Get location type icon/color
export const getLocationTypeStyle = (type: string) => {
	const typeMap: Record<
		string,
		{ icon: string; bgClass: string; textClass: string }
	> = {
		City: {
			icon: "🏙️",
			bgClass: "bg-blue-100 dark:bg-blue-900/30",
			textClass: "text-blue-800 dark:text-blue-300",
		},
		Town: {
			icon: "🏘️",
			bgClass: "bg-green-100 dark:bg-green-900/30",
			textClass: "text-green-800 dark:text-green-300",
		},
		Dungeon: {
			icon: "🏰",
			bgClass: "bg-purple-100 dark:bg-purple-900/30",
			textClass: "text-purple-800 dark:text-purple-300",
		},
		Wilderness: {
			icon: "🌲",
			bgClass: "bg-emerald-100 dark:bg-emerald-900/30",
			textClass: "text-emerald-800 dark:text-emerald-300",
		},
		Landmark: {
			icon: "🗿",
			bgClass: "bg-amber-100 dark:bg-amber-900/30",
			textClass: "text-amber-800 dark:text-amber-300",
		},
		"Adventuring Site": {
			icon: "📍",
			bgClass: "bg-red-100 dark:bg-red-900/30",
			textClass: "text-red-800 dark:text-red-300",
		},
		// Default fallback
		default: {
			icon: "📍",
			bgClass: "bg-gray-100 dark:bg-gray-800/30",
			textClass: "text-gray-800 dark:text-gray-300",
		},
	}

	return typeMap[type] || typeMap.default
}
