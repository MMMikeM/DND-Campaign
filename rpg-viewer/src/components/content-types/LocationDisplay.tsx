"use client";

import { useState, useEffect } from "react";
import { useCrossReference } from "../CrossReferenceContext";

// Custom icon components
const MapIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={1.5}
		stroke="currentColor"
		className="w-5 h-5 text-indigo-400"
		aria-hidden="true"
		role="img"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
		/>
	</svg>
);

const BuildingIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={1.5}
		stroke="currentColor"
		className="w-5 h-5 text-indigo-400"
		aria-hidden="true"
		role="img"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
		/>
	</svg>
);

const LandscapeIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={1.5}
		stroke="currentColor"
		className="w-5 h-5 text-blue-400"
		aria-hidden="true"
		role="img"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
		/>
	</svg>
);

const QuestIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={1.5}
		stroke="currentColor"
		className="w-5 h-5 text-amber-400"
		aria-hidden="true"
		role="img"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
		/>
	</svg>
);

const FeatureIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={1.5}
		stroke="currentColor"
		className="w-5 h-5 text-indigo-400"
		aria-hidden="true"
		role="img"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
		/>
	</svg>
);

const NPCIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={1.5}
		stroke="currentColor"
		className="w-5 h-5 text-indigo-400"
		aria-hidden="true"
		role="img"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
		/>
	</svg>
);

const EncounterIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={1.5}
		stroke="currentColor"
		className="w-5 h-5 text-emerald-400"
		aria-hidden="true"
		role="img"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"
		/>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z"
		/>
	</svg>
);

const TreasureIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={1.5}
		stroke="currentColor"
		className="w-5 h-5 text-emerald-400"
		aria-hidden="true"
		role="img"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
		/>
	</svg>
);

const RewardIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={1.5}
		stroke="currentColor"
		className="w-5 h-5 text-amber-400"
		aria-hidden="true"
		role="img"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
		/>
	</svg>
);

// Format name function to properly capitalize
const formatName = (name: string) => {
	return name
		.split(/[-_]/)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
};

// Updated interface to accept data as props
interface LocationDisplayProps {
	locationId?: string;
	handleRef?: (path: string) => (el: HTMLElement | null) => void;
	locationsData: {
		locations: {
			id: string;
			name: string;
			type: string;
			description: string;
			notable_features?: string[];
			history?: string;
			secrets?: string[];
			npcs?: string[];
			quests?: string[];
			encounters?: {
				type: string;
				description: string;
			}[];
			loot?: string[];
			connected_locations?: string[];
			parent_location?: string;
			sub_locations?: string[];
		}[];
		title?: string;
		version?: string;
		description?: string;
	};
	initialLocationData: any | null;
	currentLocationType?: string;
}

