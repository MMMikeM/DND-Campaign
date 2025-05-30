import { tables } from "../schemas"

const {
	conflictTables,
	itemTables,
	eventTables,
	narrativeTables,
	npcTables,
	questTables,
	regionTables,
	worldbuildingTables,
	factionTables,
	foreshadowingTables,
} = tables

type MajorConflict = typeof conflictTables.majorConflicts.$inferSelect
type ConflictParticipant = typeof conflictTables.conflictParticipants.$inferSelect

type Npc = typeof npcTables.npcs.$inferSelect
type NpcFaction = typeof npcTables.npcFactions.$inferSelect
type NpcRelationship = typeof npcTables.npcRelationships.$inferSelect
type NpcSite = typeof npcTables.npcSites.$inferSelect

type Faction = typeof factionTables.factions.$inferSelect
type FactionAgenda = typeof factionTables.factionAgendas.$inferSelect
type FactionDiplomacy = typeof factionTables.factionDiplomacy.$inferSelect
type FactionInfluence = typeof factionTables.factionInfluence.$inferSelect

type ForeshadowingSeed = typeof foreshadowingTables.foreshadowingSeeds.$inferSelect

type NarrativeEvent = typeof eventTables.narrativeEvents.$inferSelect
type Consequence = typeof eventTables.consequences.$inferSelect

type Quest = typeof questTables.quests.$inferSelect
type QuestRelationship = typeof questTables.questRelationships.$inferSelect
type QuestHook = typeof questTables.questHooks.$inferSelect
type QuestParticipantInvolvement = typeof questTables.questParticipantInvolvement.$inferSelect
type QuestStage = typeof questTables.questStages.$inferSelect
type StageDecision = typeof questTables.stageDecisions.$inferSelect

type NarrativeDestination = typeof narrativeTables.narrativeDestinations.$inferSelect
type DestinationParticipantInvolvement = typeof narrativeTables.destinationParticipantInvolvement.$inferSelect
type DestinationQuestRole = typeof narrativeTables.destinationQuestRoles.$inferSelect
type DestinationRelationship = typeof narrativeTables.destinationRelationships.$inferSelect

type Item = typeof itemTables.items.$inferSelect
type ItemRelationship = typeof itemTables.itemRelationships.$inferSelect
type ItemNotableHistory = typeof itemTables.itemNotableHistory.$inferSelect

type Region = typeof regionTables.regions.$inferSelect
type Area = typeof regionTables.areas.$inferSelect
type Site = typeof regionTables.sites.$inferSelect
type SiteEncounter = typeof regionTables.siteEncounters.$inferSelect
type SiteSecret = typeof regionTables.siteSecrets.$inferSelect
type SiteLink = typeof regionTables.siteLinks.$inferSelect
type RegionConnection = typeof regionTables.regionConnections.$inferSelect

type WorldConcept = typeof worldbuildingTables.worldConcepts.$inferSelect
type WorldConceptLink = typeof worldbuildingTables.worldConceptLinks.$inferSelect
type ConceptRelationship = typeof worldbuildingTables.conceptRelationships.$inferSelect

// ============================================================================
// CONFLICT ENTITIES
// ============================================================================

export interface MajorConflictEmbeddingInput
	extends Pick<
		MajorConflict,
		| "name"
		| "scope"
		| "natures"
		| "status"
		| "cause"
		| "stakes"
		| "moralDilemma"
		| "possibleOutcomes"
		| "hiddenTruths"
		| "clarityOfRightWrong"
		| "currentTensionLevel"
		| "description"
	> {
	primaryRegion: null | Pick<Region, "name" | "type">

	participants: null | Array<
		Pick<ConflictParticipant, "role" | "motivation" | "publicStance" | "secretStance" | "description"> &
			(
				| { participantType: "Faction"; factionInfo: Pick<Faction, "name" | "size" | "type"> }
				| { participantType: "NPC"; npcInfo: Pick<Npc, "name" | "alignment" | "occupation"> }
			)
	>

	narrativeDestinations: null | Pick<NarrativeDestination, "name" | "type" | "description" | "status">[]

	consequences: null | Pick<Consequence, "name" | "consequenceType" | "severity" | "playerImpactFeel" | "description">[]

	affectedByConsequences:
		| null
		| Pick<Consequence, "name" | "consequenceType" | "severity" | "playerImpactFeel" | "description">[]

	worldConceptLinks: null | Array<
		Pick<WorldConceptLink, "linkDetailsText" | "linkStrength" | "linkRoleOrTypeText" | "description"> & {
			associatedConcept: Pick<WorldConcept, "name" | "conceptType">
		}
	>
}

