import type { Location } from "./types"

// Points of Interest section component
export function LocationPointsOfInterest({ location }: { location: Location }) {
	if (!location.points_of_interest || location.points_of_interest.length === 0)
		return null

	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden mb-6">
			<div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
				<span className="text-gray-500 mr-2">🔍</span>
				<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
					Points of Interest
				</h2>
			</div>
			<div className="p-4 grid grid-cols-1 gap-4">
				{location.points_of_interest.map((poi) => (
					<div
						key={`poi-${poi.name || poi.description?.substring(0, 20) || Math.random().toString(36).substring(2, 9)}`}
						className="p-3 bg-gray-50 dark:bg-gray-800/40 rounded-md border border-gray-200 dark:border-gray-700"
					>
						{poi.name && (
							<h3 className="font-semibold text-gray-800 dark:text-gray-200">
								{poi.name}
							</h3>
						)}
						{poi.description && (
							<p className="text-gray-700 dark:text-gray-300 mt-1">
								{poi.description}
							</p>
						)}
					</div>
				))}
			</div>
		</div>
	)
}
