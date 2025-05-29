// ============================================================================
// CONFLICT ENTITIES
// ============================================================================

export interface MajorConflictEmbeddingInput {
	// CORE EMBEDDABLE ENTITY
	// Direct fields from 'major_conflicts' table
	name: string
	scope?: string
	natures?: string[]
	status?: string
	cause?: string
	stakes?: string[]
	moralDilemma?: string
	possibleOutcomes?: string[]
	hiddenTruths?: string[]
	clarityOfRightWrong?: string
	currentTensionLevel?: string
	description?: string[]
	creativePrompts?: string[]
	gmNotes?: string[]
	tags?: string[]

	// Resolved/Summarized fields for Relationships
	primaryRegion?: {
		name: string
		type?: string
	}
	participants?: Array<{
		name: string
		type: "Faction" | "NPC"
		roleInConflict?: string
		motivation?: string
		publicStance?: string
	}>
	keyRelatedQuests?: Array<{
		name: string
		relationship?: string
	}>
	keyRelatedNarrativeDestinations?: Array<{
		name: string
		relationship?: string
	}>
	keyRelatedConsequences?: Array<{
		name: string
		consequenceType?: string
		severity?: string
		visibility?: string
		timeframe?: string
		playerImpactFeel?: string
		impactDescription?: string
		description?: string[]
		creativePrompts?: string[]
		gmNotes?: string[]
		tags?: string[]
	}>
	keyRelatedWorldConcepts?: Array<{
		name: string
		relationship?: string
	}>
}

// ============================================================================
// EVENT ENTITIES
// ============================================================================

export interface NarrativeEventEmbeddingInput {
	// CORE EMBEDDABLE ENTITY
	// Direct fields from 'narrative_events' table
	name: string
	eventType?: string
	intendedRhythmEffect?: string
	narrativePlacement?: string
	impactSeverity?: string
	complication_details?: string
	escalation_details?: string
	twist_reveal_details?: string
	description?: string[]
	creativePrompts?: string[]
	gmNotes?: string[]
	tags?: string[]

	// Resolved/Summarized fields
	relatedQuestName?: string
	questStageName?: string
	triggeringDecisionName?: string
}

// ============================================================================
// FACTION ENTITIES
// ============================================================================

export interface FactionEmbeddingInput {
	// CORE EMBEDDABLE ENTITY
	// Direct fields from 'factions' table (includes merged faction_culture fields)
	name: string
	publicAlignment?: string
	secretAlignment?: string
	size?: string
	wealth?: string
	reach?: string
	type?: string[]
	publicGoal?: string
	secretGoal?: string
	publicPerception?: string
	transparencyLevel?: string
	values?: string[]
	history?: string[]
	symbols?: string[]
	rituals?: string[]
	taboos?: string[]
	aesthetics?: string[]
	jargon?: string[]
	recognitionSigns?: string[]
	description?: string[]
	creativePrompts?: string[]
	gmNotes?: string[]
	tags?: string[]

	// Resolved/Summarized fields for Relationships
	primaryHq?: {
		name: string
		siteType?: string
		site?: {
			name: string
			type: string
		}
	}
	agendas?: Array<{
		name: string
		agendaType?: string
		currentStage?: string
		importance?: string
		ultimateAim?: string
		moralAmbiguity?: string
		approach?: string[]
		storyHooks?: string[]
		description?: string[]
		creativePrompts?: string[]
		gmNotes?: string[]
		tags?: string[]
	}>
	diplomaticTies?: Array<{
		otherFactionName: string
		status?: string
		strength?: string
		sharedGoalsOrConflicts?: string
	}>
	influenceAreas?: Array<{
		locationName: string
		locationType: "Region" | "Area" | "Site"
		level?: string
		presenceSummary?: string
	}>
	keyMembers?: Array<{
		npcName: string
		roleInFaction?: string
		rank?: string
		loyalty?: string
	}>
	keyConflictsInvolved?: Array<{
		conflictName: string
		roleInConflict?: string
	}>
	relatedWorldConcepts?: Array<{
		name: string
		relationship?: string
	}>
	keyQuestsInvolved?: Array<{
		questName: string
		roleInQuest?: string
	}>
}

// ============================================================================
// FORESHADOWING / DISCOVERABLE ELEMENT ENTITIES
// ============================================================================

export interface ForeshadowingEmbeddingInput {
	// CORE EMBEDDABLE ENTITY
	// Direct fields from 'foreshadowing_seeds' table
	targetEntityType?: string
	targetAbstractDetail?: string
	suggestedDeliveryMethods?: string[]
	subtlety?: string
	narrativeWeight?: string
	description?: string[]
	creativePrompts?: string[]
	gmNotes?: string[]
	tags?: string[]

