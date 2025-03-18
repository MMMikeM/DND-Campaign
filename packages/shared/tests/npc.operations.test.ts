import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { DrizzleNPCOperations } from '../src/database/operations/npcs';
import { createDrizzleDb } from '../src/database/drizzle';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { initNpcSchema } from '../src/database/migrations';

// Use a temporary file for testing
const TEST_DB_PATH = path.join(__dirname, '../test-npc-db.sqlite');

describe('DrizzleNPCOperations', () => {
  let sqlite: Database.Database;
  let drizzleDb: ReturnType<typeof createDrizzleDb>;
  let npcOps: DrizzleNPCOperations;

  // Set up test database before all tests
  beforeAll(() => {
    // Remove existing test DB if it exists
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }

    // Create and initialize the database
    sqlite = new Database(TEST_DB_PATH);
    initNpcSchema(sqlite);
    drizzleDb = createDrizzleDb(TEST_DB_PATH);
    npcOps = new DrizzleNPCOperations(drizzleDb, sqlite);
  });

  // Clean up after all tests
  afterAll(() => {
    sqlite.close();
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
  });

  // Sample NPC data for testing
  const testNpc = {
    id: 'test-npc-1',
    name: 'Test NPC',
    race: 'Human',
    gender: 'Male',
    occupation: 'Blacksmith',
    role: 'Quest Giver',
    quirk: 'Always rubbing his beard',
    background: 'Grew up in a small village',
    motivation: 'Wants to be the best blacksmith',
    secret: 'Actually can\'t forge anything',
    stats: 'STR: 14, DEX: 12, CON: 16, INT: 10, WIS: 8, CHA: 14',
    description: ['Tall and muscular', 'Has a long beard'],
    personality: ['Jovial', 'Boisterous'],
    quests: [{ id: 'quest-1', description: 'Needs special ore' }],
    relationships: [],
    location: [{ id: 'location-1', description: 'Works at the forge' }],
    inventory: ['Hammer', 'Tongs', 'Leather apron']
  };

  const secondNpc = {
    id: 'test-npc-2',
    name: 'Second NPC',
    race: 'Dwarf',
    gender: 'Female',
    occupation: 'Miner',
    role: 'Supplier',
    quirk: 'Whistles while working',
    background: 'Mined in the mountains all her life',
    motivation: 'Wants to find rare gems',
    secret: 'Has a map to a legendary mine',
    stats: 'STR: 16, DEX: 10, CON: 18, INT: 12, WIS: 14, CHA: 8',
    description: ['Short and stocky', 'Long braided beard'],
    personality: ['Gruff', 'Hardworking'],
    quests: [],
    relationships: [],
    location: [],
    inventory: ['Pickaxe', 'Mining helmet']
  };

  it('should create an NPC', () => {
    // Create a test NPC
    npcOps.createNPC(testNpc);
    
    // Verify it was created correctly
    const retrievedNpc = npcOps.getNPC('test-npc-1');
    expect(retrievedNpc).toBeTruthy();
    expect(retrievedNpc?.name).toBe('Test NPC');
    expect(retrievedNpc?.race).toBe('Human');
    expect(retrievedNpc?.personality.length).toBe(2);
    expect(retrievedNpc?.inventory.length).toBe(3);
  });

  it('should update an NPC', () => {
    // Update the test NPC
    const updatedNpc = {
      ...testNpc,
      name: 'Updated Test NPC',
      quirk: 'Talks to his tools',
      inventory: ['Magic hammer', 'Enchanted tongs', 'Fireproof apron']
    };
    
    npcOps.updateNPC(updatedNpc);
    
    // Verify the update worked
    const retrievedNpc = npcOps.getNPC('test-npc-1');
    expect(retrievedNpc?.name).toBe('Updated Test NPC');
    expect(retrievedNpc?.quirk).toBe('Talks to his tools');
    expect(retrievedNpc?.inventory).toContain('Magic hammer');
  });

  it('should handle relationships between NPCs', () => {
    // Create a second NPC
    npcOps.createNPC(secondNpc);
    
    // Add a relationship between NPCs
    npcOps.addNPCRelationship('test-npc-1', 'test-npc-2', 'Business partner');
    
    // Verify the relationship was created
    const retrievedNpc = npcOps.getNPC('test-npc-1');
    expect(retrievedNpc?.relationships.length).toBe(1);
    expect(retrievedNpc?.relationships[0].id).toBe('test-npc-2');
    expect(retrievedNpc?.relationships[0].description).toBe('Business partner');
  });

  it('should add quest associations', () => {
    // Add a quest to the NPC
    npcOps.addNPCQuest('test-npc-1', 'quest-2', 'Needs a special hammer');
    
    // Verify the quest was added
    const retrievedNpc = npcOps.getNPC('test-npc-1');
    expect(retrievedNpc?.quests.length).toBe(2);
    const newQuest = retrievedNpc?.quests.find(q => q.id === 'quest-2');
    expect(newQuest).toBeTruthy();
    expect(newQuest?.description).toBe('Needs a special hammer');
  });

  it('should remove quest associations', () => {
    // Remove a quest from the NPC
    npcOps.removeNPCQuest('test-npc-1', 'quest-2');
    
    // Verify the quest was removed
    const retrievedNpc = npcOps.getNPC('test-npc-1');
    expect(retrievedNpc?.quests.length).toBe(1);
    const removedQuest = retrievedNpc?.quests.find(q => q.id === 'quest-2');
    expect(removedQuest).toBeUndefined();
  });

  it('should delete NPCs', () => {
    // Delete both NPCs
    npcOps.deleteNPC('test-npc-1');
    npcOps.deleteNPC('test-npc-2');
    
    // Verify they were deleted
    const retrievedNpc1 = npcOps.getNPC('test-npc-1');
    const retrievedNpc2 = npcOps.getNPC('test-npc-2');
    expect(retrievedNpc1).toBeNull();
    expect(retrievedNpc2).toBeNull();
  });
}); 