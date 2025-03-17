"use client"

import { Suspense, use, useState } from "react"
import type { ChangeEvent } from "react"
import { useCampaignData } from "@/components/CampaignDataProvider"
import { useRouter, notFound } from "next/navigation"
import {
	NPCHeader,
	NPCDescription,
	NPCPersonality,
	NPCMotivation,
	NPCSecret,
	NPCQuests,
	NPCInventory,
	NPCRelationships,
	NPCAffiliations,
	NPCStats,
} from "./components"
import { NPCBackground } from "./components/NPCBackground"

// Main page component
export default function NPCPage({ params }: { params: Promise<{ id: string }> }) {
	const { id: npcId } = use(params)

	const { npcs: npcsDataArray } = useCampaignData()
	const router = useRouter()

	// State for DM content visibility
	const [showSecret, setShowSecret] = useState(false)
	const [showInventory, setShowInventory] = useState(false)

	if (!npcsDataArray || npcsDataArray.length === 0) {
		notFound()
	}

	const npcsData = npcsDataArray[0]

	// Check if the NPC exists
	const npcExists =
		npcsData.npcs.some(
			(npc) =>
				npc.id === npcId ||
				npc.id?.toLowerCase() === npcId.toLowerCase() ||
				(npc.name && npc.name.toLowerCase().replace(/\s+/g, "-") === npcId),
		) ||
		npcsData.generic_npcs?.some(
			(npc) =>
				npc.id === npcId ||
				npc.id?.toLowerCase() === npcId.toLowerCase() ||
				(npc.name && npc.name.toLowerCase().replace(/\s+/g, "-") === npcId),
		)

	if (!npcExists) {
		// If NPC doesn't exist, redirect to the first NPC with a valid ID
		if (npcsData.npcs.length > 0) {
			// Find the first NPC with a valid ID or name
			for (const npc of npcsData.npcs) {
				if (npc.name) {
					const id = npc.id || npc.name.toLowerCase().replace(/\s+/g, "-")
					router.push(`/npcs/${id}`)
					return <div>Redirecting to valid NPC...</div>
				}
			}

			// If no regular NPCs, try generic NPCs
			if (npcsData.generic_npcs && npcsData.generic_npcs.length > 0) {
				for (const npc of npcsData.generic_npcs) {
					if (npc.name) {
						const id = npc.id || npc.name.toLowerCase().replace(/\s+/g, "-")
						router.push(`/npcs/${id}`)
						return <div>Redirecting to valid NPC...</div>
					}
				}
			}

			// If no NPCs have valid IDs, show 404
			notFound()
		}
		// If no NPCs, show 404
		notFound()
	}

	// Find the current NPC
	let currentNpc = npcsData.npcs.find(
		(npc) =>
			npc.id === npcId ||
			npc.id?.toLowerCase() === npcId.toLowerCase() ||
			(npc.name && npc.name.toLowerCase().replace(/\s+/g, "-") === npcId),
	)

	// If not found in regular NPCs, check generic NPCs
	if (!currentNpc && npcsData.generic_npcs) {
		currentNpc = npcsData.generic_npcs.find(
			(npc) =>
				npc.id === npcId ||
				npc.id?.toLowerCase() === npcId.toLowerCase() ||
				(npc.name && npc.name.toLowerCase().replace(/\s+/g, "-") === npcId),
		)
	}

	// Safety check - this should never happen due to the npcExists check above
	if (!currentNpc) {
		notFound()
	}

	// Handle NPC change directly from the dropdown
	const handleNpcChange = (e: ChangeEvent<HTMLSelectElement>) => {
		const newNpcId = e.target.value
		router.push(`/npcs/${newNpcId}`)
	}

	// Toggle functions for DM content
	const toggleSecret = () => {
		setShowSecret(!showSecret)
	}

	const toggleInventory = () => {
		setShowInventory(!showInventory)
	}

	const toggleAllDMContent = () => {
		const paired = showSecret || showInventory
		setShowSecret(!paired)
		setShowInventory(!paired)
	}

	return (
		<Suspense fallback={<div>Loading NPC data...</div>}>
			<div className="container mx-auto p-4 max-w-6xl">
				<h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">NPCs</h1>
				<article className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 transition-colors duration-300 overflow-hidden">
					<NPCHeader
						npc={currentNpc}
						npcId={npcId}
						npcs={[...npcsData.npcs, ...(npcsData.generic_npcs || [])]}
						handleNpcChange={handleNpcChange}
						showSecret={showSecret}
						showInventory={showInventory}
						toggleAllDMContent={toggleAllDMContent}
					/>
					<main className="p-6 pt-0 space-y-8">
						{/* NPC Overview */}

						{/* Description and Personality */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<NPCDescription npc={currentNpc} />
							<NPCPersonality npc={currentNpc} />
						</div>

						<NPCBackground currentNpc={currentNpc} />
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<NPCMotivation npc={currentNpc} />
							<NPCSecret npc={currentNpc} showSecret={showSecret} toggleSecret={toggleSecret} />
						</div>

						<NPCQuests npc={currentNpc} />

						<NPCStats npc={currentNpc} />

						<NPCRelationships npc={currentNpc} />

						<NPCAffiliations npc={currentNpc} />

						<NPCInventory
							npc={currentNpc}
							showInventory={showInventory}
							toggleInventory={toggleInventory}
						/>
					</main>
				</article>
			</div>
		</Suspense>
	)
}