// ============================================================================
// EVENT ENTITIES
// ============================================================================

export interface NarrativeEventEmbeddingInput
	extends Pick<
		NarrativeEvent,
		| "name"
		| "eventType"
		| "intendedRhythmEffect"
		| "narrativePlacement"
		| "impactSeverity"
		| "complication_details"
		| "escalation_details"
		| "twist_reveal_details"
		| "description"
	> {
	relatedQuest: null | Pick<Quest, "name" | "type">
	questStage: null | Pick<QuestStage, "name" | "stageType">
	triggeringDecision: null | Pick<StageDecision, "name" | "decisionType" | "description">

	triggeredConsequences: null | Array<
		Pick<
			Consequence,
			"name" | "consequenceType" | "severity" | "playerImpactFeel" | "description" | "conflictImpactDescription"
		>
	>
}

// ============================================================================
// FACTION ENTITIES
// ============================================================================

export interface FactionEmbeddingInput
	extends Pick<
		Faction,
		| "name"
		| "description"
		| "history"
		| "publicAlignment"
		| "publicGoal"
		| "publicPerception"
		| "reach"
		| "secretAlignment"
		| "secretGoal"
		| "size"
		| "transparencyLevel"
		| "type"
		| "values"
		| "wealth"
		| "jargon"
		| "symbols"
		| "rituals"
		| "taboos"
		| "aesthetics"
		| "recognitionSigns"
	> {
	primaryHqSite: null | Pick<Site, "name" | "description" | "type">

	members: null | Array<
		Pick<NpcFaction, "role" | "loyalty" | "description" | "rank" | "secrets" | "justification"> & {
			npcInfo: Pick<Npc, "name" | "alignment" | "occupation">
		}
	>

	agendas: null | Array<
		Pick<
			FactionAgenda,
			| "name"
			| "agendaType"
			| "currentStage"
			| "importance"
			| "ultimateAim"
			| "moralAmbiguity"
			| "description"
			| "approach"
			| "storyHooks"
		>
	>

	relationships: null | Array<
		Pick<FactionDiplomacy, "diplomaticStatus" | "strength" | "description"> & {
			otherFaction: Pick<Faction, "name" | "type">
		}
	>

	influence: null | Array<
		Pick<FactionInfluence, "influenceLevel" | "description" | "priorities" | "presenceTypes" | "presenceDetails"> &
			(
				| { scope: "Region"; regionInfo: Pick<Region, "name" | "type" | "description"> }
				| { scope: "Area"; areaInfo: Pick<Area, "name" | "type" | "description"> }
				| { scope: "Site"; siteInfo: Pick<Site, "name" | "type" | "description"> }
			)
	>

	questParticipation: null | Array<
		Pick<QuestParticipantInvolvement, "roleInQuest" | "importanceInQuest" | "description" | "involvementDetails"> & {
			questInfo: Pick<Quest, "name" | "type">
		}
	>

	worldConceptLinks: null | Array<
		Pick<WorldConceptLink, "linkDetailsText" | "linkStrength" | "linkRoleOrTypeText" | "description"> & {
			associatedConcept: Pick<WorldConcept, "name" | "conceptType">
		}
	>
}

// ============================================================================
// FORESHADOWING ENTITIES
// ============================================================================

