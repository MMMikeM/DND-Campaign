import type { APIRoute } from "astro"
import { db } from "../../../lib/db"
import { quests } from "@tome-keeper/shared"

export const POST: APIRoute = async ({ request }) => {
	const formData = await request.formData()

	const questData = {
		title: formData.get("title") as string,
		description: formData.get("description") as string,
		type: formData.get("type") as string,
		difficulty: formData.get("difficulty") as string,
		adaptable: formData.get("adaptable") === "on",
		// Initialize empty JSON fields
		stages: [],
		objectives: [],
		completionPaths: [],
		decisionPoints: [],
		decisionChoices: [],
		twists: [],
		rewards: [],
	}

	try {
		await db.insert(quests).values(questData)
		return Response.redirect("/quests", 302)
	} catch (error) {
		console.error("Failed to create quest:", error)
		return new Response("Failed to create quest", { status: 500 })
	}
}
