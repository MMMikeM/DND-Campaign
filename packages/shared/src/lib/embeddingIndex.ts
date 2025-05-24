// Central index for all embedding utilities

import { embeddingTextForClue, embeddingTextForItem } from "../schemas/associations/embeddings"
import { embeddingTextForMajorConflict } from "../schemas/conflict/embeddings"
import { embeddingTextForNarrativeEvent } from "../schemas/events/embeddings"
import {
	embeddingTextForFaction,
	embeddingTextForFactionAgenda,
	embeddingTextForFactionCulture,
} from "../schemas/factions/embeddings"
import { embeddingTextForNarrativeForeshadowing } from "../schemas/foreshadowing/embeddings"
import { embeddingTextForNarrativeDestination } from "../schemas/narrative/embeddings"
import { embeddingTextForNpc } from "../schemas/npc/embeddings"
import { embeddingTextForQuest, embeddingTextForQuestStage } from "../schemas/quests/embeddings"
import {
	embeddingTextForArea,
	embeddingTextForRegion,
	embeddingTextForSite,
	embeddingTextForSiteEncounter,
	embeddingTextForSiteSecret,
} from "../schemas/regions/embeddings"
import { embeddingTextForWorldStateChange } from "../schemas/world/embeddings"

// Type definitions for entity names
export type EmbeddedEntityName =
	| "npcs"
	| "quests"
	| "questStages"
	| "sites"
	| "areas"
	| "regions"
	| "factions"
	| "factionAgendas"
	| "factionCulture"
	| "items"
	| "clues"
	| "siteEncounters"
	| "siteSecrets"
	| "narrativeForeshadowing"
	| "narrativeDestinations"
	| "narrativeEvents"
	| "worldStateChanges"
	| "majorConflicts"

export const embeddingTextGenerators = {
	npcs: embeddingTextForNpc,
	quests: embeddingTextForQuest,
	questStages: embeddingTextForQuestStage,
	sites: embeddingTextForSite,
	areas: embeddingTextForArea,
	regions: embeddingTextForRegion,
	factions: embeddingTextForFaction,
	factionAgendas: embeddingTextForFactionAgenda,
	factionCulture: embeddingTextForFactionCulture,
	items: embeddingTextForItem,
	clues: embeddingTextForClue,
	siteEncounters: embeddingTextForSiteEncounter,
	siteSecrets: embeddingTextForSiteSecret,
	narrativeForeshadowing: embeddingTextForNarrativeForeshadowing,
	narrativeDestinations: embeddingTextForNarrativeDestination,
	narrativeEvents: embeddingTextForNarrativeEvent,
	worldStateChanges: embeddingTextForWorldStateChange,
	majorConflicts: embeddingTextForMajorConflict,
} as const
