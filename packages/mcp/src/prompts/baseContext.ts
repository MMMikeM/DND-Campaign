import { fuzzy } from "fast-fuzzy"
import { db } from ".."

// Common column configurations organized by entity type
const COMMON_COLUMNS = {
	idAndName: { id: true, name: true },

	faction: {
		basic: {
			id: true,
			name: true,
			publicPerception: true,
			publicAlignment: true,
			publicGoal: true,
		},
		detailed: {
			id: true,
			name: true,
			type: true,
			publicAlignment: true,
			secretAlignment: true,
			publicGoal: true,
			publicPerception: true,
			description: true,
		},
	},

	npc: {
		basic: {
			id: true,
			name: true,
			description: true,
			occupation: true,
			alignment: true,
		},
		detailed: {
			id: true,
			name: true,
			description: true,
			occupation: true,
			alignment: true,
			complexityProfile: true,
			playerPerceptionGoal: true,
			currentGoals: true,
			preferredTopics: true,
			avoidTopics: true,
		},
	},

	site: {
		basic: {
			id: true,
			name: true,
			type: true,
		},
		detailed: {
			id: true,
			name: true,
			description: true,
			type: true,
			intendedSiteFunction: true,
			mood: true,
			environment: true,
		},
	},

	area: {
		basic: {
			id: true,
			name: true,
			type: true,
		},
		detailed: {
			id: true,
			name: true,
			description: true,
			atmosphereType: true,
			leadership: true,
			primaryActivity: true,
			type: true,
		},
	},

	region: {
		basic: {
			id: true,
			name: true,
			type: true,
		},
		detailed: {
			id: true,
			name: true,
			description: true,
			atmosphereType: true,
			rumors: true,
			secrets: true,
		},
	},

	quest: {
		basic: {
			id: true,
			name: true,
			type: true,
		},
		detailed: {
			id: true,
			name: true,
			description: true,
			type: true,
			urgency: true,
			visibility: true,
		},
	},

	conflict: {
		detailed: {
			id: true,
			name: true,
			status: true,
			moralDilemma: true,
			description: true,
			stakes: true,
		},
	},

	lore: {
		basic: {
			id: true,
			name: true,
			loreType: true,
			summary: true,
		},
		detailed: {
			id: true,
			name: true,
			summary: true,
			loreType: true,
			tags: true,
			surfaceImpression: true,
		},
	},

	foreshadowing: {
		detailed: {
			id: true,
			name: true,
			description: true,
			suggestedDeliveryMethods: true,
			subtlety: true,
		},
	},

	narrativeDestination: {
		detailed: {
			id: true,
			name: true,
			type: true,
			status: true,
			stakes: true,
		},
	},

	// Common relationship patterns
	consequences: {
		id: true,
		name: true,
		description: true,
		timeframe: true,
		consequenceType: true,
	},

	factionInfluence: {
		id: true,
		description: true,
		priorities: true,
	},

	factionMembership: {
		id: true,
		role: true,
		loyalty: true,
	},

	questParticipant: {
		id: true,
		roleInQuest: true,
		involvementDetails: true,
		importanceInQuest: true,
	},

	regionConnection: {
		id: true,
		connectionType: true,
		sourceRegionId: true,
		targetRegionId: true,
	},
} as const

