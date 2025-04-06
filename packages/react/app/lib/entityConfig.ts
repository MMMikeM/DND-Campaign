import { z } from "zod"
import { db } from "./db" // Import db from the new file

// Define entity configurations for lookup
export const entityConfig = {
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
							incomingConsequences: { with: { decision: true } },
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
	majorConflicts: {
		findById: (id: number) =>
			db.query.majorConflicts.findFirst({
				where: (conflicts, { eq }) => eq(conflicts.id, id),
				with: {
					participants: { with: { faction: { columns: { name: true, id: true } } } },
					progression: {
						// Fetch related quest details
						with: {
							quest: { columns: { name: true, id: true } },
						},
					},
					primaryRegion: { columns: { name: true, id: true } },
				},
			}),
		// Fetch same relations as findById for type consistency
		getAll: () =>
			db.query.majorConflicts.findMany({
				with: {
					// Match findById
					participants: { with: { faction: { columns: { name: true, id: true } } } },
					progression: {
						// Fetch related quest details
						with: {
							quest: { columns: { name: true, id: true } },
						},
					},
					primaryRegion: { columns: { name: true, id: true } },
				},
			}),
		getNamesAndIds: () =>
			db.query.majorConflicts.findMany({
				columns: {
					id: true,
					name: true,
				},
			}),
	},
	narrativeForeshadowing: {
		findById: (id: number) =>
			db.query.narrativeForeshadowing.findFirst({
				where: (foreshadowing, { eq }) => eq(foreshadowing.id, id),
				with: {
					sourceStage: {
						columns: { name: true, id: true },
						with: { quest: { columns: { name: true, id: true } } },
					},
					sourceLocation: { columns: { name: true, id: true } },
					sourceNpc: { columns: { name: true, id: true } },
					sourceFaction: { columns: { name: true, id: true } },
					targetQuest: { columns: { name: true, id: true } },
					targetTwist: { columns: { twist_type: true, id: true } }, // Corrected column name
					targetNpc: { columns: { name: true, id: true } },
					targetArc: { columns: { name: true, id: true } },
				},
			}),
		// Fetch same relations as findById for type consistency
		getAll: () =>
			db.query.narrativeForeshadowing.findMany({
				with: {
					// Match findById
					sourceStage: {
						columns: { name: true, id: true },
						with: { quest: { columns: { name: true, id: true } } },
					},
					sourceLocation: { columns: { name: true, id: true } },
					sourceNpc: { columns: { name: true, id: true } },
					sourceFaction: { columns: { name: true, id: true } },
					targetQuest: { columns: { name: true, id: true } },
					targetTwist: { columns: { twist_type: true, id: true } },
					targetNpc: { columns: { name: true, id: true } },
					targetArc: { columns: { name: true, id: true } },
				},
			}),
		getNamesAndIds: () =>
			db.query.narrativeForeshadowing.findMany({
				columns: {
					id: true,
					name: true,
				},
			}),
	},
	narrativeArcs: {
		findById: (id: number) =>
			db.query.narrativeArcs.findFirst({
				where: (arcs, { eq }) => eq(arcs.id, id),
				with: {
					members: { with: { quest: { columns: { name: true, id: true } } } },
				},
			}),
		// Fetch same relations as findById for type consistency
		getAll: () =>
			db.query.narrativeArcs.findMany({
				with: {
					// Match findById
					members: { with: { quest: { columns: { name: true, id: true } } } },
				},
			}),
		getNamesAndIds: () =>
			db.query.narrativeArcs.findMany({
				columns: {
					id: true,
					name: true,
				},
			}),
	},
	worldStateChanges: {
		findById: (id: number) =>
			db.query.worldStateChanges.findFirst({
				where: (changes, { eq }) => eq(changes.id, id),
				with: {
					sourceQuest: { columns: { name: true, id: true } },
					sourceDecision: { columns: { name: true, id: true } },
					sourceConflict: { columns: { name: true, id: true } },
					affectedFaction: { columns: { name: true, id: true } },
					affectedRegion: { columns: { name: true, id: true } },
					affectedLocation: { columns: { name: true, id: true } },
					affectedNpc: { columns: { name: true, id: true } },
					leadsToQuest: { columns: { name: true, id: true } },
				},
			}),
		// Fetch same relations as findById for type consistency
		getAll: () =>
			db.query.worldStateChanges.findMany({
				with: {
					// Match findById
					sourceQuest: { columns: { name: true, id: true } },
					sourceDecision: { columns: { name: true, id: true } },
					sourceConflict: { columns: { name: true, id: true } },
					affectedFaction: { columns: { name: true, id: true } },
					affectedRegion: { columns: { name: true, id: true } },
					affectedLocation: { columns: { name: true, id: true } },
					affectedNpc: { columns: { name: true, id: true } },
					leadsToQuest: { columns: { name: true, id: true } },
				},
			}),
		getNamesAndIds: () =>
			db.query.worldStateChanges.findMany({
				columns: {
					id: true,
					title: true, // Assuming 'title' is the main identifier for world changes
				},
			}),
	},
}

export const categories = [
	"npcs",
	"factions",
	"regions",
	"quests",
	"locations",
	"conflicts",
	"foreshadowing",
	"narrative",
	"world",
] as const
export const categorySchema = z.enum(categories)

// Helper function to check for non-null name or title
export function hasNonNullIdentifier(item: { id: number; name?: string | null; title?: string | null }): item is
	| {
			id: number
			name: string
	  }
	| { id: number; title: string } {
	return (item.name !== null && item.name !== undefined) || (item.title !== null && item.title !== undefined)
}

export const getEntityNamesAndIds = async (category: string) => {
	try {
		const parsedCategory = categorySchema.parse(category)

		// Adjusting type assertion based on the category
		let namesAndIds: Array<{ id: number; name?: string | null; title?: string | null }> = []
		if (parsedCategory === "world") {
			namesAndIds = await entityConfig.worldStateChanges.getNamesAndIds()
		} else if (parsedCategory === "conflicts") {
			namesAndIds = await entityConfig.majorConflicts.getNamesAndIds()
		} else if (parsedCategory === "foreshadowing") {
			namesAndIds = await entityConfig.narrativeForeshadowing.getNamesAndIds()
		} else if (parsedCategory === "narrative") {
			namesAndIds = await entityConfig.narrativeArcs.getNamesAndIds()
		} else {
			// Handle remaining categories (npcs, factions, regions, quests, locations)
			namesAndIds =
				await entityConfig[
					parsedCategory as Exclude<(typeof categories)[number], "world" | "conflicts" | "foreshadowing" | "narrative">
				].getNamesAndIds()
		}

		if (!namesAndIds) {
			throw new Error(`No names and IDs found for category: ${category}`)
		}

		if (!namesAndIds.every(hasNonNullIdentifier)) {
			// Filter out items with null identifiers before throwing error or returning
			const invalidItems = namesAndIds.filter((item) => !hasNonNullIdentifier(item))
			console.warn(`Found items with null identifiers in category ${category}:`, invalidItems)
			// Depending on requirements, you might filter them out or throw an error.
			// Let's filter them out for now.
			// throw new Error(`Some identifiers are null in category: ${category}`);
			namesAndIds = namesAndIds.filter(hasNonNullIdentifier)
		}

		// Ensure the return type matches the expectation (either name or title exists)
		return namesAndIds as Array<{ id: number; name: string } | { id: number; title: string }>
	} catch (error) {
		console.error("Error in getEntityNamesAndIds:", error)
		throw new Error("Invalid category")
	}
}
