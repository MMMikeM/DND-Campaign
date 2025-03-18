"use client"

import { redirect } from "next/navigation"
import { useCampaignData } from "@/components/CampaignDataProvider"
import { use } from "react"

export default function LocationsPage() {
	const { locations: locationsDataArray } = useCampaignData()

	// If we have locations, redirect to the first one
	if (locationsDataArray && locationsDataArray.length > 0) {
		const locationsData = locationsDataArray[0]
		const locationIds = Object.keys(locationsData.locations)

		if (locationIds.length > 0) {
			redirect(`/locations/${locationIds[0]}`)
		}
	}

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Locations</h1>
			<div className="bg-white dark:bg-gray-900 rounded-lg shadow-md border dark:border-gray-800 p-8 text-center">
				<div className="animate-pulse">
					<p className="text-gray-600 dark:text-gray-400">
						{locationsDataArray && locationsDataArray.length > 0
							? "Redirecting to location..."
							: "No locations found."}
					</p>
				</div>
			</div>
		</div>
	)
}