	// Resolved/Summarized fields
	targetEntityNameAndType?: {
		name: string
		type: string
	}
	sourceContext?: {
		questName?: string
		stageName?: string
		siteName?: string
		npcName?: string
	}
}

// ============================================================================
// ITEM ENTITIES
// ============================================================================

export interface ItemEmbeddingInput {
	// CORE EMBEDDABLE ENTITY
	// Direct fields from 'items' table
	name: string
	itemType?: string
	rarity?: string
	narrativeRole?: string
	perceivedSimplicity?: string
	significance?: string
	loreSignificance?: string
	mechanicalEffects?: string[]
	creationPeriod?: string
	placeOfOrigin?: string
	description?: string[]
	creativePrompts?: string[]
	gmNotes?: string[]
	tags?: string[]

	// Resolved/Summarized fields for Relationships
	relatedQuestName?: string
	keyRelationshipSummaries?: Array<{
		relatedEntityName: string
		entityType: string
		relationshipType: string
		details?: string
	}>
	historicalHighlights?: Array<{
		event: string
		timeframe?: string
		keyNpcName?: string
		locationSiteName?: string
		npcRole?: string
	}>
}

// ============================================================================
// NARRATIVE DESTINATION ENTITIES
// ============================================================================

export interface NarrativeDestinationEmbeddingInput {
	// CORE EMBEDDABLE ENTITY
	// Direct fields from 'narrative_destinations' table
	name: string
	type?: string
	status?: string
	promise?: string
	payoff?: string
	themes?: string[]
	foreshadowingElements?: string[]
	intendedEmotionalArc?: string
	description?: string[]
	creativePrompts?: string[]
	gmNotes?: string[]
	tags?: string[]

	// Resolved/Summarized fields
	primaryRegionName?: string
	relatedConflictName?: string
	keyQuestAndRoleSummaries?: Array<{
		questName: string
		role?: string
		contributionToArc?: string
	}>
	relatedArcSummaries?: Array<{
		arcName: string
		relationshipType?: string
		connectionDetails?: string
	}>
	keyParticipantSummaries?: Array<{
		participantName: string
		participantType: "npc" | "faction"
		roleInArc?: string
		arcImportance?: string
	}>
}

// ============================================================================
// NPC ENTITIES
// ============================================================================

export interface NpcEmbeddingInput {
	// CORE EMBEDDABLE ENTITY
	// Direct fields from 'npcs' table
	name: string
	alignment?: string
	disposition?: string
	gender?: string
	race?: string
	trustLevel?: string
	wealth?: string
	adaptability?: string
	complexityProfile?: string
	playerPerceptionGoal?: string
	age?: string
	attitude?: string
	occupation?: string
	quirk?: string
	socialStatus?: string
	availability?: string
	currentGoals?: string[]
	appearance?: string[]
	avoidTopics?: string[]
	background?: string[]
	biases?: string[]
	dialogue?: string[]
	drives?: string[]
	fears?: string[]
	knowledge?: string[]
	mannerisms?: string[]
	personalityTraits?: string[]
	preferredTopics?: string[]
	rumours?: string[]
	secrets?: string[]
	voiceNotes?: string[]
	capability?: string
	proactivity?: string
	relatability?: string
	description?: string[]
	creativePrompts?: string[]
	gmNotes?: string[]
	tags?: string[]

	// Resolved/Summarized fields for Relationships
	currentLocation?: {
		siteName: string
		siteType?: string
		areaName?: string
	}
	factionAffiliations?: Array<{
		factionName: string
		roleInFaction?: string
		rank?: string
		loyalty?: string
		justification?: string
	}>
	siteAssociations?: Array<{
		siteName: string
		associationType?: string
		siteContext?: string
	}>
	relationships?: Array<{
		otherNpcName: string
		otherNpcRace?: string
		otherNpcOccupation?: string
		relationshipType?: string
		strength?: string
		history?: string[]
		narrativeTensions?: string[]
		sharedGoals?: string[]
		relationshipDynamics?: string[]
		isBidirectional?: boolean
		description?: string[]
		creativePrompts?: string[]
		gmNotes?: string[]
		tags?: string[]
	}>
	keyConflictsInvolved?: Array<{
		conflictName: string
		roleInConflict?: string
		motivation?: string
	}>
	keyQuestsInvolved?: Array<{
		questName: string
		roleInQuest?: string
	}>
	relatedWorldConcepts?: Array<{
		name: string
		roleOrRelationship?: string
	}>
	itemsOfSignificance?: Array<{
		itemName: string
		relationship?: string
	}>
}

// ============================================================================
// QUEST ENTITIES
// ============================================================================

