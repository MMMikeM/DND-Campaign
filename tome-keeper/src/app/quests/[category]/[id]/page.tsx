"use client"

import { Suspense, use, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCampaignData } from "@/components/CampaignDataProvider"
import QuestPage from "./components/page"

// Format category from slug (e.g., "side-quests" to "Side Quests")
const formatCategory = (slug: string): string => {
	return slug
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ")
}

export default function CategoryQuestPage({
	params,
}: {
	params: Promise<{ category: string; id: string }>
}) {
	const { category: categorySlug, id: questId } = use(params)
	const formattedCategory = formatCategory(categorySlug)
	const router = useRouter()
	const { quests: questsDataArray } = useCampaignData()

	// Add detailed debugging for category and quest ID
	console.log("==== CATEGORY/ID PAGE DEBUGGING ====")
	console.log("Raw params:", { categorySlug, questId })
	console.log("Formatted category:", formattedCategory)
	console.log("Number of quest groups:", questsDataArray?.length || 0)
	console.log("================================")

	// Validate that the quest exists and belongs to this category
	useEffect(() => {
		if (!questsDataArray || questsDataArray.length === 0) {
			console.log("No quest data available yet")
			return
		}

		let questFound = false
		let belongsToCategory = false
		let foundInGroup: string | undefined = undefined

		console.log("==== QUEST VALIDATION DEBUGGING ====")

		// Special case for faction quests
		if (categorySlug === "faction-quests") {
			console.log("Special case handling for faction-quests category")

			// Look for the quest in any group
			for (const questsFile of questsDataArray) {
				if (questsFile.quests && questsFile.quests.length > 0) {
					const quest = questsFile.quests.find(
						(q) =>
							q.id === questId || q.id?.toLowerCase() === questId.toLowerCase(),
					)

					if (quest) {
						// If the quest ID starts with FQ or has faction in its category, it belongs to faction quests
						if (
							quest.id?.startsWith("FQ") ||
							(quest.category || "").toLowerCase().includes("faction")
						) {
							console.log("Found faction quest:", {
								id: quest.id,
								title: quest.title,
								category: quest.category,
							})
							questFound = true
							belongsToCategory = true
							break
						}
					}
				}
			}

			if (questFound && belongsToCategory) {
				// We found the quest and it belongs to faction quests, so we can return early
				console.log("Validation successful for faction quest")
				return
			}
		}

		// Check each quest file
		for (const questsFile of questsDataArray) {
			console.log("Checking quest file:", {
				title: questsFile.title,
				category: questsFile.category,
				questCount: questsFile.quests?.length || 0,
			})

			if (questsFile.quests && questsFile.quests.length > 0) {
				// Find the quest
				const quest = questsFile.quests.find(
					(q) =>
						q.id === questId || q.id?.toLowerCase() === questId.toLowerCase(),
				)

				if (quest) {
					questFound = true
					foundInGroup = questsFile.category

					console.log("Found quest:", {
						id: quest.id,
						title: quest.title,
						questCategory: quest.category,
						fileCategory: questsFile.category,
					})

					// Check if it belongs to this category
					const questCategory =
						quest.category || getCategoryFromId(quest.id || "")

					console.log("Category check:", {
						questCategory,
						formattedCategory,
						match:
							questCategory?.toLowerCase() === formattedCategory.toLowerCase(),
					})

					if (
						questCategory &&
						questCategory.toLowerCase() === formattedCategory.toLowerCase()
					) {
						belongsToCategory = true
					}

					break
				}
			}
		}

		console.log("Validation results:", {
			questFound,
			belongsToCategory,
			foundInGroup,
		})
		console.log("================================")

		// If quest doesn't exist or doesn't belong to this category, redirect
		if (!questFound) {
			console.log("Quest not found, redirecting to category page")
			router.replace(`/quests/category/${categorySlug}`)
		} else if (!belongsToCategory) {
			// If quest exists but is in wrong category, redirect to correct category
			console.log("Quest in wrong category, redirecting to correct page")
			router.replace(`/quests/${questId}`)
		}
	}, [questsDataArray, questId, categorySlug, formattedCategory, router])

	// Helper function to determine category from quest ID
	const getCategoryFromId = (id: string): string | null => {
		if (id.startsWith("MQ")) return "Main Quests"
		if (id.startsWith("SQ")) return "Side Quests"
		if (id.startsWith("FQ")) return "Faction Quests"
		if (id.startsWith("PQ")) return "Personal Quests"
		return null
	}

	// Simply render the QuestPage component which will handle the display
	return (
		<Suspense fallback={<div>Loading quest data...</div>}>
			<QuestPage params={Promise.resolve({ id: questId })} />
		</Suspense>
	)
}
