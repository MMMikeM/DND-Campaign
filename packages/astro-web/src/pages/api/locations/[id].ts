import type { APIRoute } from "astro"
import { db } from "../../../lib/db"
import { locations } from "@tome-keeper/shared"
import { eq } from "drizzle-orm"
import { updateLocationSchema } from "../../../lib/schemas"
import { handleError, APIError } from "../../../lib/api"

export const GET: APIRoute = async ({ params }) => {
	try {
		const locationId = Number(params.id)
		if (Number.isNaN(locationId)) {
			throw new APIError("Invalid location ID", 400)
		}

		const location = await db.select().from(locations).where(eq(locations.id, locationId)).get()
		if (!location) {
			throw new APIError("Location not found", 404)
		}

		return new Response(JSON.stringify(location), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		})
	} catch (error) {
		return handleError(error)
	}
}

export const PUT: APIRoute = async ({ request, params }) => {
	try {
		const locationId = Number(params.id)
		if (Number.isNaN(locationId)) {
			throw new APIError("Invalid location ID", 400)
		}

		const formData = await request.formData()
		const locationData = {
			name: formData.get("name"),
			type: formData.get("type"),
			region: formData.get("region"),
			description: formData.get("description"),
			history: formData.get("history"),
			dangerLevel: formData.get("dangerLevel"),
			factionControl: formData.get("factionControl"),
		}

		// Validate the input
		const validatedData = updateLocationSchema.parse(locationData)

		// Update the location
		const [updatedLocation] = await db
			.update(locations)
			.set(validatedData)
			.where(eq(locations.id, locationId))
			.returning()

		if (!updatedLocation) {
			throw new APIError("Location not found", 404)
		}

		return new Response(JSON.stringify(updatedLocation), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		})
	} catch (error) {
		return handleError(error)
	}
}

export const DELETE: APIRoute = async ({ params }) => {
	try {
		const locationId = Number(params.id)
		if (Number.isNaN(locationId)) {
			throw new APIError("Invalid location ID", 400)
		}

		const [deletedLocation] = await db
			.delete(locations)
			.where(eq(locations.id, locationId))
			.returning()

		if (!deletedLocation) {
			throw new APIError("Location not found", 404)
		}

		return new Response(null, { status: 204 })
	} catch (error) {
		return handleError(error)
	}
}
