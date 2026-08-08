export const getWealthVariant = (wealth: string | undefined) => {
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

export const getAlignmentVariant = (alignment: string | undefined) => {
	if (!alignment) return "outline"
	if (alignment.includes("good")) return "default"
	if (alignment.includes("evil")) return "destructive"
	return "secondary"
}

export const getAdaptabilityVariant = (adaptability: string | undefined) => {
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
