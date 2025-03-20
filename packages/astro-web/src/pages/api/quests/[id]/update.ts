import type { APIRoute } from "astro"
import { db } from "../../../../lib/db"
import { quests } from "@tome-keeper/shared"
import { eq } from "drizzle-orm"

export const POST: APIRoute = async ({ request, params }) => {
	const formData = await request.formData()
	const questId = Number(params.id)

	const questData = {
		title: formData.get("title") as string,
		description: formData.get("description") as string,
		type: formData.get("type") as string,
		difficulty: formData.get("difficulty") as string,
		adaptable: formData.get("adaptable") === "on",
	}

	try {
		await db.update(quests).set(questData).where(eq(quests.id, questId))
		return Response.redirect("/quests", 302)
	} catch (error) {
		console.error("Failed to update quest:", error)
		return new Response("Failed to update quest", { status: 500 })
	}
}
