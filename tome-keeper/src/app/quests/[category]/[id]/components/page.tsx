"use client"

import { Suspense, use, useState, useEffect } from "react"
import type { ChangeEvent } from "react"
import { useCampaignData } from "@/components/CampaignDataProvider"
import { useRouter, notFound } from "next/navigation"
import {
	QuestHeader,
	QuestDescription,
	QuestObjectives,
	QuestRewards,
	QuestNotes,
	QuestLocation,
	QuestRelatedNPCs,
	QuestStatus,
	QuestTypeAndDifficulty,
	QuestAssociatedNPCs,
	QuestAdaptability,
	type Quest,
} from "."
import { idToName } from "@/server/utils/contentUtils"

// Main page component
export default function QuestPage({
	params,
}: { params: Promise<{ id: string }> }) {
	const { id: questId } = use(params)
	const { quests: questsDataArray } = useCampaignData()
	const router = useRouter()

	// State for DM content visibility
	const [showDMNotes, setShowDMNotes] = useState(false)

	// State to store the current quest and all quests
	const [currentQuest, setCurrentQuest] = useState<Quest | null>(null)
	const [allQuests, setAllQuests] = useState<Quest[]>([])
	const [categoryQuests, setCategoryQuests] = useState<Quest[]>([])
	const [isLoading, setIsLoading] = useState(true)

	// Find the quest and set up data
	useEffect(() => {
		if (!questsDataArray || questsDataArray.length === 0) {
			return
		}

		// Collect all quests from all files
		const allQuestsCollected: Quest[] = []
		let foundQuest: Quest | null = null

		// Check each quest file
		for (const questsFile of questsDataArray) {
			if (questsFile.quests && questsFile.quests.length > 0) {
				// Add all quests to our collection
				allQuestsCollected.push(...questsFile.quests)

				// Check if the current quest exists
				const quest = questsFile.quests.find(
					(q) =>
						q.id === questId || q.id?.toLowerCase() === questId.toLowerCase(),
				)

				if (quest) {
					foundQuest = quest
				}
			}
		}

		// Ensure we have unique quests by ID
		const uniqueQuestsMap = new Map<string, Quest>()
		for (const quest of allQuestsCollected) {
			if (quest.id && !uniqueQuestsMap.has(quest.id)) {
				uniqueQuestsMap.set(quest.id, quest)
			}
		}

		const uniqueQuests = Array.from(uniqueQuestsMap.values())

		// Set all quests
		setAllQuests(uniqueQuests)

		// If quest exists, set it as current
		if (foundQuest) {
			setCurrentQuest(foundQuest)

			// Filter quests by the same category as the current quest
			const questCategory =
				foundQuest.category || getCategoryFromId(foundQuest.id || "")

			if (questCategory) {
				const sameCategory = uniqueQuests.filter((q) => {
					const qCategory = q.category || getCategoryFromId(q.id || "")
					return qCategory === questCategory
				})

				setCategoryQuests(sameCategory)
			} else {
				setCategoryQuests(uniqueQuests)
			}

			setIsLoading(false)
		} else if (uniqueQuests.length > 0) {
			// If quest doesn't exist, redirect to the first valid quest
			const firstQuest = uniqueQuests[0]
			if (firstQuest.id) {
				router.replace(`/quests/${firstQuest.id}`)
			}
		} else {
			// No quests found at all
			setIsLoading(false)
		}
	}, [questsDataArray, questId, router])

	// Helper function to determine category from quest ID
	const getCategoryFromId = (id: string): string | null => {
		if (id.startsWith("MQ")) return "Main Quests"
		if (id.startsWith("SQ")) return "Side Quests"
		if (id.startsWith("FQ")) return "Faction Quests"
		if (id.startsWith("PQ")) return "Personal Quests"
		return null
	}

	// Handle quest change directly from the dropdown
	const handleQuestChange = (e: ChangeEvent<HTMLSelectElement>) => {
		const newQuestId = e.target.value

		// Get the category for the selected quest
		const selectedQuest = allQuests.find((q) => q.id === newQuestId)
		if (selectedQuest) {
			const questCategory =
				selectedQuest.category || getCategoryFromId(newQuestId)

			if (questCategory) {
				const categorySlug = idToName(questCategory)
				router.push(`/quests/${categorySlug}/${newQuestId}`)
			} else {
				// Fallback to the old route if no category
				router.push(`/quests/${newQuestId}`)
			}
		} else {
			// Fallback to the old route if quest not found
			router.push(`/quests/${newQuestId}`)
		}
	}

	// Toggle function for DM content
	const toggleDMNotes = () => {
		setShowDMNotes(!showDMNotes)
	}

	// Toggle all DM content
	const toggleAllDMContent = () => {
		setShowDMNotes(true)
	}

	// Show 404 if no quests data
	if (!questsDataArray || questsDataArray.length === 0) {
		notFound()
	}

	// Show loading state
	if (isLoading) {
		return (
			<div className="container mx-auto p-4">
				<h1 className="text-2xl font-bold mb-4">Quests</h1>
				<div className="bg-white dark:bg-gray-900 rounded-lg shadow-md border dark:border-gray-800 p-8 text-center">
					<div className="animate-pulse">
						<p className="text-gray-600 dark:text-gray-400">
							Loading quest data...
						</p>
					</div>
				</div>
			</div>
		)
	}

	// Show 404 if quest not found
	if (!currentQuest) {
		notFound()
	}

	// Get the category for the current quest
	const currentCategory =
		currentQuest.category || getCategoryFromId(currentQuest.id || "")
	const formattedCategory = idToName(currentCategory)

	return (
		<Suspense fallback={<div>Loading quest data...</div>}>
			<div className="container mx-auto p-4">
				<h1 className="text-2xl font-bold mb-4">
					{currentCategory || "Quests"}
					{currentCategory && (
						<button
							type="button"
							onClick={() =>
								router.push(`/quests/category/${formattedCategory}`)
							}
							className="ml-2 text-sm bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded hover:bg-blue-200 dark:hover:bg-blue-800/30"
						>
							View All {currentCategory}
						</button>
					)}
				</h1>
				<article className="bg-white dark:bg-gray-900 rounded-lg shadow-md border dark:border-gray-800 transition-colors duration-300">
					<QuestHeader
						quest={currentQuest}
						questId={questId}
						quests={categoryQuests.length > 0 ? categoryQuests : allQuests}
						handleQuestChange={handleQuestChange}
						showDMNotes={showDMNotes}
						toggleDMNotes={toggleDMNotes}
						toggleAllDMContent={toggleAllDMContent}
					/>

					<main className="p-6 pt-2 space-y-6">
						{/* Quest Overview */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<QuestStatus quest={currentQuest} />
							<QuestTypeAndDifficulty quest={currentQuest} />
						</div>

						{/* Location */}
						<QuestLocation quest={currentQuest} />

						{/* Description */}
						<QuestDescription quest={currentQuest} />

						{/* Objectives */}
						<QuestObjectives quest={currentQuest} />

						{/* Rewards */}
						<QuestRewards quest={currentQuest} />

						{/* Associated NPCs */}
						<QuestAssociatedNPCs quest={currentQuest} />

						{/* Related NPCs */}
						<QuestRelatedNPCs quest={currentQuest} />

						{/* Adaptability */}
						<QuestAdaptability quest={currentQuest} />

						{/* DM Notes */}
						<QuestNotes
							quest={currentQuest}
							showDMNotes={showDMNotes}
							toggleDMNotes={toggleDMNotes}
						/>
					</main>
				</article>
			</div>
		</Suspense>
	)
}
