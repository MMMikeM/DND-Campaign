import * as Icons from "lucide-react"
import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { cn } from "~/lib/utils"
import { Optional } from "./Optional"

interface InfoCardProps {
	title: string
	icon: React.ReactNode
	children?: React.ReactNode
	className?: string
	emptyMessage?: string
	contentClassName?: string
	description?: string
}

/**
 * Versatile card component for displaying information with a title and optional empty state
 */
export function InfoCard({
	title,
	icon,
	children,
	className,
	contentClassName,
	emptyMessage = `No ${title?.toLowerCase?.() || "information"} available.`,
	description,
}: InfoCardProps) {
	const isEmpty =
		!children ||
		(Array.isArray(children) && children.length === 0) ||
		(Array.isArray(children) && children.every((child) => child == null))

	return (
		<Card className={cn("overflow-hidden", className)}>
			<CardHeader className="bg-slate-50 dark:bg-slate-800 border-b">
				<CardTitle className="flex items-center gap-2">
					{icon}
					{title}
				</CardTitle>
				{description && <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription>}
			</CardHeader>
			<CardContent className={cn("px-6 py-4", contentClassName)}>
				<Optional
					fallback={
						<div className={cn("text-muted-foreground py-8 flex flex-col items-center justify-center")}>
							<Icons.AlertCircle className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
							<p>{emptyMessage}</p>
						</div>
					}
				>
					{children}
				</Optional>
			</CardContent>
		</Card>
	)
}