type TargetQuestInfo = { entityType: "Quest"; name: Quest["name"]; details: Pick<Quest, "type"> }
type TargetNpcInfo = { entityType: "Npc"; name: Npc["name"]; details: Pick<Npc, "occupation" | "race"> }
type TargetNarrativeEventInfo = {
	entityType: "NarrativeEvent"
	name: NarrativeEvent["name"]
	details: Pick<NarrativeEvent, "eventType">
}
type TargetMajorConflictInfo = {
	entityType: "MajorConflict"
	name: MajorConflict["name"]
	details: Pick<MajorConflict, "scope" | "natures">
}
type TargetItemInfo = { entityType: "Item"; name: Item["name"]; details: Pick<Item, "itemType" | "rarity"> }
type TargetNarrativeDestinationInfo = {
	entityType: "NarrativeDestination"
	name: NarrativeDestination["name"]
	details: Pick<NarrativeDestination, "type">
}
type TargetWorldConceptInfo = {
	entityType: "WorldConcept"
	name: WorldConcept["name"]
	details: Pick<WorldConcept, "conceptType">
}
type TargetFactionInfo = { entityType: "Faction"; name: Faction["name"]; details: Pick<Faction, "type"> }
type TargetSiteInfo = {
	entityType: "Site"
	name: Site["name"]
	details: Pick<Site, "type" | "intendedSiteFunction">
}
type TargetAbstractInfo = {
	entityType: "AbstractDetail" | "AbstractTheme" | "SpecificReveal"
	name: ForeshadowingSeed["targetAbstractDetail"]
	details: { abstractType: ForeshadowingSeed["targetEntityType"] }
}

type SourceQuestInfo = { sourceType: "Quest"; name: Quest["name"]; details: Pick<Quest, "type"> }
type SourceQuestStageInfo = {
	sourceType: "QuestStage"
	name: QuestStage["name"]
	details: Pick<QuestStage, "stageType">
	parentQuestName: Quest["name"]
}
type SourceSiteInfo = {
	sourceType: "Site"
	name: Site["name"]
	details: Pick<Site, "type" | "intendedSiteFunction">
}
type SourceNpcInfo = { sourceType: "Npc"; name: Npc["name"]; details: Pick<Npc, "occupation" | "race"> }

export interface ForeshadowingEmbeddingInput
	extends Pick<
		ForeshadowingSeed,
		| "targetEntityType"
		| "targetAbstractDetail"
		| "suggestedDeliveryMethods"
		| "subtlety"
		| "narrativeWeight"
		| "description"
	> {
	targetEntityContext:
		| null
		| TargetQuestInfo
		| TargetNpcInfo
		| TargetNarrativeEventInfo
		| TargetMajorConflictInfo
		| TargetItemInfo
		| TargetNarrativeDestinationInfo
		| TargetWorldConceptInfo
		| TargetFactionInfo
		| TargetSiteInfo
		| TargetAbstractInfo

	sourceEntityContext: null | SourceQuestInfo | SourceQuestStageInfo | SourceSiteInfo | SourceNpcInfo
}

// ============================================================================
// ITEM ENTITIES
// ============================================================================

type RelatedItemInfo = { entityType: "Item"; name: Item["name"]; details: Pick<Item, "itemType" | "rarity"> }
type RelatedNpcInfo = { entityType: "Npc"; name: Npc["name"]; details: Pick<Npc, "occupation" | "race"> }
type RelatedFactionInfo = { entityType: "Faction"; name: Faction["name"]; details: Pick<Faction, "type"> }
type RelatedSiteInfo = {
	entityType: "Site"
	name: Site["name"]
	details: Pick<Site, "type" | "intendedSiteFunction">
}
type RelatedQuestInfo = { entityType: "Quest"; name: Quest["name"]; details: Pick<Quest, "type"> }
type RelatedConflictInfo = {
	entityType: "Conflict"
	name: MajorConflict["name"]
	details: Pick<MajorConflict, "scope" | "natures">
}
type RelatedNarrativeDestinationInfo = {
	entityType: "NarrativeDestination"
	name: NarrativeDestination["name"]
	details: Pick<NarrativeDestination, "type">
}
type RelatedWorldConceptInfo = {
	entityType: "WorldConcept"
	name: WorldConcept["name"]
	details: Pick<WorldConcept, "conceptType">
}

