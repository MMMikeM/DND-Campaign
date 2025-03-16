"use server"

import { Suspense } from "react"
import { getDataByType } from "@/server/utils/contentUtils"
import { QuestsFileSchema } from "@/server/schemas"
import QuestDisplay from "@/components/content-types/QuestDisplay"
import { logger } from "@/utils/logger"
import { notFound } from "next/navigation"

interface QuestDisplayServerProps {
	questId?: string
	category?: string
}

export default async function QuestDisplayServer({
	questId,
	category,
}: QuestDisplayServerProps = {}) {
	logger.debug.data("Loading quests data in QuestDisplayServer", {
		questId,
		category,
	})

	try {
		// Load all quests data
		const questsDataArray = await getDataByType(
			"quests",
			QuestsFileSchema,
			"shattered-spire",
		)

		if (!questsDataArray || questsDataArray.length === 0) {
			logger.warn.data("No quests data available")
			return <div>No quests data available</div>
		}

		const questsData = questsDataArray[0] // Get first item from array

		// Format category (e.g., "side-quests" to "Side Quests")
		const formatCategory = (categoryStr?: string): string | undefined => {
			if (!categoryStr) return undefined
			return categoryStr
				.split("-")
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(" ")
		}

		const formattedCategory = formatCategory(category)

		// If a specific quest ID is provided, verify it exists
		if (questId) {
			const questData = questsData.quests.find(
				(quest) =>
					quest.id === questId ||
					quest.id?.toLowerCase() === questId.toLowerCase(),
			)

			if (!questData) {
				logger.warn.data(`Quest with ID ${questId} not found in data`)
				notFound()
			} else {
				logger.debug.data("Found specific quest data", {
					questId,
					category: questData?.category,
				})
			}
		}

		// If a category is provided, verify it has quests
		if (category && formattedCategory) {
			const categoryQuests = questsData.quests.filter(
				(quest) =>
					quest.category?.toLowerCase() === formattedCategory.toLowerCase() ||
					// Handle special case for category matching
					(quest.category?.startsWith("Main") &&
						formattedCategory === "Main Quests") ||
					(quest.category?.startsWith("Side") &&
						formattedCategory === "Side Quests") ||
					// Match quest ID prefix for main and side quests
					(formattedCategory === "Main Quests" && quest.id.startsWith("MQ")) ||
					(formattedCategory === "Side Quests" && quest.id.startsWith("SQ")) ||
					(formattedCategory === "Faction Quests" &&
						quest.id.startsWith("FQ")) ||
					(formattedCategory === "Personal Quests" &&
						quest.id.startsWith("PQ")),
			)

			if (categoryQuests.length === 0) {
				logger.warn.data(`No quests found for category ${formattedCategory}`)
				// Don't notFound() here, let the component handle empty categories
			}
		}

		logger.debug.data("QuestDisplayServer ready", {
			questCount: questsData.quests.length,
			hasSelectedQuest: !!questId,
			category: formattedCategory,
		})

		const pageTitle =
			formattedCategory || (questId ? "Quest Details" : "All Quests")

		return (
			<div className="container mx-auto p-4">
				<h1 className="text-2xl font-bold mb-4">{pageTitle}</h1>
				<Suspense fallback={<div>Loading quests...</div>}>
					<QuestDisplay
						questId={questId}
						currentCategory={formattedCategory}
						questsData={questsData}
						initialQuestData={
							questId
								? questsData.quests.find(
										(quest) =>
											quest.id === questId ||
											quest.id?.toLowerCase() === questId.toLowerCase(),
									)
								: null
						}
					/>
				</Suspense>
			</div>
		)
	} catch (error) {
		logger.error.data("Error in QuestDisplayServer", error)
		return <div>Error loading quests: {(error as Error).message}</div>
	}
}
