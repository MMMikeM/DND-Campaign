import type { APIRoute } from "astro"
import { db } from "../../../lib/db"
import { locations } from "@tome-keeper/shared"
import { desc } from "drizzle-orm"
import { insertLocationSchema } from "../../../lib/schemas"
import { handleError, APIError } from "../../../lib/api"

export const GET: APIRoute = async () => {
	try {
		const allLocations = await db.select().from(locations).orderBy(desc(locations.id))
		return new Response(JSON.stringify(allLocations), {
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
		const locationData = {
			name: formData.get("name"),
			type: formData.get("type"),
			region: formData.get("region"),
			description: formData.get("description"),
			history: formData.get("history"),
			dangerLevel: formData.get("dangerLevel"),
			factionControl: formData.get("factionControl"),
			notableFeatures: [],
		}

		// Validate the input
		const validatedData = insertLocationSchema.parse(locationData)

		// Insert the location
		const [newLocation] = await db.insert(locations).values(validatedData).returning()

		return new Response(JSON.stringify(newLocation), {
			status: 201,
			headers: { "Content-Type": "application/json" },
		})
	} catch (error) {
		return handleError(error)
	}
}
