import type { QuestLocationProps } from "./types"

export default function QuestLocation({
	quest,
	navigateToFile,
}: QuestLocationProps) {
	if (!quest.location) return null

	const handleLocationClick = () => {
		// Convert location name to slug format for navigation
		const locationSlug = quest.location
			?.toLowerCase()
			.replace(/\s+/g, "-")
			.replace(/[^\w-]+/g, "")

		if (locationSlug) {
			navigateToFile(`/locations/${locationSlug}`)
		}
	}

	return (
		<div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800/30 shadow-sm">
			<div className="flex items-center mb-2">
				<span className="text-emerald-500 mr-2">📍</span>
				<h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-400">
					Location
				</h3>
			</div>
			<button
				type="button"
				className="text-gray-800 dark:text-gray-200 cursor-pointer hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors bg-transparent border-none p-0 text-left w-full"
				onClick={handleLocationClick}
			>
				{quest.location}
			</button>
		</div>
	)
}
