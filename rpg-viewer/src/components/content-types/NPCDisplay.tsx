"use client";

import { useState, useEffect } from "react";
import { trpc } from "@/trpc/client";
import { useCrossReference } from "../CrossReferenceContext";

// Custom icon components to replace Heroicons
const EyeIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={1.5}
		stroke="currentColor"
		className="w-5 h-5 text-amber-600 dark:text-amber-400"
		aria-hidden="true"
		role="img"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
		/>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
		/>
	</svg>
);

const EyeSlashIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={1.5}
		stroke="currentColor"
		className="w-5 h-5 text-amber-600 dark:text-amber-400"
		aria-hidden="true"
		role="img"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
		/>
	</svg>
);

interface NPCDisplayProps {
	npcId?: string;
	handleRef: (path: string) => (el: HTMLElement | null) => void;
}

export default function NPCDisplay({ npcId, handleRef }: NPCDisplayProps) {
	const { navigateToFile } = useCrossReference();
	const [selectedNpcId, setSelectedNpcId] = useState<string | undefined>(npcId);
	const [showSecret, setShowSecret] = useState(false);
	const [showInventory, setShowInventory] = useState(false);

	// Fetch all NPCs
	const {
		data: npcsData,
		isLoading: isLoadingNpcs,
		error: npcsError,
	} = trpc.npcs.getAllNpcs.useQuery(undefined, {
		refetchOnWindowFocus: false,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});

	// Fetch specific NPC data if an ID is provided
	const {
		data: singleNpcData,
		isLoading: isLoadingSingleNpc,
		error: singleNpcError,
	} = trpc.npcs.getNpcByNameOrId.useQuery(selectedNpcId || "", {
		enabled: !!selectedNpcId,
		refetchOnWindowFocus: false,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});

	// Set the first NPC as selected if none is specified and we have NPCs data
	useEffect(() => {
		if (
			!selectedNpcId &&
			npcsData &&
			npcsData.npcs &&
			npcsData.npcs.length > 0
		) {
			setSelectedNpcId(npcsData.npcs[0].id);
		}
	}, [npcsData, selectedNpcId]);

	// Reset DM content visibility when changing NPCs
	useEffect(() => {
		setShowSecret(false);
		setShowInventory(false);
	}, []);

	// Handle NPC selection change
	const handleNpcChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedNpcId(e.target.value);
	};

	// Toggle secret visibility
	const toggleSecret = () => {
		setShowSecret(!showSecret);
	};

	// Toggle inventory visibility
	const toggleInventory = () => {
		setShowInventory(!showInventory);
	};

	// Toggle all DM content visibility
	const toggleAllDMContent = () => {
		const newState = !(showSecret && showInventory);
		setShowSecret(newState);
		setShowInventory(newState);
	};

	// Loading states
	if (isLoadingNpcs) {
		return <div className="p-4 text-center">Loading NPCs...</div>;
	}

	// Error states
	if (npcsError) {
		return (
			<div className="p-4 text-center text-red-500">
				Error loading NPCs: {npcsError.message}
			</div>
		);
	}

	if (!npcsData || npcsData.npcs.length === 0) {
		return (
			<div className="p-4 text-center">
				No NPC data available. Please check your YAML file.
			</div>
		);
	}

	// Loading specific NPC
	if (selectedNpcId && isLoadingSingleNpc) {
		return <div className="p-4 text-center">Loading NPC details...</div>;
	}

	// Error loading specific NPC
	if (selectedNpcId && singleNpcError) {
		return (
			<div className="p-4 text-center text-red-500">
				Error loading NPC: {singleNpcError.message}
			</div>
		);
	}

	const npc = singleNpcData;

	if (!npc) {
		return <div className="p-4 text-center">Select an NPC to view details</div>;
	}

	// Check if NPC has any DM-only content
	const hasDMContent =
		npc.secret || (npc.inventory && npc.inventory.length > 0);

	// Check the overall state of DM content visibility
	const allDMContentVisible =
		(npc.secret ? showSecret : true) &&
		(npc.inventory && npc.inventory.length > 0 ? showInventory : true);

	// Helper function to render content that might be a string or an array
	const renderContent = (content: string | string[]) => {
		if (Array.isArray(content)) {
			return (
				<ul className="space-y-2">
					{content.map((item, index) => (
						<li
							key={`content-item-${index}-${item.substring(0, 10)}`}
							className="flex items-start"
						>
							<span className="text-blue-400 mr-2 mt-1">•</span>
							<span className="text-gray-700 dark:text-gray-300">{item}</span>
						</li>
					))}
				</ul>
			);
		}
		// If it's a string, render as before
		return (
			<div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
				{content}
			</div>
		);
	};

	return (
		<article className="bg-white dark:bg-gray-900 rounded-lg shadow-md border dark:border-gray-800 transition-colors duration-300">
			{/* Header Section */}
			<header className="relative">
				{/* NPC selector */}
				<div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-t-lg border-b border-gray-200 dark:border-gray-700">
					<select
						value={selectedNpcId}
						onChange={handleNpcChange}
						className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					>
						{npcsData.npcs.map((n) => (
							<option key={n.id} value={n.id}>
								{n.name}
							</option>
						))}
					</select>
				</div>

				{/* NPC title bar */}
				<div className="p-6 pb-4 flex items-start justify-between">
					<div className="flex-1">
						<div className="flex justify-between items-center">
							<div className="flex flex-col">
								<h1
									className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-1"
									ref={handleRef(`npc-${npc.id}`)}
									id={`npc-${npc.id}`}
								>
									{npc.name}
								</h1>

								{/* DM Content Status */}
								{hasDMContent && (
									<div className="flex items-center mt-1">
										<div
											className={`h-2 w-2 rounded-full mr-2 ${allDMContentVisible ? "bg-green-500" : "bg-amber-500"}`}
										/>
										<span className="text-xs text-gray-500 dark:text-gray-400">
											{allDMContentVisible
												? "All DM content visible"
												: "Some DM content hidden"}
										</span>
									</div>
								)}
							</div>

							{/* DM Content Toggle Button */}
							{hasDMContent && (
								<button
									type="button"
									onClick={toggleAllDMContent}
									className={`flex items-center text-sm font-medium ml-4 p-2 rounded-full transition ${
										allDMContentVisible
											? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/50"
											: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
									}`}
									aria-label={
										allDMContentVisible
											? "Hide all DM content"
											: "Show all DM content"
									}
									title={
										allDMContentVisible
											? "Hide all DM content"
											: "Show all DM content"
									}
								>
									{allDMContentVisible ? (
										<>
											<EyeSlashIcon />
											<span className="sr-only">Hide All DM Content</span>
										</>
									) : (
										<>
											<EyeIcon />
											<span className="sr-only">Show All DM Content</span>
										</>
									)}
								</button>
							)}
						</div>
					</div>
				</div>

				{npcsData.description && (
					<div className="px-6 pb-4">
						<div className="bg-gray-50 dark:bg-gray-800/30 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
							<p className="text-gray-700 dark:text-gray-300 whitespace-normal break-words">
								{npcsData.description}
							</p>
						</div>
					</div>
				)}
			</header>

			<main className="p-6 pt-2 space-y-6">
				{/* NPC Overview */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-900/10 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800/30 shadow-sm">
						<div className="flex items-center mb-2">
							<span className="text-indigo-500 mr-2">👤</span>
							<h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-400">
								Role
							</h3>
						</div>
						<div className="text-gray-800 dark:text-gray-200">{npc.role}</div>
					</div>

					{npc.location && (
						<div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800/30 shadow-sm">
							<div className="flex items-center mb-2">
								<span className="text-emerald-500 mr-2">📍</span>
								<h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-400">
									Location
								</h3>
							</div>
							<div className="text-gray-800 dark:text-gray-200">
								{npc.location}
							</div>
						</div>
					)}
				</div>

				{/* Description and Personality */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-800/30 shadow-sm overflow-hidden">
						<div className="flex items-center p-3 border-b border-blue-200 dark:border-blue-800/30 bg-blue-50 dark:bg-blue-900/20">
							<span className="text-blue-500 mr-2">📝</span>
							<h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400">
								Description
							</h3>
						</div>
						<div className="p-4">{renderContent(npc.description)}</div>
					</div>

					<div className="bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-800/30 shadow-sm overflow-hidden">
						<div className="flex items-center p-3 border-b border-purple-200 dark:border-purple-800/30 bg-purple-50 dark:bg-purple-900/20">
							<span className="text-purple-500 mr-2">😀</span>
							<h3 className="text-lg font-semibold text-purple-700 dark:text-purple-400">
								Personality
							</h3>
						</div>
						<div className="p-4">{renderContent(npc.personality)}</div>
					</div>
				</div>

				{/* Motivation */}
				<div className="bg-white dark:bg-gray-800 rounded-lg border border-rose-200 dark:border-rose-800/30 shadow-sm overflow-hidden">
					<div className="flex items-center p-3 border-b border-rose-200 dark:border-rose-800/30 bg-rose-50 dark:bg-rose-900/20">
						<span className="text-rose-500 mr-2">🎯</span>
						<h3 className="text-lg font-semibold text-rose-700 dark:text-rose-400">
							Motivation
						</h3>
					</div>
					<div className="p-4">
						<div className="text-gray-700 dark:text-gray-300">
							{npc.motivation}
						</div>
					</div>
				</div>

				{/* Secret (DM Info) */}
				{npc.secret && (
					<div
						className={`bg-white dark:bg-gray-800 rounded-lg border ${showSecret ? "border-green-200 dark:border-green-800/30" : "border-red-200 dark:border-red-800/30"} shadow-sm overflow-hidden relative transition-colors duration-300`}
					>
						<div
							className={`flex items-center p-3 border-b ${showSecret ? "border-green-200 dark:border-green-800/30 bg-green-50 dark:bg-green-900/20" : "border-red-200 dark:border-red-800/30 bg-red-50 dark:bg-red-900/20"} transition-colors duration-300`}
						>
							<span
								className={`${showSecret ? "text-green-500" : "text-red-500"} mr-2 transition-colors duration-300`}
							>
								{showSecret ? "🔓" : "🔒"}
							</span>
							<h3
								className={`text-lg font-semibold ${showSecret ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"} flex items-center transition-colors duration-300`}
							>
								<span>Secret</span>
								<button
									onClick={toggleSecret}
									type="button"
									className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full transition-colors cursor-pointer flex items-center ${
										showSecret
											? "bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-700"
											: "bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-700"
									}`}
									aria-label={
										showSecret ? "Hide secret content" : "Show secret content"
									}
								>
									<span>DM Only</span>
									<span className="ml-1">{showSecret ? "👁️" : "👁️‍🗨️"}</span>
								</button>
							</h3>
						</div>
						<div className="p-4 relative">
							<div
								className={`text-gray-700 dark:text-gray-300 transition-all duration-300 ${
									showSecret ? "" : "blur-md select-none"
								}`}
							>
								{npc.secret}
							</div>

							{!showSecret && (
								<div className="absolute inset-0 flex items-center justify-center">
									<button
										onClick={toggleSecret}
										type="button"
										className="px-3 py-1 bg-red-100 dark:bg-red-800/70 hover:bg-red-200 dark:hover:bg-red-800 text-red-800 dark:text-red-200 text-sm font-medium rounded-md transition"
									>
										Click to reveal
									</button>
								</div>
							)}
						</div>
					</div>
				)}

				{/* Quests */}
				{npc.quests && npc.quests.length > 0 && (
					<div className="bg-white dark:bg-gray-800 rounded-lg border border-amber-200 dark:border-amber-800/30 shadow-sm overflow-hidden">
						<div className="flex items-center p-3 border-b border-amber-200 dark:border-amber-800/30 bg-amber-50 dark:bg-amber-900/20">
							<span className="text-amber-500 mr-2">📜</span>
							<h3 className="text-lg font-semibold text-amber-700 dark:text-amber-400">
								Quests
							</h3>
						</div>
						<div className="p-4">
							<ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
								{npc.quests.map((questId) => (
									<li key={`quest-${questId}`} className="relative">
										<button
											type="button"
											className="w-full text-left p-2 rounded-md bg-amber-50 dark:bg-amber-900/10 hover:bg-amber-100 dark:hover:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 transition-colors flex items-center text-amber-700 dark:text-amber-300"
											onClick={() =>
												navigateToFile(`shattered-spire-quests.yaml#${questId}`)
											}
											onKeyDown={(e) => {
												if (e.key === "Enter" || e.key === " ") {
													e.preventDefault();
													navigateToFile(
														`shattered-spire-quests.yaml#${questId}`,
													);
												}
											}}
										>
											<span className="mr-2">📋</span>
											{questId}
										</button>
									</li>
								))}
							</ul>
						</div>
					</div>
				)}

				{/* Stats */}
				{npc.stats && (
					<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
						<div className="flex items-center p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
							<span className="text-gray-500 mr-2">📊</span>
							<h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
								Stats
							</h3>
						</div>
						<div className="p-4">
							<div className="text-gray-700 dark:text-gray-300 whitespace-pre-line font-mono bg-gray-50 dark:bg-gray-900/50 p-3 rounded-md border border-gray-200 dark:border-gray-700">
								{npc.stats}
							</div>
						</div>
					</div>
				)}

				{/* Relationships */}
				{npc.relationships && npc.relationships.length > 0 && (
					<div className="bg-white dark:bg-gray-800 rounded-lg border border-teal-200 dark:border-teal-800/30 shadow-sm overflow-hidden">
						<div className="flex items-center p-3 border-b border-teal-200 dark:border-teal-800/30 bg-teal-50 dark:bg-teal-900/20">
							<span className="text-teal-500 mr-2">🔗</span>
							<h3 className="text-lg font-semibold text-teal-700 dark:text-teal-400">
								Relationships
							</h3>
						</div>
						<div className="p-4">
							<ul className="space-y-2">
								{npc.relationships.map((relationship) => (
									<li
										key={`rel-${relationship.substring(0, 20)}`}
										className="flex items-start"
									>
										<span className="text-teal-400 mr-2 mt-1">•</span>
										<span className="text-gray-700 dark:text-gray-300">
											{relationship}
										</span>
									</li>
								))}
							</ul>
						</div>
					</div>
				)}

				{/* Affiliations */}
				{npc.affiliations && npc.affiliations.length > 0 && (
					<div className="bg-white dark:bg-gray-800 rounded-lg border border-cyan-200 dark:border-cyan-800/30 shadow-sm overflow-hidden">
						<div className="flex items-center p-3 border-b border-cyan-200 dark:border-cyan-800/30 bg-cyan-50 dark:bg-cyan-900/20">
							<span className="text-cyan-500 mr-2">🏢</span>
							<h3 className="text-lg font-semibold text-cyan-700 dark:text-cyan-400">
								Affiliations
							</h3>
						</div>
						<div className="p-4">
							<ul className="space-y-2">
								{npc.affiliations.map((affiliation) => (
									<li
										key={`aff-${affiliation.substring(0, 20)}`}
										className="flex items-start"
									>
										<span className="text-cyan-400 mr-2 mt-1">•</span>
										<span className="text-gray-700 dark:text-gray-300">
											{affiliation}
										</span>
									</li>
								))}
							</ul>
						</div>
					</div>
				)}

				{/* Inventory - DM Only */}
				{npc.inventory && npc.inventory.length > 0 && (
					<div
						className={`bg-white dark:bg-gray-800 rounded-lg border ${showInventory ? "border-green-200 dark:border-green-800/30" : "border-yellow-200 dark:border-yellow-800/30"} shadow-sm overflow-hidden relative transition-colors duration-300`}
					>
						<div
							className={`flex items-center p-3 border-b ${showInventory ? "border-green-200 dark:border-green-800/30 bg-green-50 dark:bg-green-900/20" : "border-yellow-200 dark:border-yellow-800/30 bg-yellow-50 dark:bg-yellow-900/20"} transition-colors duration-300`}
						>
							<span
								className={`${showInventory ? "text-green-500" : "text-yellow-500"} mr-2 transition-colors duration-300`}
							>
								{showInventory ? "🔓" : "💼"}
							</span>
							<h3
								className={`text-lg font-semibold ${showInventory ? "text-green-700 dark:text-green-400" : "text-yellow-700 dark:text-yellow-400"} flex items-center transition-colors duration-300`}
							>
								<span>Inventory</span>
								<button
									onClick={toggleInventory}
									type="button"
									className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full transition-colors cursor-pointer flex items-center ${
										showInventory
											? "bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-700"
											: "bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 hover:bg-yellow-200 dark:hover:bg-yellow-700"
									}`}
									aria-label={
										showInventory
											? "Hide inventory content"
											: "Show inventory content"
									}
								>
									<span>DM Only</span>
									<span className="ml-1">{showInventory ? "👁️" : "👁️‍🗨️"}</span>
								</button>
							</h3>
						</div>
						<div className="p-4 relative">
							<ul
								className={`space-y-2 transition-all duration-300 ${
									showInventory ? "" : "blur-md select-none"
								}`}
							>
								{npc.inventory.map((item) => (
									<li
										key={`inv-${item.substring(0, 20)}`}
										className="flex items-start"
									>
										<span className="text-yellow-400 mr-2 mt-1">•</span>
										<span className="text-gray-700 dark:text-gray-300">
											{item}
										</span>
									</li>
								))}
							</ul>

							{!showInventory && (
								<div className="absolute inset-0 flex items-center justify-center">
									<button
										onClick={toggleInventory}
										type="button"
										className="px-3 py-1 bg-yellow-100 dark:bg-yellow-800/70 hover:bg-yellow-200 dark:hover:bg-yellow-800 text-yellow-800 dark:text-yellow-200 text-sm font-medium rounded-md transition"
									>
										Click to reveal
									</button>
								</div>
							)}
						</div>
					</div>
				)}
			</main>
		</article>
	);
}
