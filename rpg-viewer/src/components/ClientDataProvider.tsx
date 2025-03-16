"use client"

import { createContext, useContext, type ReactNode } from "react"

// Define a more flexible type for our campaign data
interface CampaignData {
	npcs: any[]
	factions: any[]
	locations: any[]
	quests: any[]
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
