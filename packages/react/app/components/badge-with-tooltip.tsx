import type { VariantProps } from "class-variance-authority"
import type * as React from "react"
import { Badge, type badgeVariants } from "~/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip"
import { cn } from "~/lib/utils"

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
	className,
	...badgeProps
}: BadgeWithTooltipProps) {
	return (
		<div className="inline-flex h-fit">
			<Tooltip>
				<TooltipTrigger asChild>
					<Badge className={cn("grow-0 shrink-0 capitalize", className)} {...badgeProps}>
						{children}
					</Badge>
				</TooltipTrigger>
				<TooltipContent side={tooltipSide} align={tooltipAlign}>
					{tooltipContent}
				</TooltipContent>
			</Tooltip>
		</div>
	)
}
