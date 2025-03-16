"use client";

import React, { useState, useEffect } from "react";
import { useCrossReference } from "../CrossReferenceContext";
import { usePathname, useRouter } from "next/navigation";
import type { QuestsFile } from "@/server/schemas";

// Define the Quest type from the schema
type Quest = QuestsFile['quests'][number];

// Updated interface to use the types from schema
interface QuestDisplayProps {
	questId?: string;
	handleRef?: (path: string) => (el: HTMLElement | null) => void;
	questsData: QuestsFile;
	initialQuestData: Quest | null;
	currentCategory?: string;
}

export default function QuestDisplay({
	questId,
	handleRef = () => () => null,
	questsData,
	initialQuestData,
	currentCategory: externalCategory,
}: QuestDisplayProps) {
	const { navigateToFile } = useCrossReference();
	const pathname = usePathname();
	const router = useRouter();
	const [selectedQuestId, setSelectedQuestId] = useState<string | undefined>(
		questId,
	);
	const [singleQuestData, setSingleQuestData] = useState<any | null>(initialQuestData);

	// Extract category from pathname if in a category-specific page
	const categorySlug = pathname?.match(/\/quests\/([^\/]+)/)?.[1];

	// Format category from slug (e.g., "side-quests" to "Side Quests")
	const formatCategory = (slug?: string): string | null => {
		if (!slug) return null;
		return slug
			.split("-")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	};

	// Use external category if provided, otherwise extract from pathname
	const currentCategory = externalCategory || formatCategory(categorySlug);

	// Determine if the provided questId is a file name rather than a quest ID
	const isQuestFile = questId && questId?.includes("quests");

	// Set the first quest as selected if none is specified and we have quests data
	// OR if the provided questId is the name of the quests file
	useEffect(() => {
		if (
			(!selectedQuestId || isQuestFile) &&
			questsData?.quests &&
			questsData.quests.length > 0
		) {
			// If we have a category, select the first quest from that category
			if (
				currentCategory &&
				questsData.quests.some(
					(q) =>
						q.category?.toLowerCase() === currentCategory.toLowerCase() ||
						// Handle special case for category matching
						(q.category?.startsWith("Main") &&
							currentCategory === "Main Quests") ||
						(q.category?.startsWith("Side") &&
							currentCategory === "Side Quests"),
				)
			) {
				const categoryQuest = questsData.quests.find(
					(q) =>
						q.category?.toLowerCase() === currentCategory.toLowerCase() ||
						// Handle special case for category matching
						(q.category?.startsWith("Main") &&
							currentCategory === "Main Quests") ||
						(q.category?.startsWith("Side") &&
							currentCategory === "Side Quests"),
				);
				if (categoryQuest) {
					setSelectedQuestId(categoryQuest.id);
					return;
				}
			}

			// If no category or no quests in that category, select the first quest
			setSelectedQuestId(questsData.quests[0].id);
		}
	}, [questsData, selectedQuestId, isQuestFile, currentCategory]);

	// Update the displayed quest when selection changes
	useEffect(() => {
		if (selectedQuestId && !isQuestFile) {
			// Find the quest in the data we already have
			const foundQuest = questsData?.quests?.find(q => q.id === selectedQuestId);
			if (foundQuest) {
				setSingleQuestData(foundQuest);
			} else if (initialQuestData && initialQuestData.id === selectedQuestId) {
				setSingleQuestData(initialQuestData);
			}
		}
	}, [selectedQuestId, questsData, initialQuestData, isQuestFile]);

	// Handle quest selection change
	const handleQuestChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newQuestId = e.target.value;
		setSelectedQuestId(newQuestId);
		
		// Find the selected quest data
		const selectedQuest = questsData?.quests?.find(q => q.id === newQuestId);
		if (selectedQuest) {
			setSingleQuestData(selectedQuest);
		}
		
		// Update the URL without forcing a full page navigation
		// This is just for URL appearance and bookmarking
		const currentCategoryPath = currentCategory 
			? `/quests/${currentCategory.toLowerCase().replace(/\s+/g, '-')}`
			: '/quests';
		
		// Use browser history to update URL without navigating
		if (typeof window !== 'undefined') {
			window.history.pushState(
				{}, 
				'', 
				`${currentCategoryPath}/${newQuestId}`
			);
		}
	};

	// Function to handle keyboard navigation for clickable elements
	const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			action();
		}
	};

	// Filter quests by category if we're on a category page
	const filteredQuests =
		questsData?.quests.filter((quest) => {
			if (!currentCategory) return true; // Show all quests if not in a category page


			// Match quest ID prefix for main and side quests
			if (currentCategory === "Main Quests" && quest.id.startsWith("MQ")) {
				return true;
			}
			if (currentCategory === "Side Quests" && quest.id.startsWith("SQ")) {
				return true;
			}
			if (currentCategory === "Faction Quests" && quest.id.startsWith("FQ")) {
				return true;
			}
			if (currentCategory === "Personal Quests" && quest.id.startsWith("PQ")) {
				return true;
			}

			// More flexible category matching
			const lowerCaseCategory = currentCategory.toLowerCase();
			const questCategory = (quest.category ?? "").toLowerCase();

			return (
				// Exact match
				questCategory === lowerCaseCategory ||
				// Handle hyphenated vs space-separated format
				questCategory === lowerCaseCategory.replace(/\s+/g, "-") ||
				lowerCaseCategory === questCategory.replace(/\s+/g, "-") ||
				// Partial matches for common variations
				(lowerCaseCategory.includes("main") &&
					questCategory.includes("main")) ||
				(lowerCaseCategory.includes("side") &&
					questCategory.includes("side")) ||
				(lowerCaseCategory.includes("faction") &&
					questCategory.includes("faction")) ||
				(lowerCaseCategory.includes("personal") &&
					questCategory.includes("personal"))
			);
		}) || [];

	// Log the results
	if (filteredQuests.length === 0 && questsData?.quests.length) {
		console.log("Available categories:", 
			Array.from(new Set(questsData.quests.map((q) => q.category)))
		);
		console.log(
			"Available quest IDs:",
			questsData.quests.map((q) => q.id),
		);
	}

	// Loading states
	if (isQuestFile) {
		return <div className="p-4 text-center">Loading quests...</div>;
	}

	// Error states
	if (!questsData || questsData.quests.length === 0) {
		return (
			<div className="p-4 text-center">
				No quest data available. Please check your YAML file.
			</div>
		);
	}

	// If we have a category but no quests in that category
	if (currentCategory && filteredQuests.length === 0) {
		return (
			<div className="p-4 text-center">
				<div className="mb-4">
					No quests found in category "{currentCategory}". Please check your
					YAML file.
				</div>

				<div className="text-sm text-gray-500 mt-4 p-2 border border-gray-200 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-800">
					<p className="mb-2">Debug information:</p>
					<p>
						Available categories:{" "}
						{questsData?.quests.length > 0
							? Array.from(new Set(questsData.quests.map((q) => q.category))).join(
									", "
								)
							: "None"}
					</p>
					<p>Total quests available: {questsData?.quests.length || 0}</p>
					<p>
						First few quest IDs:{" "}
						{questsData?.quests
							.slice(0, 5)
							.map((q) => q.id)
							.join(", ")}
					</p>
				</div>
			</div>
		);
	}

	// Loading specific quest
	if (selectedQuestId && !singleQuestData) {
		return <div className="p-4 text-center">Loading quest details...</div>;
	}

	// Error loading specific quest
	if (selectedQuestId && !singleQuestData) {
		return (
			<div className="p-4 text-center text-red-500">
				Error loading quest: {questsData?.quests.find(q => q.id === selectedQuestId)?.error}
			</div>
		);
	}

	return (
		<article className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border dark:border-gray-800 transition-colors duration-300 p-6">
			<header className="mb-8">
				{/* Quest Selection - Updated to be full width */}
				<div className="mb-6">
					{/* Quest Selector */}
					<div>
						<label
							htmlFor="quest-selector"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
						>
							Select Quest {currentCategory ? `(${currentCategory})` : ""}
						</label>
						<select
							id="quest-selector"
							value={selectedQuestId}
							onChange={handleQuestChange}
							className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
						>
							{filteredQuests.map((q) => (
								<option key={q.id} value={q.id}>
									{q.id}: {q.title}
								</option>
							))}
						</select>
					</div>
				</div>

				{/* Quest Title and ID */}
				<div className="flex items-start justify-between mb-4">
					<h1
						className="text-3xl font-bold text-gray-800 dark:text-gray-200 border-b pb-2 border-gray-200 dark:border-gray-700 flex-grow"
						ref={handleRef(selectedQuestId || "")}
						id={selectedQuestId}
					>
						{singleQuestData?.title}
					</h1>
					<span className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-600 dark:text-gray-400 ml-2">
						{selectedQuestId}
					</span>
				</div>

				{/* Quest Meta Information */}
				<div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
					<div className="text-sm bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded text-indigo-700 dark:text-indigo-400">
						Type: {singleQuestData?.type}
					</div>
					<div className="text-sm bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded text-amber-700 dark:text-amber-400">
						Difficulty: {singleQuestData?.difficulty}
					</div>
					<div className="text-sm bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded text-emerald-700 dark:text-emerald-400">
						Category: {singleQuestData?.category?.replace("_", " ")}
					</div>
				</div>

				{/* Quest Description */}
				<div className="bg-gray-50 dark:bg-gray-800/30 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-4">
					<h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
						Description
					</h3>
					<p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
						{singleQuestData?.description}
					</p>
				</div>
			</header>

			<main className="space-y-8">
				{/* Associated NPCs */}
				{singleQuestData?.associated_npc && singleQuestData.associated_npc.length > 0 && (
					<div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-md border border-indigo-100 dark:border-indigo-800/50">
						<h3 className="text-lg font-medium text-indigo-700 dark:text-indigo-300 mb-2">
							Quest Giver{singleQuestData.associated_npc.length > 1 ? "s" : ""}
						</h3>
						<ul className="list-disc pl-5 space-y-1 dark:text-gray-300">
							{singleQuestData.associated_npc.map((npc) => {
								const npcId = `npc-${npc.toLowerCase().replace(/\s+/g, "-")}`;
								return (
									<li key={npcId}>
										<button
											type="button"
											className="text-left hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:text-blue-600"
											onClick={() =>
												navigateToFile(
													`${npc.toLowerCase().replace(/\s+/g, "-")}.yaml`,
												)
											}
										>
											{npc}
										</button>
									</li>
								);
							})}
						</ul>
					</div>
				)}

				{/* Quest Stages */}
				{singleQuestData?.quest_stages && singleQuestData.quest_stages.length > 0 && (
					<div className="bg-white dark:bg-gray-800/20 p-4 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm">
						<h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
							Quest Stages
						</h2>
						<div className="space-y-6">
							{singleQuestData.quest_stages.map((stage) => (
								<div
									key={stage.stage}
									className="border-l-4 border-indigo-500 dark:border-indigo-600 pl-4 py-2"
								>
									<h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
										Stage {stage.stage}: {stage.title}
									</h3>

									{/* Objectives */}
									<div className="mb-4">
										<h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
											Objectives:
										</h4>
										<ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-400">
											{stage.objectives.map((objective, idx) => (
												<li key={idx}>{objective}</li>
											))}
										</ul>
									</div>

									{/* Completion Paths */}
									<div>
										<h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
											Completion Paths:
										</h4>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											{Object.entries(stage.completion_paths).map(
												([pathName, path]) => (
													<div
														key={pathName}
														className="bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700"
													>
														<h5 className="font-semibold text-gray-800 dark:text-gray-200 capitalize mb-2">
															{pathName.replace(/_/g, " ")}
														</h5>
														<div className="space-y-2 text-sm">
															<div>
																<span className="font-medium text-gray-700 dark:text-gray-300">
																	Approach:
																</span>{" "}
																<span className="text-gray-600 dark:text-gray-400">
																	{typeof path === 'object' && path !== null && 'description' in path 
																		? String(path.description) 
																		: ''}
																</span>
															</div>
															<div>
																<span className="font-medium text-gray-700 dark:text-gray-300">
																	Challenges:
																</span>{" "}
																<span className="text-gray-600 dark:text-gray-400">
																	{typeof path === 'object' && path !== null && 'challenges' in path 
																		? String(path.challenges) 
																		: ''}
																</span>
															</div>
															<div>
																<span className="font-medium text-gray-700 dark:text-gray-300">
																	Outcomes:
																</span>{" "}
																<span className="text-gray-600 dark:text-gray-400">
																	{typeof path === 'object' && path !== null && 'outcomes' in path 
																		? String(path.outcomes) 
																		: ''}
																</span>
															</div>
														</div>
													</div>
												),
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Key Decision Points */}
				{singleQuestData?.key_decision_points && singleQuestData.key_decision_points.length > 0 && (
					<div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-md border border-purple-100 dark:border-purple-800/50">
						<h2 className="text-2xl font-semibold text-purple-700 dark:text-purple-300 mb-4">
							Key Decision Points
						</h2>
						<div className="space-y-6">
							{singleQuestData.key_decision_points.map((decision, idx) => (
								<div key={idx} className="space-y-3">
									<h3 className="text-lg font-medium text-purple-700 dark:text-purple-300">
										Stage {decision.stage}: {decision.decision}
									</h3>
									<div className="space-y-2">
										{decision.choices.map((choice, choiceIdx) => (
											<div
												key={choiceIdx}
												className="bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700"
											>
												<p className="text-gray-800 dark:text-gray-200 font-medium mb-1">
													{choice.choice}
												</p>
												<p className="text-gray-600 dark:text-gray-400 text-sm">
													<span className="font-medium">Consequences:</span>{" "}
													{choice.consequences}
												</p>
											</div>
										))}
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Potential Twists */}
				{singleQuestData?.potential_twists && singleQuestData.potential_twists.length > 0 && (
					<div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-md border border-rose-100 dark:border-rose-800/50">
						<h2 className="text-2xl font-semibold text-rose-700 dark:text-rose-300 mb-4">
							Potential Twists
						</h2>
						<ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
							{singleQuestData.potential_twists.map((twist, idx) => (
								<li key={idx}>{twist}</li>
							))}
						</ul>
					</div>
				)}

				{/* Rewards */}
				{singleQuestData?.rewards && (
					<div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md border border-amber-100 dark:border-amber-800/50">
						<h2 className="text-2xl font-semibold text-amber-700 dark:text-amber-300 mb-4">
							Rewards
						</h2>
						<div className="space-y-4">
							{Array.isArray(singleQuestData.rewards) ? (
								// Simple array of rewards
								<ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
									{singleQuestData.rewards.map((reward, idx) => (
										<li key={idx}>{reward}</li>
									))}
								</ul>
							) : (
								// Object with paths and rewards
								Object.entries(singleQuestData.rewards).map(([pathName, rewards]) => (
									<div key={pathName}>
										<h3 className="font-medium text-amber-700 dark:text-amber-300 capitalize mb-2">
											{pathName.replace(/_/g, " ")}:
										</h3>
										<ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
											{Array.isArray(rewards) && rewards.map((reward, idx) => (
												<li key={idx}>{reward}</li>
											))}
										</ul>
									</div>
								))
							)}
						</div>
					</div>
				)}

				{/* Related Quests */}
				{(singleQuestData?.related_quests || singleQuestData?.follow_up_quests) && (
					<div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-md border border-emerald-100 dark:border-emerald-800/50">
						<h2 className="text-2xl font-semibold text-emerald-700 dark:text-emerald-300 mb-4">
							Connected Quests
						</h2>

						{singleQuestData.follow_up_quests && (
							<div className="mb-4">
								<h3 className="font-medium text-emerald-700 dark:text-emerald-300 mb-2">
									Follow-Up Quests:
								</h3>
								{Array.isArray(singleQuestData.follow_up_quests) ? (
									<ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
										{singleQuestData.follow_up_quests.map((questId, idx) => (
											<li
												key={idx}
												className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
												onClick={() => setSelectedQuestId(questId)}
											>
												{questId}
											</li>
										))}
									</ul>
								) : (
									<div className="space-y-3">
										{Object.entries(singleQuestData.follow_up_quests).map(
											([condition, quests]) => (
												<div key={condition}>
													<h4 className="font-medium text-gray-700 dark:text-gray-300 capitalize mb-1">
														If {condition.replace(/_/g, " ")}:
													</h4>
													<ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
														{Array.isArray(quests) && quests.map((questId, idx) => (
															<li
																key={idx}
																className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
																onClick={() => setSelectedQuestId(questId)}
															>
																{questId}
															</li>
														))}
													</ul>
												</div>
											),
										)}
									</div>
								)}
							</div>
						)}

						{singleQuestData.related_quests && singleQuestData.related_quests.length > 0 && (
							<div>
								<h3 className="font-medium text-emerald-700 dark:text-emerald-300 mb-2">
									Related Quests:
								</h3>
								<ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
									{singleQuestData.related_quests.map((questId, idx) => (
										<li
											key={idx}
											className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
											onClick={() => setSelectedQuestId(questId)}
										>
											{questId}
										</li>
									))}
								</ul>
							</div>
						)}
					</div>
				)}
			</main>
		</article>
	);
}
