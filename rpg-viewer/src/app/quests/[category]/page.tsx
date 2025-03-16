"use client"

import { notFound, redirect, useRouter } from "next/navigation"
import { useCampaignData } from "@/components/CampaignDataProvider"
import { use } from "react"

const nameToId = (name: string) => {
	return name.toLowerCase().replace(/\s+/g, "-")
}

export default function QuestCategoryPage({
	params,
}: { params: Promise<{ category: string }> }) {
	const paramValue = use(params) || {}
	const category = paramValue.category || ""
	const { quests: questsDataArray } = useCampaignData()

	const matchesParam = questsDataArray.some(
		(quest) => nameToId(quest.category || "") === category,
	)

	if (!matchesParam) {
		notFound()
	}

	const firstQuestInCategory = questsDataArray.find(
		(quest) => nameToId(quest.category || "") === category,
	)

	redirect(`/quests/${category}/${firstQuestInCategory?.quests?.[0]?.id}`)
}