export const getLocationContext = async (location?: string) => {
	const siteWith = {
		npcAssociations: {
			with: {
				npc: { columns: COMMON_COLUMNS.npc.basic },
			},
			columns: { associationType: true, isCurrent: true, id: true },
		},
		secrets: {
			columns: { secretType: true, difficultyToDiscover: true, description: true, id: true },
		},
		encounters: {
			columns: { name: true, encounterCategory: true, id: true },
		},
		area: {
			columns: COMMON_COLUMNS.idAndName,
			with: { region: { columns: COMMON_COLUMNS.idAndName } },
		},
	} as const

	const areaWith = {
		consequences: {
			columns: COMMON_COLUMNS.consequences,
		},
		factionInfluence: {
			columns: COMMON_COLUMNS.factionInfluence,
			with: {
				faction: {
					columns: COMMON_COLUMNS.faction.basic,
				},
			},
		},
		region: {
			columns: COMMON_COLUMNS.idAndName,
		},
	} as const

	const regionWith = {
		conflicts: {
			columns: { id: true, name: true, description: true },
		},
		consequences: {
			columns: COMMON_COLUMNS.consequences,
		},
		factionInfluence: {
			columns: COMMON_COLUMNS.factionInfluence,
			with: {
				faction: {
					columns: COMMON_COLUMNS.faction.basic,
				},
			},
		},
		quests: {
			columns: COMMON_COLUMNS.quest.basic,
		},
		narrativeDestinations: {
			columns: { id: true, name: true, description: true, type: true },
		},
		areas: {
			columns: COMMON_COLUMNS.area.basic,
		},
	} as const

	if (!location) {
		const sites = await db.query.sites.findMany({
			columns: COMMON_COLUMNS.site.detailed,
			with: siteWith,
		})
		const areas = await db.query.areas.findMany({
			with: areaWith,
			columns: COMMON_COLUMNS.area.detailed,
		})
		const regions = await db.query.regions.findMany({
			with: regionWith,
			columns: COMMON_COLUMNS.region.detailed,
		})
		return {
			sites,
			areas,
			regions,
		}
	}

	const sites = await db.query.sites.findMany({
		columns: COMMON_COLUMNS.idAndName,
	})

	const areas = await db.query.areas.findMany({
		columns: COMMON_COLUMNS.idAndName,
		with: { region: { columns: COMMON_COLUMNS.idAndName } },
	})

	const regions = await db.query.regions.findMany({
		columns: COMMON_COLUMNS.idAndName,
	})

	const matchedSites = sites.filter((site) => fuzzy(site.name, location) > 0.5)
	const matchedAreas = areas.filter((area) => fuzzy(area.name, location) > 0.5)
	const matchedRegions = regions.filter((region) => fuzzy(region.name, location) > 0.5)

	const siteDetails = await db.query.sites.findMany({
		where: (sites, { inArray }) =>
			inArray(
				sites.id,
				matchedSites.map((site) => site.id),
			),
		with: siteWith,
		columns: COMMON_COLUMNS.site.detailed,
	})

	const areaDetails = await db.query.areas.findMany({
		where: (areas, { inArray }) =>
			inArray(
				areas.id,
				matchedAreas.map((area) => area.id),
			),
		with: areaWith,
		columns: COMMON_COLUMNS.area.detailed,
	})

	const regionDetails = await db.query.regions.findMany({
		where: (regions, { inArray }) =>
			inArray(
				regions.id,
				matchedRegions.map((region) => region.id),
			),
		with: regionWith,
		columns: COMMON_COLUMNS.region.detailed,
	})

	return {
		sites: siteDetails,
		areas: areaDetails,
		regions: regionDetails,
	}
}

export const getLoreContext = async () => {
	return await db.query.lore.findMany({
		columns: COMMON_COLUMNS.lore.basic,
	})
}

export const getForehadowingContext = async () => {
	return await db.query.foreshadowing.findMany({
		columns: COMMON_COLUMNS.foreshadowing.detailed,
		with: {
			sourceLore: {
				columns: COMMON_COLUMNS.lore.detailed,
			},
		},
	})
}

export const getFactionContext = async (factionName?: string) => {
	const factionWith = {
		agendas: { columns: { description: true, currentStage: true, importance: true } },
		influence: {
			columns: { id: true, influenceLevel: true },
			with: {
				faction: { columns: COMMON_COLUMNS.idAndName },
				relatedArea: { columns: COMMON_COLUMNS.idAndName },
				relatedRegion: { columns: COMMON_COLUMNS.idAndName },
				relatedSite: { columns: COMMON_COLUMNS.idAndName },
				relatedRegionConnection: {
					columns: COMMON_COLUMNS.regionConnection,
				},
			},
		},
		primaryHqSite: { columns: COMMON_COLUMNS.idAndName },
		members: {
			columns: COMMON_COLUMNS.factionMembership,
			with: {
				npc: { columns: COMMON_COLUMNS.idAndName },
			},
		},
	} as const

	if (!factionName) {
		return await db.query.factions.findMany({
			columns: COMMON_COLUMNS.faction.detailed,
			with: factionWith,
		})
	}

	const factionNames = await db.query.factions.findMany({
		columns: COMMON_COLUMNS.idAndName,
	})

	const matchedFactions = factionNames.filter((faction) => fuzzy(faction.name, factionName) > 0.5)

	return await db.query.factions.findMany({
		where: (factions, { inArray }) =>
			inArray(
				factions.id,
				matchedFactions.map((faction) => faction.id),
			),
		columns: COMMON_COLUMNS.faction.detailed,
		with: factionWith,
	})
}

