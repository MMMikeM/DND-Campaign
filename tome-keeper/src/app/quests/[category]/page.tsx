"use client"

import { notFound, redirect, useRouter } from "next/navigation"
import { useCampaignData } from "@/components/CampaignDataProvider"
import { use } from "react"
import { nameToId } from "@/server/utils/contentUtils"

export default function QuestCategoryPage({
	params,
}: { params: Promise<{ category: string }> }) {
	const paramValue = use(params) || {}
	const category = paramValue.category
	const { quests: questsDataArray } = useCampaignData()

	const matchesParam = questsDataArray.some(
		(quest) => quest.category && nameToId(quest.category) === category,
	)

	if (!matchesParam) {
		const matchesId = questsDataArray.find((quest) =>
			quest.quests.find((quest) => quest.id === category),
		)
		if (matchesId) {
			redirect(
				`/quests/${matchesId.category ? nameToId(matchesId.category) : ""}/${matchesId.quests[0].id}`,
			)
		} else {
			notFound()
		}
	}

	const firstQuestInCategory = questsDataArray.find(
		(quest) => quest.category && nameToId(quest.category) === category,
	)

	redirect(`/quests/${category}/${firstQuestInCategory?.quests?.[0]?.id}`)
}
