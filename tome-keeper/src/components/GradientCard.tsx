import type { ReactNode } from "react"
import { motion } from "framer-motion"

// Color theme presets for easy usage
export type ColorTheme =
	| "blue" // Default blue-cyan-teal
	| "green" // Green-emerald-teal
	| "purple" // Purple-violet-indigo
	| "amber" // Amber-orange-yellow
	| "red" // Red-rose-orange
	| "gray" // Gray scale
	| "cyan" // Cyan-sky-blue
	| "pink" // Pink-fuchsia-rose

// Props for the GradientCard component
export interface GradientCardProps {
	// Content props
	headerContent: ReactNode
	children: ReactNode

	// Style customization
	colorTheme?: ColorTheme
	customGradient?: string // For completely custom gradients
	customHeaderClass?: string
	customBodyClass?: string

	// Optional animation controls
	animate?: boolean
}

// Map of color themes to their corresponding gradient and border classes
const themeMap: Record<
	ColorTheme,
	{
		gradient: string
		border: string
		iconColor: string
		titleColor: string
	}
> = {
	blue: {
		gradient:
			"from-indigo-50/80 via-blue-50/80 to-indigo-100/70 dark:from-indigo-900/40 dark:via-blue-900/40 dark:to-indigo-800/30",
		border: "border-indigo-200/50 dark:border-indigo-700/50",
		iconColor: "text-teal-300",
		titleColor: "text-gray-800 dark:text-teal-300",
	},
	green: {
		gradient:
			"from-green-50/60 via-emerald-50/60 to-green-100/60 dark:from-green-900/30 dark:via-emerald-900/30 dark:to-green-800/20",
		border: "border-green-200/50 dark:border-green-800/50",
		iconColor: "text-green-500",
		titleColor: "text-gray-800 dark:text-green-200",
	},
	purple: {
		gradient:
			"from-indigo-50/80 via-purple-50/80 to-indigo-100/70 dark:from-indigo-900/40 dark:via-purple-900/40 dark:to-indigo-800/30",
		border: "border-indigo-200/50 dark:border-indigo-700/50",
		iconColor: "text-violet-500",
		titleColor: "text-gray-800 dark:text-violet-200",
	},
	amber: {
		gradient:
			"from-amber-50/60 via-orange-50/60 to-amber-100/60 dark:from-amber-800/30 dark:via-orange-800/30 dark:to-amber-700/20",
		border: "border-amber-200/50 dark:border-amber-700/50",
		iconColor: "text-amber-500",
		titleColor: "text-gray-800 dark:text-amber-200",
	},
	red: {
		gradient:
			"from-red-50/60 via-rose-50/60 to-red-100/60 dark:from-red-900/30 dark:via-rose-900/30 dark:to-red-800/20",
		border: "border-red-200/50 dark:border-red-700/50",
		iconColor: "text-rose-500",
		titleColor: "text-gray-800 dark:text-rose-200",
	},
	gray: {
		gradient:
			"from-gray-50/60 via-gray-100/60 to-gray-200/60 dark:from-gray-700/30 dark:via-gray-600/30 dark:to-gray-500/20",
		border: "border-gray-300/50 dark:border-gray-500/50",
		iconColor: "text-gray-500",
		titleColor: "text-gray-800 dark:text-gray-200",
	},
	cyan: {
		gradient:
			"from-cyan-50/80 via-sky-50/80 to-indigo-100/70 dark:from-cyan-900/40 dark:via-sky-900/40 dark:to-indigo-800/30",
		border: "border-sky-200/50 dark:border-sky-700/50",
		iconColor: "text-sky-500",
		titleColor: "text-gray-800 dark:text-sky-200",
	},
	pink: {
		gradient:
			"from-pink-50/60 via-fuchsia-50/60 to-pink-100/60 dark:from-pink-900/30 dark:via-fuchsia-900/30 dark:to-pink-800/20",
		border: "border-pink-200/50 dark:border-pink-700/50",
		iconColor: "text-pink-500",
		titleColor: "text-gray-800 dark:text-pink-200",
	},
}

export function GradientCard({
	headerContent,
	children,
	colorTheme = "blue",
	customGradient,
	customHeaderClass,
	customBodyClass,
	animate = true,
}: GradientCardProps) {
	const theme = themeMap[colorTheme]

	// Determine gradient class - either custom or from theme
	const gradientClass = customGradient || `bg-gradient-to-r ${theme.gradient}`

	// Build header class with either custom class or theme-based styling
	const headerClass =
		customHeaderClass ||
		`flex items-center justify-between p-4 border-b ${theme.border} ${gradientClass} backdrop-blur-md`

	// Animation components based on animate prop
	const ContentWrapper = animate ? motion.div : "div"
	const ListWrapper = animate ? motion.ul : "ul"
	const ListItem = animate ? motion.li : "li"

	return (
		<div className="bg-white/40 dark:bg-gray-800/40 rounded-lg border border-gray-200/70 dark:border-gray-700/50 shadow-lg backdrop-blur-md overflow-hidden">
			<div className={headerClass}>{headerContent}</div>

			<div className={`p-4 ${customBodyClass || ""}`}>
				<ContentWrapper
					{...(animate
						? {
								initial: { opacity: 0 },
								animate: { opacity: 1 },
								transition: { duration: 0.3 },
							}
						: {})}
				>
					{children}
				</ContentWrapper>
			</div>
		</div>
	)
}

// Helper function to create a standard header with icon and title
export function createCardHeader(
	title: string,
	icon: ReactNode,
	colorTheme: ColorTheme = "blue",
	rightContent?: ReactNode,
) {
	const theme = themeMap[colorTheme]

	return (
		<div className="flex items-center justify-between w-full">
			<div className="flex items-center">
				{icon && <span className={`${theme.iconColor} mr-2 text-xl`}>{icon}</span>}
				{title && <h2 className={`text-xl font-semibold ${theme.titleColor}`}>{title}</h2>}
			</div>
			{rightContent}
		</div>
	)
}
