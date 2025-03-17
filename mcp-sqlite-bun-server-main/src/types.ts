import type { LocationsFile } from "./schemas/locationsSchema"
import type { QuestsFile } from "./schemas/questsSchema"
import type { NpcsFile } from "./schemas/npcsSchema"
import type { FactionsFile } from "./schemas/factionsSchema"

export interface DatabaseTransaction {
	commit(): void
	rollback(): void
}

// Helper type for non-undefined array element
export type NonNullableArrayElement<T> = T extends (infer U)[] ? NonNullable<U> : never

// Helper type for non-undefined record value
export type NonNullableRecordValue<T> = T extends Record<string, infer U> ? NonNullable<U> : never

// Helper type for non-undefined array
export type NonNullableArray<T> = NonNullable<T extends (infer U)[] ? U[] : never>

export interface QuestOperations {
	// Basic operations
	createQuest(quest: NonNullableArrayElement<QuestsFile["quests"]>): void
	getQuest(id: string): NonNullableArrayElement<QuestsFile["quests"]> | null
	updateQuest(quest: NonNullableArrayElement<QuestsFile["quests"]>): void
	deleteQuest(id: string): void

	// Stage operations
	addQuestStage(
		questId: string,
		stage: NonNullableArrayElement<
			NonNullable<NonNullableArrayElement<QuestsFile["quests"]>["quest_stages"]>
		>,
	): void
	updateQuestStage(
		questId: string,
		stage: NonNullableArrayElement<
			NonNullable<NonNullableArrayElement<QuestsFile["quests"]>["quest_stages"]>
		>,
	): void
	deleteQuestStage(questId: string, stageNumber: number): void

	// Objective operations
	addQuestObjective(questId: string, stageNumber: number, objective: string): void
	deleteQuestObjective(questId: string, stageNumber: number, objective: string): void

	// Completion path operations
	addCompletionPath(
		questId: string,
		stageNumber: number,
		pathName: string,
		path: NonNullableArrayElement<
			NonNullable<NonNullableArrayElement<QuestsFile["quests"]>["quest_stages"]>
		>["completion_paths"][string],
	): void
	deleteCompletionPath(questId: string, stageNumber: number, pathName: string): void

	// Decision point operations
	addDecisionPoint(
		questId: string,
		decisionPoint: NonNullableArrayElement<
			NonNullable<NonNullableArrayElement<QuestsFile["quests"]>["key_decision_points"]>
		>,
	): void
	deleteDecisionPoint(questId: string, stageNumber: number, decision: string): void

	// Twist operations
	addTwist(questId: string, twist: string): void
	deleteTwist(questId: string, twist: string): void

	// Reward operations
	addReward(questId: string, rewardPath: string, reward: string): void
	deleteReward(questId: string, rewardPath: string, reward: string): void

	// Relationship operations
	addFollowUpQuest(questId: string, path: string, followUpId: string): void
	deleteFollowUpQuest(questId: string, path: string, followUpId: string): void
	addRelatedQuest(questId: string, relatedId: string): void
	deleteRelatedQuest(questId: string, relatedId: string): void
}

export interface NPCOperations {
	// Basic operations
	createNPC(npc: NonNullableArrayElement<NpcsFile["npcs"]>): void
	getNPC(id: string): NonNullableArrayElement<NpcsFile["npcs"]> | null
	updateNPC(npc: NonNullableArrayElement<NpcsFile["npcs"]>): void
	deleteNPC(id: string): void

	// Quest relationship operations
	addNPCQuest(npcId: string, questId: string, description: string): void
	removeNPCQuest(npcId: string, questId: string): void

	// Character relationship operations
	addNPCRelationship(npcId: string, targetId: string, description: string): void
	removeNPCRelationship(npcId: string, targetId: string): void

	// Location operations
	addNPCLocation(npcId: string, locationId: string, description: string): void
	removeNPCLocation(npcId: string, locationId: string): void

	// Inventory operations
	addInventoryItem(npcId: string, item: string): void
	removeInventoryItem(npcId: string, item: string): void
}

export interface FactionOperations {
	// Basic operations
	createFaction(id: string, faction: NonNullableRecordValue<FactionsFile["factions"]>): void
	getFaction(id: string): NonNullableRecordValue<FactionsFile["factions"]> | null
	updateFaction(id: string, faction: NonNullableRecordValue<FactionsFile["factions"]>): void
	deleteFaction(id: string): void

