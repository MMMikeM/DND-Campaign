import type { Location } from "./types"

// Description section component
export function LocationDescription({ location }: { location: Location }) {
	if (!location.description) return null

	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden mb-6">
			<div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
				<span className="text-gray-500 mr-2">📝</span>
				<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
					Description
				</h2>
			</div>
			<div className="p-4">
				<p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
					{location.description}
				</p>
			</div>
		</div>
	)
}

// History section component
export function LocationHistory({ location }: { location: Location }) {
	if (!location.history) return null

	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden mb-6">
			<div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
				<span className="text-gray-500 mr-2">📜</span>
				<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
					History
				</h2>
			</div>
			<div className="p-4">
				<p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
					{location.history}
				</p>
			</div>
		</div>
	)
}

// Notable Features section component
export function LocationFeatures({ location }: { location: Location }) {
	if (!location.notable_features || location.notable_features.length === 0)
		return null

	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden mb-6">
			<div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
				<span className="text-gray-500 mr-2">✨</span>
				<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
					Notable Features
				</h2>
			</div>
			<div className="p-4">
				<ul className="space-y-2 dark:text-gray-300">
					{location.notable_features.map((feature) => (
						<li
							key={`feature-${feature.substring(0, 20)}`}
							className="flex items-start"
						>
							<span className="text-gray-400 mr-2 mt-1">•</span>
							<span>{feature}</span>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}