export interface QuestEmbeddingInput {
	// CORE EMBEDDABLE ENTITY
	// Direct fields from 'quests' table
	name: string
	type?: string
	urgency?: string
	visibility?: string
	mood?: string
	moralSpectrumFocus?: string
	intendedPacingRole?: string
	primaryPlayerExperienceGoal?: string
	failureOutcomes?: string[]
	successOutcomes?: string[]
	objectives?: string[]
	rewards?: string[]
	themes?: string[]
	inspirations?: string[]
	otherUnlockConditionsNotes?: string
	description?: string[]
	creativePrompts?: string[]
	gmNotes?: string[]
	tags?: string[]

	// Resolved/Summarized fields for Relationships
	region?: {
		name: string
		type?: string
	}
	relatedQuests?: Array<{
		name: string
		relationshipType?: string
		objectiveSummary?: string
	}>
	participants?: Array<{
		name: string
		type: "NPC" | "Faction"
		roleInQuest?: string
		importance?: string
	}>
	stages?: Array<{
		name: string
		order?: number
		dramaticQuestion?: string
		siteName?: string
		objectiveSummary?: string
	}>
	hooks?: Array<{
		sourceDescription?: string
		hookType?: string
		presentationStyle?: string
		deliveryNpcName?: string
		triggeringFactionName?: string
	}>
	keyItemsInvolved?: Array<{
		itemName: string
		roleInQuest?: string
	}>
	keyNarrativeEventsTriggered?: Array<{
		eventName: string
		eventType?: string
	}>
	keyConsequences?: Array<{
		consequenceName: string
		consequenceType?: string
		severity?: string
		visibility?: string
		timeframe?: string
		playerImpactFeel?: string
		description?: string[]
		creativePrompts?: string[]
		gmNotes?: string[]
		tags?: string[]
	}>
}

export interface QuestStageEmbeddingInput {
	// CORE EMBEDDABLE ENTITY
	// Direct fields from 'quest_stages' table
	stageOrder?: number
	name: string
	dramatic_question?: string
	stageType?: string
	intendedComplexityLevel?: string
	objectives?: string[]
	completionPaths?: string[]
	encounters?: string[]
	dramatic_moments?: string[]
	sensory_elements?: string[]
	stageImportance?: string
	description?: string[]
	creativePrompts?: string[]
	gmNotes?: string[]
	tags?: string[]

	// Resolved/Summarized fields
	parentQuestName: string
	site?: {
		name: string
		type?: string
	}
	keyDecisions?: Array<{
		name: string
		decisionType?: string
		conditionType?: string
		ambiguityLevel?: string
		conditionValue?: string
		successDescription?: string[]
		failureDescription?: string[]
		narrativeTransition?: string[]
		potentialPlayerReactions?: string[]
		options?: string[]
		failureLeadsToRetry?: boolean
		failureLessonLearned?: string
		description?: string[]
		creativePrompts?: string[]
		gmNotes?: string[]
		tags?: string[]
		successLeadsToStageName?: string
		failureLeadsToStageName?: string
		consequences?: Array<{
			name: string
			consequenceType?: string
			severity?: string
			visibility?: string
			timeframe?: string
			playerImpactFeel?: string
			description?: string[]
			creativePrompts?: string[]
			gmNotes?: string[]
			tags?: string[]
		}>
	}>
}

// ============================================================================
// REGION/AREA/SITE ENTITIES
// ============================================================================

export interface RegionEmbeddingInput {
	// CORE EMBEDDABLE ENTITY
	// Direct fields from 'regions' table
	name: string
	dangerLevel?: string
	type?: string
	atmosphereType?: string
	revelationLayersSummary?: string[]
	economy?: string
	history?: string
	population?: string
	culturalNotes?: string[]
	hazards?: string[]
	pointsOfInterest?: string[]
	rumors?: string[]
	secrets?: string[]
	security?: string[]
	description?: string[]
	creativePrompts?: string[]
	gmNotes?: string[]
	tags?: string[]

	// Resolved/Summarized fields
	keyAreaSummaries?: Array<{
		areaName: string
		type?: string
		primaryActivity?: string
		dangerLevel?: string
		atmosphereType?: string
	}>
	keyConnectionSummaries?: Array<{
		connectedRegionName: string
		connectionType?: string
		routeType?: string
		travelDifficulty?: string
		travelTime?: string
	}>
	keyFactionInfluenceSummaries?: Array<{
		factionName: string
		influenceLevel?: string
		presenceSummary?: string
	}>
	relatedWorldConceptSummaries?: Array<{
		conceptName: string
		relationship?: string
		relevance?: string
	}>
}

