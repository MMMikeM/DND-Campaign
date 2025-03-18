"use client"

import React, { useState, useEffect, type ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { FiMenu, FiX, FiChevronRight, FiChevronDown } from "react-icons/fi"
import {
	FiUsers,
	FiMap,
	FiFileText,
	FiArchive,
	FiBookOpen,
	FiCode,
	FiUser,
	FiFlag,
	FiHome,
	FiTarget,
} from "react-icons/fi"
import { useCampaignData } from "./CampaignDataProvider"
import { nameToId, idToName } from "@/server/utils/contentUtils"

interface NavigationDrawerProps {
	files: string[]
	children: ReactNode
}

// Group files by category
const getCategoryForFile = (file: string): string => {
	const lowerFile = file.toLowerCase()
	if (lowerFile.includes("faction")) return "Factions"
	if (lowerFile.includes("npc")) return "NPCs"
	if (lowerFile.includes("location")) return "Locations"
	if (lowerFile.includes("quest")) return "Quests"
	if (lowerFile.includes("framework")) return "Framework"
	return "Other"
}

// Get icon for category
const getIconForCategory = (category: string) => {
	switch (category) {
		case "Factions":
			return <FiUsers className="w-5 h-5" />
		case "NPCs":
			return <FiUsers className="w-5 h-5" />
		case "Locations":
			return <FiMap className="w-5 h-5" />
		case "Quests":
			return <FiBookOpen className="w-5 h-5" />
		case "Framework":
			return <FiCode className="w-5 h-5" />
		default:
			return <FiFileText className="w-5 h-5" />
	}
}

// Get icon for quest category
const getIconForQuestCategory = (category: string) => {
	switch (category.toLowerCase()) {
		case "main quests":
			return <FiTarget className="w-4 h-4 mr-2 opacity-70" />
		case "side quests":
			return <FiBookOpen className="w-4 h-4 mr-2 opacity-70" />
		case "faction quests":
			return <FiUsers className="w-4 h-4 mr-2 opacity-70" />
		case "personal quests":
			return <FiUser className="w-4 h-4 mr-2 opacity-70" />
		case "generic quests":
			return <FiArchive className="w-4 h-4 mr-2 opacity-70" />
		default:
			return <FiFileText className="w-4 h-4 mr-2 opacity-70" />
	}
}

// Format file name for display
const formatFileName = (file: string): string => {
	const cleanedName = file
		.replace(/\.ya?ml$/, "")
		.replace("shattered-spire-", "")

	return idToName(cleanedName)
}

// Format category or type name for display
const formatCategoryName = (name: string): string => {
	return idToName(name)
}

export default function NavigationDrawer({
	files,
	children,
}: NavigationDrawerProps) {
	const [isOpen, setIsOpen] = useState(true)
	const [expandedCategories, setExpandedCategories] = useState<
		Record<string, boolean>
	>({
		Factions: false,
		NPCs: false,
		Locations: false,
		Quests: false,
		Framework: false,
		Other: false,
	})

	// Get data from context instead of fetching
	const {
		npcs: npcsData,
		factions: factionsData,
		locations: locationsData,
		quests: questsData,
	} = useCampaignData()

	// No need for loading states anymore since data is passed from the server
	const isLoadingNpcs = false
	const isLoadingFactions = false
	const isLoadingLocations = false
	const isLoadingQuests = false

	// Add state for selected query params
	const router = useRouter()
	const pathname = usePathname()

	// Extract the current NPC ID from the pathname
	const currentNpcId = pathname?.startsWith("/npcs/")
		? pathname.replace("/npcs/", "")
		: undefined

	// Extract the current faction ID from the pathname
	const currentFactionId = pathname?.startsWith("/factions/")
		? pathname.replace("/factions/", "")
		: undefined

	// Extract the current quest category from the pathname
	const currentQuestCategory = pathname?.startsWith("/quests/")
		? pathname.replace("/quests/", "")
		: undefined

	// Toggle drawer
	const toggleDrawer = () => {
		setIsOpen(!isOpen)
	}

	// Toggle category expansion
	const toggleCategory = (category: string) => {
		setExpandedCategories((prev) => ({
			...prev,
			[category]: !prev[category],
		}))
	}

	// Auto-expand categories based on current path
	useEffect(() => {
		if (pathname) {
			if (pathname.includes("/npcs")) {
				setExpandedCategories((prev) => ({ ...prev, NPCs: true }))
			} else if (pathname.includes("/factions")) {
				setExpandedCategories((prev) => ({ ...prev, Factions: true }))
			} else if (pathname.includes("/locations")) {
				setExpandedCategories((prev) => ({ ...prev, Locations: true }))
			} else if (pathname.includes("/quests")) {
				setExpandedCategories((prev) => ({ ...prev, Quests: true }))
			}
		}
	}, [pathname])

	// Group files by category
	const filesByCategory = files.reduce(
		(acc, file) => {
			const category = getCategoryForFile(file)
			if (!acc[category]) {
				acc[category] = []
			}
			acc[category].push(file)
			return acc
		},
		{} as Record<string, string[]>,
	)

	// Sort categories for consistent display
	const sortedCategories = Object.keys(filesByCategory).sort((a, b) => {
		const order = [
			"Factions",
			"NPCs",
			"Locations",
			"Quests",
			"Framework",
			"Other",
		]
		return order.indexOf(a) - order.indexOf(b)
	})

	// Sort files within categories alphabetically
	const sortedFilesByCategory: Record<string, string[]> = {}
	for (const category of Object.keys(filesByCategory)) {
		sortedFilesByCategory[category] = [...filesByCategory[category]].sort(
			(a, b) => formatFileName(a).localeCompare(formatFileName(b)),
		)
	}

	// Find the files to reference for selection
	const npcFiles = sortedFilesByCategory.NPCs || []
	const factionFiles = sortedFilesByCategory.Factions || []
	const locationFiles = sortedFilesByCategory.Locations || []
	const questFiles = sortedFilesByCategory.Quests || []

	// Helper to select NPC from list
	const selectNpc = (npcId: string) => {
		// Find the NPC file to open
		const npcFile = npcFiles.find((f) => f.toLowerCase().includes("npc"))
		if (npcFile) {
			// Navigation is now handled by Link components
		}
	}

	// Helper to select Faction from list
	const selectFaction = (factionId: string) => {
		// Find the Faction file to open
		const factionFile = factionFiles.find((f) =>
			f.toLowerCase().includes("faction"),
		)
		if (factionFile) {
			// Navigation is now handled by Link components
		}
	}

	// Helper to select Location from list
	const selectLocation = (locationId: string) => {
		// Find the Location file to open
		const locationFile = locationFiles.find((f) =>
			f.toLowerCase().includes("location"),
		)
		if (locationFile) {
			// Navigation is now handled by Link components
		}
	}

	// Helper to select Quest category
	const selectQuestCategory = (category: string) => {
		// Find the Quest file to open
		const questFile = questFiles.find((f) => f.toLowerCase().includes("quest"))
		if (questFile) {
			// Navigation is now handled by Link components
		}
	}

	// Helper function to extract data for display
	const getNpcs = () => {
		// Transform npcsData into a display-friendly format
		const allNpcs: Array<{ id: string; name: string }> = []

		if (!npcsData || npcsData.length === 0) {
			console.log("No NPC data available")
			return allNpcs
		}

		for (const data of npcsData) {
			// Check if data exists
			if (!data) continue

			// Process regular NPCs
			if (data.npcs && Array.isArray(data.npcs)) {
				for (const npc of data.npcs) {
					if (npc && typeof npc === "object" && npc.name) {
						// Use name as identifier if id is not provided
						// This is safer than using indices which can change
						const id = npc.id || nameToId(npc.name)
						allNpcs.push({
							id,
							name: npc.name,
						})
					}
				}
			}

			// Process generic NPCs if they exist
			if (data.generic_npcs && Array.isArray(data.generic_npcs)) {
				for (const npc of data.generic_npcs) {
					if (npc && typeof npc === "object" && npc.name) {
						// Use name as identifier if id is not provided
						const id = npc.id || nameToId(npc.name)
						allNpcs.push({
							id,
							name: npc.name,
						})
					}
				}
			}
		}

		return allNpcs
	}

	// Same approach for factions
	const getFactions = () => {
		const allFactions: Array<{ id: string; name: string }> = []

		if (!factionsData || factionsData.length === 0) {
			console.warn("No factions data available")
			return allFactions
		}

		for (const data of factionsData) {
			if (data.factions) {
				for (const [id, faction] of Object.entries(data.factions)) {
					const factionData = faction as Record<string, unknown>
					allFactions.push({
						id,
						name: (factionData.name as string) || formatCategoryName(id),
					})
				}
			} else {
				console.warn('No "factions" property in data object:', data)
			}
		}

		return allFactions
	}

	// Get location IDs with a stable approach for consistent server/client rendering
	const getLocationIds = () => {
		const ids: string[] = []
		const locationSet = new Set<string>()

		if (locationsData && locationsData.length > 0) {
			// Process each data entry
			for (const data of locationsData) {
				if (data?.locations && typeof data.locations === "object") {
					// Add all location IDs to the set
					for (const id of Object.keys(data.locations)) {
						locationSet.add(id)
					}
				}
			}

			// Convert set to array and sort for stable order
			ids.push(...Array.from(locationSet))
		}

		return ids.sort()
	}

	// Get quest categories with proper type
	const getQuestCategories = () => {
		const categoriesSet = new Set<string>([
			"Main Quests",
			"Side Quests",
			"Faction Quests",
			"Personal Quests",
			"Generic Quests",
		])

		for (const data of questsData) {
			if (data?.quests) {
				for (const quest of Object.values(data.quests)) {
					const questData = quest as Record<string, unknown>
					if (questData.category) {
						categoriesSet.add(questData.category as string)
					}
				}
			}
		}

		// Convert to array of objects with id and name properties
		return Array.from(categoriesSet)
			.sort()
			.map((category) => ({
				id: category.toLowerCase().replace(/\s+/g, "-").replace(/_/g, "-"),
				name: category,
			}))
	}

	// Get the data we need for the UI
	const displayNpcs = getNpcs()
	const displayFactions = getFactions()
	const locationIds = getLocationIds()
	const questCategories = getQuestCategories()

	return (
		<div className="flex h-screen overflow-hidden">
			{/* Navigation Drawer */}
			<div className="flex-shrink-0 relative h-full">
				{/* Mobile toggle button - shown only on small screens */}
				<button
					type="button"
					className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-md"
					onClick={toggleDrawer}
					aria-label={isOpen ? "Close navigation" : "Open navigation"}
				>
					{isOpen ? (
						<FiX className="w-5 h-5 text-white" />
					) : (
						<FiMenu className="w-5 h-5 text-white" />
					)}
				</button>

				{/* Drawer */}
				<div
					className={`fixed top-0 left-0 h-full z-40 transform transition-transform duration-300 ease-in-out
						${isOpen ? "translate-x-0" : "-translate-x-full"}
						md:relative md:transform-none bg-gray-900 text-white
						w-64 md:w-72 overflow-y-auto`}
				>
					<div className="sticky top-0 bg-gray-900 p-4 border-b border-gray-800 flex justify-between items-center">
						<h2 className="text-xl font-bold text-white">Tomekeeper</h2>
						<button
							type="button"
							onClick={toggleDrawer}
							className="md:hidden p-1 rounded-md hover:bg-gray-800 transition-colors"
							aria-label={isOpen ? "Close navigation" : "Open navigation"}
						>
							<FiX className="w-5 h-5 text-white" />
						</button>
					</div>

					<div className="p-2">
						{sortedCategories.map((category) => (
							<div key={category} className="mb-2">
								<button
									type="button"
									className="w-full px-3 py-2 flex items-center justify-between text-left rounded-md hover:bg-gray-800 transition-colors"
									onClick={() => toggleCategory(category)}
								>
									<div className="flex items-center space-x-2">
										{getIconForCategory(category)}
										<span className="font-medium">{category}</span>
										{category === "NPCs" && (
											<span className="text-xs text-gray-400">
												({displayNpcs.length})
											</span>
										)}
										{category === "Factions" && (
											<span className="text-xs text-gray-400">
												({displayFactions.length})
											</span>
										)}
										{category === "Locations" && locationIds && (
											<span className="text-xs text-gray-400">
												({locationIds.length})
											</span>
										)}
										{category === "Quests" && questCategories && (
											<span className="text-xs text-gray-400">
												({questCategories.length})
											</span>
										)}
										{category !== "NPCs" &&
											category !== "Factions" &&
											category !== "Locations" &&
											category !== "Quests" && (
												<span className="text-xs text-gray-400">
													({sortedFilesByCategory[category].length})
												</span>
											)}
									</div>
									{expandedCategories[category] ? (
										<FiChevronDown className="w-4 h-4" />
									) : (
										<FiChevronRight className="w-4 h-4" />
									)}
								</button>

								{/* Default file listing for Framework and Other categories */}
								{expandedCategories[category] &&
									category !== "NPCs" &&
									category !== "Factions" &&
									category !== "Locations" &&
									category !== "Quests" && (
										<div className="mt-1 ml-4 space-y-1">
											{sortedFilesByCategory[category].map((file) => (
												<button
													type="button"
													key={file}
													className="w-full py-2 px-3 text-left text-sm rounded-md transition-colors flex items-center hover:bg-gray-800 text-gray-300"
													onClick={() => {}} // Navigation is now handled by Link components
													onKeyDown={(e) => {
														if (e.key === "Enter") {
															// Navigation is now handled by Link components
														}
													}}
												>
													<FiFileText className="w-4 h-4 mr-2 opacity-70" />
													{formatFileName(file)}
												</button>
											))}
										</div>
									)}

								{/* Special handling for NPCs category to show the actual NPCs */}
								{expandedCategories[category] && category === "NPCs" && (
									<div className="mt-1 ml-4 space-y-1">
										{isLoadingNpcs ? (
											<div className="text-sm text-gray-400 py-2 px-3">
												Loading NPCs...
											</div>
										) : displayNpcs.length > 0 ? (
											displayNpcs.map((npc) => (
												<Link
													href={`/npcs/${npc.id}`}
													key={npc.id}
													className={`w-full py-2 px-3 text-left text-sm rounded-md transition-colors flex items-center
														${
															currentNpcId === npc.id
																? "bg-indigo-900 text-white"
																: "hover:bg-gray-800 text-gray-300"
														}`}
													onClick={() => selectNpc(npc.id)}
												>
													<FiUser className="w-4 h-4 mr-2 opacity-70" />
													{npc.name}
												</Link>
											))
										) : (
											<div className="text-sm text-gray-400 py-2 px-3">
												No NPCs found
											</div>
										)}
									</div>
								)}

								{/* Special handling for Factions category */}
								{expandedCategories[category] && category === "Factions" && (
									<div className="mt-1 ml-4 space-y-1">
										{isLoadingFactions ? (
											<div className="text-sm text-gray-400 py-2 px-3">
												Loading Factions...
											</div>
										) : displayFactions.length > 0 ? (
											displayFactions.map((faction) => (
												<Link
													href={`/factions/${faction.id}`}
													key={faction.id}
													className={`w-full py-2 px-3 text-left text-sm rounded-md transition-colors flex items-center
														${
															currentFactionId === faction.id
																? "bg-indigo-900 text-white"
																: "hover:bg-gray-800 text-gray-300"
														}`}
													onClick={() => selectFaction(faction.id)}
												>
													<FiFlag className="w-4 h-4 mr-2 opacity-70" />
													{faction.name}
												</Link>
											))
										) : (
											<div className="text-sm text-gray-400 py-2 px-3">
												No Factions found
											</div>
										)}
									</div>
								)}

								{/* Special handling for Locations category */}
								{expandedCategories[category] && category === "Locations" && (
									<div className="mt-1 ml-4 space-y-1">
										{isLoadingLocations ? (
											<div className="text-sm text-gray-400 py-2 px-3">
												Loading Locations...
											</div>
										) : locationIds && locationIds.length > 0 ? (
											locationIds.map((locationId) => (
												<Link
													href={`/locations/${locationId}`}
													key={locationId}
													className={`w-full py-2 px-3 text-left text-sm rounded-md transition-colors flex items-center
														${
															pathname === `/locations/${locationId}`
																? "bg-indigo-900 text-white"
																: "hover:bg-gray-800 text-gray-300"
														}`}
													onClick={() => selectLocation(locationId)}
												>
													<FiMap className="w-4 h-4 mr-2 opacity-70" />
													{formatCategoryName(locationId)}
												</Link>
											))
										) : (
											<div className="text-sm text-gray-400 py-2 px-3">
												No Locations found
											</div>
										)}
									</div>
								)}

								{/* Special handling for Quests category */}
								{expandedCategories[category] && category === "Quests" && (
									<div className="mt-1 ml-4 space-y-1">
										{isLoadingQuests ? (
											<div className="text-sm text-gray-400 py-2 px-3">
												Loading Quests...
											</div>
										) : questCategories && questCategories.length > 0 ? (
											questCategories.map((questCategory) => (
												<Link
													href={`/quests/${questCategory.id}`}
													key={questCategory.id}
													className={`w-full py-2 px-3 text-left text-sm rounded-md transition-colors flex items-center
														${
															currentQuestCategory === questCategory.id
																? "bg-indigo-900 text-white"
																: "hover:bg-gray-800 text-gray-300"
														}`}
													onClick={() => selectQuestCategory(questCategory.id)}
												>
													{getIconForQuestCategory(questCategory.name)}
													{questCategory.name}
												</Link>
											))
										) : (
											<div className="text-sm text-gray-400 py-2 px-3">
												No Quests found
											</div>
										)}
									</div>
								)}
							</div>
						))}
					</div>
				</div>

				{/* Overlay for mobile - closes drawer when clicking outside */}
				{isOpen && (
					<div
						className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
						onClick={toggleDrawer}
						onKeyDown={(e) => {
							if (e.key === "Escape") toggleDrawer()
						}}
						tabIndex={0}
						role="button"
						aria-label="Close navigation"
					/>
				)}
			</div>

			{/* Main Content */}
			<div className="flex-grow overflow-y-auto p-4">{children}</div>
		</div>
	)
}