export interface ItemEmbeddingInput
	extends Pick<
		Item,
		| "name"
		| "creationPeriod"
		| "description"
		| "itemType"
		| "loreSignificance"
		| "mechanicalEffects"
		| "narrativeRole"
		| "perceivedSimplicity"
		| "placeOfOrigin"
		| "rarity"
		| "significance"
	> {
	directlyRelatedQuest: null | Pick<Quest, "name" | "type">

	contextualRelationships: null | Array<
		Pick<ItemRelationship, "relationshipType" | "relationshipDetails" | "description"> & {
			relatedEntity:
				| RelatedItemInfo
				| RelatedNpcInfo
				| RelatedFactionInfo
				| RelatedSiteInfo
				| RelatedQuestInfo
				| RelatedConflictInfo
				| RelatedNarrativeDestinationInfo
				| RelatedWorldConceptInfo
		}
	>

	notableHistory: null | Array<
		Pick<ItemNotableHistory, "eventDescription" | "timeframe" | "npcRoleInEvent" | "description"> & {
			keyNpcInvolved: null | Pick<Npc, "name" | "occupation">
			eventLocation: null | Pick<Site, "name" | "type">
		}
	>
}

// ============================================================================
// NARRATIVE ENTITIES
// ============================================================================

export interface NarrativeDestinationEmbeddingInput
	extends Pick<
		NarrativeDestination,
		| "name"
		| "type"
		| "status"
		| "promise"
		| "payoff"
		| "themes"
		| "foreshadowingElements"
		| "intendedEmotionalArc"
		| "description"
	> {
	region: null | Pick<Region, "name" | "type" | "atmosphereType">
	conflict: null | Pick<MajorConflict, "name" | "scope" | "status" | "currentTensionLevel">

	questRoles: null | Array<
		Pick<DestinationQuestRole, "role" | "sequenceInArc" | "contributionDetails" | "description"> & {
			questInfo: Pick<Quest, "name" | "type" | "mood">
		}
	>

	relatedDestinations: null | Array<
		Pick<DestinationRelationship, "relationshipType" | "relationshipDetails" | "description"> & {
			otherDestination: Pick<NarrativeDestination, "name" | "type" | "status">
		}
	>

	participantInvolvement: null | Array<
		Pick<DestinationParticipantInvolvement, "roleInArc" | "arcImportance" | "involvementDetails" | "description"> &
			(
				| { participantType: "Npc"; npcInfo: Pick<Npc, "name" | "occupation" | "alignment"> }
				| { participantType: "Faction"; factionInfo: Pick<Faction, "name" | "type" | "publicGoal"> }
			)
	>

	relatedItems: null | Array<
		Pick<ItemRelationship, "relationshipType" | "relationshipDetails" | "description"> & {
			itemInfo: Pick<Item, "name" | "itemType" | "rarity" | "narrativeRole">
		}
	>

	relevantWorldConcepts: null | Array<
		Pick<WorldConceptLink, "linkDetailsText" | "linkStrength" | "linkRoleOrTypeText" | "description"> & {
			conceptInfo: Pick<WorldConcept, "name" | "conceptType" | "summary">
		}
	>
}

// ============================================================================
// NPC ENTITIES
// ============================================================================

