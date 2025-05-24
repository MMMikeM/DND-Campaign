export const getAlignmentVariant = (alignment: string) => {
	if (alignment.includes("good")) return "default"
	if (alignment.includes("evil")) return "destructive"
	return "secondary"
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

export const getSizeVariant = (size: string) => {
	switch (size) {
		case "massive":
		case "large":
			return "default"
		case "medium":
			return "secondary"
		case "small":
		case "tiny":
			return "outline"
		default:
			return "outline"
	}
}

export const getReachVariant = (reach: string) => {
	switch (reach) {
		case "global":
		case "continental":
			return "default"
		case "national":
			return "secondary"
		case "regional":
		case "local":
			return "outline"
		default:
			return "outline"
	}
}
