import type { APIRoute } from "astro"
import { db } from "../../../lib/db"
import { quests } from "@tome-keeper/shared"
import { desc } from "drizzle-orm"
import { insertQuestSchema } from "../../../lib/schemas"
import { handleError, APIError } from "../../../lib/api"

export const GET: APIRoute = async () => {
	try {
		const allQuests = await db.select().from(quests).orderBy(desc(quests.id))
		return new Response(JSON.stringify(allQuests), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		})
	} catch (error) {
		return handleError(error)
	}
}

export const POST: APIRoute = async ({ request }) => {
	try {
		const formData = await request.formData()
		const questData = {
			title: formData.get("title"),
			description: formData.get("description"),
			type: formData.get("type"),
			difficulty: formData.get("difficulty"),
			adaptable: formData.get("adaptable") === "on",
			stages: [],
			objectives: [],
			completionPaths: [],
			decisionPoints: [],
			decisionChoices: [],
			twists: [],
			rewards: [],
		}

		// Validate the input
		const validatedData = insertQuestSchema.parse(questData)

		// Insert the quest
		const [newQuest] = await db.insert(quests).values(validatedData).returning()

		return new Response(JSON.stringify(newQuest), {
			status: 201,
			headers: { "Content-Type": "application/json" },
		})
	} catch (error) {
		return handleError(error)
	}
}
