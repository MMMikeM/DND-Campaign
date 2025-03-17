import type { z } from "zod"
import type { FactionsFileSchema } from "@/server/schemas"

// Types for our components
export type FactionData = z.infer<typeof FactionsFileSchema>
export type Faction = FactionData["factions"][string]

// Type for faction type styling
export type FactionTypeStyle = {
	icon: string
	bgClass: string
	textClass: string
}
