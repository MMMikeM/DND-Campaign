// Utility functions for World Changes route
// packages/react/app/routes/world/utils.tsx

import { Badge } from "~/components/ui/badge"

type BadgeProps = React.ComponentProps<typeof Badge>

// Example utility function (based on plan)
// Using severity as an example, adjust based on actual data model
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

// Add other world change-specific utility functions here as needed
