"use client"

import { Suspense, use } from "react"
import type { ChangeEvent } from "react"
import { useCampaignData } from "@/components/CampaignDataProvider"
import { useRouter, notFound } from "next/navigation"
import {
	LocationHeader,
	LocationDescription,
	LocationHistory,
	LocationFeatures,
	LocationDistricts,
	LocationAreas,
	LocationQuests,
	LocationNPCs,
	LocationFactions,
	LocationPointsOfInterest,
	LocationConnections,
} from "./components"

// Main page component
export default function LocationPage({ params }: { params: Promise<{ id: string }> }) {
	const { id: locationId } = use(params)

	const { locations: locationsDataArray } = useCampaignData()
	const router = useRouter()

	if (!locationsDataArray || locationsDataArray.length === 0) {
		notFound()
	}

	const locationsData = locationsDataArray[0]

	// Get all location IDs
	const locationIds = Object.keys(locationsData.locations)

	// Check if the location exists
	const locationExists = locationIds.includes(locationId)

	if (!locationExists) {
		// If location doesn't exist, redirect to the first location
		if (locationIds.length > 0) {
			router.push(`/locations/${locationIds[0]}`)
			return <div>Redirecting to valid location...</div>
		}
		// If no locations, show 404
		notFound()
	}

	const currentLocation = locationsData.locations[locationId]

	// Handle location change directly from the dropdown
	const handleLocationChange = (e: ChangeEvent<HTMLSelectElement>) => {
		const newLocationId = e.target.value
		router.push(`/locations/${newLocationId}`)
	}

	return (
		<Suspense fallback={<div>Loading location data...</div>}>
			<div className="container mx-auto p-4">
				<h1 className="text-2xl font-bold mb-4">Locations</h1>
				<article className="bg-white dark:bg-gray-900 rounded-lg shadow-md border dark:border-gray-800 transition-colors duration-300">
					<LocationHeader
						locationId={locationId}
						locationIds={locationIds}
						location={currentLocation}
						handleLocationChange={handleLocationChange}
					/>

					<main className="p-6 pt-2 space-y-6">
						<LocationDescription location={currentLocation} />
						<LocationHistory location={currentLocation} />
						<LocationFeatures location={currentLocation} />
						<LocationDistricts location={currentLocation} />
						<LocationAreas location={currentLocation} />
						<LocationQuests location={currentLocation} />
						<LocationNPCs location={currentLocation} />
						<LocationFactions location={currentLocation} />
						<LocationPointsOfInterest location={currentLocation} />
						<LocationConnections location={currentLocation} />
					</main>
				</article>
			</div>
		</Suspense>
	)
}
