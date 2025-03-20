import type { APIRoute } from "astro"
import { db } from "../../../lib/db"
import { npcs } from "@tome-keeper/shared"
import { eq } from "drizzle-orm"
import { updateNpcSchema } from "../../../lib/schemas"
import { handleError, APIError } from "../../../lib/api"

export const GET: APIRoute = async ({ params }) => {
	try {
		const npcId = Number(params.id)
		if (Number.isNaN(npcId)) {
			throw new APIError("Invalid NPC ID", 400)
		}

		const npc = await db.select().from(npcs).where(eq(npcs.id, npcId)).get()
		if (!npc) {
			throw new APIError("NPC not found", 404)
		}

		return new Response(JSON.stringify(npc), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		})
	} catch (error) {
		return handleError(error)
	}
}

export const PUT: APIRoute = async ({ request, params }) => {
	try {
		const npcId = Number(params.id)
		if (Number.isNaN(npcId)) {
			throw new APIError("Invalid NPC ID", 400)
		}

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
		}

		// Validate the input
		const validatedData = updateNpcSchema.parse(npcData)

		// Update the NPC
		const [updatedNpc] = await db
			.update(npcs)
			.set(validatedData)
			.where(eq(npcs.id, npcId))
			.returning()

		if (!updatedNpc) {
			throw new APIError("NPC not found", 404)
		}

		return new Response(JSON.stringify(updatedNpc), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		})
	} catch (error) {
		return handleError(error)
	}
}

export const DELETE: APIRoute = async ({ params }) => {
	try {
		const npcId = Number(params.id)
		if (Number.isNaN(npcId)) {
			throw new APIError("Invalid NPC ID", 400)
		}

		const [deletedNpc] = await db.delete(npcs).where(eq(npcs.id, npcId)).returning()

		if (!deletedNpc) {
			throw new APIError("NPC not found", 404)
		}

		return new Response(null, { status: 204 })
	} catch (error) {
		return handleError(error)
	}
}
