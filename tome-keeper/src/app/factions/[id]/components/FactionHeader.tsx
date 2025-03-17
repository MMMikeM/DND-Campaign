import type { ChangeEvent } from "react"
import { idToName } from "@/server/utils/contentUtils"
import type { Faction } from "./types"
import { getFactionTypeStyle } from "./utils"

interface FactionHeaderProps {
	factionId: string
	factionIds: string[]
	faction: Faction
	handleFactionChange: (e: ChangeEvent<HTMLSelectElement>) => void
}

export function FactionHeader({
	factionId,
	factionIds,
	faction,
	handleFactionChange,
}: FactionHeaderProps) {
	const typeStyle = getFactionTypeStyle(faction.type ?? "default")

	return (
		<header className="relative">
			{/* Faction selector */}
			<div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-t-lg border-b border-gray-200 dark:border-gray-700">
				<select
					value={factionId}
					onChange={handleFactionChange}
					className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
				>
					{factionIds.map((id) => (
						<option key={id} value={id}>
							{idToName(id)}
						</option>
					))}
				</select>
			</div>

			{/* Improved faction title bar with badge */}
			<div className="p-6 pb-4 flex items-start justify-between">
				<div className="flex-1">
					<h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-1">
						{idToName(factionId)}
					</h1>

					{faction.type && (
						<div className="flex items-center mt-2">
							<span
								className={[
									"inline-flex",
									"items-center",
									"px-3",
									"py-1",
									"rounded-full",
									"text-sm",
									"font-medium",
									typeStyle.bgClass,
									typeStyle.textClass,
								].join(" ")}
							>
								<span className="mr-1">{typeStyle.icon}</span> {faction.type}
							</span>
						</div>
					)}
				</div>
			</div>
		</header>
	)
}
