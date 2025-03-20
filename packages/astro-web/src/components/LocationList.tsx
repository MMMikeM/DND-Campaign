import { useState, useEffect } from "react"
import type { Location } from "../lib/db/schema"
import { LocationApi } from "../lib/db/api"

interface LocationListProps {
	onSelectLocation?: (location: Location) => void
}

export default function LocationList({ onSelectLocation }: LocationListProps) {
	const [locations, setLocations] = useState<Location[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		async function fetchLocations() {
			try {
				setLoading(true)
				const data = await LocationApi.getAll()
				setLocations(data)
				setError(null)
			} catch (err) {
				console.error("Error fetching locations:", err)
				setError("Failed to load locations. Please try again later.")
			} finally {
				setLoading(false)
			}
		}

		fetchLocations()
	}, [])

	if (loading) {
		return <div className="p-4 text-center">Loading locations...</div>
	}

	if (error) {
		return <div className="p-4 text-red-500">{error}</div>
	}

	if (locations.length === 0) {
		return <div className="p-4 text-center">No locations found.</div>
	}

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{locations.map((location) => (
				<div
					key={location.id}
					className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
					onClick={() => onSelectLocation?.(location)}
				>
					<h3 className="text-lg font-semibold">{location.name}</h3>
					<div className="text-sm text-gray-500 mb-2">
						{location.type} {location.region && `• ${location.region}`}
					</div>
					<p className="text-sm line-clamp-3">{location.description}</p>

					{location.notableFeatures && location.notableFeatures.length > 0 && (
						<div className="mt-2">
							<span className="text-xs font-medium">Notable Features:</span>
							<div className="flex flex-wrap gap-1 mt-1">
								{location.notableFeatures.map((feature, index) => (
									<span
										key={index}
										className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded"
									>
										{feature}
									</span>
								))}
							</div>
						</div>
					)}
				</div>
			))}
		</div>
	)
}
