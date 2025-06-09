import type {
	EnhancedLocationCreationArgs,
	LinkForAnalysis,
	LocationConnectionSuggestions,
	RegionForAnalysis,
	SiteForAnalysis,
} from "./types"

function getAppropriateConnectionType(newType: string, existingType: string): string {
	const connectionMap: Record<string, Record<string, string>> = {
		fortress: { town: "protects", village: "guards", road: "controls" },
		temple: { town: "blesses", cemetery: "consecrates", market: "overlooks" },
		market: { town: "serves", road: "along", port: "trades with" },
		cave: { mountain: "within", mine: "connects to", ruins: "hidden beneath" },
	}

	return connectionMap[newType]?.[existingType] || "near"
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

	// Type-based connection suggestions
	if (args.type_hint) {
		const relatedSites = existingSites.filter((site) => {
			// Find sites that would logically connect to this type
			const connectionType = getAppropriateConnectionType(args.type_hint!, site.type)
			return connectionType !== "near" // Only include meaningful connections
		})

		suggestions.typeBasedConnections = relatedSites.slice(0, 5).map((site) => {
			const connectionType = getAppropriateConnectionType(args.type_hint!, site.type)
			return `${connectionType} ${site.name} (${site.type}) - ${getStrategicReason(args.type_hint!)}`
		})
	}

	// Regional connection suggestions
	if (args.region_hint) {
		const matchingRegions = availableRegions.filter((region) =>
			region.name.toLowerCase().includes(args.region_hint!.toLowerCase()),
		)

		suggestions.regionalConnections = matchingRegions.flatMap((region) => {
			const regionSites = existingSites.filter((site) => site.area?.region.name === region.name)

			return regionSites.slice(0, 3).map((site) => {
				const role = getRegionalRole(args.type_hint)
				return `Connect to ${site.name} in ${region.name} - serves as ${role}`
			})
		})
	}

	// Purpose-based connections
	if (args.purpose_hint) {
		const purposeKeywords = args.purpose_hint.toLowerCase().split(" ")

		const relatedSites = existingSites.filter((site) => {
			const siteDescription = site.description.join(" ").toLowerCase()
			const siteFeatures = site.features.join(" ").toLowerCase()

			return purposeKeywords.some((keyword) => siteDescription.includes(keyword) || siteFeatures.includes(keyword))
		})

		suggestions.purposeBasedConnections = relatedSites.slice(0, 4).map((site) => {
			return `Functional connection to ${site.name} - shared ${args.purpose_hint} purpose`
		})
	}

	// Strategic positioning suggestions
	const existingLinkTypes = existingLinks.map((link) => link.linkType)
	const underrepresentedLinkTypes = ["portal", "tunnel", "historical", "conceptual"].filter(
		(type) => !existingLinkTypes.includes(type),
	)

	if (underrepresentedLinkTypes.length > 0) {
		suggestions.strategicPositioning.push(
			`Consider ${underrepresentedLinkTypes[0]} connection - underrepresented link type`,
		)
	}

	// Look for sites with few connections
	const siteConnectionCounts = existingSites.map((site) => {
		const connectionCount = existingLinks.filter(
			(link) => link.sourceSite?.id === site.id || link.targetSite?.id === site.id,
		).length

		return { site, connectionCount }
	})

	const isolatedSites = siteConnectionCounts.filter((sc) => sc.connectionCount === 0)
	if (isolatedSites.length > 0) {
		suggestions.strategicPositioning.push(
			`Connect to isolated ${isolatedSites[0].site.name} - currently has no connections`,
		)
	}

	// Unique connection opportunities
	// Look for atmosphere-based connections
	if (availableRegions.length > 0) {
		const atmosphereTypes = [...new Set(availableRegions.map((r) => r.atmosphereType))]

		atmosphereTypes.forEach((atmosphere) => {
			const sitesInAtmosphere = existingSites.filter((site) => site.area?.region)

			if (sitesInAtmosphere.length > 0) {
				const atmosphereContribution = getAtmosphereContribution(atmosphere, args.type_hint)
				suggestions.uniqueConnectionOpportunities.push(
					`${atmosphere} atmosphere connection - ${atmosphereContribution}`,
				)
			}
		})
	}

	// Look for encounter-based connections
	const encounterSites = existingSites.filter((site) => site.encounters.length > 0)
	if (encounterSites.length > 0) {
		const encounterType = encounterSites[0].encounters[0].objectiveType
		suggestions.uniqueConnectionOpportunities.push(
			`Encounter chain connection - link to ${encounterSites[0].name} with ${encounterType} encounter`,
		)
	}

	// Look for secret-based connections
	const secretSites = existingSites.filter((site) => site.secrets.length > 0)
	if (secretSites.length > 0) {
		const secretType = secretSites[0].secrets[0].secretType
		suggestions.uniqueConnectionOpportunities.push(
			`Mystery connection - link to ${secretSites[0].name} with ${secretType} secret`,
		)
	}

	// NPC-based connection opportunities
	const npcSites = existingSites.filter((site) => site.npcs.length > 0)
	if (npcSites.length > 0) {
		const npcOccupation = npcSites[0].npcs[0].npc.occupation
		suggestions.uniqueConnectionOpportunities.push(
			`Social connection - link through ${npcOccupation} at ${npcSites[0].name}`,
		)
	}

	return suggestions
}
