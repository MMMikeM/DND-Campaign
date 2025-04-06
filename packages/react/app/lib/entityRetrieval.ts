import addSlugs from "./addSlugs"
import { db } from "./db"
import { entityConfig, getEntityNamesAndIds } from "./entityConfig"
import { unifyRelations } from "./unify"

// Exported Entity Types (derived from get* functions)
export type NPC = Awaited<ReturnType<typeof getNpc>>
export type Faction = Awaited<ReturnType<typeof getFaction>>
export type Region = Awaited<ReturnType<typeof getRegion>>
export type Quest = Awaited<ReturnType<typeof getQuest>>
export type Location = Awaited<ReturnType<typeof getLocation>>
export type Conflict = Awaited<ReturnType<typeof getConflict>>
export type Foreshadowing = Awaited<ReturnType<typeof getForeshadowing>>
export type NarrativeArc = Awaited<ReturnType<typeof getNarrativeArc>>
export type WorldChange = Awaited<ReturnType<typeof getWorldChange>>

// --- getAll* Functions ---

export const getAllFactions = async () => await entityConfig.factions.getAll().then(addSlugs)
export const getAllRegions = async () => await entityConfig.regions.getAll().then(addSlugs)
export const getAllNpcs = async () => await entityConfig.npcs.getAll().then(addSlugs)
export const getAllQuests = async () => await entityConfig.quests.getAll().then(addSlugs)
export const getAllLocations = async () => await entityConfig.locations.getAll().then(addSlugs)
export const getAllConflicts = async () => await entityConfig.majorConflicts.getAll().then(addSlugs)
export const getAllForeshadowing = async () => await entityConfig.narrativeForeshadowing.getAll().then(addSlugs)
export const getAllNarrativeArcs = async () => await entityConfig.narrativeArcs.getAll().then(addSlugs)
export const getAllWorldChanges = async () => await entityConfig.worldStateChanges.getAll().then(addSlugs)

// --- get* by Slug Functions ---

export const getFaction = async (slug: string) => {
	const selectedFaction = await getEntityNamesAndIds("factions")
		.then(addSlugs)
		.then((factions) => factions.find((faction) => faction.slug === slug))

	if (!selectedFaction) {
		throw new Error(`Faction with slug of "${slug}" not found`)
	}

	const byId = await entityConfig.factions.findById(selectedFaction.id)

	if (byId) {
		return addSlugs(byId)
	}
	throw new Error(`Faction with id of "${selectedFaction.id}" not found`)
}

export const getQuest = async (slug: string) => {
	const selectedQuest = await getEntityNamesAndIds("quests")
		.then(addSlugs)
		.then((quests) => quests.find((quest) => quest.slug === slug))

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
	throw new Error(`Quest with id of "${selectedQuest.id}" not found`)
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
	throw new Error(`Region with id of "${selectedRegion.id}" not found`)
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
	throw new Error(`NPC with id of "${selectedNpc.id}" not found`)
}

export const getLocation = async (slug: string) => {
	const selectedLocation = await getEntityNamesAndIds("locations")
		.then(addSlugs)
		.then((locations) => locations.find((location) => location.slug === slug))

	if (!selectedLocation) {
		throw new Error(`Location with slug of "${slug}" not found`)
	}

	// Re-fetching with specific 'with' clause as in original entities.ts
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
	throw new Error(`Location with id of "${selectedLocation.id}" not found`)
}

export const getConflict = async (slug: string) => {
	const selectedEntity = await getEntityNamesAndIds("conflicts")
		.then(addSlugs)
		.then((entities) => entities.find((entity) => entity.slug === slug))

	if (!selectedEntity) {
		throw new Error(`Conflict with slug of "${slug}" not found`)
	}

	const byId = await entityConfig.majorConflicts.findById(selectedEntity.id)

	if (byId) {
		return addSlugs(byId) // Add unification if needed later
	}
	throw new Error(`Conflict with id of "${selectedEntity.id}" not found`)
}

export const getForeshadowing = async (slug: string) => {
	const selectedEntity = await getEntityNamesAndIds("foreshadowing")
		.then(addSlugs)
		.then((entities) => entities.find((entity) => entity.slug === slug))

	if (!selectedEntity) {
		throw new Error(`Foreshadowing with slug of "${slug}" not found`)
	}

	const byId = await entityConfig.narrativeForeshadowing.findById(selectedEntity.id)

	if (byId) {
		return addSlugs(byId) // Add unification if needed later
	}
	throw new Error(`Foreshadowing with id of "${selectedEntity.id}" not found`)
}

export const getNarrativeArc = async (slug: string) => {
	const selectedEntity = await getEntityNamesAndIds("narrative")
		.then(addSlugs)
		.then((entities) => entities.find((entity) => entity.slug === slug))

	if (!selectedEntity) {
		throw new Error(`Narrative Arc with slug of "${slug}" not found`)
	}

	const byId = await entityConfig.narrativeArcs.findById(selectedEntity.id)

	if (byId) {
		return addSlugs(byId) // Add unification if needed later
	}
	throw new Error(`Narrative Arc with id of "${selectedEntity.id}" not found`)
}

export const getWorldChange = async (slug: string) => {
	const selectedEntity = await getEntityNamesAndIds("world")
		.then(addSlugs)
		.then((entities) => entities.find((entity) => entity.slug === slug))

	if (!selectedEntity) {
		throw new Error(`World Change with slug of "${slug}" not found`)
	}

	const byId = await entityConfig.worldStateChanges.findById(selectedEntity.id)

	if (byId) {
		return addSlugs(byId) // Add unification if needed later
	}
	throw new Error(`World Change with id of "${selectedEntity.id}" not found`)
}
