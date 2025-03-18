import type { ReactNode } from "react"
import { motion } from "framer-motion"

export type ChipColor =
	| "blue"
	| "green"
	| "purple"
	| "amber"
	| "red"
	| "gray"
	| "cyan"
	| "pink"
	| "indigo"

export type ChipSize = "sm" | "md" | "lg"

const colorMap: Record<ChipColor, { bg: string; text: string; border?: string }> = {
	blue: {
		bg: "bg-blue-100/80 dark:bg-blue-900/40",
		text: "text-blue-700 dark:text-blue-300",
		border: "border-blue-200/50 dark:border-blue-800/50",
	},
	green: {
		bg: "bg-green-100/80 dark:bg-green-900/40",
		text: "text-green-700 dark:text-green-300",
		border: "border-green-200/50 dark:border-green-800/50",
	},
	purple: {
		bg: "bg-purple-100/80 dark:bg-purple-900/40",
		text: "text-purple-700 dark:text-purple-300",
		border: "border-purple-200/50 dark:border-purple-800/50",
	},
	amber: {
		bg: "bg-amber-100/80 dark:bg-amber-900/40",
		text: "text-amber-700 dark:text-amber-300",
		border: "border-amber-200/50 dark:border-amber-800/50",
	},
	red: {
		bg: "bg-red-100/80 dark:bg-red-900/40",
		text: "text-red-700 dark:text-red-300",
		border: "border-red-200/50 dark:border-red-800/50",
	},
	gray: {
		bg: "bg-gray-100/80 dark:bg-gray-800/40",
		text: "text-gray-700 dark:text-gray-300",
		border: "border-gray-200/50 dark:border-gray-700/50",
	},
	cyan: {
		bg: "bg-cyan-100/80 dark:bg-cyan-900/40",
		text: "text-cyan-700 dark:text-cyan-300",
		border: "border-cyan-200/50 dark:border-cyan-800/50",
	},
	pink: {
		bg: "bg-pink-100/80 dark:bg-pink-900/40",
		text: "text-pink-700 dark:text-pink-300",
		border: "border-pink-200/50 dark:border-pink-800/50",
	},
	indigo: {
		bg: "bg-indigo-100/80 dark:bg-indigo-900/40",
		text: "text-indigo-700 dark:text-indigo-300",
		border: "border-indigo-200/50 dark:border-indigo-800/50",
	},
}

const sizeMap: Record<ChipSize, { text: string; padding: string; icon: string }> = {
	sm: {
		text: "text-xs",
		padding: "px-2 py-0.5",
		icon: "w-3.5 h-3.5",
	},
	md: {
		text: "text-sm",
		padding: "px-3 py-1",
		icon: "w-4 h-4",
	},
	lg: {
		text: "text-base",
		padding: "px-4 py-1.5",
		icon: "w-5 h-5",
	},
}

export interface ChipProps {
	// Content
	children: ReactNode
	icon?: ReactNode

	// Style
	color?: ChipColor
	size?: ChipSize
	withBorder?: boolean
	withBlur?: boolean

	// Animation
	animate?: boolean

	// Optional
	className?: string
	onClick?: () => void
}

export function Chip({
	children,
	icon,
	color = "gray",
	size = "md",
	withBorder = false,
	withBlur = true,
	animate = false,
	className = "",
	onClick,
}: ChipProps) {
	const colorStyle = colorMap[color]
	const sizeStyle = sizeMap[size]

	const classes = [
		"inline-flex",
		"items-center",
		"rounded-full",
		"font-medium",
		colorStyle.bg,
		colorStyle.text,
		sizeStyle.text,
		sizeStyle.padding,
		withBorder && colorStyle.border && `border ${colorStyle.border}`,
		withBlur && "backdrop-blur-sm",
		onClick && "cursor-pointer hover:opacity-80 transition-opacity",
		className,
	]
		.filter(Boolean)
		.join(" ")

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (onClick && (e.key === "Enter" || e.key === " ")) {
			e.preventDefault()
			onClick()
		}
	}

	const sharedProps = onClick
		? {
				role: "button",
				tabIndex: 0,
				onClick,
				onKeyDown: handleKeyDown,
			}
		: {}

	const content = (
		<>
			{icon && <span className={`mr-1 ${sizeStyle.icon}`}>{icon}</span>}
			{children}
		</>
	)

	if (animate) {
		return (
			<motion.span
				className={classes}
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.2 }}
				{...sharedProps}
			>
				{content}
			</motion.span>
		)
	}

	return (
		<span className={classes} {...sharedProps}>
			{content}
		</span>
	)
}
