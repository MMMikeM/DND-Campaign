import { eq } from "drizzle-orm"
import { initializeDatabase } from "@tome-master/shared"
import addSlugs, { type WithSlugsAdded } from "./addSlugs"
import { unifyRelations } from "./unify"
import { z } from "zod"

const dbPath = "/Users/mikemurray/Development/DND-Campaign/dnddb.sqlite"
export const db = initializeDatabase(dbPath)

export type NPC = Awaited<ReturnType<typeof getNpc>>
export type Faction = Awaited<ReturnType<typeof getFaction>>
export type Region = Awaited<ReturnType<typeof getRegion>>
export type Quest = Awaited<ReturnType<typeof getQuest>>
export type Location = Awaited<ReturnType<typeof getLocation>>
export type QuestStage = Awaited<ReturnType<typeof getQuestStages>>

// Define entity configurations for lookup
const entityConfig = {
	npcs: {
		findById: (id: number) =>
			db.query.npcs.findFirst({
				where: (npcs, { eq }) => eq(npcs.id, id),
				with: {
					relatedFactions: { with: { faction: { columns: { name: true, id: true } } } },
					incomingRelationships: { with: { sourceNpc: { columns: { name: true, id: true } } } },
					outgoingRelationships: { with: { targetNpc: { columns: { name: true, id: true } } } },
					relatedQuests: { with: { quest: { columns: { name: true, id: true } } } },
					relatedItems: true,
					relatedClues: {
						with: {
							stage: {
								columns: { name: true, id: true },
								with: { quest: { columns: { name: true, id: true } } },
							},
						},
					},
					relatedLocations: {
						with: {
							location: {
								columns: { name: true, id: true },
								with: { region: { columns: { name: true, id: true } } },
							},
						},
					},
					relatedQuestHooks: {
						with: {
							hook: {
								with: {
									quest: { columns: { name: true, id: true } },
									stage: { columns: { name: true, id: true } },
								},
							},
						},
					},
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
					members: { with: { npc: { columns: { name: true, id: true } } } },
					headquarters: { with: { location: { columns: { name: true, id: true } } } },
					relatedQuests: { with: { quest: { columns: { name: true, id: true } } } },
					incomingRelationships: { with: { sourceFaction: { columns: { name: true, id: true } } } },
					outgoingRelationships: { with: { targetFaction: { columns: { name: true, id: true } } } },
					relatedRegions: { with: { region: { columns: { name: true, id: true } } } },
					operations: true,
					culture: true,
					influence: {
						with: {
							quest: { columns: { name: true, id: true } },
							region: { columns: { name: true, id: true } },
							location: { columns: { name: true, id: true } },
						},
					},
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
							sourceRegion: { columns: { name: true, id: true } },
							connections: true,
						},
					},
					outgoingRelations: {
						with: {
							targetRegion: { columns: { name: true, id: true } },
							connections: true,
						},
					},
					locations: {
						with: {
							region: { columns: { name: true, id: true } },
							encounters: true,
							secrets: true,
							incomingRelations: { with: { sourceLocation: true } },
							outgoingRelations: { with: { targetLocation: true } },
							items: true,
							npcs: true,
						},
					},
					quests: true,
					factions: { with: { faction: { columns: { name: true, id: true } } } },
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
				with: {
					stages: {
						with: {
							clues: true,
							location: { columns: { name: true, id: true } },
							outgoingDecisions: {
								with: {
									consequences: true,
									toStage: true,
								},
							},
						},
					},
					items: true,
					region: { columns: { name: true, id: true } },
					incomingRelations: { with: { sourceQuest: { columns: { name: true, id: true } } } },
					outgoingRelations: { with: { targetQuest: { columns: { name: true, id: true } } } },
					unlockConditions: true,
					twists: true,
					factions: {
						with: {
							faction: {
								columns: {
									name: true,
									id: true,
								},
							},
						},
					},
					npcs: {
						with: {
							npc: {
								columns: {
									name: true,
									id: true,
								},
							},
						},
					},
				},
				where: (quests, { eq }) => eq(quests.id, id),
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
	locations: {
		findById: (id: number) =>
			db.query.locations.findFirst({
				where: (locations, { eq }) => eq(locations.id, id),
				with: {
					region: true,
					encounters: true,
					secrets: true,
					incomingRelations: { with: { sourceLocation: true } },
					outgoingRelations: { with: { targetLocation: true } },
					items: true,
					npcs: { with: { npc: { columns: { name: true, id: true } } } },
				},
			}),
		getAll: () => db.query.locations.findMany({}),
		getNamesAndIds: () =>
			db.query.locations.findMany({
				columns: {
					id: true,
					name: true,
				},
			}),
	},
}

const categories = ["npcs", "factions", "regions", "quests", "locations"] as const
const categorySchema = z.enum(categories)

export const getEntityNamesAndIds = async (category: string) => {
	try {
		const categories = categorySchema.parse(category)

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

export const getAllLocations = async () => await entityConfig.locations.getAll().then(addSlugs)

export const getFaction = async (slug: string) => {
	const selectedFaction = await getEntityNamesAndIds("factions")
		.then(addSlugs)
		.then((factions) => factions.find((faction) => faction.slug === slug))

	if (!selectedFaction) {
		throw new Error(`Faction with slug of "${slug}" not found`)
	}

	const byId = await entityConfig.factions.findById(selectedFaction.id)

	if (byId) {
		console.log(byId)
		return addSlugs(byId)
	}
	throw new Error(`Faction with id of "${slug}" not found`)
}

export const getQuest = async (slug: string) => {
	const selectedQuest = await (await getEntityNamesAndIds("quests").then(addSlugs)).find((quest) => quest.slug === slug)

	if (!selectedQuest) {
		throw new Error(`Quest with slug of "${slug}" not found`)
	}

	const byId = await entityConfig.quests.findById(selectedQuest.id)
	if (byId) {
		const unified = unifyRelations(byId)
			.from({ property: "incomingRelations", key: "sourceQuest" })
			.with({ property: "outgoingRelations", key: "targetQuest" })
			.to({ property: "relations", key: "quest" })

		return addSlugs(unified)
	}
	throw new Error(`Quest with slug of "${slug}" not found`)
}

export const getRegion = async (slug: string) => {
	const selectedRegion = await getEntityNamesAndIds("regions")
		.then(addSlugs)
		.then((regions) => regions.find((region) => region.slug === slug))

	if (!selectedRegion) {
		throw new Error(`Region with slug of "${slug}" not found`)
	}

	const byId = await entityConfig.regions.findById(selectedRegion.id)

	if (byId) {
		const unified = unifyRelations(byId)
			.from({ property: "incomingRelations", key: "sourceRegion" })
			.with({ property: "outgoingRelations", key: "targetRegion" })
			.to({ property: "relations", key: "region" })

		return addSlugs(unified)
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
		const unified = unifyRelations(byId)
			.from({ property: "incomingRelationships", key: "sourceNpc" })
			.with({ property: "outgoingRelationships", key: "targetNpc" })
			.to({ property: "relations", key: "npc" })

		return addSlugs(unified)
	}
	throw new Error(`NPC with slug of "${slug}" not found`)
}

export const getLocation = async (slug: string) => {
	const selectedLocation = await getEntityNamesAndIds("locations")
		.then(addSlugs)
		.then((locations) => locations.find((location) => location.slug === slug))

	if (!selectedLocation) {
		throw new Error(`Location with slug of "${slug}" not found`)
	}

	const byId = await db.query.locations.findFirst({
		where: (locations, { eq }) => eq(locations.id, selectedLocation.id),
		with: {
			region: { columns: { name: true, id: true } },
			encounters: true,
			secrets: true,
			items: { with: { stage: { columns: { name: true, id: true } } } },
			npcs: { with: { npc: { columns: { name: true, id: true } } } },
			incomingRelations: { with: { sourceLocation: true } },
			outgoingRelations: { with: { targetLocation: true } },
		},
	})

	if (byId) {
		const unified = unifyRelations(byId)
			.from({ property: "incomingRelations", key: "sourceLocation" })
			.with({ property: "outgoingRelations", key: "targetLocation" })
			.to({ property: "relations", key: "location" })

		return addSlugs(unified)
	}
	throw new Error(`Location with id of "${slug}" not found`)
}

const getRawQuestStages = async (id: number) => {
	return await db.query.questStages.findMany({
		where: (questStages, { eq }) => eq(questStages.questId, id),
		with: {
			incomingConsequences: { with: { decision: true } },
			incomingDecisions: { with: { consequences: true, fromStage: true } },
			quest: { columns: { name: true, id: true } },
			clues: true,
			location: { columns: { name: true, id: true } },
			outgoingDecisions: { with: { consequences: true, toStage: true } },
		},
	})
}

// Export the RawQuestStage type so it can be used by other modules
export type RawQuestStage = Awaited<ReturnType<typeof getRawQuestStages>>[number]

// Extract common properties from RawQuestStage that we want to keep
type StageBaseProps = Pick<RawQuestStage, "id" | "name" | "stage" | "dramatic_question" | "location">

// Define the stage decision type based on RawQuestStage's outgoingDecisions
export type StageDecision = RawQuestStage["outgoingDecisions"][number]

// Improved StageNode type definition that leverages RawQuestStage
export type StageNode =
	| (StageBaseProps & {
			branches: {
				decision: StageDecision
				nextStage: StageNode | { id: number; isCycle: true } | null
			}[]
	  })
	| { id: number; isCycle: true }
	| null

// Extract buildStageTree to be reusable
export function buildStageTree(
	stageId: number,
	stageMap: Map<number, RawQuestStage>,
	visited = new Set<number>(),
): StageNode {
	if (visited.has(stageId)) {
		return { id: stageId, isCycle: true } // Mark as cycle to avoid infinite recursion
	}

	const stage = stageMap.get(stageId)
	if (!stage) return null

	// Track visited stages to prevent cycles
	visited.add(stageId)

	// Process outgoing decisions and their target stages
	const branches = stage.outgoingDecisions
		.filter((decision) => decision.toStage)
		.map((decision) => {
			const nextStage = decision.toStage?.id
				? buildStageTree(decision.toStage.id, stageMap, new Set([...visited]))
				: null

			return { decision, nextStage }
		})

	// Return a clean stage object with essential data and branches
	return {
		id: stage.id,
		name: stage.name,
		stage: stage.stage,
		dramatic_question: stage.dramatic_question,
		location: stage.location,
		branches,
	}
}

export const getQuestStages = async (id: number) => {
	// 1. Get all stages for this quest
	const stages = await getRawQuestStages(id)

	// 2. Create a lookup map of stages
	const stageMap = new Map(stages.map((stage) => [stage.id, stage]))

	// 3. Find the root stage (with no incoming decisions)
	const rootStage = stages.find((stage) => stage.incomingDecisions.length === 0)

	if (!rootStage) {
		return { stages, stageTree: null } // Return flat list if no root found
	}

	// 5. Start building from root using the extracted function
	const stageTree = buildStageTree(rootStage.id, stageMap)

	// 6. Return both the flat list and the tree structure
	return {
		stages, // Original flat data (useful for lookups)
		stageTree, // Hierarchical structure
	}
}
