"use client"

import { useCampaignData } from "@/components/CampaignDataProvider"
import LocationDisplay from "@/components/content-types/LocationDisplay"
import { notFound } from "next/navigation"
import { type LocationsFile } from "@/server/schemas"

interface LocationDisplayClientProps {
	locationId?: string
	locationType?: string
}

export default function LocationDisplayClient({
	locationId,
	locationType,
}: LocationDisplayClientProps) {
	const { locations } = useCampaignData()

	if (!locations || locations.length === 0) {
		return <div>No locations data available</div>
	}

	const locationData = locations[0] as LocationsFile

	// If a specific location ID is provided, verify it exists
	if (locationId) {
		const location = locationData.locations.find(
			(location) =>
				location.id === locationId ||
				location.id?.toLowerCase() === locationId.toLowerCase(),
		)

		if (!location) {
			notFound()
		}
	}

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Locations</h1>
			<LocationDisplay
				locationId={locationId}
				currentLocationType={locationType}
				locationsData={locationData}
				initialLocationData={
					locationId
						? locationData.locations.find(
								(location) =>
									location.id === locationId ||
									location.id?.toLowerCase() === locationId.toLowerCase(),
							)
						: null
				}
			/>
		</div>
	)
}
