import type { Badge } from "~/components/ui/badge"

type BadgeProps = React.ComponentProps<typeof Badge>

export const getChangeSeverityVariant = (severity: string | null | undefined): BadgeProps["variant"] => {
	switch (severity?.toLowerCase()) {
		case "catastrophic":
		case "major":
			return "destructive"
		case "moderate":
			return "default" // Or secondary
		case "minor":
		case "subtle":
			return "secondary" // Or outline
		default:
			return "secondary"
	}
}

export const getLoreTypeVariant = (type: string | null | undefined): BadgeProps["variant"] => {
	const typeLower = type?.toLowerCase()
	if (typeLower === "history" || typeLower === "legend") {
		return "default"
	}
	if (typeLower === "culture" || typeLower === "religion") {
		return "secondary"
	}
	if (typeLower === "geography") {
		return "outline"
	}
	if (typeLower === "item_lore" || typeLower === "character_backstory") {
		return "destructive"
	}
	return "secondary"
}
