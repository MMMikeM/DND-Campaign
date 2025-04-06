import { Badge } from "~/components/ui/badge"

type BadgeProps = React.ComponentProps<typeof Badge>

export const getConflictStatusVariant = (status: string | null | undefined): BadgeProps["variant"] => {
	switch (status?.toLowerCase()) {
		case "active":
		case "escalating":
			return "destructive"
		case "simmering":
		case "stalemate":
			return "secondary"
		case "resolved":
		case "de-escalated":
			return "default"
		default:
			return "secondary"
	}
}
