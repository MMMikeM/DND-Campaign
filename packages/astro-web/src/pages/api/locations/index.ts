import type { APIRoute } from "astro"
import { handleError, APIError } from "../../../lib/api"

// This is a simple example - in a real app, you would fetch this from your backend
const mockLocations = [
	{
		id: 1,
		name: "The Sunken Temple",
		type: "Dungeon",
		region: "Coastal Wilds",
		description:
			"An ancient temple that sank beneath the waves centuries ago, now home to aquatic creatures and hidden treasures.",
		history: "Built by the seafaring Azlanti civilization before their downfall.",
		dangerLevel: "Moderate",
		factionControl: "Sahuagin Tribe",
		notableFeatures: ["Coral-encrusted statues", "Magical wards", "Underwater breathing chambers"],
	},
	{
		id: 2,
		name: "Crystalfall Village",
		type: "Settlement",
		region: "Northern Mountains",
		description:
			"A small mining village nestled in the mountains, known for its crystal caves and hardy residents.",
		history:
			"Founded 200 years ago when deposits of magical crystals were discovered in the nearby caves.",
		dangerLevel: "Low",
		factionControl: "Village Council",
		notableFeatures: ["Crystal market", "Miner's Guild Hall", "Ancient shrine"],
	},
	{
		id: 3,
		name: "The Whispering Woods",
		type: "Wilderness",
		region: "Central Heartlands",
		description:
			"A dense forest where the trees seem to whisper secrets to those who listen carefully.",
		history:
			"Sacred to druids for millennia, said to be home to fey creatures and ancient nature spirits.",
		dangerLevel: "Varies",
		factionControl: "Circle of Druids",
		notableFeatures: ["Talking trees", "Hidden fey portals", "Druidic stone circles"],
	},
]

export const GET: APIRoute = async () => {
	// Simulate a delay to mimic a real API call
	await new Promise((resolve) => setTimeout(resolve, 100))

	return new Response(JSON.stringify(mockLocations), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	})
}

export const POST: APIRoute = async ({ request }) => {
	// Parse the request body
	const location = await request.json()

	// In a real app, you would validate and save to a database
	// For now, we just return the location with a fake ID
	const newLocation = {
		...location,
		id: Math.floor(Math.random() * 1000) + 10, // Generate a "unique" ID
	}

	return new Response(JSON.stringify(newLocation), {
		status: 201,
		headers: {
			"Content-Type": "application/json",
		},
	})
}
