import type { QuestComponentProps } from "./types"

export default function QuestStatus({ quest }: QuestComponentProps) {
	if (!quest.status) return null

	// Define status colors
	const statusColors = {
		active: {
			bg: "bg-green-100 dark:bg-green-900/20",
			text: "text-green-800 dark:text-green-300",
			border: "border-green-200 dark:border-green-800/30",
			icon: "text-green-500",
		},
		completed: {
			bg: "bg-blue-100 dark:bg-blue-900/20",
			text: "text-blue-800 dark:text-blue-300",
			border: "border-blue-200 dark:border-blue-800/30",
			icon: "text-blue-500",
		},
		failed: {
			bg: "bg-red-100 dark:bg-red-900/20",
			text: "text-red-800 dark:text-red-300",
			border: "border-red-200 dark:border-red-800/30",
			icon: "text-red-500",
		},
		available: {
			bg: "bg-amber-100 dark:bg-amber-900/20",
			text: "text-amber-800 dark:text-amber-300",
			border: "border-amber-200 dark:border-amber-800/30",
			icon: "text-amber-500",
		},
		unavailable: {
			bg: "bg-gray-100 dark:bg-gray-900/20",
			text: "text-gray-800 dark:text-gray-300",
			border: "border-gray-200 dark:border-gray-800/30",
			icon: "text-gray-500",
		},
	}

	// Normalize status to lowercase for comparison
	const normalizedStatus = quest.status.toLowerCase()

	// Get status colors or default to unavailable
	const statusColor =
		normalizedStatus === "active"
			? statusColors.active
			: normalizedStatus === "completed"
				? statusColors.completed
				: normalizedStatus === "failed"
					? statusColors.failed
					: normalizedStatus === "available"
						? statusColors.available
						: statusColors.unavailable

	// Get status icon
	const statusIcon =
		normalizedStatus === "active"
			? "⚔️"
			: normalizedStatus === "completed"
				? "✅"
				: normalizedStatus === "failed"
					? "❌"
					: normalizedStatus === "available"
						? "📋"
						: "⏳"

	return (
		<div
			className={`${statusColor.bg} p-4 rounded-lg border ${statusColor.border} shadow-sm`}
		>
			<div className="flex items-center mb-2">
				<span className={`${statusColor.icon} mr-2`}>{statusIcon}</span>
				<h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
					Status
				</h3>
			</div>
			<div className={`${statusColor.text} font-medium`}>{quest.status}</div>
		</div>
	)
}
