import { EmbeddingBuilder } from "./embedding-helpers"
import type { SiteEmbeddingInput, SiteEncounterEmbeddingInput, SiteSecretEmbeddingInput } from "./embedding-input-types"

export const embeddingTextForSite = (site: SiteEmbeddingInput): string => {
	return new EmbeddingBuilder()
		.title("Site", site.name)
		.overview(site.description)
		.basicInfoSection([
			{ label: "Type", value: site.siteType },
			{ label: "Intended Function", value: site.intendedSiteFunction },
			{ label: "Terrain", value: site.terrain },
			{ label: "Climate", value: site.climate },
			{ label: "Mood", value: site.mood },
			{ label: "Environment", value: site.environment },
			{ label: "Area", value: site.parentAreaName },
			{ label: "Region", value: site.parentRegionName },
		])
		.conditionalFieldSection("Environmental Details", [
			{ label: "Lighting", value: site.lightingDescription },
			{ label: "Weather", value: site.weather },
		])
		.list("Descriptors", site.descriptors)
		.lists([
			{ title: "Creatures", items: site.creatures },
			{ title: "Features", items: site.features },
			{ title: "Treasures", items: site.treasures },
			{ title: "Soundscape", items: site.soundscape },
			{ title: "Smells", items: site.smells },
			{ title: "Cover Options", items: site.coverOptions },
		])
		.build()
}

export const embeddingTextForSiteEncounter = (encounter: SiteEncounterEmbeddingInput): string => {
	return new EmbeddingBuilder()
		.title("Site Encounter", encounter.name)
		.overview(encounter.description)
		.basicInfoSection([
			{ label: "Type", value: encounter.encounterType },
			{ label: "Danger Level", value: encounter.dangerLevel },
			{ label: "Difficulty", value: encounter.difficulty },
			{ label: "Site", value: encounter.parentSiteName },
		])
		.lists([
			{ title: "Creatures", items: encounter.creatures },
			{ title: "Treasure", items: encounter.treasure },
		])
		.build()
}

export const embeddingTextForSiteSecret = (secret: SiteSecretEmbeddingInput): string => {
	// Generate a name for the secret if it doesn't have one
	const secretName = secret.name || (secret.parentSiteName ? `${secret.parentSiteName} Secret` : "Unknown Site Secret")

	return new EmbeddingBuilder()
		.title("Site Secret", secretName)
		.overview(secret.description)
		.basicInfoSection([
			{ label: "Type", value: secret.secretType },
			{ label: "Difficulty to Discover", value: secret.difficultyToDiscover },
			{ label: "Site", value: secret.parentSiteName },
		])
		.lists([
			{ title: "Discovery Methods", items: secret.discoveryMethod },
			{ title: "Consequences", items: secret.consequences },
		])
		.build()
}
