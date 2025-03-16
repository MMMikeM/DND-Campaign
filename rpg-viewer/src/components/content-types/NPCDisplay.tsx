"use client";

import { useState, useEffect } from "react";
import { trpc } from "@/trpc/client";
import { useCrossReference } from "../CrossReferenceContext";

interface NPCDisplayProps {
	npcId?: string;
	handleRef: (path: string) => (el: HTMLElement | null) => void;
}

export default function NPCDisplay({ npcId, handleRef }: NPCDisplayProps) {
	const { navigateToFile } = useCrossReference();
	const [selectedNpcId, setSelectedNpcId] = useState<string | undefined>(npcId);

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

	// Handle NPC selection change
	const handleNpcChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedNpcId(e.target.value);
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

	return (
		<article className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border dark:border-gray-800 transition-colors duration-300 p-6">
			<header className="mb-8">
				{/* NPC selector */}
				<div className="mb-4">
					<select
						value={selectedNpcId}
						onChange={handleNpcChange}
						className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
					>
						{npcsData.npcs.map((n) => (
							<option key={n.id} value={n.id}>
								{n.name}
							</option>
						))}
					</select>
				</div>

				<h1
					className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4 border-b pb-2 border-gray-200 dark:border-gray-700"
					ref={handleRef(`npc-${npc.id}`)}
					id={`npc-${npc.id}`}
				>
					{npc.name}
				</h1>

				{npcsData.description && (
					<div className="bg-gray-50 dark:bg-gray-800/30 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-4">
						<p className="text-gray-700 dark:text-gray-300 whitespace-normal break-words">
							{npcsData.description}
						</p>
					</div>
				)}
			</header>

			<main className="space-y-8">
				{/* NPC Overview */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-md border border-indigo-100 dark:border-indigo-800/50">
						<h3 className="text-lg font-medium text-indigo-700 dark:text-indigo-300 mb-2">
							Role
						</h3>
						<div className="text-gray-800 dark:text-gray-200">{npc.role}</div>
					</div>

					{npc.location && (
						<div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-md border border-emerald-100 dark:border-emerald-800/50">
							<h3 className="text-lg font-medium text-emerald-700 dark:text-emerald-300 mb-2">
								Location
							</h3>
							<div className="text-gray-800 dark:text-gray-200">
								{npc.location}
							</div>
						</div>
					)}
				</div>

				{/* Description and Personality */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md border border-blue-100 dark:border-blue-800/50">
						<h3 className="text-lg font-medium text-blue-700 dark:text-blue-300 mb-2">
							Description
						</h3>
						<div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
							{npc.description}
						</div>
					</div>

					<div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-md border border-purple-100 dark:border-purple-800/50">
						<h3 className="text-lg font-medium text-purple-700 dark:text-purple-300 mb-2">
							Personality
						</h3>
						<div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
							{npc.personality}
						</div>
					</div>
				</div>

				{/* Motivation */}
				<div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-md border border-rose-100 dark:border-rose-800/50">
					<h3 className="text-lg font-medium text-rose-700 dark:text-rose-300 mb-2">
						Motivation
					</h3>
					<div className="text-gray-700 dark:text-gray-300">
						{npc.motivation}
					</div>
				</div>

				{/* Secret (DM Info) */}
				{npc.secret && (
					<div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md border border-red-100 dark:border-red-800/50">
						<h3 className="text-lg font-medium text-red-700 dark:text-red-300 mb-2 flex items-center">
							<span>Secret</span>
							<span className="ml-2 text-xs bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 px-2 py-1 rounded-full">
								DM Only
							</span>
						</h3>
						<div className="text-gray-700 dark:text-gray-300">{npc.secret}</div>
					</div>
				)}

				{/* Quests */}
				{npc.quests && npc.quests.length > 0 && (
					<div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md border border-amber-100 dark:border-amber-800/50">
						<h3 className="text-lg font-medium text-amber-700 dark:text-amber-300 mb-2">
							Quests
						</h3>
						<ul className="list-disc pl-5 space-y-2">
							{npc.quests.map((questId) => (
								<li
									key={`quest-${questId}`}
									className="text-gray-700 dark:text-gray-300"
								>
									<button
										type="button"
										className="text-left cursor-pointer hover:text-amber-700 dark:hover:text-amber-300 bg-transparent border-0 p-0"
										onClick={() =>
											navigateToFile(`shattered-spire-quests.yaml#${questId}`)
										}
										aria-label={`View quest ${questId}`}
									>
										{questId}
									</button>
								</li>
							))}
						</ul>
					</div>
				)}

				{/* Additional Fields */}
				{npc.stats && (
					<div className="bg-gray-50 dark:bg-gray-800/20 p-4 rounded-md border border-gray-200 dark:border-gray-700">
						<h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
							Stats
						</h3>
						<div className="text-gray-700 dark:text-gray-300 whitespace-pre-line font-mono">
							{npc.stats}
						</div>
					</div>
				)}

				{npc.relationships && npc.relationships.length > 0 && (
					<div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-md border border-teal-100 dark:border-teal-800/50">
						<h3 className="text-lg font-medium text-teal-700 dark:text-teal-300 mb-2">
							Relationships
						</h3>
						<ul className="list-disc pl-5 space-y-1">
							{npc.relationships.map((relationship) => (
								<li
									key={`rel-${relationship.substring(0, 20)}`}
									className="text-gray-700 dark:text-gray-300"
								>
									{relationship}
								</li>
							))}
						</ul>
					</div>
				)}

				{npc.affiliations && npc.affiliations.length > 0 && (
					<div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-md border border-cyan-100 dark:border-cyan-800/50">
						<h3 className="text-lg font-medium text-cyan-700 dark:text-cyan-300 mb-2">
							Affiliations
						</h3>
						<ul className="list-disc pl-5 space-y-1">
							{npc.affiliations.map((affiliation) => (
								<li
									key={`aff-${affiliation.substring(0, 20)}`}
									className="text-gray-700 dark:text-gray-300"
								>
									{affiliation}
								</li>
							))}
						</ul>
					</div>
				)}

				{npc.inventory && npc.inventory.length > 0 && (
					<div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md border border-yellow-100 dark:border-yellow-800/50">
						<h3 className="text-lg font-medium text-yellow-700 dark:text-yellow-300 mb-2 flex items-center">
							<span>Inventory</span>
							<span className="ml-2 text-xs bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full">
								DM Only
							</span>
						</h3>
						<ul className="list-disc pl-5 space-y-1">
							{npc.inventory.map((item) => (
								<li
									key={`inv-${item.substring(0, 20)}`}
									className="text-gray-700 dark:text-gray-300"
								>
									{item}
								</li>
							))}
						</ul>
					</div>
				)}
			</main>
		</article>
	);
}
