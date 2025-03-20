import type { APIRoute } from "astro"
import { db } from "../../../lib/db"
import { npcs } from "@tome-keeper/shared"
import { desc } from "drizzle-orm"
import { insertNpcSchema } from "../../../lib/schemas"
import { handleError, APIError } from "../../../lib/api"

export const GET: APIRoute = async () => {
	try {
		const allNpcs = await db.select().from(npcs).orderBy(desc(npcs.id))
		return new Response(JSON.stringify(allNpcs), {
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
		const npcData = {
			name: formData.get("name"),
			race: formData.get("race"),
			gender: formData.get("gender"),
			occupation: formData.get("occupation"),
			role: formData.get("role"),
			quirk: formData.get("quirk"),
			background: formData.get("background"),
			motivation: formData.get("motivation"),
			secret: formData.get("secret"),
			stats: formData.get("stats"),
			descriptions: [],
			personalityTraits: [],
			inventory: [],
			dialogue: [],
		}

		// Validate the input
		const validatedData = insertNpcSchema.parse(npcData)

		// Insert the NPC
		const [newNpc] = await db.insert(npcs).values(validatedData).returning()

		return new Response(JSON.stringify(newNpc), {
			status: 201,
			headers: { "Content-Type": "application/json" },
		})
	} catch (error) {
		return handleError(error)
	}
}