export interface AreaEmbeddingInput {
	// CORE EMBEDDABLE ENTITY
	// Direct fields from 'areas' table
	name: string
	type?: string
	dangerLevel?: string
	atmosphereType?: string
	revelationLayersSummary?: string[]
	leadership?: string
	population?: string
	primaryActivity?: string
	culturalNotes?: string[]
	hazards?: string[]
	pointsOfInterest?: string[]
	rumors?: string[]
	defenses?: string[]
	description?: string[]
	creativePrompts?: string[]
	gmNotes?: string[]
	tags?: string[]

	// Resolved/Summarized fields
	parentRegionName: string
	keySiteSummaries?: Array<{
		siteName: string
		siteType?: string
		intendedFunction?: string
		mood?: string
	}>
	keyFactionInfluenceSummaries?: Array<{
		factionName: string
		influenceLevel?: string
		presenceSummary?: string
	}>
}

export interface SiteEmbeddingInput {
	// CORE EMBEDDABLE ENTITY
	// Direct fields from 'sites' table
	siteType?: string
	intendedSiteFunction?: string
	name: string
	terrain?: string
	climate?: string
	mood?: string
	environment?: string
	creatures?: string[]
	features?: string[]
	treasures?: string[]
	lightingDescription?: string[]
	soundscape?: string[]
	smells?: string[]
	weather?: string[]
	descriptors?: string[]
	coverOptions?: string[]
	description?: string[]
	creativePrompts?: string[]
	gmNotes?: string[]
	tags?: string[]

	// Resolved/Summarized fields for Relationships
	locationContext?: {
		areaName: string
		areaType?: string
		regionName: string
		regionType?: string
	}
	encounters?: Array<{
		name: string
		encounterType?: string
		dangerLevel?: string
		difficulty?: string
		creatures?: string[]
		treasure?: string[]
		description?: string[]
		creativePrompts?: string[]
		gmNotes?: string[]
		tags?: string[]
	}>
	secrets?: Array<{
		secretType?: string
		briefDescription: string
		difficultyToDiscover?: string
		discoveryMethod?: string[]
		consequences?: string[]
		description?: string[]
		creativePrompts?: string[]
		gmNotes?: string[]
		tags?: string[]
	}>
	connectedSites?: Array<{
		otherSiteName: string
		linkType?: string
		travelDescription?: string
	}>
	keyNpcsPresent?: Array<{
		npcName: string
		associationType?: string
		npcSummary?: string
	}>
	factionsPresent?: Array<{
		factionName: string
		influenceLevel?: string
		presenceSummary?: string
	}>
	keyQuestsLocatedHere?: Array<{
		questName: string
		stageName?: string
		objectiveSummary?: string
	}>
	itemsLocatedHere?: Array<{
		itemName: string
		context?: string
	}>
	relatedWorldConcepts?: Array<{
		name: string
		relationship?: string
	}>
}

// ============================================================================
// WORLDBUILDING ENTITIES
// ============================================================================

export interface WorldConceptEmbeddingInput {
	// CORE EMBEDDABLE ENTITY
	// Direct fields from 'world_concepts' table (and its 1:1 subtype tables like cultural_groups, historical_periods, social_institutions)
	name: string
	conceptType?: string
	complexityProfile?: string
	moralClarity?: string
	summary?: string
	surfaceImpression?: string
	livedRealityDetails?: string
	hiddenTruthsOrDepths?: string
	additionalDetails?: string[]
	socialStructure?: string
	coreValues?: string[]
	traditions?: string[]
	languages?: string[]
	definingCharacteristics?: string[]
	majorEvents?: string[]
	scope?: string
	status?: string
	timeframe?: string
	startYear?: number
	endYear?: number
	modernRelevance?: string
	currentChallenges?: string[]
	modernConsequences?: string[]
	questHooks?: string[]
	description?: string[]
	creativePrompts?: string[]
	gmNotes?: string[]
	tags?: string[]

	// Resolved/Summarized fields for Relationships
	relatedConcepts?: Array<{
		otherConceptName: string
		relationshipType?: string
		strength?: string
		details?: string
	}>
	entityLinks?: Array<{
		entityName: string
		entityType: "Region" | "Faction" | "NPC" | "Conflict" | "Quest"
		roleOrType?: string
		strength?: string
		details?: string
	}>
	primaryRegionSummaries?: Array<{
		regionName: string
		relevanceType?: string
		influence?: string
	}>
	keyFactionSummaries?: Array<{
		factionName: string
		relationshipType?: string
		representationLevel?: string
	}>
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Recursively makes all properties required, handling arrays, objects, and null unions properly
 */
export type RecursiveRequired<T> = T extends (infer U)[]
	? RecursiveRequired<U>[] // Handle arrays
	: T extends object
		? T extends Function
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
