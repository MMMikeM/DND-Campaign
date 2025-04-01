/**
 * Utility functions for the Quests module
 */

// Helper functions for badge variants
export const getTypeVariant = (type: string) => {
	switch (type) {
		case "main":
			return "default"
		case "side":
			return "secondary"
		case "faction":
			return "outline"
		case "character":
			return "destructive"
		case "generic":
			return "outline"
		default:
			return "outline"
	}
}

export const getUrgencyVariant = (urgency: string) => {
	switch (urgency) {
		case "critical":
			return "destructive"
		case "urgent":
			return "default"
		case "developing":
			return "secondary"
		case "background":
			return "outline"
		default:
			return "outline"
	}
}

export const getVisibilityVariant = (visibility: string) => {
	switch (visibility) {
		case "featured":
			return "default"
		case "known":
			return "secondary"
		case "rumored":
			return "outline"
		case "hidden":
			return "destructive"
		default:
			return "outline"
	}
}
