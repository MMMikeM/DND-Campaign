export const getTrustLevelVariant = (level: string) => {
	switch (level) {
		case "high":
			return "default"
		case "medium":
			return "secondary"
		case "low":
			return "outline"
		case "none":
			return "destructive"
		default:
			return "outline"
	}
}

export const getWealthVariant = (wealth: string) => {
	switch (wealth) {
		case "wealthy":
		case "rich":
			return "default"
		case "moderate":
			return "secondary"
		case "poor":
		case "destitute":
			return "destructive"
		default:
			return "outline"
	}
}

export const getAlignmentVariant = (alignment: string) => {
	if (alignment.includes("good")) return "default"
	if (alignment.includes("evil")) return "destructive"
	return "secondary"
}

export const getAdaptabilityVariant = (adaptability: string) => {
	switch (adaptability) {
		case "opportunistic":
		case "flexible":
			return "default"
		case "reluctant":
			return "secondary"
		case "rigid":
			return "destructive"
		default:
			return "outline"
	}
}

export const getRelationshipStrengthVariant = (strength: string) => {
	switch (strength) {
		case "unbreakable":
		case "strong":
			return "default"
		case "moderate":
			return "secondary"
		case "weak":
			return "outline"
		default:
			return "outline"
	}
}

export const getRelationshipTypeVariant = (type: string) => {
	switch (type) {
		case "ally":
			return "default"
		case "neutral":
			return "secondary"
		case "enemy":
			return "destructive"
		default:
			return "outline"
	}
}
