"use client"

import { useCampaignData } from "@/components/CampaignDataProvider"
import NPCDisplay from "./NPCDisplay"
import { notFound } from "next/navigation"

interface NPCDisplayClientProps {
	npcId?: string
}

export default function NPCDisplayClient({ npcId }: NPCDisplayClientProps) {
	// Get data from the campaign data provider
	const { npcs: npcsDataArray } = useCampaignData()

	if (!npcsDataArray || npcsDataArray.length === 0) {
		return <div>No NPCs data available</div>
	}

	const npcsData = npcsDataArray[0] as any // Get first item from array

	// If a specific NPC ID is provided, verify it exists
	if (npcId) {
		const npcData = npcsData.npcs?.find(
			(npc: any) =>
				npc.id === npcId || npc.id?.toLowerCase() === npcId.toLowerCase(),
		)

		if (!npcData) {
			// Use Next.js notFound for 404 handling
			notFound()
		}
	}

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">NPCs</h1>
			<NPCDisplay
				npcId={npcId}
				npcsData={npcsData}
				initialNpcData={
					npcId
						? npcsData.npcs?.find(
								(npc: any) =>
									npc.id === npcId ||
									npc.id?.toLowerCase() === npcId.toLowerCase(),
							)
						: null
				}
			/>
		</div>
	)
}
