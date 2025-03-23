import { z } from "astro:schema"
import { db } from "."
import { fromSlug } from "../utils/slugs"

// Define entity configurations for lookup
const entityConfig = {
	npcs: {
		findById: (id: number) =>
			db.query.npcs.findFirst({
				where: (npcs, { eq }) => eq(npcs.id, id),
				with: {
					significantItems: {
						with: {
							npc: true,
							quest: true,
						},
					},
					areas: {
						with: {
							location: true,
						},
					},
					factions: {
						with: {
							faction: true,
						},
					},
					locations: {
						with: {
							location: true,
						},
					},
					quests: {
						with: {
							quest: true,
						},
					},
					relationships: {
						with: {
							relatedNpc: true,
						},
					},
				},
			}),
		findByName: (name: string) =>
			db.query.npcs.findFirst({
				where: (npcs, { eq }) => eq(npcs.name, name),
				with: {
					areas: {
						with: {
							location: true,
						},
					},
					factions: {
						with: {
							faction: true,
						},
					},
					locations: {
						with: {
							location: true,
						},
					},
					quests: {
						with: {
							quest: true,
						},
					},
					relationships: {
						with: {
							relatedNpc: true,
						},
					},
				},
			}),
		getAll: () =>
			db.query.npcs.findMany({
				with: {
					areas: true,
					factions: true,
					locations: true,
					quests: true,
					relationships: true,
					relatedTo: true,
				},
			}),
		getNamesAndIds: () =>
			db.query.npcs.findMany({
				columns: {
					id: true,
					name: true,
				},
			}),
	},
	factions: {
		findById: (id: number) =>
			db.query.factions.findFirst({
				where: (factions, { eq }) => eq(factions.id, id),
				with: {
					relationships: {
						with: {
							faction: true,
						},
					},
					otherRelationships: {
						with: {
							faction: true,
						},
					},
					locations: {
						with: {
							location: true,
						},
					},
					members: {
						with: {
							npc: true,
						},
					},
					quests: {
						with: {
							quest: true,
						},
					},
				},
			}),
		findByName: (name: string) =>
			db.query.factions.findFirst({
				where: (factions, { eq }) => eq(factions.name, name),
				with: {
					relationships: {
						with: {
							faction: true,
						},
					},
					otherRelationships: {
						with: {
							faction: true,
						},
					},
					locations: {
						with: {
							location: true,
						},
					},
					members: {
						with: {
							npc: true,
						},
					},
					quests: {
						with: {
							quest: true,
						},
					},
				},
			}),
		getAll: () => db.query.factions.findMany(),
		getNamesAndIds: () =>
			db.query.factions.findMany({
				columns: {
					id: true,
					name: true,
				},
			}),
	},
	locations: {
		findById: (id: number) =>
			db.query.locations.findFirst({
				where: (locations, { eq }) => eq(locations.id, id),
				with: {
					npcs: {
						with: {
							npc: true,
						},
					},
					factions: {
						with: {
							faction: true,
						},
					},
					quests: {
						with: {
							quest: true,
						},
					},
					areas: {
						with: {
							location: true,
						},
					},
					encounters: {
						with: {
							location: true,
						},
					},
					relations: {
						with: {
							location: true,
						},
					},
				},
			}),
		findByName: (name: string) =>
			db.query.locations.findFirst({
				where: (locations, { eq }) => eq(locations.name, name),
				with: {
					npcs: {
						with: {
							npc: true,
						},
					},
					factions: {
						with: {
							faction: true,
						},
					},
					quests: {
						with: {
							quest: true,
						},
					},
					areas: {
						with: {
							location: true,
						},
					},
					encounters: {
						with: {
							location: true,
						},
					},
					relations: {
						with: {
							location: true,
						},
					},
				},
			}),
		getAll: () => db.query.locations.findMany(),
		getNamesAndIds: () =>
			db.query.locations.findMany({
				columns: {
					id: true,
					name: true,
				},
			}),
	},
	quests: {
		findById: (id: number) =>
			db.query.quests.findFirst({
				where: (quests, { eq }) => eq(quests.id, id),
				with: {
					npcs: {
						with: {
							npc: true,
						},
					},
					factions: {
						with: {
							faction: true,
						},
					},
					locations: {
						with: {
							location: true,
						},
					},
					clues: {
						with: {
							location: true,
							quest: true,
							npc: true,
						},
					},
					relatedQuests: {
						with: {
							quest: true,
						},
					},
					stages: {
						with: {
							decisions: true,
						},
					},
					relatedToQuests: {
						with: {
							quest: true,
						},
					},
				},
			}),
		findByName: (name: string) =>
			db.query.quests.findFirst({
				where: (quests, { eq }) => eq(quests.name, name),
				with: {
					npcs: {
						with: {
							npc: true,
						},
					},
					factions: {
						with: {
							faction: true,
						},
					},
					locations: {
						with: {
							location: true,
						},
					},
					clues: {
						with: {
							location: true,
							quest: true,
							npc: true,
						},
					},
					relatedQuests: {
						with: {
							quest: true,
						},
					},
					stages: {
						with: {
							decisions: true,
						},
					},
					relatedToQuests: {
						with: {
							quest: true,
						},
					},
				},
			}),
		getAll: () => db.query.quests.findMany(),
		getNamesAndIds: () =>
			db.query.quests.findMany({
				columns: {
					id: true,
					name: true,
				},
			}),
	},
}

