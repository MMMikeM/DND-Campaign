import { tables as conflictTables } from "@tome-master/shared/entities/conflicts"
import { tables as consequenceTables } from "@tome-master/shared/entities/consequences"
import { tables as factionTables } from "@tome-master/shared/entities/factions"
import { tables as foreshadowingTables } from "@tome-master/shared/entities/foreshadowing"
import { tables as loreTables } from "@tome-master/shared/entities/lore"
import { tables as npcTables } from "@tome-master/shared/entities/npcs"
import { tables as questTables } from "@tome-master/shared/entities/quests"
import { tables as regionTables } from "@tome-master/shared/entities/regions"
import type { InferSelectModel, Table } from "drizzle-orm"
import { db } from ".."

// Drizzle checks column names only in object literals written inline, so a selection kept in a constant is
// checked here instead.
type Columns<TTable extends Table> = { [K in keyof InferSelectModel<TTable>]?: boolean }

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
		} satisfies Columns<typeof factionTables.factions>,
		detailed: {
			id: true,
			name: true,
			type: true,
			publicAlignment: true,
			secretAlignment: true,
			publicGoal: true,
			publicPerception: true,
			description: true,
		} satisfies Columns<typeof factionTables.factions>,
	},

	npc: {
		basic: {
			id: true,
			name: true,
			summary: true,
			occupation: true,
		} satisfies Columns<typeof npcTables.npcs>,
		detailed: {
			id: true,
			name: true,
			summary: true,
			occupation: true,
			attitude: true,
			socialStatusAndReputation: true,
		} satisfies Columns<typeof npcTables.npcs>,
	},

	npcDetails: {
		basic: {
			alignment: true,
		} satisfies Columns<typeof npcTables.npcDetails>,
		detailed: {
			alignment: true,
			complexity: true,
			goalsAndFears: true,
			preferredTopics: true,
			avoidTopics: true,
		} satisfies Columns<typeof npcTables.npcDetails>,
	},

	site: {
		basic: {
			id: true,
			name: true,
			intendedSiteFunction: true,
		} satisfies Columns<typeof regionTables.sites>,
		detailed: {
			id: true,
			name: true,
			description: true,
			intendedSiteFunction: true,
		} satisfies Columns<typeof regionTables.sites>,
	},

	area: {
		basic: {
			id: true,
			name: true,
			type: true,
		} satisfies Columns<typeof regionTables.areas>,
		detailed: {
			id: true,
			name: true,
			description: true,
			type: true,
			cultureAndLeadership: true,
			featuresAndHazards: true,
		} satisfies Columns<typeof regionTables.areas>,
	},

	region: {
		basic: {
			id: true,
			name: true,
			type: true,
		} satisfies Columns<typeof regionTables.regions>,
		detailed: {
			id: true,
			name: true,
			description: true,
			type: true,
			dangerLevel: true,
			atmosphereAndCulture: true,
			loreAndSecrets: true,
		} satisfies Columns<typeof regionTables.regions>,
	},

	quest: {
		basic: {
			id: true,
			name: true,
			type: true,
		} satisfies Columns<typeof questTables.quests>,
		detailed: {
			id: true,
			name: true,
			description: true,
			type: true,
			urgency: true,
			stakes: true,
		} satisfies Columns<typeof questTables.quests>,
	},

	conflict: {
		detailed: {
			id: true,
			name: true,
			status: true,
			moralDilemma: true,
			description: true,
			stakes: true,
		} satisfies Columns<typeof conflictTables.conflicts>,
	},

	lore: {
		basic: {
			id: true,
			name: true,
			loreType: true,
			summary: true,
		} satisfies Columns<typeof loreTables.lore>,
		detailed: {
			id: true,
			name: true,
			summary: true,
			loreType: true,
			tags: true,
			surfaceImpression: true,
		} satisfies Columns<typeof loreTables.lore>,
	},

	foreshadowing: {
		detailed: {
			id: true,
			name: true,
			description: true,
			suggestedDeliveryMethods: true,
			subtlety: true,
		} satisfies Columns<typeof foreshadowingTables.foreshadowing>,
	},

	// Common relationship patterns
	consequences: {
		id: true,
		name: true,
		description: true,
		timeframe: true,
		consequenceType: true,
	} satisfies Columns<typeof consequenceTables.consequences>,

	factionInfluence: {
		id: true,
		description: true,
		priorities: true,
	} satisfies Columns<typeof factionTables.factionInfluence>,

	factionMembership: {
		id: true,
		role: true,
		loyalty: true,
	} satisfies Columns<typeof npcTables.npcFactionMemberships>,

	questParticipant: {
		id: true,
		roleInQuest: true,
		involvementDetails: true,
		importanceInQuest: true,
	} satisfies Columns<typeof questTables.questParticipants>,

	regionConnection: {
		id: true,
		connectionType: true,
		sourceRegionId: true,
		targetRegionId: true,
	} satisfies Columns<typeof regionTables.regionConnections>,

	factionAgenda: {
		id: true,
		name: true,
		agendaType: true,
		currentStage: true,
		importance: true,
		ultimateAim: true,
		description: true,
	} satisfies Columns<typeof factionTables.factionAgendas>,

	factionDiplomacy: {
		id: true,
		strength: true,
		diplomaticStatus: true,
		description: true,
	} satisfies Columns<typeof factionTables.factionDiplomacy>,
} as const

export const getSiteContext = async () =>
	await db.query.sites.findMany({
		columns: COMMON_COLUMNS.site.detailed,
		with: {
			npcs: {
				columns: COMMON_COLUMNS.npc.basic,
				with: { details: { columns: COMMON_COLUMNS.npcDetails.basic } },
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

export const getFactionContext = async (factionId?: number) => {
	return db.query.factions.findMany({
		...(factionId !== undefined && { where: { id: factionId } }),
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
			details: { columns: COMMON_COLUMNS.npcDetails.detailed },
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
