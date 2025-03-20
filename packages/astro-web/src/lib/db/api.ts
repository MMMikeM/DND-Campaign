/**
 * Client API for interacting with the DND Campaign Manager server
 */
import type { Location, NPC, Faction, Quest } from "./schema"

const API_BASE_URL = "/api"

// Generic API error class
export class ApiError extends Error {
	statusCode: number

	constructor(message: string, statusCode: number) {
		super(message)
		this.name = "ApiError"
		this.statusCode = statusCode
	}
}

// Helper function for API requests
async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
	const url = `${API_BASE_URL}${endpoint}`

	const response = await fetch(url, {
		headers: {
			"Content-Type": "application/json",
			...options.headers,
		},
		...options,
	})

	if (!response.ok) {
		const errorText = await response.text()
		throw new ApiError(`API request failed: ${errorText}`, response.status)
	}

	// Handle empty responses
	const text = await response.text()
	return text ? JSON.parse(text) : null
}

// Location APIs
export const LocationApi = {
	getAll: async (): Promise<Location[]> => {
		return fetchApi<Location[]>("/locations")
	},

	getById: async (id: number): Promise<Location> => {
		return fetchApi<Location>(`/locations/${id}`)
	},

	create: async (location: Omit<Location, "id">): Promise<Location> => {
		return fetchApi<Location>("/locations", {
			method: "POST",
			body: JSON.stringify(location),
		})
	},

	update: async (id: number, location: Partial<Location>): Promise<Location> => {
		return fetchApi<Location>(`/locations/${id}`, {
			method: "PUT",
			body: JSON.stringify(location),
		})
	},

	delete: async (id: number): Promise<void> => {
		return fetchApi<void>(`/locations/${id}`, {
			method: "DELETE",
		})
	},
}

// NPC APIs
export const NPCApi = {
	getAll: async (): Promise<NPC[]> => {
		return fetchApi<NPC[]>("/npcs")
	},

	getById: async (id: number): Promise<NPC> => {
		return fetchApi<NPC>(`/npcs/${id}`)
	},

	create: async (npc: Omit<NPC, "id">): Promise<NPC> => {
		return fetchApi<NPC>("/npcs", {
			method: "POST",
			body: JSON.stringify(npc),
		})
	},

	update: async (id: number, npc: Partial<NPC>): Promise<NPC> => {
		return fetchApi<NPC>(`/npcs/${id}`, {
			method: "PUT",
			body: JSON.stringify(npc),
		})
	},

	delete: async (id: number): Promise<void> => {
		return fetchApi<void>(`/npcs/${id}`, {
			method: "DELETE",
		})
	},
}

// Add similar APIs for Factions and Quests as needed
export const FactionApi = {
	getAll: async (): Promise<Faction[]> => {
		return fetchApi<Faction[]>("/factions")
	},

	getById: async (id: number): Promise<Faction> => {
		return fetchApi<Faction>(`/factions/${id}`)
	},
}

export const QuestApi = {
	getAll: async (): Promise<Quest[]> => {
		return fetchApi<Quest[]>("/quests")
	},

	getById: async (id: number): Promise<Quest> => {
		return fetchApi<Quest>(`/quests/${id}`)
	},
}