export interface NpcEmbeddingInput
	extends Pick<
		Npc,
		| "name"
		| "alignment"
		| "disposition"
		| "gender"
		| "race"
		| "trustLevel"
		| "wealth"
		| "adaptability"
		| "complexityProfile"
		| "playerPerceptionGoal"
		| "age"
		| "attitude"
		| "occupation"
		| "quirk"
		| "socialStatus"
		| "availability"
		| "capability"
		| "proactivity"
		| "relatability"
		| "description"
		| "currentGoals"
		| "appearance"
		| "avoidTopics"
		| "background"
		| "biases"
		| "dialogue"
		| "drives"
		| "fears"
		| "knowledge"
		| "mannerisms"
		| "personalityTraits"
		| "preferredTopics"
		| "rumours"
		| "secrets"
		| "voiceNotes"
	> {
	currentLocation: null | Pick<Site, "name" | "type" | "mood" | "environment">

	factionAffiliations: null | Array<
		Pick<NpcFaction, "role" | "rank" | "loyalty" | "justification" | "secrets" | "description"> & {
			factionInfo: Pick<Faction, "name" | "type" | "publicAlignment">
		}
	>

	associatedSites: null | Array<
		Pick<NpcSite, "associationType" | "description"> & {
			siteInfo: Pick<Site, "name" | "type" | "mood">
		}
	>

	relationshipsWithOtherNpcs: null | Array<
		Pick<
			NpcRelationship,
			| "relationshipType"
			| "strength"
			| "history"
			| "narrativeTensions"
			| "sharedGoals"
			| "relationshipDynamics"
			| "isBidirectional"
			| "description"
		> & {
			relatedNpcInfo: Pick<Npc, "name" | "occupation" | "alignment">
		}
	>

	conflictInvolvement: null | Array<
		Pick<ConflictParticipant, "role" | "motivation" | "publicStance" | "secretStance" | "description"> & {
			conflictInfo: Pick<MajorConflict, "name" | "scope" | "status">
		}
	>

	questInvolvement: null | Array<
		Pick<QuestParticipantInvolvement, "roleInQuest" | "importanceInQuest" | "involvementDetails" | "description"> & {
			questInfo: Pick<Quest, "name" | "type" | "urgency">
		}
	>

	worldConceptConnections: null | Array<
		Pick<WorldConceptLink, "linkRoleOrTypeText" | "linkStrength" | "linkDetailsText" | "description"> & {
			conceptInfo: Pick<WorldConcept, "name" | "conceptType" | "summary">
		}
	>

	significantItems: null | Array<
		Pick<ItemRelationship, "relationshipType" | "relationshipDetails" | "description"> & {
			itemInfo: Pick<Item, "name" | "itemType" | "rarity" | "significance">
		}
	>
}

// ============================================================================
// QUEST ENTITIES
// ============================================================================

export interface QuestEmbeddingInput
	extends Pick<
		Quest,
		| "name"
		| "type"
		| "urgency"
		| "visibility"
		| "mood"
		| "moralSpectrumFocus"
		| "intendedPacingRole"
		| "primaryPlayerExperienceGoal"
		| "otherUnlockConditionsNotes"
		| "description"
		| "themes"
		| "inspirations"
		| "objectives"
		| "failureOutcomes"
		| "successOutcomes"
		| "rewards"
	> {
	primaryRegion: null | Pick<Region, "name" | "type" | "dangerLevel">

	parentQuest: null | Pick<Quest, "name" | "type">

	relatedQuests: null | Array<
		Pick<QuestRelationship, "relationshipType" | "description"> & {
			otherQuest: Pick<Quest, "name" | "type" | "urgency">
		}
	>

	participants: null | Array<
		Pick<QuestParticipantInvolvement, "roleInQuest" | "importanceInQuest" | "involvementDetails" | "description"> &
			(
				| { participantType: "Npc"; npcInfo: Pick<Npc, "name" | "occupation" | "disposition"> }
				| { participantType: "Faction"; factionInfo: Pick<Faction, "name" | "type" | "publicGoal"> }
			)
	>

	stages: null | Array<
		Pick<QuestStage, "name" | "stageOrder" | "dramatic_question" | "stageType" | "description"> & {
			stageSite: null | Pick<Site, "name" | "type" | "mood">
		}
	>

	hooks: null | Array<
		Pick<
			QuestHook,
			| "source"
			| "hookType"
			| "presentationStyle"
			| "hookContent"
			| "discoveryConditions"
			| "npcRelationshipToParty"
			| "trustRequired"
			| "dialogueHint"
			| "description"
		> & {
			deliveryNpc: null | Pick<Npc, "name" | "occupation">
			hookSite: null | Pick<Site, "name" | "type">
			hookFaction: null | Pick<Faction, "name" | "type">
		}
	>

	relatedItems: null | Array<
		Pick<ItemRelationship, "relationshipType" | "relationshipDetails" | "description"> & {
			itemInfo: Pick<Item, "name" | "itemType" | "rarity" | "narrativeRole">
		}
	>

	relatedNarrativeEvents: null | Array<
		Pick<NarrativeEvent, "name" | "eventType" | "intendedRhythmEffect" | "description">
	>

	directConsequences: null | Array<
		Pick<Consequence, "name" | "consequenceType" | "severity" | "playerImpactFeel" | "description"> & {
			affectedConflictName: null | MajorConflict["name"]
		}
	>

	worldConceptConnections: null | Array<
		Pick<WorldConceptLink, "linkRoleOrTypeText" | "linkStrength" | "linkDetailsText" | "description"> & {
			conceptInfo: Pick<WorldConcept, "name" | "conceptType" | "summary">
		}
	>
}

