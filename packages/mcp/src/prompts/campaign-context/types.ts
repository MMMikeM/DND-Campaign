import { z } from "zod/v4"

export const campaignContextSchema = z.object({})

export type CampaignContextArgs = z.infer<typeof campaignContextSchema>
