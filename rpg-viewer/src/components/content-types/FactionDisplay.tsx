"use client";

import { useState, useEffect, type ChangeEvent } from "react";
import { trpc } from "@/trpc/client";
import { useCrossReference } from "../CrossReferenceContext";

interface FactionDisplayProps {
	factionId?: string;
	handleRef: (path: string) => (el: HTMLElement | null) => void;
}

export default function FactionDisplay({
	factionId,
	handleRef,
}: FactionDisplayProps) {
	const { navigateToFile } = useCrossReference();
	const [selectedFactionId, setSelectedFactionId] = useState<
		string | undefined
	>(factionId);

	// Fetch all factions
	const {
		data: factionsData,
		isLoading: isLoadingFactions,
		error: factionsError,
	} = trpc.factions.getAllFactions.useQuery(undefined, {
		refetchOnWindowFocus: false,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});

	// Fetch specific faction data if an ID is provided
	const {
		data: singleFactionData,
		isLoading: isLoadingSingleFaction,
		error: singleFactionError,
	} = trpc.factions.getFactionById.useQuery(selectedFactionId || "", {
		enabled: !!selectedFactionId,
		refetchOnWindowFocus: false,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});

	// Set the first faction as selected if none is specified and we have factions data
	useEffect(() => {
		if (!selectedFactionId && factionsData?.factions?.length) {
			setSelectedFactionId(factionsData.factions[0].id);
		}
	}, [factionsData, selectedFactionId]);

	// Handle faction selection change
	const handleFactionChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setSelectedFactionId(e.target.value);
	};

	// Get faction type icon/color
	const getFactionTypeStyle = (type: string) => {
		const typeMap: Record<
			string,
			{ icon: string; bgClass: string; textClass: string }
		> = {
			"Cult Front Organization": {
				icon: "🔮",
				bgClass: "bg-purple-100 dark:bg-purple-900/30",
				textClass: "text-purple-800 dark:text-purple-300",
			},
			Guild: {
				icon: "⚒️",
				bgClass: "bg-amber-100 dark:bg-amber-900/30",
				textClass: "text-amber-800 dark:text-amber-300",
			},
			Government: {
				icon: "👑",
				bgClass: "bg-blue-100 dark:bg-blue-900/30",
				textClass: "text-blue-800 dark:text-blue-300",
			},
			Military: {
				icon: "⚔️",
				bgClass: "bg-red-100 dark:bg-red-900/30",
				textClass: "text-red-800 dark:text-red-300",
			},
			Criminal: {
				icon: "🗡️",
				bgClass: "bg-slate-100 dark:bg-slate-900/30",
				textClass: "text-slate-800 dark:text-slate-300",
			},
			Religious: {
				icon: "✨",
				bgClass: "bg-yellow-100 dark:bg-yellow-900/30",
				textClass: "text-yellow-800 dark:text-yellow-300",
			},
			// Default fallback
			default: {
				icon: "🏛️",
				bgClass: "bg-gray-100 dark:bg-gray-800/30",
				textClass: "text-gray-800 dark:text-gray-300",
			},
		};

		return typeMap[type] || typeMap.default;
	};

	// Format faction ID to a proper display name
	const formatFactionName = (id: string): string => {
		return id
			.split("_")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	};

	// Loading states
	if (isLoadingFactions) {
		return <div className="p-4 text-center">Loading factions...</div>;
	}

	// Error states
	if (factionsError) {
		return (
			<div className="p-4 text-center text-red-500">
				Error loading factions: {factionsError.message}
			</div>
		);
	}

	if (!factionsData || factionsData.factions.length === 0) {
		return (
			<div className="p-4 text-center">
				No faction data available. Please check your YAML file.
			</div>
		);
	}

	// Loading specific faction
	if (selectedFactionId && isLoadingSingleFaction) {
		return <div className="p-4 text-center">Loading faction details...</div>;
	}

	// Error loading specific faction
	if (selectedFactionId && singleFactionError) {
		return (
			<div className="p-4 text-center text-red-500">
				Error loading faction: {singleFactionError.message}
			</div>
		);
	}

	const faction = singleFactionData;

	if (!faction) {
		return (
			<div className="p-4 text-center">Select a faction to view details</div>
		);
	}

	const typeStyle = faction.type
		? getFactionTypeStyle(faction.type)
		: getFactionTypeStyle("default");

	return (
		<article className="bg-white dark:bg-gray-900 rounded-lg shadow-md border dark:border-gray-800 transition-colors duration-300">
			{/* Improved Header Section */}
			<header className="relative">
				{/* Faction selector */}
				<div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-t-lg border-b border-gray-200 dark:border-gray-700">
					<select
						value={selectedFactionId}
						onChange={handleFactionChange}
						className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					>
						{factionsData.factions.map((f) => (
							<option key={f.id} value={f.id}>
								{formatFactionName(f.id)}
							</option>
						))}
					</select>
				</div>

				{/* Improved faction title bar with badge */}
				<div className="p-6 pb-4 flex items-start justify-between">
					<div className="flex-1">
						<h1
							className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-1"
							ref={handleRef(faction.id)}
							id={faction.id}
						>
							{formatFactionName(faction.id)}
						</h1>

						{faction.type && (
							<div className="flex items-center mt-2">
								<span
									className={[
										"inline-flex",
										"items-center",
										"px-3",
										"py-1",
										"rounded-full",
										"text-sm",
										"font-medium",
										typeStyle.bgClass,
										typeStyle.textClass,
									].join(" ")}
								>
									<span className="mr-1">{typeStyle.icon}</span> {faction.type}
								</span>
							</div>
						)}
					</div>
				</div>
			</header>

			<main className="p-6 pt-2 space-y-6">
				{/* Goals Section - Improved Cards */}
				<div className="grid grid-cols-1 gap-4 mb-6">
					<div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
						<div className="p-4 border-b border-gray-200 dark:border-gray-700">
							<div className="flex items-center mb-2">
								<span className="text-emerald-500 mr-2">🌐</span>
								<h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-400">
									Public Goal
								</h3>
							</div>
							<p className="text-gray-700 dark:text-gray-300">
								{faction.public_goal}
							</p>
						</div>

						<div className="p-4">
							<div className="flex items-center mb-2">
								<span className="text-rose-500 mr-2">🎭</span>
								<h3 className="text-lg font-semibold text-rose-700 dark:text-rose-400">
									True Goal
								</h3>
							</div>
							<p className="text-gray-700 dark:text-gray-300">
								{faction.true_goal}
							</p>
						</div>
					</div>
				</div>

				{/* Resources with improved styling */}
				{faction.resources && faction.resources.length > 0 && (
					<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
						<div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
							<span className="text-gray-500 mr-2">💰</span>
							<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
								Resources
							</h2>
						</div>
						<div className="p-4">
							<ul className="space-y-2 dark:text-gray-300">
								{faction.resources.map((resource) => (
									<li key={`resource-${resource}`} className="flex items-start">
										<span className="text-gray-400 mr-2 mt-1">•</span>
										<span>{resource}</span>
									</li>
								))}
							</ul>
						</div>
					</div>
				)}

				{/* Leadership with improved cards */}
				{faction.leadership && faction.leadership.length > 0 && (
					<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
						<div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
							<span className="text-gray-500 mr-2">👑</span>
							<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
								Leadership
							</h2>
						</div>
						<div className="p-4 grid grid-cols-1 gap-4">
							{faction.leadership.map((leader, index) => (
								<div
									key={`leader-${leader.name}`}
									className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/70 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
								>
									<h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 flex items-center">
										<span className="mr-2">👤</span>
										{leader.name}
										{leader.role && (
											<span className="ml-2 px-2 py-0.5 text-xs font-normal bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
												{leader.role}
											</span>
										)}
									</h3>
									{leader.description && (
										<p className="text-gray-700 dark:text-gray-300 mt-2">
											{leader.description}
										</p>
									)}
									{leader.secret && (
										<div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-100 dark:border-red-800/50">
											<p className="text-red-700 dark:text-red-300 text-sm flex items-center">
												<span className="mr-1">🔒</span>
												<span className="italic font-medium">Secret:</span>{" "}
												{leader.secret}
											</p>
										</div>
									)}
								</div>
							))}
						</div>
					</div>
				)}

				{/* Territory */}
				{faction.territory && (
					<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
						<div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
							<span className="text-gray-500 mr-2">🗺️</span>
							<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
								Territory
							</h2>
						</div>
						<div className="p-4">
							<p className="text-gray-700 dark:text-gray-300">
								{faction.territory}
							</p>
						</div>
					</div>
				)}

				{/* Relations Section: Allies & Enemies */}
				{(faction.allies && faction.allies.length > 0) ||
				(faction.enemies && faction.enemies.length > 0) ? (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{/* Allies */}
						{faction.allies && faction.allies.length > 0 && (
							<div className="bg-white dark:bg-gray-800 rounded-lg border border-green-200 dark:border-green-800/30 shadow-sm overflow-hidden">
								<div className="flex items-center p-4 border-b border-green-200 dark:border-green-800/30 bg-green-50 dark:bg-green-900/20">
									<span className="text-green-500 mr-2">🤝</span>
									<h2 className="text-xl font-semibold text-green-700 dark:text-green-400">
										Allies
									</h2>
								</div>
								<div className="p-4">
									<ul className="space-y-2 dark:text-gray-300">
										{faction.allies.map((ally) => (
											<li key={`ally-${ally}`} className="flex items-start">
												<span className="text-green-400 mr-2 mt-1">•</span>
												<span>{ally}</span>
											</li>
										))}
									</ul>
								</div>
							</div>
						)}

						{/* Enemies */}
						{faction.enemies && faction.enemies.length > 0 && (
							<div className="bg-white dark:bg-gray-800 rounded-lg border border-red-200 dark:border-red-800/30 shadow-sm overflow-hidden">
								<div className="flex items-center p-4 border-b border-red-200 dark:border-red-800/30 bg-red-50 dark:bg-red-900/20">
									<span className="text-red-500 mr-2">⚔️</span>
									<h2 className="text-xl font-semibold text-red-700 dark:text-red-400">
										Enemies
									</h2>
								</div>
								<div className="p-4">
									<ul className="space-y-2 dark:text-gray-300">
										{faction.enemies.map((enemy) => (
											<li key={`enemy-${enemy}`} className="flex items-start">
												<span className="text-red-400 mr-2 mt-1">•</span>
												<span>{enemy}</span>
											</li>
										))}
									</ul>
								</div>
							</div>
						)}
					</div>
				) : null}

				{/* Notes with improved styling */}
				{faction.notes && (
					<div className="bg-white dark:bg-gray-800 rounded-lg border border-amber-200 dark:border-amber-800/30 shadow-sm overflow-hidden">
						<div className="flex items-center p-4 border-b border-amber-200 dark:border-amber-800/30 bg-amber-50 dark:bg-amber-900/20">
							<span className="text-amber-500 mr-2">📝</span>
							<h2 className="text-xl font-semibold text-amber-700 dark:text-amber-400">
								Notes
							</h2>
						</div>
						<div className="p-4">
							<div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
								{faction.notes}
							</div>
						</div>
					</div>
				)}

				{/* Members with improved styling */}
				{faction.members && faction.members.length > 0 && (
					<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
						<div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
							<span className="text-gray-500 mr-2">👥</span>
							<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
								Members
							</h2>
						</div>
						<div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
							{faction.members.map((member, index) => (
								<div
									key={`member-${member.name}`}
									className="p-3 bg-gray-50 dark:bg-gray-800/40 rounded-md border border-gray-200 dark:border-gray-700"
								>
									<h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center">
										<span className="mr-1">👤</span>
										{member.name}
										{member.role && (
											<span className="ml-2 px-2 py-0.5 text-xs font-normal bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
												{member.role}
											</span>
										)}
									</h3>
									{member.description && (
										<p className="text-gray-700 dark:text-gray-300 mt-1">
											{member.description}
										</p>
									)}
								</div>
							))}
						</div>
					</div>
				)}

				{/* Quests with improved styling */}
				{faction.quests && faction.quests.length > 0 && (
					<div className="bg-white dark:bg-gray-800 rounded-lg border border-indigo-200 dark:border-indigo-800/30 shadow-sm overflow-hidden">
						<div className="flex items-center p-4 border-b border-indigo-200 dark:border-indigo-800/30 bg-indigo-50 dark:bg-indigo-900/20">
							<span className="text-indigo-500 mr-2">📜</span>
							<h2 className="text-xl font-semibold text-indigo-700 dark:text-indigo-400">
								Quests
							</h2>
						</div>
						<div className="p-4">
							<ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
								{faction.quests.map((quest) => (
									<li key={`quest-${quest}`} className="relative">
										<button
											className="w-full text-left p-2 rounded-md bg-indigo-50 dark:bg-indigo-900/10 hover:bg-indigo-100 dark:hover:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30 transition-colors flex items-center text-indigo-700 dark:text-indigo-300"
											type="button"
											onClick={() => navigateToFile(`${quest}.yaml`)}
											onKeyDown={(e) => {
												if (e.key === "Enter" || e.key === " ") {
													e.preventDefault();
													navigateToFile(`${quest}.yaml`);
												}
											}}
										>
											<span className="mr-2">📋</span>
											{quest}
										</button>
									</li>
								))}
							</ul>
						</div>
					</div>
				)}
			</main>
		</article>
	);
}
