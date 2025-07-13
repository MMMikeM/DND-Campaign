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

	factionAgenda: {
		id: true,
		name: true,
		agendaType: true,
		currentStage: true,
		importance: true,
		ultimateAim: true,
		description: true,
	},

	factionDiplomacy: {
		id: true,
		strength: true,
		diplomaticStatus: true,
		description: true,
	},
} as const

export const getSiteContext = async () =>
	await db.query.sites.findMany({
		columns: COMMON_COLUMNS.site.detailed,
		with: {
			npcs: {
				columns: COMMON_COLUMNS.npc.basic,
			},
			factionHqs: {
				columns: COMMON_COLUMNS.faction.basic,
			},
			encounters: {
				columns: COMMON_COLUMNS.idAndName,
			},
			area: {
				columns: COMMON_COLUMNS.idAndName,
				with: { region: { columns: COMMON_COLUMNS.idAndName } },
			},
		},
	})

export const getAreaContext = async () =>
	await db.query.areas.findMany({
		with: {
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
		},
		columns: COMMON_COLUMNS.area.detailed,
	})

export const getRegionContext = async () =>
	await db.query.regions.findMany({
		with: {
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

			areas: {
				columns: COMMON_COLUMNS.area.basic,
			},
		},
		columns: COMMON_COLUMNS.region.detailed,
	})

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

export const getFactionContext = async () => {
	return db.query.factions.findMany({
		columns: COMMON_COLUMNS.faction.detailed,
		with: {
			members: {
				columns: { role: true },
				with: { npc: { columns: { id: true, name: true, occupation: true } } },
			},
			influence: {
				columns: {
					influenceLevel: true,
					presenceTypes: true,
					priorities: true,
				},
				with: {
					site: { columns: COMMON_COLUMNS.idAndName },
					area: { columns: COMMON_COLUMNS.idAndName },
					region: { columns: COMMON_COLUMNS.idAndName },
				},
			},
			agendas: {
				columns: COMMON_COLUMNS.factionAgenda,
			},
			incomingRelations: {
				columns: COMMON_COLUMNS.factionDiplomacy,
				with: {
					sourceFaction: { columns: COMMON_COLUMNS.faction.basic },
				},
			},
			outgoingRelations: {
				columns: COMMON_COLUMNS.factionDiplomacy,
				with: {
					targetFaction: { columns: COMMON_COLUMNS.faction.basic },
				},
			},
			primaryHqSite: {
				columns: COMMON_COLUMNS.site.basic,
				with: {
					area: {
						columns: COMMON_COLUMNS.area.basic,
					},
				},
			},
		},
	})
}

export const getNpcContext = async () => {
	return await db.query.npcs.findMany({
		columns: COMMON_COLUMNS.npc.detailed,
		with: {
			questStageDeliveries: true,
			stageInvolvement: true,
			questHooks: true,
			factionMemberships: {
				columns: COMMON_COLUMNS.factionMembership,
				with: { faction: { columns: COMMON_COLUMNS.idAndName } },
			},
			site: {
				columns: COMMON_COLUMNS.site.basic,
				with: {
					area: { columns: COMMON_COLUMNS.area.basic },
				},
			},
		},
	})
}

export const getQuestContext = async () => {
	return await db.query.quests.findMany({
		columns: COMMON_COLUMNS.quest.detailed,
		with: {
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
		},
	})
}

export const getConsequences = async () => {
	return await db.query.consequences.findMany({
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

const contextFunctions = {
	sites: getSiteContext,
	areas: getAreaContext,
	regions: getRegionContext,
	npcs: getNpcContext,
	factions: getFactionContext,
	conflicts: getConflictContext,
	quests: getQuestContext,
	consequences: getConsequences,
} as const

export type Context = {
	[K in keyof typeof contextFunctions]: Awaited<ReturnType<(typeof contextFunctions)[K]>>
}

export const getFullContext = async (): Promise<Context> => {
	const entries = Object.entries(contextFunctions)
	const results = await Promise.all(entries.map(([_, fn]) => fn()))

	return Object.fromEntries(entries.map(([key], index) => [key, results[index]])) as Context
}
