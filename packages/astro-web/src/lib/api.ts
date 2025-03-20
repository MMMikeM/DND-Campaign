import { ZodError } from "zod"

export class APIError extends Error {
	constructor(
		message: string,
		public status: number = 500,
		public details?: unknown,
	) {
		super(message)
	}
}

export function handleError(error: unknown): Response {
	console.error("API Error:", error)

	if (error instanceof APIError) {
		return new Response(
			JSON.stringify({
				error: error.message,
				details: error.details,
			}),
			{ status: error.status },
		)
	}

	if (error instanceof ZodError) {
		return new Response(
			JSON.stringify({
				error: "Validation Error",
				details: error.errors,
			}),
			{ status: 400 },
		)
	}

	return new Response(
		JSON.stringify({
			error: "Internal Server Error",
		}),
		{ status: 500 },
	)
}
