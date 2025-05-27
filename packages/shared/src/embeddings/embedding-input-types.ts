/**
 * Embedding Input Type Definitions
 *
 * These interfaces define the exact shape of data objects that the corresponding
 * `embeddingTextFor[EntityName]` functions will receive. Each interface includes:
 * - Direct fields from the database tables
 * - Resolved/summarized fields from related entities (populated by mapper functions)
 */

// ============================================================================
// CONFLICT ENTITIES
// ============================================================================

export interface MajorConflictEmbeddingInput {
	// Direct fields
	name: string
	scope?: string | null
	natures?: string[] | null
	status?: string | null
	cause?: string | null
	stakes?: string[] | null
	moralDilemma?: string | null
	possibleOutcomes?: string[] | null
	hiddenTruths?: string[] | null
	clarityOfRightWrong?: string | null
	currentTensionLevel?: string | null
	description?: string[] | null
	creativePrompts?: string[] | null
	gmNotes?: string[] | null
	tags?: string[] | null

	// Resolved fields
	primaryRegionName?: string | null
	participantSummaries?: string[] // e.g., ["Thag (Goblin Leader, Instigator)", "The Iron Brigade (Opponent)"]
}

export interface ConflictParticipantEmbeddingInput {
	// Direct fields
	role?: string | null
	motivation?: string | null
	publicStance?: string | null
	secretStance?: string | null
	description?: string[] | null
	creativePrompts?: string[] | null
	gmNotes?: string[] | null
	tags?: string[] | null

	// Resolved fields
	parentConflictName: string
	participantName: string
	participantType: "NPC" | "Faction"
}

// ============================================================================
// EVENT ENTITIES
// ============================================================================

export interface NarrativeEventEmbeddingInput {
	// Direct fields
	name: string
	eventType?: string | null
	intendedRhythmEffect?: string | null
	narrativePlacement?: string | null
	impactSeverity?: string | null
	complication_details?: string | null
	escalation_details?: string | null
	twist_reveal_details?: string | null
	description?: string[] | null
	creativePrompts?: string[] | null
	gmNotes?: string[] | null
	tags?: string[] | null

	// Resolved fields
	relatedQuestName?: string | null
	questStageName?: string | null
	triggeringDecisionName?: string | null
}

export interface ConsequenceEmbeddingInput {
	// Direct fields
	name: string
	consequenceType?: string | null
	severity?: string | null
	visibility?: string | null
	timeframe?: string | null
	sourceType?: string | null
	playerImpactFeel?: string | null
	conflictImpactDescription?: string | null
	description?: string[] | null
	creativePrompts?: string[] | null
	gmNotes?: string[] | null
	tags?: string[] | null

	// Resolved fields
	triggerDecisionName?: string | null
	triggerQuestName?: string | null
	triggerConflictName?: string | null
	affectedFactionName?: string | null
	affectedRegionName?: string | null
	affectedAreaName?: string | null
	affectedSiteName?: string | null
	affectedNpcName?: string | null
	affectedDestinationName?: string | null
	affectedConflictNameAsEffect?: string | null
	futureQuestName?: string | null
}

// ============================================================================
// FACTION ENTITIES
// ============================================================================

export interface FactionEmbeddingInput {
	// Direct fields
	name: string
	publicAlignment?: string | null
	secretAlignment?: string | null
	size?: string | null
	wealth?: string | null
	reach?: string | null
	type?: string[] | null
	publicGoal?: string | null
	secretGoal?: string | null
	publicPerception?: string | null
	transparencyLevel?: string | null
	values?: string[] | null
	history?: string[] | null
	symbols?: string[] | null
	rituals?: string[] | null
	taboos?: string[] | null
	aesthetics?: string[] | null
	jargon?: string | null
	recognitionSigns?: string[] | null
	description?: string[] | null
	creativePrompts?: string[] | null
	gmNotes?: string[] | null
	tags?: string[] | null

	// Resolved fields
	primaryHqSiteName?: string | null
	keyAllyFactionNames?: string[]
	keyEnemyFactionNames?: string[]
	areasOfInfluence?: string[] // e.g., ["Dominates Silverwood Forest (Region)", "Strong influence in Port Town (Area)"]
}

