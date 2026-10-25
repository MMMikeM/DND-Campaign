import type { Badge } from "~/components/ui/badge"

type BadgeProps = React.ComponentProps<typeof Badge>

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