	// Resource operations
	addResource(factionId: string, resource: string): void
	removeResource(factionId: string, resource: string): void

	// Leader operations
	addLeader(
		factionId: string,
		leader: NonNullableArrayElement<
			NonNullableArray<NonNullableRecordValue<FactionsFile["factions"]>["leadership"]>
		>,
	): void
	removeLeader(factionId: string, leaderName: string): void

	// Member operations
	addMember(
		factionId: string,
		member: NonNullableArrayElement<
			NonNullableArray<NonNullableRecordValue<FactionsFile["factions"]>["members"]>
		>,
	): void
	removeMember(factionId: string, memberName: string): void

	// Relationship operations
	addAlly(factionId: string, allyId: string): void
	removeAlly(factionId: string, allyId: string): void
	addEnemy(factionId: string, enemyId: string): void
	removeEnemy(factionId: string, enemyId: string): void

	// Quest operations
	addQuest(factionId: string, questId: string): void
	removeQuest(factionId: string, questId: string): void
}

export interface LocationOperations {
	// Basic operations
	createLocation(id: string, location: NonNullableRecordValue<LocationsFile["locations"]>): void
	getLocation(id: string): NonNullableRecordValue<LocationsFile["locations"]> | null
	updateLocation(id: string, location: NonNullableRecordValue<LocationsFile["locations"]>): void
	deleteLocation(id: string): void

	// Feature operations
	addNotableFeature(locationId: string, feature: string): void
	removeNotableFeature(locationId: string, feature: string): void

	// NPC operations
	addNPC(locationId: string, npcId: string): void
	removeNPC(locationId: string, npcId: string): void

	// Faction operations
	addFaction(locationId: string, factionId: string): void
	removeFaction(locationId: string, factionId: string): void

	// Point of Interest operations
	addPointOfInterest(
		locationId: string,
		poi: NonNullableArrayElement<
			NonNullableArray<NonNullableRecordValue<LocationsFile["locations"]>["points_of_interest"]>
		>,
	): void
	removePointOfInterest(locationId: string, poiName: string): void

	// Connection operations
	addConnection(locationId: string, connectedLocationId: string): void
	removeConnection(locationId: string, connectedLocationId: string): void

	// District operations
	addDistrict(
		locationId: string,
		districtId: string,
		district: NonNullableRecordValue<
			NonNullableRecordValue<LocationsFile["locations"]>["districts"]
		>,
	): void
	updateDistrict(
		locationId: string,
		districtId: string,
		district: NonNullableRecordValue<
			NonNullableRecordValue<LocationsFile["locations"]>["districts"]
		>,
	): void
	removeDistrict(locationId: string, districtId: string): void
	addDistrictFeature(locationId: string, districtId: string, feature: string): void
	removeDistrictFeature(locationId: string, districtId: string, feature: string): void
	addDistrictNPC(locationId: string, districtId: string, npcId: string): void
	removeDistrictNPC(locationId: string, districtId: string, npcId: string): void

	// Area operations
	addArea(
		locationId: string,
		areaId: string,
		area: NonNullableRecordValue<NonNullableRecordValue<LocationsFile["locations"]>["areas"]>,
	): void
	updateArea(
		locationId: string,
		areaId: string,
		area: NonNullableRecordValue<NonNullableRecordValue<LocationsFile["locations"]>["areas"]>,
	): void
	removeArea(locationId: string, areaId: string): void
	addAreaFeature(locationId: string, areaId: string, feature: string): void
	removeAreaFeature(locationId: string, areaId: string, feature: string): void
	addAreaEncounter(locationId: string, areaId: string, encounter: string): void
	removeAreaEncounter(locationId: string, areaId: string, encounter: string): void
	addAreaTreasure(locationId: string, areaId: string, treasure: string): void
	removeAreaTreasure(locationId: string, areaId: string, treasure: string): void
	addAreaNPC(locationId: string, areaId: string, npcId: string): void
	removeAreaNPC(locationId: string, areaId: string, npcId: string): void
}

export interface DatabaseOperations {
	quests: QuestOperations
	npcs: NPCOperations
	factions: FactionOperations
	locations: LocationOperations

	// Transaction support
	transaction(): DatabaseTransaction
}

export class DatabaseError extends Error {
	constructor(
		message: string,
		public cause?: unknown,
	) {
		super(message)
		this.name = "DatabaseError"
	}
}