// ============================================================================
// QUEST STAGE ENTITIES
// ============================================================================

export interface QuestStageEmbeddingInput
	extends Pick<
		QuestStage,
		| "stageOrder"
		| "name"
		| "dramatic_question"
		| "stageType"
		| "intendedComplexityLevel"
		| "stageImportance"
		| "description"
		| "objectives"
		| "completionPaths"
		| "encounters"
		| "dramatic_moments"
		| "sensory_elements"
	> {
	parentQuest: Pick<Quest, "name" | "type" | "mood" | "themes" | "urgency" | "primaryPlayerExperienceGoal">

	stageLocation: null | {
		siteInfo: Pick<Site, "name" | "type" | "mood" | "environment" | "description">
		areaInfo: Pick<Area, "name" | "type" | "atmosphereType">
	}

	potentialDecisions: null | Array<
		Pick<
			StageDecision,
			| "name"
			| "decisionType"
			| "conditionType"
			| "ambiguityLevel"
			| "options"
			| "description"
			| "successDescription"
			| "failureDescription"
			| "narrativeTransition"
		> & {
			triggeredConsequences: Array<
				Pick<Consequence, "name" | "consequenceType" | "severity" | "playerImpactFeel" | "description">
			>

			leadsToStageName: null | QuestStage["name"]
		}
	>
}

// ============================================================================
// REGION ENTITIES
// ============================================================================

export interface RegionEmbeddingInput
	extends Pick<
		Region,
		| "name"
		| "dangerLevel"
		| "type"
		| "atmosphereType"
		| "economy"
		| "history"
		| "population"
		| "description"
		| "culturalNotes"
		| "revelationLayersSummary"
		| "hazards"
		| "pointsOfInterest"
		| "rumors"
		| "secrets"
	> {
	containedAreas: null | Array<Pick<Area, "name" | "type" | "description" | "dangerLevel" | "atmosphereType">>

	outgoingConnections: null | Array<
		Pick<
			RegionConnection,
			| "connectionType"
			| "routeType"
			| "travelDifficulty"
			| "travelTime"
			| "travelHazards"
			| "pointsOfInterest"
			| "description"
		> & {
			connectedToRegion: Pick<Region, "name" | "type" | "dangerLevel">
			controllingFaction: null | Pick<Faction, "name" | "type">
		}
	>

	regionalFactionInfluence: null | Array<
		Pick<FactionInfluence, "influenceLevel" | "description" | "priorities" | "presenceTypes" | "presenceDetails"> & {
			factionInfo: Pick<Faction, "name" | "type" | "publicGoal">
		}
	>

	worldConceptConnections: null | Array<
		Pick<WorldConceptLink, "linkRoleOrTypeText" | "linkStrength" | "linkDetailsText" | "description"> & {
			conceptInfo: Pick<WorldConcept, "name" | "conceptType" | "summary">
		}
	>
}

