import { z } from "zod/v4"

export const campaignContextSchema = z
	.object({
		questName: z.string().optional().describe("The name of a specific quest to focus on for detailed context."),
		factionName: z.string().optional().describe("The name of a specific faction to focus on for detailed context."),
	})
	.refine((data) => !(data.questName && data.factionName), {
		message: "Cannot provide both questName and factionName. Please choose one.",
		path: ["questName", "factionName"],
	})

export type CampaignContextArgs = z.infer<typeof campaignContextSchema>
