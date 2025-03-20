import type { APIRoute } from "astro"
import { db } from "../../../lib/db"
import { quests } from "@tome-keeper/shared"
import { eq } from "drizzle-orm"
import { updateQuestSchema } from "../../../lib/schemas"
import { handleError, APIError } from "../../../lib/api"

export const GET: APIRoute = async ({ params }) => {
	try {
		const questId = Number(params.id)
		if (Number.isNaN(questId)) {
			throw new APIError("Invalid quest ID", 400)
		}

		const quest = await db.select().from(quests).where(eq(quests.id, questId)).get()
		if (!quest) {
			throw new APIError("Quest not found", 404)
		}

		return new Response(JSON.stringify(quest), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		})
	} catch (error) {
		return handleError(error)
	}
}

export const PUT: APIRoute = async ({ request, params }) => {
	try {
		const questId = Number(params.id)
		if (Number.isNaN(questId)) {
			throw new APIError("Invalid quest ID", 400)
		}

		const formData = await request.formData()
		const questData = {
			title: formData.get("title"),
			description: formData.get("description"),
			type: formData.get("type"),
			difficulty: formData.get("difficulty"),
			adaptable: formData.get("adaptable") === "on",
		}

		// Validate the input
		const validatedData = updateQuestSchema.parse(questData)

		// Update the quest
		const [updatedQuest] = await db
			.update(quests)
			.set(validatedData)
			.where(eq(quests.id, questId))
			.returning()

		if (!updatedQuest) {
			throw new APIError("Quest not found", 404)
		}

		return new Response(JSON.stringify(updatedQuest), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		})
	} catch (error) {
		return handleError(error)
	}
}

export const DELETE: APIRoute = async ({ params }) => {
	try {
		const questId = Number(params.id)
		if (Number.isNaN(questId)) {
			throw new APIError("Invalid quest ID", 400)
		}

		const [deletedQuest] = await db.delete(quests).where(eq(quests.id, questId)).returning()

		if (!deletedQuest) {
			throw new APIError("Quest not found", 404)
		}

		return new Response(null, { status: 204 })
	} catch (error) {
		return handleError(error)
	}
}