export interface FactionAgendaEmbeddingInput {
	// Direct fields
	name: string
	agendaType?: string | null
	currentStage?: string | null
	importance?: string | null
	ultimateAim?: string | null
	moralAmbiguity?: string | null
	approach?: string[] | null
	storyHooks?: string[] | null
	description?: string[] | null
	creativePrompts?: string[] | null
	gmNotes?: string[] | null
	tags?: string[] | null

	// Resolved fields
	parentFactionName: string
}

export interface FactionDiplomacyEmbeddingInput {
	// Direct fields
	strength?: string | null
	diplomaticStatus?: string | null
	description?: string[] | null
	creativePrompts?: string[] | null
	gmNotes?: string[] | null
	tags?: string[] | null

	// Resolved fields
	faction1Name: string
	faction2Name: string
}

export interface FactionInfluenceEmbeddingInput {
	// Direct fields
	influenceLevel?: string | null
	presenceTypes?: string[] | null
	presenceDetails?: string[] | null
	priorities?: string[] | null
	description?: string[] | null
	creativePrompts?: string[] | null
	gmNotes?: string[] | null
	tags?: string[] | null

	// Resolved fields
	parentFactionName: string
	locationName: string
	locationType: "Region" | "Area" | "Site"
}

// ============================================================================
// FORESHADOWING ENTITIES
// ============================================================================

export interface ForeshadowingSeedEmbeddingInput {
	// Direct fields
	targetEntityType?: string | null
	targetAbstractDetail?: string | null
	suggestedDeliveryMethods?: string[] | null
	subtlety?: string | null
	narrativeWeight?: string | null
	description?: string[] | null
	creativePrompts?: string[] | null
	gmNotes?: string[] | null
	tags?: string[] | null

	// Resolved fields
	targetEntityName?: string | null
	sourceContextSummary?: string // e.g., "Can be delivered by Elara during the 'Lost Artifact' quest at the Old Mill site."
}

// ============================================================================
// ITEM ENTITIES
// ============================================================================

export interface ItemEmbeddingInput {
	// Direct fields
	name: string
	itemType?: string | null
	rarity?: string | null
	narrativeRole?: string | null
	perceivedSimplicity?: string | null
	significance?: string | null
	loreSignificance?: string | null
	mechanicalEffects?: string[] | null
	creationPeriod?: string | null
	placeOfOrigin?: string | null
	description?: string[] | null
	creativePrompts?: string[] | null
	gmNotes?: string[] | null
	tags?: string[] | null

	// Resolved fields
	relatedQuestName?: string | null
}

export interface ItemRelationshipEmbeddingInput {
	// Direct fields
	relatedEntityType?: string | null
	relationshipType?: string | null
	relationshipDetails?: string | null
	description?: string[] | null
	creativePrompts?: string[] | null
	gmNotes?: string[] | null
	tags?: string[] | null

	// Resolved fields
	sourceItemName: string
	relatedEntityName: string
}

export interface ItemNotableHistoryEmbeddingInput {
	// Direct fields
	eventDescription?: string | null
	timeframe?: string | null
	npcRoleInEvent?: string | null
	description?: string[] | null
	creativePrompts?: string[] | null
	gmNotes?: string[] | null
	tags?: string[] | null

	// Resolved fields
	parentItemName: string
	keyNpcName?: string | null
	eventLocationSiteName?: string | null
}

// ============================================================================
// NARRATIVE ENTITIES
// ============================================================================

export interface NarrativeDestinationEmbeddingInput {
	// Direct fields
	name: string
	type?: string | null
	status?: string | null
	promise?: string | null
	payoff?: string | null
	themes?: string[] | null
	foreshadowingElements?: string[] | null
	intendedEmotionalArc?: string | null
	description?: string[] | null
	creativePrompts?: string[] | null
	gmNotes?: string[] | null
	tags?: string[] | null

	// Resolved fields
	primaryRegionName?: string | null
	relatedConflictName?: string | null
	keyQuestNamesInArc?: string[]
}

export interface DestinationQuestRoleEmbeddingInput {
	// Direct fields
	role?: string | null
	sequenceInArc?: number | null
	contributionDetails?: string[] | null
	description?: string[] | null
	creativePrompts?: string[] | null
	gmNotes?: string[] | null
	tags?: string[] | null

	// Resolved fields
	parentDestinationName: string
	questName: string
}

