"use client"

import { Suspense, use, useState } from "react"
import type { ChangeEvent } from "react"
import { useCampaignData } from "@/components/CampaignDataProvider"
import type { FactionsFileSchema } from "@/server/schemas"
import type { z } from "zod"
import { useRouter, notFound } from "next/navigation"
import {
	FactionHeader,
	FactionGoals,
	FactionDescription,
	FactionResources,
	FactionLeadership,
	FactionTerritory,
	FactionRelations,
	FactionNotes,
	FactionMembers,
	FactionQuests,
} from "./components"

// Main page component
export default function FactionPage({ params }: { params: Promise<{ id: string }> }) {
	const factionId = use(params).id

	// Get data from the campaign data provider
	const { factions: factionsDataArray } = useCampaignData()
	const router = useRouter()

	// State for DM content visibility
	const [showTrueGoal, setShowTrueGoal] = useState(false)
	const [showTrueLeader, setShowTrueLeader] = useState(false)
	const [showSecrets, setShowSecrets] = useState(false)

	// Toggle functions for DM content
	const toggleTrueGoal = () => {
		setShowTrueGoal(!showTrueGoal)
	}

	const toggleTrueLeader = () => {
		setShowTrueLeader(!showTrueLeader)
	}

	const toggleSecrets = () => {
		setShowSecrets(!showSecrets)
	}

	// Toggle all DM content at once
	const toggleAllDMContent = () => {
		const allHidden = !showTrueGoal && !showTrueLeader && !showSecrets
		setShowTrueGoal(allHidden)
		setShowTrueLeader(allHidden)
		setShowSecrets(allHidden)
	}

	if (!factionsDataArray || factionsDataArray.length === 0) {
		return <div className="container mx-auto p-4">No factions data available</div>
	}

	// Get first item from array - using type assertion with a more specific type
	const factionsData = factionsDataArray[0] as z.infer<typeof FactionsFileSchema>

	// Check if the faction exists
	const factionExists =
		factionsData.factions &&
		Object.keys(factionsData.factions).some((faction) => faction === factionId)

	if (!factionExists) {
		// Use Next.js notFound for 404 handling
		notFound()
	}

	const handleFactionChange = async (e: ChangeEvent<HTMLSelectElement>) => {
		const newFactionId = e.target.value
		router.push(`/factions/${newFactionId}`)
	}

	const factionIds = Object.keys(factionsData.factions)
	const currentFaction = factionsData.factions[factionId]

	return (
		<Suspense fallback={<div>Loading faction data...</div>}>
			<div className="container mx-auto p-4 max-w-6xl">
				<h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">Factions</h1>
				<article className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 transition-colors duration-300 overflow-hidden">
					<FactionHeader
						factionId={factionId}
						factionIds={factionIds}
						faction={currentFaction}
						handleFactionChange={handleFactionChange}
						showDMContent={{ showTrueGoal, showTrueLeader, showSecrets }}
						toggleAllDMContent={toggleAllDMContent}
					/>

					<main className="p-6 pt-2 space-y-8">
						<FactionGoals
							faction={currentFaction}
							showTrueGoal={showTrueGoal}
							toggleTrueGoal={toggleTrueGoal}
						/>
						<FactionDescription faction={currentFaction} />
						<FactionResources
							faction={currentFaction}
							showSecrets={showSecrets}
							toggleSecrets={toggleSecrets}
						/>
						<FactionLeadership
							faction={currentFaction}
							showTrueLeader={showTrueLeader}
							toggleTrueLeader={toggleTrueLeader}
							showSecrets={showSecrets}
							toggleSecrets={toggleSecrets}
						/>
						<FactionTerritory faction={currentFaction} />
						<FactionRelations faction={currentFaction} />
						<FactionNotes faction={currentFaction} />
						<FactionMembers faction={currentFaction} />
						<FactionQuests faction={currentFaction} />
					</main>
				</article>
			</div>
		</Suspense>
	)
}
