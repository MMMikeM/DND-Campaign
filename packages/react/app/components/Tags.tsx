import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "~/lib/utils"

const tagVariants = cva("inline-flex items-center px-2 py-1 text-xs font-medium rounded-md", {
	variants: {
		variant: {
			default: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
			primary: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
			secondary: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
			success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
			warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
			destructive: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
		},
	},
	defaultVariants: {
		variant: "default",
	},
})

interface TagsProps extends VariantProps<typeof tagVariants> {
	tags: string[]
	className?: string
	maxDisplay?: number
	showCount?: boolean
}

export function Tags({ tags, variant, className, maxDisplay, showCount = true }: TagsProps) {
	if (!tags || tags.length === 0) {
		return null
	}

	const displayTags = maxDisplay ? tags.slice(0, maxDisplay) : tags
	const remainingCount = maxDisplay && tags.length > maxDisplay ? tags.length - maxDisplay : 0

	const uniqueTags = [...new Set(displayTags)]

	return (
		<div className={cn("flex flex-wrap gap-1", className)}>
			{uniqueTags.map((tag) => (
				<span key={`${tag}`} className={tagVariants({ variant })}>
					{tag}
				</span>
			))}
			{remainingCount > 0 && showCount && (
				<span className={tagVariants({ variant: "secondary" })}>+{remainingCount} more</span>
			)}
		</div>
	)
}
