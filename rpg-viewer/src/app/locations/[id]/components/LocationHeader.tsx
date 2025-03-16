import type { ChangeEvent } from "react"
import { formatName, getLocationTypeStyle } from "./types"
import type { Location } from "./types"

// Header component with location selector and title
export function LocationHeader({
	location,
	locationId,
	locationIds,
	handleLocationChange,
}: {
	location: Location
	locationId: string
	locationIds: string[]
	handleLocationChange: (e: ChangeEvent<HTMLSelectElement>) => void
}) {
	const typeStyle = getLocationTypeStyle(location.type || "default")

	return (
		<header className="relative">
			{/* Location selector */}
			<div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-t-lg border-b border-gray-200 dark:border-gray-700">
				<div>
					<label
						htmlFor="location-select"
						className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
					>
						Location
					</label>
					<select
						id="location-select"
						value={locationId}
						onChange={handleLocationChange}
						className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					>
						{locationIds.map((id) => (
							<option key={id} value={id}>
								{location.name || formatName(id)}
							</option>
						))}
					</select>
				</div>
			</div>

			{/* Improved location title bar with badge */}
			<div className="p-6 pb-4 flex items-start justify-between">
				<div className="flex-1">
					<h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-1">
						{location.name || formatName(locationId)}
					</h1>

					{location.type && (
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
								<span className="mr-1">{typeStyle.icon}</span> {location.type}
							</span>

							{location.danger_level && (
								<span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
									<span className="mr-1">⚠️</span> {location.danger_level}
								</span>
							)}

							{location.faction_control && (
								<span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
									<span className="mr-1">🏛️</span>{" "}
									{formatName(location.faction_control)}
								</span>
							)}
						</div>
					)}
				</div>
			</div>
		</header>
	)
}
