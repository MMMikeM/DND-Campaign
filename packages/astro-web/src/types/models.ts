/**
 * NPC Model Interface
 */
export interface NPC {
	id: number
	name: string
	race: string
	gender: string
	occupation: string
	role?: string
	quirk?: string
	background: string
	motivation: string
	secret: string
	stats: string
	descriptions?: string[]
	personalityTraits?: string[]
	inventory?: {
		item: string
		quantity: number
		notes?: string
	}[]
	dialogue?: {
		topic: string
		response: string
		condition?: string
	}[]
}

/**
 * Faction Model Interface
 */
export interface Faction {
	id: number
	name: string
	type: string
	alignment?: string
	description?: string
	publicGoal?: string
	trueGoal?: string
	headquarters?: string
	territory?: string
	history?: string
	notes?: string
}

/**
 * Quest Model Interface
 */
export interface Quest {
	id: number
	title: string
	status: string
	description: string
	reward?: string
	location?: string
	questGiver?: string
	notes?: string
	objectives?: string[]
	relatedNPCs?: number[]
	relatedFactions?: number[]
}

/**
 * Location Model Interface
 */
export interface Location {
	id: number
	name: string
	type: string
	description: string
	notes?: string
	pointsOfInterest?: string[]
	residents?: number[]
	controllingFaction?: number
}
