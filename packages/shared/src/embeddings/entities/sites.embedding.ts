import { createEmbeddingBuilder } from "../embedding-helpers"
import type {
	SiteEmbeddingInput,
	SiteEncounterEmbeddingInput,
	SiteSecretEmbeddingInput,
} from "../embedding-input-types"

export const embeddingTextForSite = (site: SiteEmbeddingInput): string => {
	const builder = createEmbeddingBuilder()

	builder.setEntity("Site", site.name, site.description)

	builder.addFields("Basic Information", {
		type: site.siteType,
		intendedFunction: site.intendedSiteFunction,
		terrain: site.terrain,
		climate: site.climate,
		mood: site.mood,
		environment: site.environment,
		area: site.parentAreaName,
		region: site.parentRegionName,
	})

	// Environmental Details (only if present)
	const environmentalDetails: Record<string, unknown> = {}
	if (site.lightingDescription) environmentalDetails.lighting = site.lightingDescription
	if (site.weather) environmentalDetails.weather = site.weather

	if (Object.keys(environmentalDetails).length > 0) {
		builder.addFields("Environmental Details", environmentalDetails)
	}

	builder
		.addList("Descriptors", site.descriptors)
		.addList("Creatures", site.creatures)
		.addList("Features", site.features)
		.addList("Treasures", site.treasures)
		.addList("Soundscape", site.soundscape)
		.addList("Smells", site.smells)
		.addList("Cover Options", site.coverOptions)

	return builder.build()
}

export const embeddingTextForSiteEncounter = (encounter: SiteEncounterEmbeddingInput): string => {
	const builder = createEmbeddingBuilder()

	builder.setEntity("Site Encounter", encounter.name, encounter.description)

	builder.addFields("Encounter Details", {
		type: encounter.encounterType,
		dangerLevel: encounter.dangerLevel,
		difficulty: encounter.difficulty,
		site: encounter.parentSiteName,
	})

	builder.addList("Creatures", encounter.creatures).addList("Treasure", encounter.treasure)

	return builder.build()
}

export const embeddingTextForSiteSecret = (secret: SiteSecretEmbeddingInput): string => {
	// Generate a name for the secret if it doesn't have one
	const secretName = secret.name || (secret.parentSiteName ? `${secret.parentSiteName} Secret` : "Unknown Site Secret")

	const builder = createEmbeddingBuilder()

	builder.setEntity("Site Secret", secretName, secret.description)

	builder.addFields("Secret Details", {
		type: secret.secretType,
		difficultyToDiscover: secret.difficultyToDiscover,
		site: secret.parentSiteName,
	})

	builder.addList("Discovery Methods", secret.discoveryMethod).addList("Consequences", secret.consequences)

	return builder.build()
}