export interface DestinationRelationshipEmbeddingInput {
	// Direct fields
	relationshipType?: string | null
	relationshipDetails?: string[] | null
	description?: string[] | null
	creativePrompts?: string[] | null
	gmNotes?: string[] | null
	tags?: string[] | null

	// Resolved fields
	sourceDestinationName: string
	relatedDestinationName: string
}

export interface DestinationParticipantInvolvementEmbeddingInput {
	// Direct fields
	roleInArc?: string | null
	arcImportance?: string | null
	involvementDetails?: string[] | null
	description?: string[] | null
	creativePrompts?: string[] | null
	gmNotes?: string[] | null
	tags?: string[] | null

	// Resolved fields
	parentDestinationName: string
	participantName: string
	participantType: "NPC" | "Faction"
}

// ============================================================================
// NPC ENTITIES
// ============================================================================

export interface NpcEmbeddingInput {
	// Direct fields
	name: string
	alignment?: string | null
	disposition?: string | null
	gender?: string | null
	race?: string | null
	trustLevel?: string | null
	wealth?: string | null
	adaptability?: string | null
	complexityProfile?: string | null
	playerPerceptionGoal?: string | null
	age?: string | null
	attitude?: string | null
	occupation?: string | null
	quirk?: string | null
	socialStatus?: string | null
	availability?: string | null
	currentGoals?: string[] | null
	appearance?: string[] | null
	avoidTopics?: string[] | null
	background?: string[] | null
	biases?: string[] | null
	dialogue?: string[] | null
	drives?: string[] | null
	fears?: string[] | null
	knowledge?: string[] | null
	mannerisms?: string[] | null
	personalityTraits?: string[] | null
	preferredTopics?: string[] | null
	rumours?: string[] | null
	secrets?: string[] | null
	voiceNotes?: string[] | null
	capability?: string | null
	proactivity?: string | null
	relatability?: string | null
	description?: string[] | null
	creativePrompts?: string[] | null
	gmNotes?: string[] | null
	tags?: string[] | null

	// Resolved fields
	currentLocationSiteName?: string | null
	primaryFactionNameAndRole?: string // e.g., "The Shadow Guild (Leader)"
	keySiteAssociations?: string[] // e.g., ["Resides at The Old Tower", "Works at The Arcane Library"]
	keyRelationshipSummaries?: string[] // e.g., ["Ally (Strong) with Elara", "Rival (Moderate) with Borin"]
}

export interface NpcSiteEmbeddingInput {
	// Direct fields
	associationType?: string | null
	description?: string[] | null
	creativePrompts?: string[] | null
	gmNotes?: string[] | null
	tags?: string[] | null

	// Resolved fields
	npcName: string
	siteName: string
}

export interface NpcFactionEmbeddingInput {
	// Direct fields
	loyalty?: string | null
	justification?: string | null
	role?: string | null
	rank?: string | null
	secrets?: string[] | null
	description?: string[] | null
	creativePrompts?: string[] | null
	gmNotes?: string[] | null
	tags?: string[] | null

	// Resolved fields
	npcName: string
	factionName: string
}

export interface NpcRelationshipEmbeddingInput {
	// Direct fields
	relationshipType?: string | null
	strength?: string | null
	history?: string[] | null
	narrativeTensions?: string[] | null
	sharedGoals?: string[] | null
	relationshipDynamics?: string[] | null
	isBidirectional?: boolean | null
	description?: string[] | null
	creativePrompts?: string[] | null
	gmNotes?: string[] | null
	tags?: string[] | null

	// Resolved fields (optional to allow for external parameter passing)
	npc1Name?: string
	npc2Name?: string
}

// ============================================================================
// QUEST ENTITIES
// ============================================================================

export interface QuestStageEmbeddingInput {
	// Direct fields
	stageOrder?: number | null
	name: string
	dramatic_question?: string | null
	stageType?: string | null
	intendedComplexityLevel?: string | null
	objectives?: string[] | null
	completionPaths?: string[] | null
	encounters?: string[] | null
	dramatic_moments?: string[] | null
	sensory_elements?: string[] | null
	stageImportance?: string | null
	description?: string[] | null
	creativePrompts?: string[] | null
	gmNotes?: string[] | null
	tags?: string[] | null

	// Resolved fields
	parentQuestName: string
	siteName?: string | null
}

