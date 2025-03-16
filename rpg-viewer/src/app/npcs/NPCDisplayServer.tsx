"use server"

import { Suspense } from "react"
import { getDataByType } from "@/server/utils/contentUtils"
import { NpcsFileSchema } from "@/server/schemas"
import NPCDisplay from "@/components/content-types/NPCDisplay"
import { logger } from "@/utils/logger"
import { notFound } from "next/navigation"

export default async function NPCDisplayServer({
	npcId,
}: { npcId?: string } = {}) {
	logger.debug.routing("NPCDisplayServer render starting", { npcId })

	try {
		// Fetch data directly on the server
		const npcsDataArray = await getDataByType(
			"npcs",
			NpcsFileSchema,
			"shattered-spire",
		)

		if (!npcsDataArray || npcsDataArray.length === 0) {
			logger.warn.data("No NPCs data available")
			return <div>No NPCs data available</div>
		}

		const npcsData = npcsDataArray[0] // Get first item from array

		// If a specific NPC ID is provided, verify it exists
		if (npcId) {
			const npcData = npcsData.npcs.find(
				(npc) =>
					npc.id === npcId || npc.id?.toLowerCase() === npcId.toLowerCase(),
			)

			if (!npcData) {
				logger.warn.data(`NPC with ID ${npcId} not found in data`)
				notFound()
			} else {
				logger.debug.data("Found specific NPC data", { npcId })
			}
		}

		logger.debug.data("NPCDisplayServer ready", {
			npcCount: npcsData.npcs.length,
			hasSelectedNPC: !!npcId,
		})

		return (
			<div className="container mx-auto p-4">
				<h1 className="text-2xl font-bold mb-4">NPCs</h1>
				<Suspense fallback={<div>Loading NPCs...</div>}>
					<NPCDisplay
						npcId={npcId}
						npcsData={npcsData}
						initialNpcData={
							npcId
								? npcsData.npcs.find(
										(npc) =>
											npc.id === npcId ||
											npc.id?.toLowerCase() === npcId.toLowerCase(),
									)
								: null
						}
					/>
				</Suspense>
			</div>
		)
	} catch (error) {
		logger.error.data("Error in NPCDisplayServer", error)
		return <div>Error loading NPCs: {(error as Error).message}</div>
	}
}
