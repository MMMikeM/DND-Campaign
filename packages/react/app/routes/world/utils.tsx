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
