import React, { useState, useEffect } from "react";
import { trpc } from "@/trpc/client";
import { useCrossReference } from "../CrossReferenceContext";

interface LocationDisplayProps {
  locationId?: string;
  handleRef?: (path: string) => (el: HTMLElement | null) => void;
}

export default function LocationDisplay({
  locationId,
  handleRef = () => () => null,
}: LocationDisplayProps) {
  const { navigateToFile } = useCrossReference();
  const [selectedLocationId, setSelectedLocationId] = useState<
    string | undefined
  >(locationId);
  const [selectedType, setSelectedType] = useState<string>("all");

  // Fetch all locations
  const {
    data: locationsData,
    isLoading: isLoadingLocations,
    error: locationsError,
  } = trpc.locations.getAllLocations.useQuery(undefined, {
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Determine if the provided locationId is a file name rather than a location ID
  const isLocationFile = locationId && locationId.includes("locations");

  // Fetch specific location data if an ID is provided and it's not the locations file
  const {
    data: singleLocationData,
    isLoading: isLoadingSingleLocation,
    error: singleLocationError,
  } = trpc.locations.getLocationById.useQuery(selectedLocationId || "", {
    enabled: !!selectedLocationId && !isLocationFile,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Set the first location as selected if none is specified and we have locations data
  // OR if the provided locationId is the name of the locations file
  useEffect(() => {
    if (
      (!selectedLocationId || isLocationFile) &&
      locationsData?.locations &&
      locationsData.locations.length > 0
    ) {
      setSelectedLocationId(locationsData.locations[0].id);
    }
  }, [locationsData, selectedLocationId, isLocationFile]);

  // Handle location selection change
  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLocationId(e.target.value);
  };

  // Handle type filter change
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
  };

  // Filter locations by type
  const filteredLocations = locationsData?.locations
    ? selectedType === "all"
      ? locationsData.locations
      : locationsData.locations.filter(
          (location) => location.type === selectedType
        )
    : [];

  // Get unique location types
  const locationTypes = locationsData?.locations
    ? Array.from(
        new Set(locationsData.locations.map((location) => location.type))
      )
    : [];

  // Loading states
  if (isLoadingLocations) {
    return <div className="p-4 text-center">Loading locations...</div>;
  }

  // Error states
  if (locationsError) {
    return (
      <div className="p-4 text-center text-red-500">
        Error loading locations: {locationsError.message}
      </div>
    );
  }

  if (!locationsData || locationsData.locations.length === 0) {
    return (
      <div className="p-4 text-center">
        No location data available. Please check your YAML file.
      </div>
    );
  }

  // Loading specific location
  if (selectedLocationId && isLoadingSingleLocation) {
    return <div className="p-4 text-center">Loading location details...</div>;
  }

  // Error loading specific location
  if (selectedLocationId && singleLocationError) {
    return (
      <div className="p-4 text-center text-red-500">
        Error loading location: {singleLocationError.message}
      </div>
    );
  }

  // Handle the case where we have locations data but no specific location is selected or found
  const location = singleLocationData;

  if (
    !location &&
    locationsData?.locations &&
    locationsData.locations.length > 0
  ) {
    // If no specific location is found but we have location data, show the first location
    if (!isLoadingSingleLocation && selectedLocationId) {
      console.log(
        `Location ${selectedLocationId} not found, showing first available location`
      );
      // Set the first location as selected
      if (selectedLocationId !== locationsData.locations[0].id) {
        setSelectedLocationId(locationsData.locations[0].id);
        return (
          <div className="p-4 text-center">
            Loading first available location...
          </div>
        );
      }
    }
  }

  if (!location) {
    return (
      <div className="p-4 text-center">Select a location to view details</div>
    );
  }

  return (
    <article
      className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border dark:border-gray-800 transition-colors duration-300 p-6"
      ref={handleRef(`location-${location.id}`)}
    >
      <header className="mb-8">
        {/* Type and Location Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Type Filter */}
          <div>
            <label
              htmlFor="type-select"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Filter by Type
            </label>
            <select
              id="type-select"
              className="block w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 dark:text-gray-200"
              value={selectedType}
              onChange={handleTypeChange}
            >
              <option value="all">All Types</option>
              {locationTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Location Selection */}
          <div>
            <label
              htmlFor="location-select"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Select Location
            </label>
            <select
              id="location-select"
              className="block w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 dark:text-gray-200"
              value={selectedLocationId}
              onChange={handleLocationChange}
            >
              {filteredLocations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Title and Location Type */}
        <h1
          className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4 border-b pb-2 border-gray-200 dark:border-gray-700"
          ref={handleRef(`location-title-${location.id}`)}
          id={`location-${location.id}`}
        >
          {location.name}
        </h1>

        <div className="text-sm bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded text-indigo-700 dark:text-indigo-400 inline-block mb-4">
          Type: {location.type}
        </div>

        {/* Location Description */}
        <div className="bg-gray-50 dark:bg-gray-800/30 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-4">
          <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
            Description
          </h3>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {location.description}
          </p>
        </div>
      </header>

      <main className="space-y-8">
        {/* Districts Section */}
        {location.districts && Object.keys(location.districts).length > 0 && (
          <div className="bg-white dark:bg-gray-800/20 p-4 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Districts
            </h2>
            <div className="space-y-6">
              {Object.entries(location.districts).map(([id, district]) => (
                <div
                  key={id}
                  className="border-l-4 border-indigo-500 dark:border-indigo-600 pl-4 py-2"
                >
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    {id
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </h3>

                  {/* District Description */}
                  <div className="mb-4 text-gray-700 dark:text-gray-300">
                    {district.description}
                  </div>

                  {/* Features */}
                  {district.features && district.features.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Features:
                      </h4>
                      <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-400">
                        {district.features.map((feature, idx) => (
                          <li key={idx}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* NPCs */}
                  {district.npcs && district.npcs.length > 0 && (
                    <div>
                      <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
                        NPCs:
                      </h4>
                      <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-400">
                        {district.npcs.map((npc, idx) => (
                          <li
                            key={idx}
                            className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                            onClick={() =>
                              navigateToFile(
                                `${npc
                                  .split(" - ")[0]
                                  .toLowerCase()
                                  .replace(/\s+/g, "-")}.yaml`
                              )
                            }
                          >
                            {npc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Areas Section */}
        {location.areas && Object.keys(location.areas).length > 0 && (
          <div className="bg-white dark:bg-gray-800/20 p-4 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Areas
            </h2>
            <div className="space-y-6">
              {Object.entries(location.areas).map(([id, area]) => (
                <div
                  key={id}
                  className="border-l-4 border-emerald-500 dark:border-emerald-600 pl-4 py-2"
                >
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    {id
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </h3>

                  {/* Area Description */}
                  <div className="mb-4 text-gray-700 dark:text-gray-300">
                    {area.description}
                  </div>

                  {/* Features */}
                  {area.features && area.features.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Features:
                      </h4>
                      <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-400">
                        {area.features.map((feature, idx) => (
                          <li key={idx}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Encounters */}
                  {area.encounters && area.encounters.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Encounters:
                      </h4>
                      <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-400">
                        {area.encounters.map((encounter, idx) => (
                          <li key={idx}>{encounter}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Treasure */}
                  {area.treasure && area.treasure.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Treasure:
                      </h4>
                      <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-400">
                        {area.treasure.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* NPCs */}
                  {area.npcs && area.npcs.length > 0 && (
                    <div>
                      <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
                        NPCs:
                      </h4>
                      <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-400">
                        {area.npcs.map((npc, idx) => (
                          <li
                            key={idx}
                            className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                            onClick={() =>
                              navigateToFile(
                                `${npc
                                  .split(" - ")[0]
                                  .toLowerCase()
                                  .replace(/\s+/g, "-")}.yaml`
                              )
                            }
                          >
                            {npc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quests Section */}
        {location.quests && Object.keys(location.quests).length > 0 && (
          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md border border-amber-100 dark:border-amber-800/50">
            <h2 className="text-2xl font-semibold text-amber-700 dark:text-amber-300 mb-4">
              Quests
            </h2>
            <div className="space-y-6">
              {Object.entries(location.quests).map(([id, quest]) => (
                <div
                  key={id}
                  className="bg-white dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700"
                >
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    {quest.title}
                  </h3>

                  <div className="mb-2 text-sm text-indigo-600 dark:text-indigo-400">
                    Quest Giver:
                    <span
                      className="ml-1 cursor-pointer hover:underline"
                      onClick={() =>
                        navigateToFile(
                          `${quest.quest_giver
                            .toLowerCase()
                            .replace(/\s+/g, "-")}.yaml`
                        )
                      }
                    >
                      {quest.quest_giver}
                    </span>
                  </div>

                  <div className="mb-4 text-gray-700 dark:text-gray-300">
                    {quest.description}
                  </div>

                  {/* Rewards */}
                  {quest.rewards && quest.rewards.length > 0 && (
                    <div>
                      <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Rewards:
                      </h4>
                      <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-400">
                        {quest.rewards.map((reward, idx) => (
                          <li key={idx}>{reward}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </article>
  );
}