// ============================================================================
// AREA ENTITIES
// ============================================================================

export interface AreaEmbeddingInput
	extends Pick<
		Area,
		| "name"
		| "type"
		| "dangerLevel"
		| "atmosphereType"
		| "leadership"
		| "population"
		| "primaryActivity"
		| "description"
		| "culturalNotes"
		| "revelationLayersSummary"
		| "hazards"
		| "pointsOfInterest"
		| "rumors"
		| "defenses"
	> {
	parentRegion: Pick<Region, "name" | "type" | "dangerLevel" | "economy" | "atmosphereType">

	containedSites: null | Array<Pick<Site, "name" | "type" | "description" | "mood" | "intendedSiteFunction">>

	areaFactionInfluence: null | Array<
		Pick<FactionInfluence, "influenceLevel" | "description" | "priorities" | "presenceTypes" | "presenceDetails"> & {
			factionInfo: Pick<Faction, "name" | "type" | "publicGoal" | "size">
		}
	>
}

// ============================================================================
// SITE ENTITIES
// ============================================================================

export interface SiteEmbeddingInput
	extends Pick<
		Site,
		| "type"
		| "intendedSiteFunction"
		| "name"
		| "terrain"
		| "climate"
		| "mood"
		| "environment"
		| "description"
		| "creatures"
		| "features"
		| "treasures"
		| "lightingDescription"
		| "soundscape"
		| "smells"
		| "weather"
		| "descriptors"
		| "coverOptions"
		| "elevationFeatures"
		| "movementRoutes"
		| "difficultTerrain"
		| "chokePoints"
		| "sightLines"
		| "tacticalPositions"
		| "interactiveElements"
		| "environmentalHazards"
	> {
	locationHierarchy: {
		area: Pick<Area, "name" | "type" | "atmosphereType">
		region: Pick<Region, "name" | "type" | "dangerLevel">
	}

	siteEncounters: null | Array<
		Pick<
			SiteEncounter,
			"name" | "encounterType" | "dangerLevel" | "difficulty" | "description" | "creatures" | "treasure"
		>
	>

	hiddenSecrets: null | Array<
		Pick<SiteSecret, "secretType" | "difficultyToDiscover" | "description" | "discoveryMethod" | "consequences">
	>

	siteConnections: null | Array<
		Pick<SiteLink, "linkType" | "description"> & {
			linkedSite: null | Pick<Site, "name" | "type">
		}
	>

	npcsCurrentlyPresent: null | Array<Pick<Npc, "name" | "occupation" | "disposition" | "currentGoals">>

	npcGeneralAssociations: null | Array<
		Pick<NpcSite, "associationType" | "description"> & {
			npcInfo: Pick<Npc, "name" | "occupation">
		}
	>

	siteFactionInfluence: null | Array<
		Pick<FactionInfluence, "influenceLevel" | "description" | "priorities" | "presenceTypes" | "presenceDetails"> & {
			factionInfo: Pick<Faction, "name" | "type" | "publicGoal">
		}
	>

	questStagesLocatedHere: null | Array<
		Pick<QuestStage, "name" | "stageOrder" | "stageImportance" | "dramatic_question"> & {
			parentQuest: Pick<Quest, "name" | "type" | "urgency">
		}
	>

	relatedItems: null | Array<
		Pick<ItemRelationship, "relationshipType" | "relationshipDetails" | "description"> & {
			itemInfo: Pick<Item, "name" | "itemType" | "rarity" | "significance">
		}
	>

	relevantWorldConcepts: null | Array<
		Pick<WorldConceptLink, "linkRoleOrTypeText" | "linkStrength" | "linkDetailsText" | "description"> & {
			conceptInfo: Pick<WorldConcept, "name" | "conceptType" | "summary">
		}
	>
}

// ============================================================================
// WORLD CONCEPT ENTITIES
// ============================================================================