export interface StageDecisionEmbeddingInput {
	// Direct fields
	conditionType?: string | null
	decisionType?: string | null
	name: string
	ambiguityLevel?: string | null
	conditionValue?: string | null
	successDescription?: string[] | null
	failureDescription?: string[] | null
	narrativeTransition?: string[] | null
	potential_player_reactions?: string[] | null
	options?: string[] | null
	failure_leads_to_retry?: boolean | null
	failure_lesson_learned?: string | null
	description?: string[] | null
	creativePrompts?: string[] | null
	gmNotes?: string[] | null
	tags?: string[] | null

	// Resolved fields
	parentQuestName: string
	fromStageName: string
	toStageName?: string | null
}

export interface QuestEmbeddingInput {
	// Direct fields
	name: string
	type?: string | null
	urgency?: string | null
	visibility?: string | null
	mood?: string | null
	moralSpectrumFocus?: string | null
	intendedPacingRole?: string | null
	primaryPlayerExperienceGoal?: string | null
	failureOutcomes?: string[] | null
	successOutcomes?: string[] | null
	objectives?: string[] | null
	rewards?: string[] | null
	themes?: string[] | null
	inspirations?: string[] | null
	otherUnlockConditionsNotes?: string | null
	description?: string[] | null
	creativePrompts?: string[] | null
	gmNotes?: string[] | null
	tags?: string[] | null

	// Resolved fields
	regionName?: string | null
	prerequisiteQuestName?: string | null
	keyParticipantSummaries?: string[] // e.g., ["Elara (Quest Giver)", "Gorgon (Antagonist, NPC)", "The Silver Hand (Ally, Faction)"]
}

export interface QuestRelationshipEmbeddingInput {
	// Direct fields
	relationshipType?: string | null
	description?: string[] | null
	creativePrompts?: string[] | null
	gmNotes?: string[] | null
	tags?: string[] | null

	// Resolved fields
	quest1Name: string
	quest2Name: string
}

export interface QuestHookEmbeddingInput {
	// Direct fields
	source?: string | null
	hookType?: string | null
	presentationStyle?: string | null
	hookContent?: string[] | null
	discoveryConditions?: string[] | null
	npcRelationshipToParty?: string | null
	trustRequired?: string | null
	dialogueHint?: string | null
	description?: string[] | null
	creativePrompts?: string[] | null
	gmNotes?: string[] | null
	tags?: string[] | null

	// Resolved fields
	parentQuestName: string
	siteName?: string | null
	factionName?: string | null
	deliveryNpcName?: string | null
}

export interface QuestParticipantInvolvementEmbeddingInput {
	// Direct fields
	roleInQuest?: string | null
	importanceInQuest?: string | null
	involvementDetails?: string[] | null
	description?: string[] | null
	creativePrompts?: string[] | null
	gmNotes?: string[] | null
	tags?: string[] | null

	// Resolved fields
	parentQuestName: string
	participantName: string
	participantType: "NPC" | "Faction"
}

// ============================================================================
// REGION/SITE ENTITIES
// ============================================================================

export interface SiteEmbeddingInput {
	// Direct fields
	siteType?: string | null
	intendedSiteFunction?: string | null
	name: string
	terrain?: string | null
	climate?: string | null
	mood?: string | null
	environment?: string | null
	creatures?: string[] | null
	features?: string[] | null
	treasures?: string[] | null
	lightingDescription?: string | null
	soundscape?: string[] | null
	smells?: string[] | null
	weather?: string | null
	descriptors?: string[] | null
	coverOptions?: string[] | null
	description?: string[] | null
	creativePrompts?: string[] | null
	gmNotes?: string[] | null
	tags?: string[] | null

	// Resolved fields
	parentAreaName: string
	parentRegionName?: string | null
}

export interface SiteLinkEmbeddingInput {
	// Direct fields
	linkType?: string | null
	description?: string[] | null
	creativePrompts?: string[] | null
	gmNotes?: string[] | null
	tags?: string[] | null

	// Resolved fields
	site1Name: string
	site2Name?: string | null
}

export interface SiteEncounterEmbeddingInput {
	// Direct fields
	name: string
	encounterType?: string | null
	dangerLevel?: string | null
	difficulty?: string | null
	creatures?: string[] | null
	treasure?: string[] | null
	description?: string[] | null
	creativePrompts?: string[] | null
	gmNotes?: string[] | null
	tags?: string[] | null

