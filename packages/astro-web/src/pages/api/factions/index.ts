import type { APIRoute } from "astro"
import { db } from "../../../lib/db"
import { factions } from "@tome-keeper/shared"
import { desc } from "drizzle-orm"
import { insertFactionSchema } from "../../../lib/schemas"
import { handleError, APIError } from "../../../lib/api"

export const GET: APIRoute = async () => {
	try {
		const allFactions = await db.select().from(factions).orderBy(desc(factions.id))
		return new Response(JSON.stringify(allFactions), {
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
		const factionData = {
			name: formData.get("name"),
			type: formData.get("type"),
			alignment: formData.get("alignment"),
			description: formData.get("description"),
			publicGoal: formData.get("publicGoal"),
			trueGoal: formData.get("trueGoal"),
			headquarters: formData.get("headquarters"),
			territory: formData.get("territory"),
			history: formData.get("history"),
			notes: formData.get("notes"),
		}

		// Validate the input
		const validatedData = insertFactionSchema.parse(factionData)

		// Insert the faction
		const [newFaction] = await db.insert(factions).values(validatedData).returning()

		return new Response(JSON.stringify(newFaction), {
			status: 201,
			headers: { "Content-Type": "application/json" },
		})
	} catch (error) {
		return handleError(error)
	}
}
