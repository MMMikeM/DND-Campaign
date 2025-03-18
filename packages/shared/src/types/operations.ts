import type { Faction, Npc, Quest, Location } from "../entities/index.js"

export interface DatabaseTransaction {
	commit(): void
	rollback(): void
}

export interface BaseOperations<T> {
	create(id: string, entity: T): void
	get(id: string): T | null
	update(id: string, entity: T): void
	delete(id: string): void
}

// Specialized operation interfaces
export interface BaseQuestOperations extends BaseOperations<Quest> {}
export interface BaseNPCOperations extends BaseOperations<Npc> {}
export interface BaseFactionOperations extends BaseOperations<Faction> {}
export interface BaseLocationOperations extends BaseOperations<Location> {}

export interface DatabaseOperations {
	quests: BaseQuestOperations
	npcs: BaseNPCOperations
	factions: BaseFactionOperations
	locations: BaseLocationOperations
}

export interface MCPOperations extends DatabaseOperations {
	transactions: DatabaseTransaction
}