export default function LocationDisplay({
	locationId,
	handleRef = () => () => null,
	locationsData,
	initialLocationData,
	currentLocationType: externalLocationType,
}: LocationDisplayProps) {
	const { navigateToFile } = useCrossReference();
	const [selectedLocationId, setSelectedLocationId] = useState<string | undefined>(
		locationId,
	);
	const [selectedType, setSelectedType] = useState<string | undefined>(
		externalLocationType || "all",
	);
	const [singleLocationData, setSingleLocationData] = useState<any | null>(initialLocationData);

	// Extract all available location types from data
	const locationTypes = [
		"all",
		...new Set(
			locationsData?.locations.map((location) => location.type.toLowerCase()),
		),
	];

	// Update the selected type when externalLocationType changes
	useEffect(() => {
		if (externalLocationType) {
			setSelectedType(externalLocationType.toLowerCase());
		}
	}, [externalLocationType]);

	// Set the first location as selected if none is specified and we have locations data
	useEffect(() => {
		if (!selectedLocationId && locationsData?.locations && locationsData.locations.length > 0) {
			// Filter locations by selected type if not "all"
			const filteredLocations =
				selectedType && selectedType !== "all"
					? locationsData.locations.filter(
							(loc) => loc.type.toLowerCase() === selectedType.toLowerCase(),
					  )
					: locationsData.locations;

			// If we have filtered locations, select the first one
			if (filteredLocations.length > 0) {
				setSelectedLocationId(filteredLocations[0].id);
			} else if (locationsData.locations.length > 0) {
				// If no filtered locations, select the first overall location
				setSelectedLocationId(locationsData.locations[0].id);
			}
		}
	}, [locationsData, selectedLocationId, selectedType]);

	// Update the displayed location when selection changes
	useEffect(() => {
		if (selectedLocationId) {
			// Find the location in the data we already have
			const foundLocation = locationsData?.locations?.find(l => l.id === selectedLocationId);
			if (foundLocation) {
				setSingleLocationData(foundLocation);
			} else if (initialLocationData && initialLocationData.id === selectedLocationId) {
				setSingleLocationData(initialLocationData);
			}
		}
	}, [selectedLocationId, locationsData, initialLocationData]);

	const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newLocationId = e.target.value;
		setSelectedLocationId(newLocationId);
		
		// For client-side navigation, we redirect to the new location page
		// This will trigger a server-side load of the new location data
		if (typeof window !== 'undefined') {
			const currentTypePath = selectedType && selectedType !== 'all'
				? `/locations/${selectedType.toLowerCase().replace(/\s+/g, '-')}`
				: '/locations';
			window.location.href = `${currentTypePath}/${newLocationId}`;
		}
	};

	const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newType = e.target.value;
		setSelectedType(newType);
		setSelectedLocationId(undefined); // Reset selected location when type changes
		
		// For client-side navigation, we redirect to the new type page
		if (typeof window !== 'undefined') {
			const typePath = newType === 'all' 
				? '/locations' 
				: `/locations/${newType.toLowerCase().replace(/\s+/g, '-')}`;
			window.location.href = typePath;
		}
	};

	// Filter locations by selected type
	const filteredLocations =
		selectedType && selectedType !== "all"
			? locationsData?.locations.filter(
					(location) =>
						location.type.toLowerCase() === selectedType.toLowerCase(),
			  )
			: locationsData?.locations || [];

	// Loading states
	if (!locationsData || locationsData.locations.length === 0) {
		return (
			<div className="p-4 text-center">
				No location data available. Please check your YAML file.
			</div>
		);
	}

	// Loading specific location
	if (selectedLocationId && !singleLocationData) {
		return <div className="p-4 text-center">Loading location details...</div>;
	}

	return (
		<article className="bg-white dark:bg-gray-900 rounded-lg shadow-md border dark:border-gray-800 transition-colors duration-300">
			{/* Header Section */}
			<header className="p-6 pb-4">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
					{/* Type selector */}
					<div>
						<label
							htmlFor="location-type-selector"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
						>
							Filter by Type
						</label>
						<select
							id="location-type-selector"
							value={selectedType}
							onChange={handleTypeChange}
							className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						>
							{locationTypes.map((type) => (
								<option key={type} value={type}>
									{type === "all"
										? "All Types"
										: formatName(type)}
								</option>
							))}
						</select>
					</div>

					{/* Location selector */}
					<div>
						<label
							htmlFor="location-selector"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
						>
							Select Location {selectedType !== "all" && `(${formatName(selectedType as string)})`}
						</label>
						<select
							id="location-selector"
							value={selectedLocationId}
							onChange={handleLocationChange}
							className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						>
							{filteredLocations.map((location) => (
								<option key={location.id} value={location.id}>
									{location.name}
								</option>
							))}
						</select>
					</div>
				</div>

				{/* Location title and type */}
				<div className="flex justify-between items-start">
					<div>
						<h1
							className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-1"
							id={singleLocationData?.id}
							ref={handleRef(singleLocationData?.id)}
						>
							{singleLocationData?.name}
						</h1>
						<div className="flex items-center text-gray-500 dark:text-gray-400">
							<MapIcon />
							<span className="ml-1">
								{formatName(singleLocationData?.type || "")}
							</span>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="px-6 pb-6">
				{/* Description */}
				<div className="mb-6">
					<h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
						Description
					</h2>
					<div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
						<p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
							{singleLocationData?.description}
						</p>
					</div>
				</div>

				{/* History (if available) */}
				{singleLocationData?.history && (
					<div className="mb-6">
						<h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
							History
						</h2>
						<div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-lg border border-amber-200 dark:border-amber-900/20">
							<p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
								{singleLocationData.history}
							</p>
						</div>
					</div>
				)}

				{/* Grid for various elements */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Notable Features */}
					{singleLocationData?.notable_features &&
						singleLocationData.notable_features.length > 0 && (
							<div className="bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-800/30 shadow-sm overflow-hidden">
								<div className="flex items-center p-3 border-b border-purple-200 dark:border-purple-800/30 bg-purple-50 dark:bg-purple-900/20">
									<FeatureIcon />
									<h3 className="text-lg font-semibold text-purple-700 dark:text-purple-400 ml-2">
										Notable Features
									</h3>
								</div>
								<ul className="p-4 space-y-3">
									{singleLocationData.notable_features.map((feature, index) => (
										<li
											key={`feature-${index}`}
											className="flex items-start"
										>
											<span className="text-purple-400 mr-2 mt-1">•</span>
											<span className="text-gray-700 dark:text-gray-300">
												{feature}
											</span>
										</li>
									))}
								</ul>
							</div>
						)}

					{/* NPCs */}
					{singleLocationData?.npcs && singleLocationData.npcs.length > 0 && (
						<div className="bg-white dark:bg-gray-800 rounded-lg border border-indigo-200 dark:border-indigo-800/30 shadow-sm overflow-hidden">
							<div className="flex items-center p-3 border-b border-indigo-200 dark:border-indigo-800/30 bg-indigo-50 dark:bg-indigo-900/20">
								<NPCIcon />
								<h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-400 ml-2">
									NPCs
								</h3>
							</div>
							<ul className="p-4 space-y-3">
								{singleLocationData.npcs.map((npc) => (
									<li key={`npc-${npc}`} className="flex items-start">
										<span className="text-indigo-400 mr-2 mt-1">•</span>
										<button
											className="text-left text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded"
											onClick={() =>
												navigateToFile(
													`${npc.toLowerCase().replace(/\s+/g, "-")}.yaml`,
												)
											}
										>
											{formatName(npc)}
										</button>
									</li>
								))}
							</ul>
						</div>
					)}

					{/* Connected Locations */}
					{singleLocationData?.connected_locations &&
						singleLocationData.connected_locations.length > 0 && (
							<div className="bg-white dark:bg-gray-800 rounded-lg border border-emerald-200 dark:border-emerald-800/30 shadow-sm overflow-hidden">
								<div className="flex items-center p-3 border-b border-emerald-200 dark:border-emerald-800/30 bg-emerald-50 dark:bg-emerald-900/20">
									<MapIcon />
									<h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-400 ml-2">
										Connected Locations
									</h3>
								</div>
								<ul className="p-4 space-y-3">
									{singleLocationData.connected_locations.map((loc) => {
										// Find the location in the full data to get its type
										const connectedLocation = locationsData.locations.find(
											(l) => l.id === loc,
										);
										return (
											<li key={`loc-${loc}`} className="flex items-start">
												<span className="text-emerald-400 mr-2 mt-1">
													•
												</span>
												<button
													className="text-left text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded flex items-center"
													onClick={() =>
														navigateToFile(
															`shattered-spire-locations.yaml#${loc}`,
														)
													}
												>
													{formatName(loc)}
													{connectedLocation && (
														<span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
															({formatName(connectedLocation.type)})
														</span>
													)}
												</button>
											</li>
										);
									})}
								</ul>
							</div>
						)}

					{/* Parent Location */}
					{singleLocationData?.parent_location && (
						<div className="bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-800/30 shadow-sm overflow-hidden">
							<div className="flex items-center p-3 border-b border-blue-200 dark:border-blue-800/30 bg-blue-50 dark:bg-blue-900/20">
								<BuildingIcon />
								<h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400 ml-2">
									Parent Location
								</h3>
							</div>
							<div className="p-4">
								<button
									className="text-left text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded flex items-center"
									onClick={() =>
										navigateToFile(
											`shattered-spire-locations.yaml#${singleLocationData.parent_location}`,
										)
									}
								>
									{formatName(singleLocationData.parent_location)}
									{/* Find the parent location to show its type */}
									{locationsData.locations.find(
										(l) =>
											l.id === singleLocationData.parent_location,
									) && (
										<span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
											(
											{formatName(
												locationsData.locations.find(
													(l) =>
														l.id ===
														singleLocationData.parent_location,
												)?.type || "",
											)}
											)
										</span>
									)}
								</button>
							</div>
						</div>
					)}

					{/* Sub Locations */}
					{singleLocationData?.sub_locations &&
						singleLocationData.sub_locations.length > 0 && (
							<div className="bg-white dark:bg-gray-800 rounded-lg border border-indigo-200 dark:border-indigo-800/30 shadow-sm overflow-hidden">
								<div className="flex items-center p-3 border-b border-indigo-200 dark:border-indigo-800/30 bg-indigo-50 dark:bg-indigo-900/20">
									<BuildingIcon />
									<h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-400 ml-2">
										Sub Locations
									</h3>
								</div>
								<ul className="p-4 space-y-3">
									{singleLocationData.sub_locations.map((loc) => {
										// Find the location in the full data to get its type
										const subLocation = locationsData.locations.find(
											(l) => l.id === loc,
										);
										return (
											<li key={`subloc-${loc}`} className="flex items-start">
												<span className="text-indigo-400 mr-2 mt-1">
													•
												</span>
												<button
													className="text-left text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded flex items-center"
													onClick={() =>
														navigateToFile(
															`shattered-spire-locations.yaml#${loc}`,
														)
													}
												>
													{formatName(loc)}
													{subLocation && (
														<span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
															({formatName(subLocation.type)})
														</span>
													)}
												</button>
											</li>
										);
									})}
								</ul>
							</div>
						)}

					{/* Quests */}
					{singleLocationData?.quests && singleLocationData.quests.length > 0 && (
						<div className="bg-white dark:bg-gray-800 rounded-lg border border-amber-200 dark:border-amber-800/30 shadow-sm overflow-hidden">
							<div className="flex items-center p-3 border-b border-amber-200 dark:border-amber-800/30 bg-amber-50 dark:bg-amber-900/20">
								<QuestIcon />
								<h3 className="text-lg font-semibold text-amber-700 dark:text-amber-400 ml-2">
									Quests
								</h3>
							</div>
							<ul className="p-4 space-y-3">
								{singleLocationData.quests.map((quest) => (
									<li key={`quest-${quest}`} className="flex items-start">
										<span className="text-amber-400 mr-2 mt-1">•</span>
										<button
											className="text-left text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded"
											onClick={() =>
												navigateToFile(
													`shattered-spire-quests.yaml#${quest}`,
												)
											}
										>
											{formatName(quest)}
										</button>
									</li>
								))}
							</ul>
						</div>
					)}

					{/* Encounters */}
					{singleLocationData?.encounters &&
						singleLocationData.encounters.length > 0 && (
							<div className="bg-white dark:bg-gray-800 rounded-lg border border-red-200 dark:border-red-800/30 shadow-sm overflow-hidden">
								<div className="flex items-center p-3 border-b border-red-200 dark:border-red-800/30 bg-red-50 dark:bg-red-900/20">
									<EncounterIcon />
									<h3 className="text-lg font-semibold text-red-700 dark:text-red-400 ml-2">
										Encounters
									</h3>
								</div>
								<div className="p-4 space-y-4">
									{singleLocationData.encounters.map((encounter, index) => (
										<div
											key={`encounter-${index}`}
											className="border-l-4 border-red-300 dark:border-red-800 pl-3 py-2"
										>
											<h4 className="font-medium text-gray-800 dark:text-gray-200">
												{encounter.type}
											</h4>
											<p className="text-gray-600 dark:text-gray-400 mt-1">
												{encounter.description}
											</p>
										</div>
									))}
								</div>
							</div>
						)}

					{/* Loot/Treasure */}
					{singleLocationData?.loot && singleLocationData.loot.length > 0 && (
						<div className="bg-white dark:bg-gray-800 rounded-lg border border-amber-200 dark:border-amber-800/30 shadow-sm overflow-hidden">
							<div className="flex items-center p-3 border-b border-amber-200 dark:border-amber-800/30 bg-amber-50 dark:bg-amber-900/20">
								<TreasureIcon />
								<h3 className="text-lg font-semibold text-amber-700 dark:text-amber-400 ml-2">
									Treasure
								</h3>
							</div>
							<ul className="p-4 space-y-3">
								{singleLocationData.loot.map((item, index) => (
									<li
										key={`loot-${index}`}
										className="flex items-start"
									>
										<span className="text-amber-400 mr-2 mt-1">•</span>
										<span className="text-gray-700 dark:text-gray-300">
											{item}
										</span>
									</li>
								))}
							</ul>
						</div>
					)}

					{/* Secrets (DM-only info) */}
					{singleLocationData?.secrets && singleLocationData.secrets.length > 0 && (
						<div className="bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-800/30 shadow-sm overflow-hidden col-span-1 lg:col-span-2">
							<div className="flex items-center p-3 border-b border-purple-200 dark:border-purple-800/30 bg-purple-50 dark:bg-purple-900/20">
								<RewardIcon />
								<h3 className="text-lg font-semibold text-purple-700 dark:text-purple-400 ml-2">
									Secrets (DM Information)
								</h3>
							</div>
							<ul className="p-4 space-y-3">
								{singleLocationData.secrets.map((secret, index) => (
									<li
										key={`secret-${index}`}
										className="flex items-start"
									>
										<span className="text-purple-400 mr-2 mt-1">•</span>
										<span className="text-gray-700 dark:text-gray-300">
											{secret}
										</span>
									</li>
								))}
							</ul>
						</div>
					)}
				</div>
			</main>
		</article>
	);
}
