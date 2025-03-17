"use client"

import { notFound, redirect, useRouter } from "next/navigation"
import { useCampaignData } from "@/components/CampaignDataProvider"
import { use } from "react"
import { nameToId } from "@/server/utils/contentUtils"
import type { Quest } from "@/app/quests/[category]/[id]/components/types"

export default function QuestCategoryPage({
	params,
}: { params: Promise<{ category: string }> }) {
	const { category } = use(params)
	const { quests: questsDataArray } = useCampaignData()

	// Check if this is a valid category by comparing normalized names
	const matchesParam = questsDataArray.some(
		(quest) =>
			quest.category && nameToId(quest.category) === category.toLowerCase(),
	)

	if (!matchesParam) {
		// If not a category, check if it's a quest ID
		const matchesId = questsDataArray.find((questGroup) =>
			questGroup.quests.find((quest) => quest.id === category),
		)

		if (matchesId) {
			// Found a quest with this ID, redirect to its proper page
			const foundQuest = matchesId.quests.find((quest) => quest.id === category)
			const questCategory =
				foundQuest?.category || getCategoryFromId(foundQuest?.id || "")

			redirect(
				`/quests/${questCategory ? nameToId(questCategory) : ""}/${category}`,
			)
		} else {
			notFound()
		}
	}

	// Find the first quest in this category
	const firstQuestInCategory = questsDataArray.find(
		(quest) =>
			quest.category && nameToId(quest.category) === category.toLowerCase(),
	)

	// If we found a quest in this category, redirect to it
	if (firstQuestInCategory && firstQuestInCategory.quests.length > 0) {
		redirect(`/quests/${category}/${firstQuestInCategory.quests[0].id}`)
	}

	// If we get here, something went wrong
	notFound()
}

// Helper function to determine category from quest ID
function getCategoryFromId(id: string): string | null {
	if (id.startsWith("MQ")) return "Main Quests"
	if (id.startsWith("SQ")) return "Side Quests"
	if (id.startsWith("FQ")) return "Faction Quests"
	if (id.startsWith("PQ")) return "Personal Quests"
	if (id.startsWith("GQ")) return "Generic Quests"
	return null
}
