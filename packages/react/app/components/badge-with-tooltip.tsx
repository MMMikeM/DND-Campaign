import * as React from "react"
import { Badge, badgeVariants } from "~/components/ui/badge"
import { Tooltip, TooltipTrigger, TooltipContent } from "~/components/ui/tooltip"
import type { VariantProps } from "class-variance-authority"

type BadgeWithTooltipProps = React.ComponentProps<typeof Badge> &
	VariantProps<typeof badgeVariants> & {
		tooltipContent: string // Required tooltip explanation
		tooltipSide?: "top" | "right" | "bottom" | "left"
		tooltipAlign?: "start" | "center" | "end"
	}

export function BadgeWithTooltip({
	children,
	tooltipContent,
	tooltipSide = "top",
	tooltipAlign = "center",
	...badgeProps
}: BadgeWithTooltipProps) {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Badge {...badgeProps}>{children}</Badge>
			</TooltipTrigger>
			<TooltipContent side={tooltipSide} align={tooltipAlign}>
				{tooltipContent}
			</TooltipContent>
		</Tooltip>
	)
}
