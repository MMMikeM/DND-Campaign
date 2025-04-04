import { cn } from "../lib/utils"
import React, { useState } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronDown, ChevronUp, Info } from "lucide-react"
import { motion, AnimatePresence, m } from "motion/react"

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
		spacing: "sm",
		textSize: "base",
		textColor: "default",
	},
})

export interface ListProps extends VariantProps<typeof listVariants> {
	items?: string[]
	emptyText?: string
	maxItems?: 2 | 3 | 4 | 5
	heading?: string
	icon?: React.ReactNode
	bulletColor?: "amber" | "red" | "green" | "blue" | "purple" | "gray"
	className?: string
}

export function List({
	items,
	className,
	emptyText = "No items to display",
	maxItems,
	heading,
	icon = <Info className="h-4 w-4 mr-2" />,
	listStyle,
	spacing,
	textSize,
	textColor,
	bulletColor = "gray",
	...props
}: ListProps) {
	const [displayMore, setDisplayMore] = useState(false)

	// If there are no items, display the empty text
	if (!items || items.length === 0) {
		return (
			<div {...props}>
				{heading && (
					<h3 className="font-medium mb-2 flex items-center">
						{icon}
						{heading}
					</h3>
				)}
				<ul className={cn(listVariants({ listStyle, spacing, textSize, textColor }), className)}>
					<li className="text-muted-foreground">{emptyText}</li>
				</ul>
			</div>
		)
	}

	// Split items into display and more items
	const displayItems = maxItems ? items.slice(0, maxItems) : items
	const moreItems = maxItems ? items.slice(maxItems) : []
	const animationSpeed = 0.1

	return (
		<div {...props}>
			{heading && (
				<h3 className="font-medium mb-2 flex items-center">
					{icon}
					{heading}
				</h3>
			)}
			<ul className={cn(listVariants({ listStyle, spacing, textSize, textColor }), className)}>
				{displayItems.map((item, index) => (
					<li
						key={`${item.substring(0, 20)}-${index}`}
						className={cn(
							textColor === "muted" ? "text-muted-foreground" : "",
							bulletColor && "flex items-start justify-start",
						)}
					>
						{bulletColor && (
							<div className={`flex-shrink-0 mr-3 mt-2`}>
								<div className={`h-2 w-2 rounded-full bg-${bulletColor}-500`} />
							</div>
						)}
						<span className="text-slate-700 dark:text-slate-300">{item}</span>
					</li>
				))}

				<AnimatePresence>
					{displayMore && (
						<motion.div
							className={cn(listVariants({ listStyle, spacing, textSize, textColor }), className)}
							style={{ overflow: "hidden" }}
							initial={maxItems ? { height: 0 } : { height: "auto" }}
							animate={{
								height: "auto",
								transition: {
									duration: moreItems.length * animationSpeed,
									ease: "easeOut",
								},
							}}
							exit={{
								height: 0,
								transition: {
									duration: moreItems.length * animationSpeed,
									ease: "easeInOut",
									delay: animationSpeed,
								},
							}}
						>
							{moreItems.map((item, index) => (
								<motion.li
									key={`${item.substring(0, 20)}-${index + displayItems.length}`}
									className={cn(
										textColor === "muted" ? "text-muted-foreground" : "",
										bulletColor && "flex items-start justify-start",
									)}
									initial={{ opacity: 0 }}
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
											delay: animationSpeed * (moreItems.length - index - 1),
											duration: animationSpeed,
										},
									}}
									style={{ transformOrigin: "top" }}
								>
									{bulletColor && (
										<div className={`flex-shrink-0 mr-3 mt-2`}>
											<div className={`h-2 w-2 rounded-full bg-${bulletColor}-500`} />
										</div>
									)}
									<span className="text-slate-700 dark:text-slate-300">{item}</span>
								</motion.li>
							))}
						</motion.div>
					)}
				</AnimatePresence>

				{moreItems.length > 0 && (
					<motion.li className="flex justify-end">
						<button
							type="button"
							onClick={() => setDisplayMore(!displayMore)}
							className="flex items-center text-xs text-indigo-500 hover:text-indigo-600 transition-colors"
						>
							{displayMore ? (
								<>
									<ChevronUp className="h-3 w-3 mr-1" />
									Show less
								</>
							) : (
								<>
									<ChevronDown className="h-3 w-3 mr-1" />
									Show {moreItems.length} more
								</>
							)}
						</button>
					</motion.li>
				)}
			</ul>
		</div>
	)
}
