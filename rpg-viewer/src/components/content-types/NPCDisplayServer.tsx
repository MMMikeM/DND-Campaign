// This is a server component that loads NPC data
"use server"

import { getNpcsData } from "@/server/utils/npcs"
import NPCDisplay from "./NPCDisplay"

export default async function NPCDisplayServer() {
	const npcsDataArray = await getNpcsData()
	// Get the first item from the array since NPCDisplay expects a single NpcsFile object
	const npcsData = npcsDataArray[0]

	return <NPCDisplay npcsData={npcsData} />
}
