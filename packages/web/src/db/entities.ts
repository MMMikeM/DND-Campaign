import { z } from "astro:schema"
import { db } from "."
import addSlugs from "@utils/addSlugs"
import { unifyRelations } from "./utils"
import { eq } from "drizzle-orm"

// Define entity configurations for lookup
const entityConfig = {
	npcs: {
		findById: (id: number) =>
			db.query.npcs.findFirst({
				where: (npcs, { eq }) => eq(npcs.id, id),
				with: {
					factions: true,
					incomingRelationships: { with: { sourceNpc: { columns: { name: true } } } },
					outgoingRelationships: { with: { targetNpc: { columns: { name: true } } } },
					quests: true,
					items: true,
					clues: { with: { stage: true } },
					locations: { with: { location: true } },
					questHooks: { with: { hook: true } },
				},
			}),

		getAll: () => db.query.npcs.findMany({}),
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
					members: { with: { npc: { columns: { name: true } } } },
					headquarters: { with: { location: true } },
					quests: true,
					incomingRelationships: { with: { sourceFaction: { columns: { name: true } } } },
					outgoingRelationships: { with: { targetFaction: { columns: { name: true } } } },
					operations: true,
					regions: true,
					culture: true,
				},
			}),
		getAll: () => db.query.factions.findMany({}),
		getNamesAndIds: () =>
			db.query.factions.findMany({
				columns: {
					id: true,
					name: true,
				},
			}),
	},
	regions: {
		findById: (id: number) =>
			db.query.regions.findFirst({
				where: (regions, { eq }) => eq(regions.id, id),
				with: {
					incomingRelations: {
						with: {
							sourceRegion: true,
						},
					},
					outgoingRelations: {
						with: {
							targetRegion: true,
						},
					},
					locations: {
						with: {
							region: true,
							encounters: true,
							atmosphere: true,
							secrets: true,
							incomingRelations: true,
							outgoingRelations: true,
							items: true,
							npcs: true,
						},
					},
					quests: true,
					factions: true,
				},
			}),
		getAll: () => db.query.regions.findMany({}),
		getNamesAndIds: () =>
			db.query.regions.findMany({
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
					items: true,
					region: true,
					requiredBy: true,
					requires: true,
					twists: true,
					factions: {
						with: {
							faction: {
								columns: {
									name: true,
								},
							},
						},
					},
					npcs: {
						with: {
							npc: {
								columns: {
									name: true,
								},
							},
						},
					},
					stages: {
						where: (questsStages) => eq(questsStages.stage, 1),
						with: {
							clues: true,
							location: true,
							outgoingDecisions: {
								with: {
									consequences: true,
									toStage: true,
								},
							},
						},
					},
				},
			}),
		getAll: () => db.query.quests.findMany({}),
		getNamesAndIds: () =>
			db.query.quests.findMany({
				columns: {
					id: true,
					name: true,
				},
			}),
	},
}

const categories = ["npcs", "factions", "regions", "quests"] as const
const categorySchema = z.enum(categories)

export const getEntityNamesAndIds = async (category: string) => {
	try {
		const categories = categorySchema.parse(category)

		console.log("Categories:", categories)

		const namesAndIds = await entityConfig[categories].getNamesAndIds()

		if (!namesAndIds) {
			throw new Error(`No names and IDs found for category: ${category}`)
		}

		function isNameNonNull(item: { id: number; name: string | null }): item is { id: number; name: string } {
			return item.name !== null
		}

		if (!namesAndIds) {
			throw new Error(`No names and IDs found for category: ${category}`)
		}

		if (!namesAndIds.every(isNameNonNull)) {
			throw new Error(`Some names are null in category: ${category}`)
		}

		return namesAndIds
	} catch (error) {
		console.error("Error in getEntityNamesAndIds:", error)
		throw new Error("Invalid category")
	}
}

export const getAllFactions = async () => await entityConfig.factions.getAll().then(addSlugs)

export const getAllRegions = async () => await entityConfig.regions.getAll().then(addSlugs)

export const getAllNpcs = async () => await entityConfig.npcs.getAll().then(addSlugs)

export const getAllQuests = async () => await entityConfig.quests.getAll().then(addSlugs)

export const getFaction = async (slug: string) => {
	const selectedFaction = await getEntityNamesAndIds("factions")
		.then(addSlugs)
		.then((factions) => factions.find((faction) => faction.slug === slug))

	if (!selectedFaction) {
		throw new Error(`Faction with slug of "${slug}" not found`)
	}

	const byId = await entityConfig.factions.findById(selectedFaction.id)

	if (byId) {
		const faction = unifyRelations(byId)
			.from({ property: "incomingRelationships", key: "sourceFaction" })
			.with({ property: "outgoingRelationships", key: "targetFaction" })
			.to({ property: "relations", key: "faction" })

		return addSlugs(faction)
	}
	throw new Error(`Faction with id of "${slug}" not found`)
}

export const getQuest = async (slug: string) => {
	const selectedQuest = await (await getEntityNamesAndIds("quests").then(addSlugs)).find(
		(quest) => quest.slug === slug,
	)

	if (!selectedQuest) {
		throw new Error(`Quest with slug of "${slug}" not found`)
	}

	const byId = await entityConfig.quests.findById(selectedQuest.id)
	if (byId) {
		return addSlugs(byId)
	}
	throw new Error(`Quest with slug of "${slug}" not found`)
}

export const getRegion = async (slug: string) => {
	console.log("Slug:", slug)
	const selectedRegion = await getEntityNamesAndIds("regions")
		.then(addSlugs)
		.then((regions) => regions.find((region) => region.slug === slug))

	if (!selectedRegion) {
		throw new Error(`Region with slug of "${slug}" not found`)
	}

	const byId = await entityConfig.regions.findById(selectedRegion.id)

	if (byId) {
		const region = unifyRelations(byId)
			.from({ property: "incomingRelations", key: "sourceRegion" })
			.with({ property: "outgoingRelations", key: "targetRegion" })
			.to({ property: "relations", key: "region" })

		return addSlugs(region)
	}
	throw new Error(`Region with slug of "${slug}" not found`)
}

export const getNpc = async (slug: string) => {
	const selectedNpc = await getEntityNamesAndIds("npcs")
		.then(addSlugs)
		.then((npcs) => npcs.find((npc) => npc.slug === slug))

	if (!selectedNpc) {
		throw new Error(`NPC with slug of "${slug}" not found`)
	}

	const byId = await entityConfig.npcs.findById(selectedNpc.id)

	if (byId) {
		console.log(byId)
		const npc = unifyRelations(byId)
			.from({ property: "incomingRelationships", key: "sourceNpc" })
			.with({ property: "outgoingRelationships", key: "targetNpc" })
			.to({ property: "relations", key: "npc" })
		console.log(npc)
		return addSlugs(npc)
	}
	throw new Error(`NPC with slug of "${slug}" not found`)
}
