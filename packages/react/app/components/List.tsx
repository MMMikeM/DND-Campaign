import { cva, type VariantProps } from "class-variance-authority"
import { ChevronDown, ChevronUp, Info } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import React, { useEffect, useRef, useState } from "react"
import { cn } from "../lib/utils"

const listVariants = cva("", {
	variants: {
		listStyle: {
			decimal: "list-decimal",
			none: "",
		},
		spacing: {
			none: "",
			xs: "space-y-1",
			sm: "space-y-2",
			md: "space-y-3",
			lg: "space-y-4",
		},
		textSize: {
			xs: "text-xs",
			sm: "text-sm",
			base: "text-base",
			lg: "text-lg",
		},
		textColor: {
			default: "",
			muted: "text-muted-foreground",
		},
	},
	defaultVariants: {
		spacing: "md",
		textSize: "base",
		textColor: "default",
	},
})

// Base props without heading-related props
interface BaseListProps extends VariantProps<typeof listVariants> {
	items?: string[]
	emptyText?: string
	bulletColor?: "amber" | "red" | "green" | "blue" | "purple" | "gray"
	className?: string
}

// Props for list without heading (non-collapsible)
interface ListWithoutHeadingProps extends BaseListProps {
	heading?: never
	icon?: never
	collapsible?: never
	initialCollapsed?: never
}

// Props for non-collapsible list with heading
interface ListWithHeadingNonCollapsibleProps extends BaseListProps {
	heading: string
	icon?: React.ReactNode
	collapsible: false
	initialCollapsed?: never
}

// Props for collapsible list with heading
interface ListWithHeadingCollapsibleProps extends BaseListProps {
	heading: string
	icon?: React.ReactNode
	collapsible?: true
	initialCollapsed?: boolean
}

// Union type to ensure proper prop combinations
export type ListProps = ListWithoutHeadingProps | ListWithHeadingNonCollapsibleProps | ListWithHeadingCollapsibleProps

export function List({
	items,
	className,
	emptyText = "No items to display",
	heading,
	icon = <Info className="h-4 w-4 mr-2" />,
	listStyle,
	spacing,
	textSize,
	textColor,
	bulletColor = "gray",
	initialCollapsed,
	...props
}: ListProps) {
	// Make collapsed true by default for collapsible lists
	const collapsible = !!(props.collapsible !== false && heading)
	const defaultCollapsed = collapsible && initialCollapsed !== undefined ? initialCollapsed : collapsible
	const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)
	const isFirstRender = useRef(true)

	const animationSpeed = 0.5 / 10
	const isCollapsibleHeading = heading && collapsible

	// Skip the initial animation on mount
	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false
		}
	}, [])

	// If there are no items, display the empty text
	if (!items || items.length === 0) {
		return (
			<div {...props}>
				{renderHeading(heading, icon, Boolean(isCollapsibleHeading), isCollapsed, setIsCollapsed)}
				{!isCollapsed && (
					<ul className={cn(listVariants({ listStyle, spacing, textSize, textColor }), className)}>
						<li className="text-muted-foreground">{emptyText}</li>
					</ul>
				)}
			</div>
		)
	}

	return (
		<div {...props}>
			{renderHeading(heading, icon, Boolean(isCollapsibleHeading), isCollapsed, setIsCollapsed)}

			<AnimatePresence initial={false}>
				{!isCollapsed && (
					<motion.div
						style={{ overflow: "hidden" }}
						initial={isFirstRender.current ? false : { height: 0 }}
						animate={{
							height: "auto",
							transition: {
								duration: items.length * animationSpeed,
								ease: "easeOut",
							},
						}}
						exit={{
							height: 0,
							transition: {
								duration: items.length * animationSpeed,
								ease: "easeInOut",
								delay: animationSpeed,
							},
						}}
					>
						<ul className={cn(listVariants({ listStyle, spacing, textSize, textColor }), className)}>
							{items.map((item, index) => (
								<motion.li
									key={`${item.substring(0, 20)}-${index}`}
									className={cn(
										textColor === "muted" ? "text-muted-foreground" : "",
										bulletColor && "flex items-start justify-start",
									)}
									initial={isFirstRender.current ? false : { opacity: 0 }}
									animate={{
										opacity: 1,
										transition: {
											delay: animationSpeed * (index + 0.5),
											duration: animationSpeed,
										},
									}}
									exit={{
										opacity: 0,
										transition: {
											delay: animationSpeed * (items.length - index - 1),
											duration: animationSpeed,
										},
									}}
									style={{ transformOrigin: "top" }}
								>
									{renderBullet(bulletColor)}
									<span className="text-slate-700 dark:text-slate-300">{item}</span>
								</motion.li>
							))}
						</ul>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

// Helper function to render the heading with collapse functionality
function renderHeading(
	heading?: string,
	icon?: React.ReactNode,
	collapsible?: boolean,
	isCollapsed?: boolean,
	setIsCollapsed?: React.Dispatch<React.SetStateAction<boolean>>,
) {
	if (!heading) return null

	const toggleCollapse = () => setIsCollapsed?.(!isCollapsed)

	return (
		<h3
			className={cn("font-medium mb-2 flex items-center", collapsible && "cursor-pointer")}
			onClick={collapsible ? toggleCollapse : undefined}
			onKeyDown={
				collapsible
					? (e) => {
							if (e.key === "Enter" || e.key === " ") {
								e.preventDefault()
								toggleCollapse()
							}
						}
					: undefined
			}
			tabIndex={collapsible ? 0 : undefined}
			role={collapsible ? "button" : undefined}
			aria-expanded={collapsible ? !isCollapsed : undefined}
		>
			{icon}
			{heading}
			{collapsible && (
				<div className="ml-auto">
					{isCollapsed ? (
						<ChevronDown className="h-4 w-4 text-muted-foreground" />
					) : (
						<ChevronUp className="h-4 w-4 text-muted-foreground" />
					)}
				</div>
			)}
		</h3>
	)
}

// Helper function to render bullet point
function renderBullet(bulletColor?: string) {
	if (!bulletColor) return null

	return (
		<div className="flex-shrink-0 mr-3 mt-2">
			<div className={`h-2 w-2 rounded-full bg-${bulletColor}-500`} />
		</div>
	)
}
