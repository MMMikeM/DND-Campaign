/**
 * Utility functions for the Regions module
 */

// Helper function for danger level badge variant
export const getDangerVariant = (level: string) => {
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
