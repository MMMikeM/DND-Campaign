/**
 * Utility functions for the Areas module
 */

// Helper function for danger level badge variant
export const getDangerVariant = (level: string | null | undefined) => {
	switch (level) {
		case "safe":
			return "outline"
		case "low":
			return "secondary"
		case "moderate":
			return "default"
		case "high":
			return "destructive"
		case "deadly":
			return "destructive"
		default:
			return "outline"
	}
}

// Helper function for danger level tooltip
export const getDangerTooltip = (level: string | null | undefined) => {
	switch (level) {
		case "safe":
			return "Safe for inhabitants"
		case "low":
			return "Minor threats present"
		case "moderate":
			return "Significant dangers"
		case "high":
			return "Very dangerous"
		case "deadly":
			return "Extremely deadly"
		default:
			return "Danger level unknown"
	}
}

// Add other area-specific utility functions here as needed
