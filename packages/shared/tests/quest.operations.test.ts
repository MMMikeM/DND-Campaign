import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { SQLiteQuestOperations } from '../src/database/operations/quests';
import Database from 'better-sqlite3';
import type { Database as SQLiteDatabase } from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Use a temporary file for testing
const TEST_DB_PATH = path.join(__dirname, '../test-quest-db.sqlite');

describe('SQLiteQuestOperations', () => {
  let sqlite: SQLiteDatabase;
  let questOps: SQLiteQuestOperations;

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
        FOREIGN KEY (quest_id) REFERENCES quests(id) ON DELETE CASCADE
      );
    `);
    
    questOps = new SQLiteQuestOperations(sqlite);
  });

  // Clean up after all tests
  afterAll(() => {
    sqlite.close();
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
  });

  // Sample quest data for testing
  const testQuest = {
    id: 'QS001',
    title: 'The Lost Artifact',
    type: 'Investigation',
    difficulty: 'Medium' as const,
    description: 'A valuable artifact has gone missing from the town museum.',
    quest_stages: [
      {
        stage: 1,
        title: 'Investigate the Museum',
        objectives: ['Talk to the curator', 'Examine the display case'],
        completion_paths: {
          'interview': {
            description: 'Speak with museum staff',
            challenges: 'DC 12 Persuasion check',
            outcomes: 'Staff reveals suspicious activity the night before'
          },
          'evidence': {
            description: 'Look for physical evidence',
            challenges: 'DC 14 Investigation check',
            outcomes: 'Find footprints leading to the back exit'
          }
        }
      },
      {
        stage: 2,
        title: 'Follow the Leads',
        objectives: ['Track down the suspect', 'Recover the artifact'],
        completion_paths: {
          'chase': {
            description: 'Chase the thief through the city',
            challenges: 'DC 13 Athletics check',
            outcomes: 'Cornering the thief in an alley'
          }
        }
      }
    ],
    key_decision_points: [
      {
        stage: 2,
        decision: 'Confront or follow thief',
        choices: [
          {
            choice: 'Confront directly',
            consequences: 'Combat encounter with thief'
          },
          {
            choice: 'Follow secretly',
            consequences: 'Discover the thief\'s hideout'
          }
        ]
      }
    ],
    potential_twists: ['The curator is the thief', 'The artifact is a forgery'],
    rewards: {
      'standard': ['50 gold', 'Letter of commendation'],
      'bonus': ['Ancient scroll']
    },
    follow_up_quests: {
      'standard': ['QS002']
    },
    related_quests: [],
    associated_npc: ['NPC001', 'NPC002'],
    adaptable: true
  };

  const secondQuest = {
    id: 'QS002',
    title: 'The Artifact\'s Secret',
    type: 'Mystery',
    difficulty: 'Hard' as const,
    description: 'The recovered artifact holds a dangerous secret.',
    quest_stages: [
      {
        stage: 1,
        title: 'Research the Artifact',
        objectives: ['Visit the library', 'Consult with a sage'],
        completion_paths: {
          'research': {
            description: 'Study ancient tomes',
            challenges: 'DC 15 Arcana check',
            outcomes: 'Discover the artifact\'s origin'
          }
        }
      }
    ],
    key_decision_points: [],
    potential_twists: ['The artifact is sentient'],
    rewards: {
      'standard': ['100 gold', 'Magic item']
    },
    follow_up_quests: {},
    related_quests: ['QS001'],
    associated_npc: ['NPC003'],
    adaptable: true
  };

  it('should create a quest', () => {
    // Create a test quest
    questOps.createQuest(testQuest);
    
    // Verify it was created correctly
    const retrievedQuest = questOps.getQuest('QS001');
    expect(retrievedQuest).toBeTruthy();
    expect(retrievedQuest?.title).toBe('The Lost Artifact');
    expect(retrievedQuest?.difficulty).toBe('Medium');
    expect(retrievedQuest?.quest_stages.length).toBe(2);
    expect(retrievedQuest?.key_decision_points.length).toBe(1);
  });

  it('should update a quest', () => {
    // Update the quest
    const updatedQuest = {
      ...testQuest,
      title: 'The Stolen Artifact',
      difficulty: 'Hard' as const,
      potential_twists: ['The artifact is cursed', 'The thief was coerced']
    };
    
    questOps.updateQuest(updatedQuest);
    
    // Verify the update
    const retrievedQuest = questOps.getQuest('QS001');
    expect(retrievedQuest?.title).toBe('The Stolen Artifact');
    expect(retrievedQuest?.difficulty).toBe('Hard');
    expect(retrievedQuest?.potential_twists).toContain('The artifact is cursed');
  });

  it('should create a related quest', () => {
    // Create a second quest that relates to the first
    questOps.createQuest(secondQuest);
    
    // Verify the relationship
    const retrievedQuest = questOps.getQuest('QS002');
    expect(retrievedQuest?.related_quests).toContain('QS001');
  });

  it('should add a quest stage', () => {
    const newStage = {
      stage: 3,
      title: 'Secure the Artifact',
      objectives: ['Return to the museum', 'Place in secure vault'],
      completion_paths: {
        'ceremony': {
          description: 'Public return ceremony',
          challenges: 'DC 10 Persuasion check',
          outcomes: 'Gain reputation in town'
        }
      }
    };
    
    questOps.addQuestStage('QS001', newStage);
    
    // Verify the stage was added
    const retrievedQuest = questOps.getQuest('QS001');
    expect(retrievedQuest?.quest_stages.length).toBe(3);
    const addedStage = retrievedQuest?.quest_stages.find(s => s.stage === 3);
    expect(addedStage?.title).toBe('Secure the Artifact');
  });

  it('should add a quest twist', () => {
    questOps.addTwist('QS001', 'The artifact attracts monsters');
    
    // Verify the twist was added
    const retrievedQuest = questOps.getQuest('QS001');
    expect(retrievedQuest?.potential_twists).toContain('The artifact attracts monsters');
  });

  it('should delete a quest', () => {
    // Delete the quests
    questOps.deleteQuest('QS001');
    questOps.deleteQuest('QS002');
    
    // Verify they were deleted
    const retrievedQuest1 = questOps.getQuest('QS001');
    const retrievedQuest2 = questOps.getQuest('QS002');
    expect(retrievedQuest1).toBeNull();
    expect(retrievedQuest2).toBeNull();
  });
}); 