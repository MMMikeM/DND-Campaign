"use client"

import { use, useState } from "react"
import type { ChangeEvent } from "react"
import { useRouter, notFound } from "next/navigation"
import { useCampaignData } from "@/components/CampaignDataProvider"
import { nameToId } from "@/server/utils/contentUtils"
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
} from "./components"

export default function CategoryQuestPage({
	params,
}: {
	params: Promise<{ slug: string; id: string }>
}) {
	const { slug: categorySlug, id: questId } = use(params)
	const router = useRouter()
	const { quests: questsDataArray } = useCampaignData()
	const [showDMNotes, setShowDMNotes] = useState(false)

	const questFile =
		questsDataArray.find((questFile) => nameToId(questFile.category) === categorySlug) || notFound()

	const quest = questFile.quests?.find((q) => q.id === questId) || notFound()

	const handleQuestChange = (e: ChangeEvent<HTMLSelectElement>) => {
		const newQuestId = e.target.value

		router.push(`/quests/${categorySlug}/${newQuestId}`)
	}

	const toggleDMNotes = () => setShowDMNotes(!showDMNotes)
	const toggleAllDMContent = () => setShowDMNotes(true)

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">{questFile.category || "Quests"}</h1>
			<article className="bg-white dark:bg-gray-900 rounded-lg shadow-md border dark:border-gray-800 transition-colors duration-300">
				<QuestHeader
					quest={quest}
					questId={questId}
					quests={questFile.quests}
					handleQuestChange={handleQuestChange}
					showDMNotes={showDMNotes}
					toggleDMNotes={toggleDMNotes}
					toggleAllDMContent={toggleAllDMContent}
				/>

				<main className="p-6 pt-2 space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<QuestStatus quest={quest} />
						<QuestTypeAndDifficulty quest={quest} />
					</div>
					<QuestLocation quest={quest} />
					<QuestDescription quest={quest} />
					<QuestObjectives quest={quest} />
					<QuestRewards quest={quest} />
					<QuestAssociatedNPCs quest={quest} />
					<QuestRelatedNPCs quest={quest} />
					<QuestAdaptability quest={quest} />
					<QuestNotes quest={quest} showDMNotes={showDMNotes} toggleDMNotes={toggleDMNotes} />
				</main>
			</article>
		</div>
	)
}
