import { logger } from ".."
import type { ResourceContent } from "./resource-types"

// Helper function to safely stringify data
const safeStringify = (data: unknown): string => {
	try {
		return JSON.stringify(data, null, 2)
	} catch (error) {
		logger.warn("Failed to stringify data", { error })
		return String(data)
	}
}

// Helper to create JSON resource content
export const createJsonResource = (uri: string, data: unknown): ResourceContent => ({
	uri,
	mimeType: "application/json",
	text: safeStringify(data),
})