const categories = ["npcs", "factions", "locations", "quests"] as const
const categorySchema = z.enum(categories)

const idOrNameParse = (idOrName: string | number) => {
	const id = possibleNumberSchema.safeParse(idOrName)
	const name = possibleStringSchema.safeParse(idOrName)

	// If this is a string, it might be a slug - convert it to a potential name
	const nameFromSlug = name.success ? fromSlug(name.data) : undefined

	return {
		id: id.success ? id.data : undefined,
		name: name.success ? name.data : undefined,
		nameFromSlug,
	}
}

export const getEntityNamesAndIds = (category: string) => {
	try {
		const categories = categorySchema.parse(category)

		return entityConfig[categories].getNamesAndIds()
	} catch (error) {
		console.error("Error in getEntityNamesAndIds:", error)
		throw new Error("Invalid category")
	}
}

const possibleNumberSchema = z.coerce.number()
const possibleStringSchema = z.string()

export const getAllFactions = async () => await entityConfig.factions.getAll()

export const getAllLocations = async () => await entityConfig.locations.getAll()

export const getAllNpcs = async () => await entityConfig.npcs.getAll()

export const getAllQuests = async () => await entityConfig.quests.getAll()

export const getEntity = async (entity: (typeof entityConfig)[(typeof categories)[number]]) => {
	const returnFn = (nameOrId: number | string) => {
		const { id, name } = idOrNameParse(nameOrId)
		if (id) {
			const data = entity.findById(id)
			if (data) return data
		}
		if (name) {
			const data = entity.findByName(name)
			if (data) return data
		}
		throw new Error(`Entity with name or id of "${nameOrId}" not found`)
	}
	return returnFn
}

export const getFaction = async (factionIdOrName: number | string) => {
	const queries = entityConfig.factions
	const { id, name, nameFromSlug } = idOrNameParse(factionIdOrName)

	if (id) {
		const byId = await queries.findById(id)
		if (byId) {
			return byId
		}
	}

	if (name) {
		// First try exact match
		const byName = await queries.findByName(name)
		if (byName) {
			return byName
		}

		// Then try case-insensitive match by getting all factions and comparing
		const allFactions = await queries.getAll()
		const matchByNameIgnoreCase = allFactions.find(
			(faction) => faction.name.toLowerCase() === name.toLowerCase(),
		)

		if (matchByNameIgnoreCase) {
			return queries.findById(matchByNameIgnoreCase.id)
		}

		// Try with the slug-converted name
		if (nameFromSlug && nameFromSlug !== name) {
			const bySlugName = await queries.findByName(nameFromSlug)
			if (bySlugName) {
				return bySlugName
			}

			// Try case-insensitive match with the un-slugified name
			const matchBySlugNameIgnoreCase = allFactions.find(
				(faction) => faction.name.toLowerCase() === nameFromSlug.toLowerCase(),
			)

			if (matchBySlugNameIgnoreCase) {
				return queries.findById(matchBySlugNameIgnoreCase.id)
			}
		}
	}
	throw new Error(`Faction with name or id of "${factionIdOrName}" not found`)
}