type LinkedRegionInfo = { entityType: "Region"; name: Region["name"]; details: Pick<Region, "type" | "dangerLevel"> }
type LinkedFactionInfo = { entityType: "Faction"; name: Faction["name"]; details: Pick<Faction, "type" | "size"> }
type LinkedNpcInfo = { entityType: "Npc"; name: Npc["name"]; details: Pick<Npc, "occupation" | "alignment"> }
type LinkedConflictInfo = {
	entityType: "Conflict"
	name: MajorConflict["name"]
	details: Pick<MajorConflict, "scope" | "status">
}
type LinkedQuestInfo = { entityType: "Quest"; name: Quest["name"]; details: Pick<Quest, "type" | "urgency"> }

export interface WorldConceptEmbeddingInput
	extends Pick<
		WorldConcept,
		| "name"
		| "conceptType"
		| "complexityProfile"
		| "moralClarity"
		| "summary"
		| "surfaceImpression"
		| "livedRealityDetails"
		| "hiddenTruthsOrDepths"
		| "scope"
		| "status"
		| "timeframe"
		| "startYear"
		| "endYear"
		| "modernRelevance"
		| "description"
		| "traditions"
		| "definingCharacteristics"
		| "currentChallenges"
		| "modernConsequences"
		| "questHooks"
		| "additionalDetails"
		| "socialStructure"
		| "coreValues"
		| "languages"
		| "adaptationStrategies"
		| "majorEvents"
		| "lastingInstitutions"
		| "conflictingNarratives"
		| "historicalGrievances"
		| "endingCauses"
		| "historicalLessons"
		| "purpose"
		| "structure"
		| "membership"
		| "rules"
		| "modernAdaptations"
		| "currentEffectiveness"
		| "institutionalChallenges"
		| "culturalEvolution"
	> {
	connectionsToEntities: null | Array<
		Pick<WorldConceptLink, "linkRoleOrTypeText" | "linkStrength" | "linkDetailsText" | "description"> & {
			linkedEntity: LinkedRegionInfo | LinkedFactionInfo | LinkedNpcInfo | LinkedConflictInfo | LinkedQuestInfo
		}
	>

	relatedConcepts: null | Array<
		Pick<
			ConceptRelationship,
			"relationshipType" | "strength" | "relationshipDetails" | "isBidirectional" | "description"
		> & {
			targetConcept: Pick<WorldConcept, "name" | "conceptType" | "summary">
		}
	>
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type RecursiveRequired<T> = T extends (infer U)[]
	? RecursiveRequired<U>[] // Handle arrays
	: T extends object
		? // biome-ignore lint/complexity/noBannedTypes: <Some reason>
			T extends Function
			? T // Don't transform functions
			: {
					[K in keyof T]-?: T[K] extends infer U
						? U extends object
							? RecursiveRequired<U> // Recursively transform nested objects, removing null
							: U // Keep primitives as-is, removing null
						: T[K] extends object
							? RecursiveRequired<T[K]> // Handle non-null objects
							: T[K] // Keep primitives as-is
				}
		: T // Return primitives unchanged

// ============================================================================
// CONSOLIDATED EMBEDDING INPUTS
// ============================================================================

// Main embeddable entity types - these are the primary units for semantic search
export type EmbeddingInput =
	| MajorConflictEmbeddingInput
	| NarrativeEventEmbeddingInput
	| FactionEmbeddingInput
	| ForeshadowingEmbeddingInput
	| ItemEmbeddingInput
	| NarrativeDestinationEmbeddingInput
	| NpcEmbeddingInput
	| QuestEmbeddingInput
	| QuestStageEmbeddingInput
	| RegionEmbeddingInput
	| AreaEmbeddingInput
	| SiteEmbeddingInput
	| WorldConceptEmbeddingInput

// Note: Removed standalone types for sub-entities that are better represented
// within their parent entities (ConsequenceEmbeddingInput, FactionAgendaEmbeddingInput,
// NpcRelationshipEmbeddingInput, SiteEncounterEmbeddingInput, SiteSecretEmbeddingInput,
// StageDecisionEmbeddingInput) as they are primarily used as components within
// their parent entities rather than as independent searchable units.
