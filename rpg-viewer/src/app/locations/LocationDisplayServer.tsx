"use server"

import { Suspense } from "react"
import { getDataByType } from "@/server/utils/contentUtils"
import { LocationsFileSchema } from "@/server/schemas"
import LocationDisplay from "@/components/content-types/LocationDisplay"
import { logger } from "@/utils/logger"
import { notFound } from "next/navigation"

interface LocationDisplayServerProps {
	locationId?: string
	locationType?: string
}

export default async function LocationDisplayServer({
	locationId,
	locationType,
}: LocationDisplayServerProps = {}) {
	logger.debug.data("Loading locations data in LocationDisplayServer", {
		locationId,
		locationType,
	})

	try {
		// Load all locations data
		const locationsDataArray = await getDataByType(
			"locations",
			LocationsFileSchema,
			"shattered-spire",
		)

		if (!locationsDataArray || locationsDataArray.length === 0) {
			logger.warn.data("No locations data available")
			return <div>No locations data available</div>
		}

		const locationsData = locationsDataArray[0] // Get first item from array

		// If a specific location ID is provided, verify it exists
		if (locationId) {
			const locationData = locationsData.locations.find(
				(location) =>
					location.id === locationId ||
					location.id?.toLowerCase() === locationId.toLowerCase(),
			)

			if (!locationData) {
				logger.warn.data(`Location with ID ${locationId} not found in data`)
				notFound()
			} else {
				logger.debug.data("Found specific location data", {
					locationId,
					locationType: locationData?.type,
				})
			}
		}

		logger.debug.data("LocationDisplayServer ready", {
			locationCount: locationsData.locations.length,
			hasSelectedLocation: !!locationId,
		})

		return (
			<div className="container mx-auto p-4">
				<h1 className="text-2xl font-bold mb-4">Locations</h1>
				<Suspense fallback={<div>Loading locations...</div>}>
					<LocationDisplay
						locationId={locationId}
						currentLocationType={locationType}
						locationsData={locationsData}
						initialLocationData={
							locationId
								? locationsData.locations.find(
										(location) =>
											location.id === locationId ||
											location.id?.toLowerCase() === locationId.toLowerCase(),
									)
								: null
						}
					/>
				</Suspense>
			</div>
		)
	} catch (error) {
		logger.error.data("Error in LocationDisplayServer", error)
		return <div>Error loading locations: {(error as Error).message}</div>
	}
}
