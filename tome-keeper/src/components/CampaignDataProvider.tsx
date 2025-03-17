"use client"

import type {
	NpcsFileSchema,
	FactionsFileSchema,
	LocationsFileSchema,
	QuestsFileSchema,
} from "@/server/schemas"
import { createContext, useContext, type ReactNode } from "react"
import type { z } from "zod"

export interface CampaignData {
	npcs: z.infer<typeof NpcsFileSchema>[]
	factions: z.infer<typeof FactionsFileSchema>[]
	locations: z.infer<typeof LocationsFileSchema>[]
	quests: z.infer<typeof QuestsFileSchema>[]
}

// Create a context with a default empty state
const CampaignDataContext = createContext<CampaignData>({
	npcs: [],
	factions: [],
	locations: [],
	quests: [],
})

// Hook to easily access the context data
export const useCampaignData = () => useContext(CampaignDataContext)

// Provider component that makes campaign data available to all child components
export function CampaignDataProvider({
	children,
	initialData,
}: {
	children: ReactNode
	initialData: CampaignData
}) {
	return (
		<CampaignDataContext.Provider value={initialData}>
			{children}
		</CampaignDataContext.Provider>
	)
}

// Export the old name for backward compatibility during transition
export const ClientDataProvider = CampaignDataProvider
export const useClientData = useCampaignData
