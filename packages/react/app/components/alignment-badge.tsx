import * as React from "react"
import { Badge } from "~/components/ui/badge"
import { cn } from "~/lib/utils"
import * as Icons from "lucide-react"

export const alignments = [
	"lawful good",
	"neutral good",
	"chaotic good",
	"lawful neutral",
	"true neutral",
	"chaotic neutral",
	"lawful evil",
	"neutral evil",
	"chaotic evil",
] as const

export type Alignment = (typeof alignments)[number]

const alignmentConfig: Record<Alignment, { icon: React.ReactNode; color: string }> = {
	"lawful good": {
		icon: <Icons.Sun className="!size-4" />,
		color: "bg-blue-100 text-blue-900 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-900",
	},
	"neutral good": {
		icon: <Icons.Bird className="!size-4" />,
		color: "bg-green-100 text-green-900 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-900",
	},
	"chaotic good": {
		icon: <Icons.FlameKindling className="!size-4" />,
		color: "bg-cyan-100 text-cyan-900 border-cyan-200 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-900",
	},
	"lawful neutral": {
		icon: <Icons.Book className="!size-4" />,
		color: "bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900",
	},
	"true neutral": {
		icon: <Icons.Scale className="!size-4" />,
		color: "bg-gray-100 text-gray-900 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
	},
	"chaotic neutral": {
		icon: <Icons.Dice1 className="!size-4" />,
		color:
			"bg-orange-100 text-orange-900 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-900",
	},
	"lawful evil": {
		icon: <Icons.HandMetal className="!size-4" />,
		color:
			"bg-purple-100 text-purple-900 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-900",
	},
	"neutral evil": {
		icon: <Icons.Moon className="!size-4" />,
		color: "bg-pink-100 text-pink-900 border-pink-200 dark:bg-pink-950 dark:text-pink-300 dark:border-pink-900",
	},
	"chaotic evil": {
		icon: <Icons.Skull className="!size-4 overflow-visible" />,
		color: "bg-red-100 text-red-900 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-900",
	},
}

interface AlignmentBadgeProps {
	alignment: Alignment | string
	className?: string
}

export function AlignmentBadge({ alignment, className }: AlignmentBadgeProps) {
	const config = alignmentConfig[alignment]

	return (
		<Badge
			variant="outline"
			className={cn("capitalize flex items-center gap-1.5 px-2 py-0.5", config.color, className)}
		>
			{config.icon}
			{alignment}
		</Badge>
	)
}
