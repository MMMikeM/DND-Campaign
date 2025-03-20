import type { APIRoute } from "astro"
import { db } from "../../../lib/db"
import { factions } from "@tome-keeper/shared"
import { eq } from "drizzle-orm"
import { updateFactionSchema } from "../../../lib/schemas"
import { handleError, APIError } from "../../../lib/api"

export const GET: APIRoute = async ({ params }) => {
	try {
		const factionId = Number(params.id)
		if (Number.isNaN(factionId)) {
			throw new APIError("Invalid faction ID", 400)
		}

		const faction = await db.select().from(factions).where(eq(factions.id, factionId)).get()
		if (!faction) {
			throw new APIError("Faction not found", 404)
		}

		return new Response(JSON.stringify(faction), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		})
	} catch (error) {
		return handleError(error)
	}
}

export const PUT: APIRoute = async ({ request, params }) => {
	try {
		const factionId = Number(params.id)
		if (Number.isNaN(factionId)) {
			throw new APIError("Invalid faction ID", 400)
		}

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
		const validatedData = updateFactionSchema.parse(factionData)

		// Update the faction
		const [updatedFaction] = await db
			.update(factions)
			.set(validatedData)
			.where(eq(factions.id, factionId))
			.returning()

		if (!updatedFaction) {
			throw new APIError("Faction not found", 404)
		}

		return new Response(JSON.stringify(updatedFaction), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		})
	} catch (error) {
		return handleError(error)
	}
}

export const DELETE: APIRoute = async ({ params }) => {
	try {
		const factionId = Number(params.id)
		if (Number.isNaN(factionId)) {
			throw new APIError("Invalid faction ID", 400)
		}

		const [deletedFaction] = await db.delete(factions).where(eq(factions.id, factionId)).returning()

		if (!deletedFaction) {
			throw new APIError("Faction not found", 404)
		}

		return new Response(null, { status: 204 })
	} catch (error) {
		return handleError(error)
	}
}
