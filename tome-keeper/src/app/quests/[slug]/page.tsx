"use client"

import { notFound, redirect } from "next/navigation"
import { useCampaignData } from "@/components/CampaignDataProvider"
import { use } from "react"
import { idToName, nameToId } from "@/server/utils/contentUtils"

export default function QuestCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = use(params)
	const { quests: questsDataArray } = useCampaignData()

	const id = slug.toLowerCase()

	const firstQuestInCategory = questsDataArray.find(
		(quest) => quest.category && nameToId(quest.category) === id,
	)

	if (firstQuestInCategory?.quests.length) {
		redirect(`/quests/${id}/${firstQuestInCategory.quests[0].id}`)
	}

	const matchingQuestGroup = questsDataArray.find((questGroup) => {
		const idMatch = questGroup.quests.find((quest) => quest.id === id)
		const nameMatch = questGroup.quests.find((quest) => nameToId(quest.title) === id)
		return idMatch || nameMatch
	})

	if (matchingQuestGroup) {
		redirect(`/quests/${id}/${matchingQuestGroup.quests[0].id}`)
	}

	notFound()
}
