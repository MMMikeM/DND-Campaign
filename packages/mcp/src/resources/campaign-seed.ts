import { z } from "zod/v4"
import { foreshadowing, lore } from "../tools/tools"

const loreSeedSchema = z.object({
	name: z.string(),
	summary: z.string(),
	loreType: z.string(),
	tags: z.array(z.string()).optional(),
})

const narrativeEventSeedSchema = z.object({
	name: z.string(),
	description: z.string(),
	eventType: z.string(),
})

const narrativeDestinationSeedSchema = z.object({
	name: z.string(),
	description: z.string(),
	type: z.string(),
	stakes: z.string(),
})

const foreshadowingSeedSchema = z.object({
	name: z.string(),
	description: z.string(),
	subtlety: z.string().optional(),
})

export const campaignSeedSchema = z.object({
	lore: z.array(loreSeedSchema).optional(),
	narrativeEvents: z.array(narrativeEventSeedSchema).optional(),
	narrativeDestinations: z.array(narrativeDestinationSeedSchema).optional(),
	foreshadowing: z.array(foreshadowingSeedSchema).optional(),
})

export type CampaignSeed = z.infer<typeof campaignSeedSchema>

export async function handleCampaignSeed(seed: CampaignSeed) {
	if (seed.lore) {
		for (const loreItem of seed.lore) {
			await lore.handlers.manage_lore({ create: { lore: loreItem } })
		}
	}
	if (seed.foreshadowing) {
		for (const item of seed.foreshadowing) {
			await foreshadowing.handlers.manage_foreshadowing({ create: { foreshadowing: item } })
		}
	}
}
