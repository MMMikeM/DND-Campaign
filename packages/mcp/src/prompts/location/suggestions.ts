import { createFuzzySearch, SCORES } from "ekrina"
import type {
	EnhancedLocationCreationArgs,
	LinkForAnalysis,
	LocationConnectionSuggestions,
	RegionForAnalysis,
	SiteForAnalysis,
} from "./types"

const NO_MEANINGFUL_CONNECTION = "near"

function getAppropriateConnectionType(newType: string, existingType: string): string {
	const connectionMap: Record<string, Record<string, string>> = {
		fortress: { town: "protects", village: "guards", road: "controls" },
		temple: { town: "blesses", cemetery: "consecrates", market: "overlooks" },
		market: { town: "serves", road: "along", port: "trades with" },
		cave: { mountain: "within", mine: "connects to", ruins: "hidden beneath" },
	}

	return connectionMap[newType]?.[existingType] || NO_MEANINGFUL_CONNECTION
}

function getStrategicReason(type: string): string {
	const strategicReasons: Record<string, string> = {
		fortress: "strategic military position",
		port: "trade route control",
		temple: "spiritual influence",
		market: "economic hub",
		crossroads: "travel nexus",
		bridge: "crossing control",
		mine: "resource extraction",
		tower: "observation point",
	}

	return strategicReasons[type] || "strategic positioning"
}

function getRegionalRole(type?: string): string {
	const regionalRoles: Record<string, string> = {
		fortress: "regional defense center",
		market: "trade hub for the region",
		temple: "spiritual center",
		port: "maritime gateway",
		crossroads: "travel intersection",
		ruins: "historical landmark",
		mine: "resource provider",
	}

	return regionalRoles[type || ""] || "important regional location"
}

function getAtmosphereContribution(atmosphere: string, type?: string): string {
	const atmosphereMap: Record<string, Record<string, string>> = {
		safe_haven_rest: {
			temple: "sanctuary vibes",
			market: "peaceful commerce",
			town: "welcoming community",
		},
		oppressive_tense: {
			fortress: "military intimidation",
			ruins: "ominous presence",
			cave: "dark foreboding",
		},
		mysterious_intriguing: {
			ruins: "ancient mysteries",
			cave: "hidden secrets",
			tower: "enigmatic purpose",
		},
	}

	return atmosphereMap[atmosphere]?.[type || ""] || `contributes to ${atmosphere} atmosphere`
}

export function generateLocationConnectionSuggestions(
	args: EnhancedLocationCreationArgs,
	existingSites: SiteForAnalysis[],
	availableRegions: RegionForAnalysis[],
	existingLinks: LinkForAnalysis[],
): LocationConnectionSuggestions {
	const suggestions: LocationConnectionSuggestions = {
		typeBasedConnections: [],
		regionalConnections: [],
		purposeBasedConnections: [],
		strategicPositioning: [],
		uniqueConnectionOpportunities: [],
	}

	if (args.type_hint) {
		const typeHint = args.type_hint
		const connectableSites = existingSites.filter(
			(site) => getAppropriateConnectionType(typeHint, site.type) !== NO_MEANINGFUL_CONNECTION,
		)

		suggestions.typeBasedConnections = connectableSites.map((site) => {
			const connectionType = getAppropriateConnectionType(typeHint, site.type)
			return `${connectionType} ${site.name} (${site.type}) - ${getStrategicReason(typeHint)}`
		})
	}

	if (args.region_hint) {
		const regionHint = args.region_hint
		const searchRegions = createFuzzySearch(availableRegions, (region) => region.name)
		const matchingRegions = searchRegions(regionHint).map(({ item }) => item)

		suggestions.regionalConnections = matchingRegions.flatMap((region) => {
			const regionSites = existingSites.filter((site) => site.area?.region.name === region.name)

			return regionSites.map((site) => {
				const role = getRegionalRole(args.type_hint)
				return `Connect to ${site.name} in ${region.name} - serves as ${role}`
			})
		})
	}

	if (args.purpose_hint) {
		const purposeHint = args.purpose_hint
		const searchSites = createFuzzySearch(existingSites, [
			{ text: ({ description }) => description.join(" ") },
			{ text: ({ features }) => features.join(" "), atBest: SCORES.CONTAINS },
		])

		// Scores run low-to-high; past CONTAINS the hint no longer literally appears.
		suggestions.purposeBasedConnections = searchSites(purposeHint)
			.filter(({ score }) => score <= SCORES.CONTAINS)
			.map(({ item }) => `Functional connection to ${item.name} - shared ${purposeHint} purpose`)
	}

	const existingLinkTypes = existingLinks.map((link) => link.linkType)
	const underrepresentedLinkTypes = ["portal", "tunnel", "historical", "conceptual"].filter(
		(type) => !existingLinkTypes.includes(type),
	)

	if (underrepresentedLinkTypes?.[0]) {
		suggestions.strategicPositioning.push(
			`Consider ${underrepresentedLinkTypes[0]} connection - underrepresented link type`,
		)
	}

	const siteConnectionCounts = existingSites.map((site) => {
		const connectionCount = existingLinks.filter(
			(link) => link.sourceSite?.id === site.id || link.targetSite?.id === site.id,
		).length

		return { site, connectionCount }
	})

	const isolatedSites = siteConnectionCounts.filter((sc) => sc.connectionCount === 0)
	if (isolatedSites?.[0]) {
		const firstIsolatedSite = isolatedSites[0]
		if (firstIsolatedSite) {
			suggestions.strategicPositioning.push(
				`Connect to isolated ${firstIsolatedSite.site.name} - currently has no connections`,
			)
		}
	}

	if (availableRegions?.[0]) {
		const atmosphereTypes = Array.from(new Set(availableRegions.map((r) => r.atmosphereType)))

		atmosphereTypes.forEach((atmosphere) => {
			const sitesInAtmosphere = existingSites.filter((site) => site.area?.region)

			if (sitesInAtmosphere?.[0]) {
				const atmosphereContribution = getAtmosphereContribution(atmosphere, args.type_hint)
				suggestions.uniqueConnectionOpportunities.push(
					`${atmosphere} atmosphere connection - ${atmosphereContribution}`,
				)
			}
		})
	}

	const encounterSites = existingSites.filter((site) => site.encounters.length > 0)
	if (encounterSites?.[0]) {
		const [firstEncounterSite] = encounterSites
		if (firstEncounterSite?.encounters?.[0]) {
			suggestions.uniqueConnectionOpportunities.push(
				`Encounter chain connection - link to ${firstEncounterSite.name} with ${firstEncounterSite.encounters[0].objectiveType} encounter`,
			)
		}
	}

	const secretSites = existingSites.filter((site) => site.secrets.length > 0)
	if (secretSites?.[0]) {
		const [firstSecretSite] = secretSites
		if (firstSecretSite?.secrets?.[0]) {
			suggestions.uniqueConnectionOpportunities.push(
				`Mystery connection - link to ${firstSecretSite.name} with ${firstSecretSite.secrets[0].secretType} secret`,
			)
		}
	}

	const npcSites = existingSites.filter((site) => site.npcs.length > 0)
	if (npcSites?.[0]) {
		const [firstNpcSite] = npcSites
		if (firstNpcSite?.npcs?.[0]) {
			suggestions.uniqueConnectionOpportunities.push(
				`Social connection - link through ${firstNpcSite.npcs[0].npc.occupation} at ${firstNpcSite.name}`,
			)
		}
	}

	return suggestions
}
