import { Badge } from "~/components/ui/badge"

type BadgeProps = React.ComponentProps<typeof Badge>

export const getArcStatusVariant = (status: string | null | undefined): BadgeProps["variant"] => {
	switch (status?.toLowerCase()) {
		case "active":
		case "ongoing":
			return "default"
		case "completed":
		case "concluded":
			return "secondary"
		case "abandoned":
		case "failed":
			return "destructive"
		default:
			return "secondary"
	}
}