export const getQuest = async (questIdOrName: number | string) => {
	const queries = entityConfig.quests
	const { id, name, nameFromSlug } = idOrNameParse(questIdOrName)

	if (id) {
		const byId = await queries.findById(id)
		if (byId) {
			return byId
		}
	}
	if (name) {
		// First try exact match
		const byName = await queries.findByName(name)
		if (byName) {
			return byName
		}

		// Then try case-insensitive match by getting all quests and comparing
		const allQuests = await queries.getAll()
		const matchByNameIgnoreCase = allQuests.find(
			(quest) => quest.name.toLowerCase() === name.toLowerCase(),
		)

		if (matchByNameIgnoreCase) {
			return queries.findById(matchByNameIgnoreCase.id)
		}

		// Try with the slug-converted name
		if (nameFromSlug && nameFromSlug !== name) {
			const bySlugName = await queries.findByName(nameFromSlug)
			if (bySlugName) {
				return bySlugName
			}

			// Try case-insensitive match with the un-slugified name
			const matchBySlugNameIgnoreCase = allQuests.find(
				(quest) => quest.name.toLowerCase() === nameFromSlug.toLowerCase(),
			)

			if (matchBySlugNameIgnoreCase) {
				return queries.findById(matchBySlugNameIgnoreCase.id)
			}
		}
	}
	throw new Error(`Quest with name or id of "${questIdOrName}" not found`)
}

export const getLocation = async (locationIdOrName: number | string) => {
	const queries = entityConfig.locations
	const { id, name, nameFromSlug } = idOrNameParse(locationIdOrName)

	if (id) {
		const byId = await queries.findById(id)
		if (byId) {
			return byId
		}
	}
	if (name) {
		// First try exact match
		const byName = await queries.findByName(name)
		if (byName) {
			return byName
		}

		// Then try case-insensitive match by getting all locations and comparing
		const allLocations = await queries.getAll()
		const matchByNameIgnoreCase = allLocations.find(
			(location) => location.name.toLowerCase() === name.toLowerCase(),
		)

		if (matchByNameIgnoreCase) {
			return queries.findById(matchByNameIgnoreCase.id)
		}

		// Try with the slug-converted name
		if (nameFromSlug && nameFromSlug !== name) {
			const bySlugName = await queries.findByName(nameFromSlug)
			if (bySlugName) {
				return bySlugName
			}

			// Try case-insensitive match with the un-slugified name
			const matchBySlugNameIgnoreCase = allLocations.find(
				(location) => location.name.toLowerCase() === nameFromSlug.toLowerCase(),
			)

			if (matchBySlugNameIgnoreCase) {
				return queries.findById(matchBySlugNameIgnoreCase.id)
			}
		}
	}
	throw new Error(`Location with name or id of "${locationIdOrName}" not found`)
}

export const getNpc = async (npcIdOrName: number | string) => {
	const queries = entityConfig.npcs
	const { id, name, nameFromSlug } = idOrNameParse(npcIdOrName)

	if (id) {
		const byId = await queries.findById(id)
		if (byId) {
			return byId
		}
	}
	if (name) {
		// First try exact match
		const byName = await queries.findByName(name)
		if (byName) {
			return byName
		}

		// Then try case-insensitive match by getting all NPCs and comparing
		const allNpcs = await queries.getAll()
		const matchByNameIgnoreCase = allNpcs.find(
			(npc) => npc.name.toLowerCase() === name.toLowerCase(),
		)

		if (matchByNameIgnoreCase) {
			return queries.findById(matchByNameIgnoreCase.id)
		}

		// Try with the slug-converted name
		if (nameFromSlug && nameFromSlug !== name) {
			const bySlugName = await queries.findByName(nameFromSlug)
			if (bySlugName) {
				return bySlugName
			}

			// Try case-insensitive match with the un-slugified name
			const matchBySlugNameIgnoreCase = allNpcs.find(
				(npc) => npc.name.toLowerCase() === nameFromSlug.toLowerCase(),
			)

			if (matchBySlugNameIgnoreCase) {
				return queries.findById(matchBySlugNameIgnoreCase.id)
			}
		}
	}
	throw new Error(`NPC with name or id of "${npcIdOrName}" not found`)
}
