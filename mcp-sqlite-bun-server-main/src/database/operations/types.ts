import type { QuestsFile } from "../../schemas/questsSchema"
import type { NpcsFile } from "../../schemas/npcsSchema"
import type { FactionsFile } from "../../schemas/factionsSchema"
import type { LocationsFile } from "../../schemas/locationsSchema"

// Helper type for non-undefined array element
export type NonNullableArrayElement<T> = T extends (infer U)[] ? NonNullable<U> : never

// Helper type for non-undefined record value
export type NonNullableRecordValue<T> = T extends Record<string, infer U> ? NonNullable<U> : never

// Helper type for non-undefined array
export type NonNullableArray<T> = NonNullable<T extends (infer U)[] ? U[] : never>

// Helper type for making all nested objects and arrays required
export type DeepRequired<T> = T extends object
  ? T extends Array<infer U>
    ? Array<DeepRequired<NonNullable<U>>>
    : {
        [P in keyof T]-?: DeepRequired<NonNullable<T[P]>>
      }
  : NonNullable<T>

// Helper type for making all nested objects and arrays required, preserving undefined
export type DeepRequiredPreserveUndefined<T> = T extends object
  ? T extends Array<infer U>
    ? Array<DeepRequiredPreserveUndefined<U>>
    : {
        [P in keyof T]: DeepRequiredPreserveUndefined<T[P]>
      }
  : T

// Type aliases for commonly used deep required types
export type RequiredQuest = DeepRequired<QuestsFile["quests"][number]>
export type RequiredNPC = DeepRequired<NpcsFile["npcs"][number]>
export type RequiredFaction = DeepRequired<FactionsFile["factions"][string]>
export type RequiredLocation = DeepRequired<LocationsFile["locations"][string]>

export interface DatabaseTransaction {
  commit(): void
  rollback(): void
}

export interface QuestOperations {
  // Basic operations
  createQuest(quest: RequiredQuest): void
  getQuest(id: string): RequiredQuest | null
  updateQuest(quest: RequiredQuest): void
  deleteQuest(id: string): void

  // Stage operations
  addQuestStage(questId: string, stage: DeepRequired<RequiredQuest["quest_stages"][number]>): void
  updateQuestStage(questId: string, stage: DeepRequired<RequiredQuest["quest_stages"][number]>): void
  deleteQuestStage(questId: string, stageNumber: number): void

  // Objective operations
  addQuestObjective(questId: string, stageNumber: number, objective: string): void
  deleteQuestObjective(questId: string, stageNumber: number, objective: string): void

  // Completion path operations
  addCompletionPath(
    questId: string,
    stageNumber: number,
    pathName: string,
    path: DeepRequired<RequiredQuest["quest_stages"][number]["completion_paths"][string]>,
  ): void
  deleteCompletionPath(questId: string, stageNumber: number, pathName: string): void

  // Decision point operations
  addDecisionPoint(
    questId: string,
    decisionPoint: DeepRequired<RequiredQuest["key_decision_points"][number]>,
  ): void
  deleteDecisionPoint(questId: string, stageNumber: number, decision: string): void

  // Twist operations
  addTwist(questId: string, twist: string): void
  deleteTwist(questId: string, twist: string): void

  // Reward operations
  addReward(questId: string, rewardPath: string, reward: string): void
  deleteReward(questId: string, rewardPath: string, reward: string): void

  // Follow-up quest operations
  addFollowUpQuest(questId: string, path: string, followUpId: string): void
  deleteFollowUpQuest(questId: string, path: string, followUpId: string): void

  // Related quest operations
  addRelatedQuest(questId: string, relatedId: string): void
  deleteRelatedQuest(questId: string, relatedId: string): void
}

export interface NPCOperations {
  // Basic operations
  createNPC(npc: RequiredNPC): void
  getNPC(id: string): RequiredNPC | null
  updateNPC(npc: RequiredNPC): void
  deleteNPC(id: string): void

  // Quest operations
  addNPCQuest(npcId: string, questId: string, description: string): void
  removeNPCQuest(npcId: string, questId: string): void

  // Relationship operations
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
  createFaction(id: string, faction: RequiredFaction): void
  getFaction(id: string): RequiredFaction | null
  updateFaction(id: string, faction: RequiredFaction): void
  deleteFaction(id: string): void

  // Resource operations
  addResource(factionId: string, resource: string): void
  removeResource(factionId: string, resource: string): void

  // Leader operations
  addLeader(factionId: string, leader: DeepRequired<RequiredFaction["leadership"][number]>): void
  removeLeader(factionId: string, leaderName: string): void

  // Member operations
  addMember(factionId: string, member: DeepRequired<RequiredFaction["members"][number]>): void
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
  createLocation(id: string, location: RequiredLocation): void
  getLocation(id: string): RequiredLocation | null
  updateLocation(id: string, location: RequiredLocation): void
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
  addPointOfInterest(locationId: string, poi: DeepRequired<RequiredLocation["points_of_interest"][number]>): void
  removePointOfInterest(locationId: string, poiName: string): void

  // Connection operations
  addConnection(locationId: string, connectedLocationId: string): void
  removeConnection(locationId: string, connectedLocationId: string): void

  // District operations
  addDistrict(locationId: string, districtId: string, district: DeepRequired<RequiredLocation["districts"][string]>): void
  updateDistrict(locationId: string, districtId: string, district: DeepRequired<RequiredLocation["districts"][string]>): void
  removeDistrict(locationId: string, districtId: string): void
  addDistrictFeature(locationId: string, districtId: string, feature: string): void
  removeDistrictFeature(locationId: string, districtId: string, feature: string): void
  addDistrictNPC(locationId: string, districtId: string, npcId: string): void
  removeDistrictNPC(locationId: string, districtId: string, npcId: string): void

  // Area operations
  addArea(locationId: string, areaId: string, area: DeepRequired<RequiredLocation["areas"][string]>): void
  updateArea(locationId: string, areaId: string, area: DeepRequired<RequiredLocation["areas"][string]>): void
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