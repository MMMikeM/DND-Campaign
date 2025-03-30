import * as React from "react"
import { Link as RouterLink } from "react-router"
import { cn } from "~/lib/utils"
import { buttonVariants } from "./button"
import type { VariantProps } from "class-variance-authority"

export interface LinkProps
	extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
		VariantProps<typeof buttonVariants> {
	href: string
	asButton?: boolean
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
	({ className, variant, size, asButton = false, href, children, ...props }, ref) => {
		if (asButton) {
			return (
				<RouterLink
					ref={ref}
					to={href}
					className={cn(buttonVariants({ variant, size, className }))}
					{...props}
				>
					{children}
				</RouterLink>
			)
		}

		return (
			<RouterLink ref={ref} to={href} className={cn(className)} {...props}>
				{children}
			</RouterLink>
		)
	},
)
Link.displayName = "Link"

export { Link }
