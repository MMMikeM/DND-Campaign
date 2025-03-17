import { idToName } from "@/server/utils/contentUtils"
import type { Location } from "./types"
import Link from "next/link"

// NPCs section component
export function LocationNPCs({
	location,
}: {
	location: Location
}) {
	if (!location.npcs || location.npcs.length === 0) return null

	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden mb-6">
			<div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
				<span className="text-gray-500 mr-2">👤</span>
				<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
					NPCs
				</h2>
			</div>
			<div className="p-4">
				<ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
					{location.npcs.map((npc) => (
						<li key={`npc-${npc}`} className="relative">
							<Link
								href={`/npcs/${npc}`}
								className="block w-full text-left p-2 rounded-md bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 transition-colors flex items-center text-blue-700 dark:text-blue-300"
							>
								<span className="mr-2">👤</span>
								{idToName(npc)}
							</Link>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}

// Factions section component
export function LocationFactions({
	location,
}: {
	location: Location
}) {
	if (!location.factions || location.factions.length === 0) return null

	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden mb-6">
			<div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
				<span className="text-gray-500 mr-2">🏛️</span>
				<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
					Factions
				</h2>
			</div>
			<div className="p-4">
				<ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
					{location.factions.map((faction) => (
						<li key={`faction-${faction}`} className="relative">
							<Link
								href={`/factions/${faction}`}
								className="block w-full text-left p-2 rounded-md bg-amber-50 dark:bg-amber-900/10 hover:bg-amber-100 dark:hover:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 transition-colors flex items-center text-amber-700 dark:text-amber-300"
							>
								<span className="mr-2">🏛️</span>
								{idToName(faction)}
							</Link>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}
