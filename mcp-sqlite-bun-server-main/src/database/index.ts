import { Database } from "bun:sqlite"
import { SQLiteQuestOperations } from "./operations/quests"
import { SQLiteNPCOperations } from "./operations/npcs"
import { SQLiteFactionOperations } from "./operations/factions"
import { SQLiteLocationOperations } from "./operations/locations"
import type { QuestOperations, NPCOperations, FactionOperations, LocationOperations } from "./operations/types"

export class SQLiteDatabase {
  private db: Database
  readonly quests: QuestOperations
  readonly npcs: NPCOperations
  readonly factions: FactionOperations
  readonly locations: LocationOperations

  constructor(dbPath: string) {
    this.db = new Database(dbPath, { create: true })
    this.setupDatabase()
    
    this.quests = new SQLiteQuestOperations(this.db)
    this.npcs = new SQLiteNPCOperations(this.db)
    this.factions = new SQLiteFactionOperations(this.db)
    this.locations = new SQLiteLocationOperations(this.db)
  }

  /**
   * Set up the database by creating necessary tables
   */
  private setupDatabase(): void {
    // Create the tables if they don't exist
    this.db.exec(`
      -- Quests tables
      CREATE TABLE IF NOT EXISTS quests (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        type TEXT,
        difficulty TEXT,
        description TEXT
      );

      CREATE TABLE IF NOT EXISTS quest_stages (
        quest_id TEXT,
        stage INTEGER,
        title TEXT,
        PRIMARY KEY (quest_id, stage),
        FOREIGN KEY (quest_id) REFERENCES quests(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS quest_objectives (
        quest_id TEXT,
        stage INTEGER,
        objective TEXT,
        PRIMARY KEY (quest_id, stage, objective),
        FOREIGN KEY (quest_id, stage) REFERENCES quest_stages(quest_id, stage) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS quest_completion_paths (
        quest_id TEXT,
        stage INTEGER,
        path_name TEXT,
        description TEXT,
        challenges TEXT,
        outcomes TEXT,
        PRIMARY KEY (quest_id, stage, path_name),
        FOREIGN KEY (quest_id, stage) REFERENCES quest_stages(quest_id, stage) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS quest_decision_points (
        quest_id TEXT,
        stage INTEGER,
        decision TEXT,
        description TEXT,
        PRIMARY KEY (quest_id, stage, decision),
        FOREIGN KEY (quest_id) REFERENCES quests(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS quest_decision_choices (
        quest_id TEXT,
        stage INTEGER,
        decision TEXT,
        choice TEXT,
        outcome TEXT,
        PRIMARY KEY (quest_id, stage, decision, choice),
        FOREIGN KEY (quest_id, stage, decision) REFERENCES quest_decision_points(quest_id, stage, decision) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS quest_twists (
        quest_id TEXT,
        twist TEXT,
        PRIMARY KEY (quest_id, twist),
        FOREIGN KEY (quest_id) REFERENCES quests(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS quest_rewards (
        quest_id TEXT,
        path TEXT,
        reward TEXT,
        PRIMARY KEY (quest_id, path, reward),
        FOREIGN KEY (quest_id) REFERENCES quests(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS quest_follow_ups (
        quest_id TEXT,
        path TEXT,
        follow_up_id TEXT,
        PRIMARY KEY (quest_id, path, follow_up_id),
        FOREIGN KEY (quest_id) REFERENCES quests(id) ON DELETE CASCADE,
        FOREIGN KEY (follow_up_id) REFERENCES quests(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS quest_related (
        quest_id TEXT,
        related_id TEXT,
        PRIMARY KEY (quest_id, related_id),
        FOREIGN KEY (quest_id) REFERENCES quests(id) ON DELETE CASCADE,
        FOREIGN KEY (related_id) REFERENCES quests(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS quest_associated_npcs (
        quest_id TEXT,
        npc_id TEXT,
        role TEXT,
        PRIMARY KEY (quest_id, npc_id),
        FOREIGN KEY (quest_id) REFERENCES quests(id) ON DELETE CASCADE,
        FOREIGN KEY (npc_id) REFERENCES npcs(id) ON DELETE CASCADE
      );

      -- NPCs tables
      CREATE TABLE IF NOT EXISTS npcs (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        race TEXT,
        gender TEXT,
        occupation TEXT,
        role TEXT,
        quirk TEXT,
        background TEXT,
        motivation TEXT,
        secret TEXT,
        stats TEXT
      );

      CREATE TABLE IF NOT EXISTS npc_descriptions (
        npc_id TEXT,
        description TEXT,
        PRIMARY KEY (npc_id, description),
        FOREIGN KEY (npc_id) REFERENCES npcs(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS npc_personality_traits (
        npc_id TEXT,
        trait TEXT,
        PRIMARY KEY (npc_id, trait),
        FOREIGN KEY (npc_id) REFERENCES npcs(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS npc_quests (
        npc_id TEXT,
        quest_id TEXT,
        description TEXT,
        PRIMARY KEY (npc_id, quest_id),
        FOREIGN KEY (npc_id) REFERENCES npcs(id) ON DELETE CASCADE,
        FOREIGN KEY (quest_id) REFERENCES quests(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS npc_relationships (
        npc_id TEXT,
        target_id TEXT,
        description TEXT,
        PRIMARY KEY (npc_id, target_id),
        FOREIGN KEY (npc_id) REFERENCES npcs(id) ON DELETE CASCADE,
        FOREIGN KEY (target_id) REFERENCES npcs(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS npc_locations (
        npc_id TEXT,
        location_id TEXT,
        description TEXT,
        PRIMARY KEY (npc_id, location_id),
        FOREIGN KEY (npc_id) REFERENCES npcs(id) ON DELETE CASCADE,
        FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS npc_inventory (
        npc_id TEXT,
        item TEXT,
        PRIMARY KEY (npc_id, item),
        FOREIGN KEY (npc_id) REFERENCES npcs(id) ON DELETE CASCADE
      );

      -- Factions tables
      CREATE TABLE IF NOT EXISTS factions (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT,
        alignment TEXT,
        description TEXT,
        public_goal TEXT,
        true_goal TEXT,
        headquarters TEXT,
        territory TEXT,
        history TEXT
      );

      CREATE TABLE IF NOT EXISTS faction_resources (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        faction_id TEXT NOT NULL,
        resource TEXT NOT NULL,
        FOREIGN KEY (faction_id) REFERENCES factions(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS faction_leadership (
        faction_id TEXT,
        name TEXT,
        role TEXT,
        description TEXT,
        secret TEXT,
        stats TEXT,
        bio TEXT,
        PRIMARY KEY (faction_id, name),
        FOREIGN KEY (faction_id) REFERENCES factions(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS faction_members (
        faction_id TEXT,
        name TEXT,
        description TEXT,
        stats TEXT,
        PRIMARY KEY (faction_id, name),
        FOREIGN KEY (faction_id) REFERENCES factions(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS faction_allies (
        faction_id TEXT,
        ally_id TEXT,
        PRIMARY KEY (faction_id, ally_id),
        FOREIGN KEY (faction_id) REFERENCES factions(id) ON DELETE CASCADE,
        FOREIGN KEY (ally_id) REFERENCES factions(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS faction_enemies (
        faction_id TEXT,
        enemy_id TEXT,
        PRIMARY KEY (faction_id, enemy_id),
        FOREIGN KEY (faction_id) REFERENCES factions(id) ON DELETE CASCADE,
        FOREIGN KEY (enemy_id) REFERENCES factions(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS faction_quests (
        faction_id TEXT,
        quest_id TEXT,
        PRIMARY KEY (faction_id, quest_id),
        FOREIGN KEY (faction_id) REFERENCES factions(id) ON DELETE CASCADE,
        FOREIGN KEY (quest_id) REFERENCES quests(id) ON DELETE CASCADE
      );

      -- Locations tables
      CREATE TABLE IF NOT EXISTS locations (
        id TEXT PRIMARY KEY,
        name TEXT,
        type TEXT,
        region TEXT,
        description TEXT,
        history TEXT,
        danger_level TEXT,
        faction_control TEXT,
        FOREIGN KEY (faction_control) REFERENCES factions(id) ON DELETE SET NULL
      );

      CREATE TABLE IF NOT EXISTS location_features (
        location_id TEXT,
        feature TEXT,
        PRIMARY KEY (location_id, feature),
        FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS location_npcs (
        location_id TEXT,
        npc_id TEXT,
        PRIMARY KEY (location_id, npc_id),
        FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE,
        FOREIGN KEY (npc_id) REFERENCES npcs(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS location_factions (
        location_id TEXT,
        faction_id TEXT,
        PRIMARY KEY (location_id, faction_id),
        FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE,
        FOREIGN KEY (faction_id) REFERENCES factions(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS location_points_of_interest (
        location_id TEXT,
        name TEXT,
        description TEXT,
        PRIMARY KEY (location_id, name),
        FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS location_connections (
        location_id TEXT,
        connected_id TEXT,
        PRIMARY KEY (location_id, connected_id),
        FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE,
        FOREIGN KEY (connected_id) REFERENCES locations(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS location_districts (
        location_id TEXT,
        district_id TEXT,
        description TEXT,
        PRIMARY KEY (location_id, district_id),
        FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS district_features (
        location_id TEXT,
        district_id TEXT,
        feature TEXT,
        PRIMARY KEY (location_id, district_id, feature),
        FOREIGN KEY (location_id, district_id) REFERENCES location_districts(location_id, district_id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS district_npcs (
        location_id TEXT,
        district_id TEXT,
        npc_id TEXT,
        PRIMARY KEY (location_id, district_id, npc_id),
        FOREIGN KEY (location_id, district_id) REFERENCES location_districts(location_id, district_id) ON DELETE CASCADE,
        FOREIGN KEY (npc_id) REFERENCES npcs(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS location_areas (
        location_id TEXT,
        area_id TEXT,
        description TEXT,
        PRIMARY KEY (location_id, area_id),
        FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS area_features (
        location_id TEXT,
        area_id TEXT,
        feature TEXT,
        PRIMARY KEY (location_id, area_id, feature),
        FOREIGN KEY (location_id, area_id) REFERENCES location_areas(location_id, area_id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS area_encounters (
        location_id TEXT,
        area_id TEXT,
        encounter TEXT,
        PRIMARY KEY (location_id, area_id, encounter),
        FOREIGN KEY (location_id, area_id) REFERENCES location_areas(location_id, area_id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS area_treasures (
        location_id TEXT,
        area_id TEXT,
        treasure TEXT,
        PRIMARY KEY (location_id, area_id, treasure),
        FOREIGN KEY (location_id, area_id) REFERENCES location_areas(location_id, area_id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS area_npcs (
        location_id TEXT,
        area_id TEXT,
        npc_id TEXT,
        PRIMARY KEY (location_id, area_id, npc_id),
        FOREIGN KEY (location_id, area_id) REFERENCES location_areas(location_id, area_id) ON DELETE CASCADE,
        FOREIGN KEY (npc_id) REFERENCES npcs(id) ON DELETE CASCADE
      );
    `)
  }

  /**
   * Execute a raw SQL query
   */
  query(sql: string): any[] {
    return this.db.query(sql).all()
  }

  /**
   * Execute a raw SQL command
   */
  run(sql: string): { changes: number } {
    return this.db.run(sql)
  }

  /**
   * Close the database connection
   */
  close(): void {
    this.db.close()
  }
}

// Export the main SQLiteDatabase class
export default SQLiteDatabase 