"use client"

import { redirect } from "next/navigation"
import { useCampaignData } from "@/components/CampaignDataProvider"

export default function NPCsPage() {
	const { npcs: npcsDataArray } = useCampaignData()

	// If we have NPCs, redirect to the first one
	if (npcsDataArray && npcsDataArray.length > 0) {
		const npcsData = npcsDataArray[0]

		if (npcsData.npcs && npcsData.npcs.length > 0) {
			// Find the first NPC with a valid ID or name
			for (const npc of npcsData.npcs) {
				if (npc.name) {
					const id = npc.id || npc.name.toLowerCase().replace(/\s+/g, "-")
					redirect(`/npcs/${id}`)
				}
			}

			// If no regular NPCs, try generic NPCs
			if (npcsData.generic_npcs && npcsData.generic_npcs.length > 0) {
				for (const npc of npcsData.generic_npcs) {
					if (npc.name) {
						const id = npc.id || npc.name.toLowerCase().replace(/\s+/g, "-")
						redirect(`/npcs/${id}`)
					}
				}
			}
		}
	}

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">NPCs</h1>
			<div className="bg-white dark:bg-gray-900 rounded-lg shadow-md border dark:border-gray-800 p-8 text-center">
				<div className="animate-pulse">
					<p className="text-gray-600 dark:text-gray-400">
						{npcsDataArray && npcsDataArray.length > 0
							? "Redirecting to NPC..."
							: "No NPCs found."}
					</p>
				</div>
			</div>
		</div>
	)
}
