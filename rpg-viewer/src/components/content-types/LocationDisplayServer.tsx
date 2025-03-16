// This is a server component that loads Location data
'use server';

import { getLocationsData } from "@/server/utils/locations";
import LocationDisplay from "./LocationDisplay";
import { logger } from "@/utils/logger";

interface LocationDisplayServerProps {
  locationId?: string;
  locationType?: string;
}

export default async function LocationDisplayServer({
  locationId,
  locationType,
}: LocationDisplayServerProps) {
  logger.debug.data("Loading locations data in LocationDisplayServer", { locationId, locationType });
  
  try {
    // Load all locations data
    const locationsDataArray = await getLocationsData();
    
    if (!locationsDataArray || locationsDataArray.length === 0) {
      logger.warn.data("No locations data available");
      return <div>No locations data available</div>;
    }
    
    const locationsData = locationsDataArray[0]; // Get first item from array
    
    // If a specific location ID is provided, find that location's data
    let locationData: any = null;
    if (locationId) {
      locationData = locationsData.locations.find((location: any) => 
        location.id === locationId || 
        (location.id?.toLowerCase() === locationId.toLowerCase())
      ) || null;
      
      if (locationData) {
        logger.debug.data("Found specific location data", { 
          locationId, 
          locationType: locationData?.type 
        });
      } else {
        logger.warn.data(`Location with ID ${locationId} not found in data`);
      }
    }
    
    logger.debug.data("LocationDisplayServer ready", { 
      locationCount: locationsData.locations.length,
      hasSelectedLocation: !!locationData
    });

    return (
      <LocationDisplay
        locationId={locationId}
        currentLocationType={locationType}
        locationsData={locationsData}
        initialLocationData={locationData}
      />
    );
  } catch (error) {
    logger.error.data("Error in LocationDisplayServer", error);
    return <div>Error loading locations: {(error as Error).message}</div>;
  }
} 