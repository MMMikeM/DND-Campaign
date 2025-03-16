"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FiMenu, FiX, FiChevronRight, FiChevronDown } from "react-icons/fi";
import {
	FiUsers,
	FiMap,
	FiFileText,
	FiArchive,
	FiBookOpen,
	FiCode,
} from "react-icons/fi";

interface NavigationDrawerProps {
	files: string[];
	activeFile: string | null;
	onSelectFile: (fileName: string) => void;
}

// Group files by category
const getCategoryForFile = (file: string): string => {
	const lowerFile = file.toLowerCase();
	if (lowerFile.includes("faction")) return "Factions";
	if (lowerFile.includes("npc")) return "NPCs";
	if (lowerFile.includes("location")) return "Locations";
	if (lowerFile.includes("quest")) return "Quests";
	if (lowerFile.includes("framework")) return "Framework";
	return "Other";
};

// Get icon for category
const getIconForCategory = (category: string) => {
	switch (category) {
		case "Factions":
			return <FiUsers className="w-5 h-5" />;
		case "NPCs":
			return <FiUsers className="w-5 h-5" />;
		case "Locations":
			return <FiMap className="w-5 h-5" />;
		case "Quests":
			return <FiBookOpen className="w-5 h-5" />;
		case "Framework":
			return <FiCode className="w-5 h-5" />;
		default:
			return <FiFileText className="w-5 h-5" />;
	}
};

// Format file name for display
const formatFileName = (file: string): string => {
	return file
		.replace(/\.ya?ml$/, "")
		.replace("shattered-spire-", "")
		.replace(/[-_]/g, " ")
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
};

export default function NavigationDrawer({
	files,
	activeFile,
	onSelectFile,
}: NavigationDrawerProps) {
	const [isOpen, setIsOpen] = useState(true);
	const [expandedCategories, setExpandedCategories] = useState<
		Record<string, boolean>
	>({
		Factions: true,
		NPCs: true,
		Locations: true,
		Quests: true,
		Framework: true,
		Other: true,
	});

	// Toggle drawer
	const toggleDrawer = () => {
		setIsOpen(!isOpen);
	};

	// Toggle category expansion
	const toggleCategory = (category: string) => {
		setExpandedCategories((prev) => ({
			...prev,
			[category]: !prev[category],
		}));
	};

	// Group files by category
	const filesByCategory = files.reduce(
		(acc, file) => {
			const category = getCategoryForFile(file);
			if (!acc[category]) {
				acc[category] = [];
			}
			acc[category].push(file);
			return acc;
		},
		{} as Record<string, string[]>,
	);

	// Sort categories for consistent display
	const sortedCategories = Object.keys(filesByCategory).sort((a, b) => {
		const order = [
			"Factions",
			"NPCs",
			"Locations",
			"Quests",
			"Framework",
			"Other",
		];
		return order.indexOf(a) - order.indexOf(b);
	});

	return (
		<div className="relative h-full">
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
					<h2 className="text-xl font-bold">Campaign Files</h2>
					<button
						type="button"
						onClick={toggleDrawer}
						className="md:hidden p-1 rounded-md hover:bg-gray-800"
						aria-label={isOpen ? "Close navigation" : "Open navigation"}
					>
						<FiX className="w-5 h-5" />
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
								</div>
								{expandedCategories[category] ? (
									<FiChevronDown className="w-4 h-4" />
								) : (
									<FiChevronRight className="w-4 h-4" />
								)}
							</button>

							{expandedCategories[category] && (
								<div className="mt-1 ml-4 space-y-1">
									{filesByCategory[category].map((file) => (
										<button
											type="button"
											key={file}
											className={`w-full py-2 px-3 text-left text-sm rounded-md transition-colors flex items-center
                        ${
													activeFile === file
														? "bg-indigo-900 text-white"
														: "hover:bg-gray-800 text-gray-300"
												}`}
											onClick={() => onSelectFile(file)}
											onKeyDown={(e) => {
												if (e.key === "Enter") onSelectFile(file);
											}}
										>
											<FiFileText className="w-4 h-4 mr-2 opacity-70" />
											{formatFileName(file)}
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
						if (e.key === "Escape") toggleDrawer();
					}}
					tabIndex={0}
					role="button"
					aria-label="Close navigation"
				/>
			)}
		</div>
	);
}
