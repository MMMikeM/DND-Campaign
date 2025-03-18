import type { z } from "zod"
import type { FactionsFileSchema } from "@/server/schemas"
import type { ChipColor } from "@/components/Chip"

// Types for our components
export type FactionData = z.infer<typeof FactionsFileSchema>
export type Faction = FactionData["factions"][string]

// Type for faction type styling
export type FactionTypeStyle = {
	icon: string
	bgClass: string
	textClass: string
	chipColor: ChipColor
}

// Additional types for our components
export interface FactionLeader {
	name: string
	description?: string
	role?: string
	secret?: string
	secret_leader?: boolean
	stats?: string
	bio?: string
}
