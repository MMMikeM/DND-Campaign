/**
 * Utility functions for hydrating entity records with related data before embedding generation.
 * This improves the semantic richness of embeddings by including names and key details
 * from related entities instead of just foreign key IDs.
 */

// Type definitions for hydrated entities
export interface HydratedMajorConflict {
	primaryRegionName?: string
	participantNames?: string[]
}

export interface HydratedNpcRelationship {
	npc1Name?: string
	npc2Name?: string
}

export interface HydratedQuest {
	relatedNpcNames?: string[]
	primaryRegionName?: string
}

export interface HydratedItem {
	relatedQuestName?: string
	ownerName?: string
}

/**
 * Example hydration function for major conflicts.
 * In a real implementation, this would fetch data from your database.
 */
export async function hydrateMajorConflict(
	conflict: any,
	fetchRegionName: (id: string) => Promise<string | null>,
	fetchParticipantNames: (conflictId: string) => Promise<string[]>,
): Promise<any> {
	const hydrated = { ...conflict }

	// Fetch primary region name if available
	if (conflict.primaryRegionId) {
		const regionName = await fetchRegionName(conflict.primaryRegionId)
		if (regionName) {
			hydrated.primaryRegionName = regionName
		}
	}

	// Fetch participant names (NPCs and factions involved)
	if (conflict.id) {
		const participantNames = await fetchParticipantNames(conflict.id)
		if (participantNames.length > 0) {
			hydrated.participantNames = participantNames
		}
	}

	return hydrated
}

/**
 * Example hydration function for NPC relationships.
 */
export async function hydrateNpcRelationship(
	relationship: any,
	fetchNpcName: (id: string) => Promise<string | null>,
): Promise<{ relationship: any; additionalData: HydratedNpcRelationship }> {
	const additionalData: HydratedNpcRelationship = {}

	if (relationship.npcId) {
		const npc1Name = await fetchNpcName(relationship.npcId)
		if (npc1Name) {
			additionalData.npc1Name = npc1Name
		}
	}

	if (relationship.relatedNpcId) {
		const npc2Name = await fetchNpcName(relationship.relatedNpcId)
		if (npc2Name) {
			additionalData.npc2Name = npc2Name
		}
	}

	return { relationship, additionalData }
}

/**
 * Example hydration function for quests.
 */
export async function hydrateQuest(
	quest: any,
	fetchNpcName: (id: string) => Promise<string | null>,
	fetchRegionName: (id: string) => Promise<string | null>,
	fetchQuestNpcs: (questId: string) => Promise<string[]>,
): Promise<any> {
	const hydrated = { ...quest }

	// Fetch primary region name
	if (quest.regionId) {
		const regionName = await fetchRegionName(quest.regionId)
		if (regionName) {
			hydrated.primaryRegionName = regionName
		}
	}

	// Fetch related NPC names
	if (quest.id) {
		const npcIds = await fetchQuestNpcs(quest.id)
		const npcNames = await Promise.all(npcIds.map(async (id) => await fetchNpcName(id)))
		const validNames = npcNames.filter(Boolean) as string[]
		if (validNames.length > 0) {
			hydrated.relatedNpcNames = validNames
		}
	}

	return hydrated
}

/**
 * Generic hydration helper that can be used with the generateEmbeddingsForEntities function.
 *
 * Usage example:
 * ```typescript
 * const hydratedConflicts = await generateEmbeddingsForEntities(
 *   "majorConflicts",
 *   conflicts,
 *   createHydrationHelper(async (conflict) => {
 *     return await hydrateMajorConflict(conflict, fetchRegionName, fetchParticipantNames)
 *   })
 * )
 * ```
 */
export function createHydrationHelper<T>(hydrateFunction: (record: T) => Promise<T>) {
	return (record: T) => hydrateFunction(record)
}

/**
 * Helper for relationship entities that need additional data passed separately.
 */
export function createRelationshipHydrationHelper<T>(
	hydrateFunction: (record: T) => Promise<{ relationship: T; additionalData: any }>,
) {
	return async (record: T) => {
		const { additionalData } = await hydrateFunction(record)
		return additionalData
	}
}