	// Resolved fields
	parentSiteName: string
}

export interface SiteSecretEmbeddingInput {
	// Direct fields
	secretType?: string | null
	difficultyToDiscover?: string | null
	discoveryMethod?: string[] | null
	consequences?: string[] | null
	description?: string[] | null
	creativePrompts?: string[] | null
	gmNotes?: string[] | null
	tags?: string[] | null

	// Resolved fields
	parentSiteName: string
}

export interface RegionEmbeddingInput {
	// Direct fields
	name: string
	dangerLevel?: string | null
	type?: string | null
	atmosphereType?: string | null
	revelationLayersSummary?: string[] | null
	economy?: string | null
	history?: string | null
	population?: string | null
	culturalNotes?: string[] | null
	hazards?: string[] | null
	pointsOfInterest?: string[] | null
	rumors?: string[] | null
	secrets?: string[] | null
	security?: string | null
	description?: string[] | null
	creativePrompts?: string[] | null
	gmNotes?: string[] | null
	tags?: string[] | null
}

export interface AreaEmbeddingInput {
	// Direct fields
	name: string
	type?: string | null
	dangerLevel?: string | null
	atmosphereType?: string | null
	revelationLayersSummary?: string[] | null
	leadership?: string | null
	population?: string | null
	primaryActivity?: string | null
	culturalNotes?: string[] | null
	hazards?: string[] | null
	pointsOfInterest?: string[] | null
	rumors?: string[] | null
	defenses?: string | null
	description?: string[] | null
	creativePrompts?: string[] | null
	gmNotes?: string[] | null
	tags?: string[] | null

	// Resolved fields
	parentRegionName: string
}

export interface RegionConnectionEmbeddingInput {
	// Direct fields
	connectionType?: string | null
	routeType?: string | null
	travelDifficulty?: string | null
	travelTime?: string | null
	travelHazards?: string[] | null
	pointsOfInterest?: string[] | null
	description?: string[] | null
	creativePrompts?: string[] | null
	gmNotes?: string[] | null
	tags?: string[] | null

	// Resolved fields
	region1Name: string
	region2Name?: string | null
	controllingFactionName?: string | null
}

// ============================================================================
// WORLDBUILDING ENTITIES
// ============================================================================

export interface WorldConceptEmbeddingInput {
	// Direct fields
	name: string
	conceptType?: string | null
	complexityProfile?: string | null
	moralClarity?: string | null
	summary?: string | null
	surfaceImpression?: string | null
	livedRealityDetails?: string | null
	hiddenTruthsOrDepths?: string | null
	additionalDetails?: string[] | null
	socialStructure?: string | null
	coreValues?: string[] | null
	scope?: string | null
	status?: string | null
	timeframe?: string | null
	startYear?: number | null
	endYear?: number | null
	modernRelevance?: string | null
	currentChallenges?: string[] | null
	modernConsequences?: string[] | null
	questHooks?: string[] | null
	description?: string[] | null
	creativePrompts?: string[] | null
	gmNotes?: string[] | null
	tags?: string[] | null

	// Resolved fields
	keyRelatedConceptNamesAndTypes?: string[] // e.g., ["The Old Faith (Influenced By)", "The Great Schism (Led To)"]
	primaryRegionNamesWhereRelevant?: string[]
	keyFactionNamesRepresentingConcept?: string[]
}

export interface ConceptRelationshipEmbeddingInput {
	// Direct fields
	relationshipType?: string | null
	relationshipDetails?: string | null
	strength?: string | null
	isBidirectional?: boolean | null
	description?: string[] | null
	creativePrompts?: string[] | null
	gmNotes?: string[] | null
	tags?: string[] | null

	// Resolved fields
	sourceConceptName: string
	targetConceptName: string
}

export interface WorldConceptLinkEmbeddingInput {
	// Direct fields
	linkRoleOrTypeText?: string | null
	linkStrength?: string | null
	linkDetailsText?: string | null
	description?: string[] | null
	creativePrompts?: string[] | null
	gmNotes?: string[] | null
	tags?: string[] | null

	// Resolved fields
	parentConceptName: string
	linkedEntityName: string
	linkedEntityType: "Region" | "Faction" | "NPC" | "Conflict" | "Quest"
}
