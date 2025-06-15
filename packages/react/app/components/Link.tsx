import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"
import { Link as RouterLink } from "react-router"
import { cn } from "~/lib/utils"

const linkVariants = cva(
	"inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
	{
		variants: {
			variant: {
				default: "text-primary hover:text-primary/80",
				subtle: "text-muted-foreground hover:text-foreground",
				destructive: "text-destructive hover:text-destructive/80",
				accent: "text-accent-foreground hover:text-accent-foreground/80",
				underlined: "underline-offset-4 hover:underline text-primary",
			},
			size: {
				default: "text-base",
				sm: "text-sm",
				lg: "text-lg",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
)

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement>, VariantProps<typeof linkVariants> {
	href: string
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
	({ className, variant, size, href, children, ...props }, ref) => {
		return (
			<RouterLink ref={ref} to={href} className={cn(linkVariants({ variant, size, className }))} {...props}>
				{children}
			</RouterLink>
		)
	},
)
Link.displayName = "Link"