export const getNpcContext = async (npcName?: string) => {
	const npcWith = {
		questStageDeliveries: true,
		stageInvolvement: true,
		questHooks: true,
		factionMemberships: {
			columns: COMMON_COLUMNS.factionMembership,
			with: { faction: { columns: COMMON_COLUMNS.idAndName } },
		},
		siteAssociations: { columns: { id: true, associationType: true, isCurrent: true, description: true } },
	} as const
	if (!npcName) {
		return await db.query.npcs.findMany({
			columns: COMMON_COLUMNS.npc.detailed,
			with: npcWith,
		})
	}

	const npcNames = await db.query.npcs.findMany({
		columns: COMMON_COLUMNS.idAndName,
	})

	const matchedNpcs = npcNames.filter((npc) => fuzzy(npc.name, npcName) > 0.5)

	return await db.query.npcs.findMany({
		where: (npcs, { inArray }) =>
			inArray(
				npcs.id,
				matchedNpcs.map((npc) => npc.id),
			),
		with: npcWith,
		columns: COMMON_COLUMNS.npc.detailed,
	})
}

export const getQuestContext = async (questName?: string) => {
	const questWith = {
		hooks: {
			columns: { id: true, hookType: true, description: true },
		},
		triggeredConsequences: {
			columns: COMMON_COLUMNS.consequences,
		},
		affectingConsequences: {
			columns: COMMON_COLUMNS.consequences,
		},
		participants: {
			columns: COMMON_COLUMNS.questParticipant,
			with: {
				npc: { columns: COMMON_COLUMNS.idAndName },
			},
		},
	} as const

	if (!questName) {
		return await db.query.quests.findMany({
			columns: COMMON_COLUMNS.quest.detailed,
			with: questWith,
		})
	}

	const questNames = await db.query.quests.findMany({
		columns: COMMON_COLUMNS.idAndName,
	})

	const matchedQuests = questNames.filter((quest) => fuzzy(quest.name, questName) > 0.5)

	return await db.query.quests.findMany({
		where: (quests, { inArray }) =>
			inArray(
				quests.id,
				matchedQuests.map((quest) => quest.id),
			),
		with: questWith,
		columns: COMMON_COLUMNS.quest.detailed,
	})
}

export const getNarrativeDestsinationContext = async () => {
	return await db.query.narrativeDestinations.findMany({
		with: {
			participantInvolvement: {
				with: {
					faction: { columns: COMMON_COLUMNS.idAndName },
					narrativeDestination: { columns: COMMON_COLUMNS.idAndName },
					npc: { columns: { id: true } },
				},
				columns: { narrativeRole: true, involvementDetails: true, importance: true },
			},
		},
		columns: COMMON_COLUMNS.narrativeDestination.detailed,
	})
}

export const getNarrativeEventContext = async () => {
	return await db.query.narrativeEvents.findMany({
		columns: { id: true, name: true, description: true },
	})
}

export const getConflictContext = async () => {
	return await db.query.conflicts.findMany({
		with: {
			region: { columns: COMMON_COLUMNS.idAndName },
			participants: {
				with: {
					npc: { columns: COMMON_COLUMNS.idAndName },
					faction: { columns: COMMON_COLUMNS.idAndName },
				},
				columns: { role: true, motivation: true },
			},
		},
		columns: COMMON_COLUMNS.conflict.detailed,
	})
}

export type Context = {
	locations: Awaited<ReturnType<typeof getLocationContext>>
	npcs: Awaited<ReturnType<typeof getNpcContext>>
	factions: Awaited<ReturnType<typeof getFactionContext>>
	conflicts: Awaited<ReturnType<typeof getConflictContext>>
	quests: Awaited<ReturnType<typeof getQuestContext>>
	narrativeDestinations: Awaited<ReturnType<typeof getNarrativeDestsinationContext>>
}

export const getFullContext = async (): Promise<Context> => {
	const [locations, npcs, factions, conflicts, quests, narrativeDestinations] = await Promise.all([
		getLocationContext(),
		getNpcContext(),
		getFactionContext(),
		getConflictContext(),
		getQuestContext(),
		getNarrativeDestsinationContext(),
	])

	return {
		locations,
		npcs,
		factions,
		conflicts,
		quests,
		narrativeDestinations,
	}
}
