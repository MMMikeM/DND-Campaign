import { Badge } from "~/components/ui/badge"

type BadgeProps = React.ComponentProps<typeof Badge>

export const getForeshadowingSubtletyVariant = (subtlety: string | null | undefined): BadgeProps["variant"] => {
	switch (subtlety?.toLowerCase()) {
		case "obvious":
		case "direct":
			return "destructive"
		case "subtle":
			return "secondary"
		case "veiled":
		case "symbolic":
			return "outline"
		default:
			return "secondary"
	}
}
