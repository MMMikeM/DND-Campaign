import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { SQLiteFactionOperations } from '../src/database/operations/factions';
import Database from 'better-sqlite3';
import type { Database as SQLiteDatabase } from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Use a temporary file for testing
const TEST_DB_PATH = path.join(__dirname, '../test-faction-db.sqlite');

describe('SQLiteFactionOperations', () => {
  let sqlite: SQLiteDatabase;
  let factionOps: SQLiteFactionOperations;

  // Set up test database before all tests
  beforeAll(() => {
    // Remove existing test DB if it exists
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }

    // Create and initialize the database
    sqlite = new Database(TEST_DB_PATH);
    
    // Create tables for testing
    sqlite.exec(`
      -- Factions tables
      CREATE TABLE IF NOT EXISTS factions (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT,
        description TEXT,
        goals TEXT
      );

      CREATE TABLE IF NOT EXISTS faction_resources (
        faction_id TEXT,
        resource TEXT,
        PRIMARY KEY (faction_id, resource),
        FOREIGN KEY (faction_id) REFERENCES factions(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS faction_leadership (
        faction_id TEXT,
        npc_id TEXT,
        title TEXT,
        PRIMARY KEY (faction_id, npc_id),
        FOREIGN KEY (faction_id) REFERENCES factions(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS faction_members (
        faction_id TEXT,
        npc_id TEXT,
        role TEXT,
        PRIMARY KEY (faction_id, npc_id),
        FOREIGN KEY (faction_id) REFERENCES factions(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS faction_allies (
        faction_id TEXT,
        ally_id TEXT,
        details TEXT,
        PRIMARY KEY (faction_id, ally_id),
        FOREIGN KEY (faction_id) REFERENCES factions(id) ON DELETE CASCADE,
        FOREIGN KEY (ally_id) REFERENCES factions(id)
      );

      CREATE TABLE IF NOT EXISTS faction_enemies (
        faction_id TEXT,
        enemy_id TEXT,
        details TEXT,
        PRIMARY KEY (faction_id, enemy_id),
        FOREIGN KEY (faction_id) REFERENCES factions(id) ON DELETE CASCADE,
        FOREIGN KEY (enemy_id) REFERENCES factions(id)
      );

      CREATE TABLE IF NOT EXISTS faction_quests (
        faction_id TEXT,
        quest_id TEXT,
        details TEXT,
        PRIMARY KEY (faction_id, quest_id),
        FOREIGN KEY (faction_id) REFERENCES factions(id) ON DELETE CASCADE
      );
    `);
    
    factionOps = new SQLiteFactionOperations(sqlite);
  });

  // Clean up after all tests
  afterAll(() => {
    sqlite.close();
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
  });

  // Sample faction data for testing
  const testFaction = {
    id: 'FC001',
    name: 'The Silver Shield',
    type: 'Mercenary Company',
    description: 'A respected company of mercenaries known for their reliability and honor.',
    goals: 'Build wealth and reputation while maintaining a code of honor.',
    resources: [
      'Silver Shield Guildhall',
      'Substantial treasury',
      'Network of informants'
    ],
    leadership: [
      {
        id: 'NPC001',
        title: 'Captain'
      }
    ],
    members: [
      {
        id: 'NPC002',
        role: 'Lieutenant'
      },
      {
        id: 'NPC003',
        role: 'Quartermaster'
      }
    ],
    allies: [
      {
        id: 'FC002',
        details: 'Trade partnership and mutual defense pact'
      }
    ],
    enemies: [],
    quests: [
      {
        id: 'QS001',
        details: 'A mission to recover stolen goods'
      }
    ]
  };

  const secondFaction = {
    id: 'FC002',
    name: 'Merchant\'s Guild',
    type: 'Trade Guild',
    description: 'The powerful association of merchants that controls much of the region\'s trade.',
    goals: 'Maximize profits and expand trade routes.',
    resources: [
      'Guild headquarters',
      'Large treasury',
      'Trading fleet'
    ],
    leadership: [
      {
        id: 'NPC004',
        title: 'Guildmaster'
      }
    ],
    members: [
      {
        id: 'NPC005',
        role: 'Senior merchant'
      }
    ],
    allies: [
      {
        id: 'FC001',
        details: 'Trade partnership and mutual defense pact'
      }
    ],
    enemies: [
      {
        id: 'FC003',
        details: 'Competing trade interests and past betrayals'
      }
    ],
    quests: [
      {
        id: 'QS002',
        details: 'Escort merchant caravan'
      }
    ]
  };

  it('should create a faction', () => {
    // Create a test faction
    factionOps.createFaction(testFaction.id, testFaction);
    
    // Verify it was created correctly
    const retrievedFaction = factionOps.getFaction(testFaction.id);
    expect(retrievedFaction).toBeTruthy();
    expect(retrievedFaction?.name).toBe('The Silver Shield');
    expect(retrievedFaction?.type).toBe('Mercenary Company');
    expect(retrievedFaction?.resources).toHaveLength(3);
    expect(retrievedFaction?.leadership).toHaveLength(1);
    expect(retrievedFaction?.members).toHaveLength(2);
  });

  it('should update a faction', () => {
    // Update the faction
    const updatedFaction = {
      ...testFaction,
      name: 'The Golden Shield',
      description: 'A renowned company of elite mercenaries.',
      resources: [
        'Golden Shield Guildhall',
        'Overflowing treasury',
        'Network of informants',
        'Training grounds'
      ]
    };
    
    factionOps.updateFaction(testFaction.id, updatedFaction);
    
    // Verify the update
    const retrievedFaction = factionOps.getFaction(testFaction.id);
    expect(retrievedFaction?.name).toBe('The Golden Shield');
    expect(retrievedFaction?.description).toBe('A renowned company of elite mercenaries.');
    expect(retrievedFaction?.resources).toHaveLength(4);
    expect(retrievedFaction?.resources).toContain('Training grounds');
  });

  it('should create an allied faction', () => {
    // Create a second faction that is allied with the first
    factionOps.createFaction(secondFaction.id, secondFaction);
    
    // Verify the alliance
    const retrievedFaction1 = factionOps.getFaction(testFaction.id);
    const retrievedFaction2 = factionOps.getFaction(secondFaction.id);
    
    expect(retrievedFaction1?.allies).toHaveLength(1);
    expect(retrievedFaction1?.allies[0].id).toBe('FC002');
    
    expect(retrievedFaction2?.allies).toHaveLength(1);
    expect(retrievedFaction2?.allies[0].id).toBe('FC001');
  });

  it('should add a member', () => {
    const newMember = {
      id: 'NPC006',
      role: 'Scout'
    };
    
    factionOps.addMember(testFaction.id, newMember.id, newMember.role);
    
    // Verify the member was added
    const retrievedFaction = factionOps.getFaction(testFaction.id);
    expect(retrievedFaction?.members).toHaveLength(3);
    const addedMember = retrievedFaction?.members.find(m => m.id === 'NPC006');
    expect(addedMember?.role).toBe('Scout');
  });

  it('should add a quest', () => {
    const newQuest = {
      id: 'QS003',
      details: 'A contract to guard an important noble'
    };
    
    factionOps.addQuest(testFaction.id, newQuest.id, newQuest.details);
    
    // Verify the quest was added
    const retrievedFaction = factionOps.getFaction(testFaction.id);
    expect(retrievedFaction?.quests).toHaveLength(2);
    const addedQuest = retrievedFaction?.quests.find(q => q.id === 'QS003');
    expect(addedQuest?.details).toBe('A contract to guard an important noble');
  });

  it('should delete a faction', () => {
    // Delete the factions
    factionOps.deleteFaction(testFaction.id);
    factionOps.deleteFaction(secondFaction.id);
    
    // Verify they were deleted
    const retrievedFaction1 = factionOps.getFaction(testFaction.id);
    const retrievedFaction2 = factionOps.getFaction(secondFaction.id);
    expect(retrievedFaction1).toBeNull();
    expect(retrievedFaction2).toBeNull();
  });
}); 