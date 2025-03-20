/**
 * Dark mode theme colors and settings
 */
export const darkModeColors = {
	background: {
		primary: "#0f172a", // Dark blue-gray
		secondary: "#1e293b", // Slightly lighter blue-gray
		tertiary: "#334155", // Medium blue-gray
		highlight: "#334155", // Accent background
		active: "#1e40af", // Active/selected item
		card: "#1e293b", // Card background
	},
	text: {
		primary: "#f8fafc", // Almost white
		secondary: "#cbd5e1", // Light gray
		accent: "#60a5fa", // Light blue accent
		muted: "#64748b", // Muted text
		success: "#4ade80", // Success green
		warning: "#facc15", // Warning yellow
		danger: "#f87171", // Danger red
	},
	border: {
		light: "#334155", // Light border
		normal: "#475569", // Normal border
		active: "#3b82f6", // Active/focused border
	},
}

// Type for theme structure
type ThemeColors = typeof darkModeColors

/**
 * Utility to get theme tokens
 */
export const getThemeToken = (path: string): string => {
	const parts = path.split(".")
	let result: unknown = darkModeColors

	for (const part of parts) {
		if (
			typeof result !== "object" ||
			result === null ||
			!(part in (result as Record<string, unknown>))
		) {
			console.warn(`Theme token not found: ${path}`)
			return "#ffffff"
		}
		result = (result as Record<string, unknown>)[part]
	}

	if (typeof result !== "string") {
		console.warn(`Theme token is not a string: ${path}`)
		return "#ffffff"
	}

	return result
}
