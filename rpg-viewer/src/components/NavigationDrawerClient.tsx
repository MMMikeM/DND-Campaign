"use client"

import React, { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
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

// Import API client for data loading
// The tRPC import has been removed as we're now using direct API calls

interface NavigationDrawerClientProps {
	files: string[]
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
	return file
		.replace(/\.ya?ml$/, "")
		.replace("shattered-spire-", "")
		.replace(/[-_]/g, " ")
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ")
}

// Format category or type name for display
const formatCategoryName = (name: string): string => {
	return name
		.split(/[-_\s]/)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(" ")
}

export default function NavigationDrawerClient({
	files,
}: NavigationDrawerClientProps) {
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

	const router = useRouter()
	const pathname = usePathname()

	// Get data from context
	const { locations: locationsData } = useCampaignData()

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
			if (pathname.includes("/npcs/")) {
				setExpandedCategories((prev) => ({ ...prev, NPCs: true }))
			} else if (pathname.includes("/factions/")) {
				setExpandedCategories((prev) => ({ ...prev, Factions: true }))
			} else if (pathname.includes("/locations/")) {
				setExpandedCategories((prev) => ({ ...prev, Locations: true }))
			} else if (pathname.includes("/quests/")) {
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

	// Navigation functions

	// Navigate to NPC
	const navigateToNpc = (npcId: string) => {
		const npcSlug = npcId.toLowerCase().replace(/\s+/g, "-")
		router.push(`/npcs/${encodeURIComponent(npcSlug)}`)
	}

	// Navigate to Faction
	const navigateToFaction = (factionId: string) => {
		const factionSlug = factionId.toLowerCase().replace(/\s+/g, "-")
		router.push(`/factions/${encodeURIComponent(factionSlug)}`)
	}

	// Navigate to Location
	const navigateToLocation = (locationId: string) => {
		router.push(`/locations/${encodeURIComponent(locationId)}`)
	}

	// Navigate to Quest category
	const navigateToQuestCategory = (category: string) => {
		const questCategorySlug = category
			.toLowerCase()
			.replace(/\s+/g, "-")
			.replace(/_/g, "-")
		router.push(`/quests/${encodeURIComponent(questCategorySlug)}`)
	}

	// Use hardcoded location IDs to ensure consistency between server and client
	const getLocationIds = () => {
		// Hardcoded list of location IDs to ensure consistency
		return [
			"ancient-ruins",
			"forest-clearing",
			"mountain-pass",
			"coastal-village",
			"hidden-cave",
			"abandoned-mine",
		].sort()
	}

	// Determine quest categories from filenames
	const questCategories = [
		"Main Quests",
		"Side Quests",
		"Faction Quests",
		"Personal Quests",
		"Generic Quests",
	]

	// Get location IDs from the data
	const locationIds = getLocationIds()

	return (
		<div className="relative h-full">
			{/* Mobile toggle button - shown only on small screens */}
			<button
				type="button"
				className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors duration-200"
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
          w-64 md:w-72 overflow-y-auto shadow-lg border-r border-gray-800`}
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
								className="w-full px-3 py-2 flex items-center justify-between text-left rounded-md hover:bg-gray-800 transition-colors text-white"
								onClick={() => toggleCategory(category)}
							>
								<div className="flex items-center space-x-2">
									{getIconForCategory(category)}
									<span className="font-medium">{category}</span>
								</div>
								{expandedCategories[category] ? (
									<FiChevronDown className="w-4 h-4" />
								) : (
									<FiChevronRight className="w-4 h-4" />
								)}
							</button>

							{/* Framework and Other categories */}
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
												className="w-full py-2 px-3 text-left text-sm rounded-md transition-colors 
                          hover:bg-gray-800 text-gray-300"
												onClick={() => {
													/* Handle generic file navigation */
												}}
											>
												<FiFileText className="w-4 h-4 mr-2 inline opacity-70" />
												{formatFileName(file)}
											</button>
										))}
									</div>
								)}

							{/* NPCs category */}
							{expandedCategories[category] && category === "NPCs" && (
								<div className="mt-1 ml-4 space-y-1">
									{["Guildmaster", "Merchant", "Quest Giver", "Innkeeper"].map(
										(npc) => (
											<button
												type="button"
												key={npc}
												className={`w-full py-2 px-3 text-left text-sm rounded-md transition-colors
                        hover:bg-gray-800 text-gray-300`}
												onClick={() => navigateToNpc(npc)}
											>
												<FiUser className="w-4 h-4 mr-2 inline opacity-70" />
												{npc}
											</button>
										),
									)}
								</div>
							)}

							{/* Factions category */}
							{expandedCategories[category] && category === "Factions" && (
								<div className="mt-1 ml-4 space-y-1">
									<button
										type="button"
										className="w-full py-2 px-3 text-left text-sm rounded-md transition-colors hover:bg-gray-800 text-gray-300"
										onClick={() => navigateToFaction("the-arcane-syndicate")}
									>
										The Arcane Syndicate
									</button>
									<button
										type="button"
										className="w-full py-2 px-3 text-left text-sm rounded-md transition-colors hover:bg-gray-800 text-gray-300"
										onClick={() => navigateToFaction("the-crimson-veil")}
									>
										The Crimson Veil
									</button>
									<button
										type="button"
										className="w-full py-2 px-3 text-left text-sm rounded-md transition-colors hover:bg-gray-800 text-gray-300"
										onClick={() => navigateToFaction("the-iron-covenant")}
									>
										The Iron Covenant
									</button>
								</div>
							)}

							{/* Locations category */}
							{expandedCategories[category] && category === "Locations" && (
								<div className="mt-1 ml-4 space-y-1">
									{!locationsData || locationsData.length === 0 ? (
										<div className="text-sm text-gray-400 py-2 px-3">
											Loading Locations...
										</div>
									) : locationIds.length > 0 ? (
										locationIds.map((id) => (
											<button
												type="button"
												key={id}
												className={`w-full py-2 px-3 text-left text-sm rounded-md transition-colors
                        ${
													pathname?.includes(
														`/locations/${encodeURIComponent(id)}`,
													)
														? "bg-indigo-900 text-white"
														: "hover:bg-gray-800 text-gray-300"
												}`}
												onClick={() => navigateToLocation(id)}
											>
												<FiHome className="w-4 h-4 mr-2 inline opacity-70" />
												{formatCategoryName(id)}
											</button>
										))
									) : (
										<div className="text-sm text-gray-400 py-2 px-3">
											No Locations found
										</div>
									)}
								</div>
							)}

							{/* Quests category */}
							{expandedCategories[category] && category === "Quests" && (
								<div className="mt-1 ml-4 space-y-1">
									{questCategories.map((questCategory) => (
										<button
											type="button"
											key={questCategory}
											className={`w-full py-2 px-3 text-left text-sm rounded-md transition-colors
                        hover:bg-gray-800 text-gray-300`}
											onClick={() => navigateToQuestCategory(questCategory)}
										>
											{getIconForQuestCategory(questCategory)}
											{formatCategoryName(questCategory)}
										</button>
									))}
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
	)
}
