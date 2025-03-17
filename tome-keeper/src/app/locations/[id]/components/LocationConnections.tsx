import { idToName } from "@/server/utils/contentUtils"
import type { Location } from "./types"
import Link from "next/link"

// Connections section component
export function LocationConnections({
	location,
}: {
	location: Location
}) {
	if (!location.connections || location.connections.length === 0) return null

	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden mb-6">
			<div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
				<span className="text-gray-500 mr-2">🔄</span>
				<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
					Connected Locations
				</h2>
			</div>
			<div className="p-4">
				<ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
					{location.connections.map((connection) => (
						<li key={`connection-${connection}`} className="relative">
							<Link
								href={`/locations/${connection}`}
								className="block w-full text-left p-2 rounded-md bg-green-50 dark:bg-green-900/10 hover:bg-green-100 dark:hover:bg-green-900/20 border border-green-100 dark:border-green-800/30 transition-colors flex items-center text-green-700 dark:text-green-300"
							>
								<span className="mr-2">📍</span>
								{idToName(connection)}
							</Link>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}
