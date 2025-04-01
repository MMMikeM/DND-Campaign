import * as React from "react"
import * as Icons from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { cn } from "~/lib/utils"

interface InfoCardProps {
	title: string
	icon: React.ReactNode
	children?: React.ReactNode
	className?: string
	emptyMessage?: string
}

/**
 * Versatile card component for displaying information with a title and optional empty state
 */
export function InfoCard({
	title,
	icon,
	children,
	className,
	emptyMessage = `No ${title?.toLowerCase?.() || "information"} available.`,
}: InfoCardProps) {
	return (
		<Card className={cn("overflow-hidden", className)}>
			<CardHeader className="bg-slate-50 dark:bg-slate-800 border-b">
				<CardTitle className="flex items-center gap-2">
					{icon}
					{title}
				</CardTitle>
			</CardHeader>
			<CardContent className={cn("px-6 py-4")}>
				{children ?? (
					<div className={cn("text-muted-foreground py-8 flex flex-col items-center justify-center")}>
						<Icons.AlertCircle className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
						<p>{emptyMessage}</p>
					</div>
				)}
			</CardContent>
		</Card>
	)
}
