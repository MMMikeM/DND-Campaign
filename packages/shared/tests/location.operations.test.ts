import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { SQLiteLocationOperations } from '../src/database/operations/locations';
import Database from 'better-sqlite3';
import type { Database as SQLiteDatabase } from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Use a temporary file for testing
const TEST_DB_PATH = path.join(__dirname, '../test-location-db.sqlite');

describe('SQLiteLocationOperations', () => {
  let sqlite: SQLiteDatabase;
  let locationOps: SQLiteLocationOperations;

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
      -- Locations tables
      CREATE TABLE IF NOT EXISTS locations (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        description TEXT,
        region TEXT
      );

      CREATE TABLE IF NOT EXISTS location_districts (
        location_id TEXT,
        district_name TEXT,
        description TEXT,
        PRIMARY KEY (location_id, district_name),
        FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS location_notable_features (
        location_id TEXT,
        feature TEXT,
        PRIMARY KEY (location_id, feature),
        FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS location_npcs (
        location_id TEXT,
        npc_id TEXT,
        role TEXT,
        PRIMARY KEY (location_id, npc_id),
        FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS location_factions (
        location_id TEXT,
        faction_id TEXT,
        influence TEXT,
        PRIMARY KEY (location_id, faction_id),
        FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
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
        description TEXT,
        PRIMARY KEY (location_id, connected_id),
        FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE,
        FOREIGN KEY (connected_id) REFERENCES locations(id)
      );

      CREATE TABLE IF NOT EXISTS location_areas (
        location_id TEXT,
        district_name TEXT,
        area_name TEXT,
        description TEXT,
        PRIMARY KEY (location_id, district_name, area_name),
        FOREIGN KEY (location_id, district_name) REFERENCES location_districts(location_id, district_name) ON DELETE CASCADE
      );
    `);
    
    locationOps = new SQLiteLocationOperations(sqlite);
  });

  // Clean up after all tests
  afterAll(() => {
    sqlite.close();
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
  });

  // Sample location data for testing
  const testLocation = {
    id: 'LC001',
    name: 'Ravenhollow',
    type: 'Town',
    description: 'A small town nestled in a valley, known for its mysterious past.',
    region: 'Eastern Forests',
    districts: [
      {
        name: 'Market District',
        description: 'The bustling center of commerce in Ravenhollow.'
      },
      {
        name: 'Residential Quarter',
        description: 'Where most of the townsfolk live.'
      }
    ],
    notable_features: [
      'Ancient oak tree in the town square',
      'Mysterious standing stones on the outskirts'
    ],
    npcs: [
      {
        id: 'NPC001',
        role: 'Town mayor'
      },
      {
        id: 'NPC002',
        role: 'Local blacksmith'
      }
    ],
    factions: [
      {
        id: 'FC001',
        influence: 'Strong presence in town affairs'
      }
    ],
    points_of_interest: [
      {
        name: 'The Laughing Raven Inn',
        description: 'A popular gathering place for locals and travelers alike.'
      },
      {
        name: 'Blacksmith\'s Forge',
        description: 'Run by the talented smith, produces fine weapons.'
      }
    ],
    connections: [
      {
        id: 'LC002',
        description: 'A road leading through the forest to the neighboring village.'
      }
    ],
    areas: [
      {
        district: 'Market District',
        name: 'Town Square',
        description: 'The central plaza where markets are held.'
      },
      {
        district: 'Residential Quarter',
        name: 'Noble Homes',
        description: 'Where the wealthier residents live.'
      }
    ]
  };

  const secondLocation = {
    id: 'LC002',
    name: 'Misty Hollow',
    type: 'Hamlet',
    description: 'A tiny settlement often shrouded in mist.',
    region: 'Eastern Forests',
    districts: [
      {
        name: 'Village Center',
        description: 'The heart of this small community.'
      }
    ],
    notable_features: [
      'Perpetual mist that never fully clears',
      'Ancient well said to grant wishes'
    ],
    npcs: [
      {
        id: 'NPC003',
        role: 'Village elder'
      }
    ],
    factions: [],
    points_of_interest: [
      {
        name: 'The Foggy Lantern',
        description: 'The only tavern in the hamlet.'
      }
    ],
    connections: [
      {
        id: 'LC001',
        description: 'A road leading through the forest to Ravenhollow.'
      }
    ],
    areas: []
  };

  it('should create a location', () => {
    // Create a test location
    locationOps.createLocation(testLocation.id, testLocation);
    
    // Verify it was created correctly
    const retrievedLocation = locationOps.getLocation(testLocation.id);
    expect(retrievedLocation).toBeTruthy();
    expect(retrievedLocation?.name).toBe('Ravenhollow');
    expect(retrievedLocation?.type).toBe('Town');
    expect(retrievedLocation?.notable_features).toHaveLength(2);
    expect(retrievedLocation?.districts).toHaveLength(2);
    expect(retrievedLocation?.npcs).toHaveLength(2);
  });

  it('should update a location', () => {
    // Update the location
    const updatedLocation = {
      ...testLocation,
      name: 'New Ravenhollow',
      description: 'A town rebuilding after recent events.',
      notable_features: [
        'Newly planted oak tree in the town square',
        'Mysterious standing stones on the outskirts',
        'Memorial statue to heroes'
      ]
    };
    
    locationOps.updateLocation(testLocation.id, updatedLocation);
    
    // Verify the update
    const retrievedLocation = locationOps.getLocation(testLocation.id);
    expect(retrievedLocation?.name).toBe('New Ravenhollow');
    expect(retrievedLocation?.description).toBe('A town rebuilding after recent events.');
    expect(retrievedLocation?.notable_features).toHaveLength(3);
    expect(retrievedLocation?.notable_features).toContain('Memorial statue to heroes');
  });

  it('should create a connected location', () => {
    // Create a second location that connects to the first
    locationOps.createLocation(secondLocation.id, secondLocation);
    
    // Verify the connections
    const retrievedLocation1 = locationOps.getLocation(testLocation.id);
    const retrievedLocation2 = locationOps.getLocation(secondLocation.id);
    
    expect(retrievedLocation1?.connections).toHaveLength(1);
    expect(retrievedLocation1?.connections[0].id).toBe('LC002');
    
    expect(retrievedLocation2?.connections).toHaveLength(1);
    expect(retrievedLocation2?.connections[0].id).toBe('LC001');
  });

  it('should add a district', () => {
    const newDistrict = {
      name: 'Temple District',
      description: 'Where the town\'s religious buildings are located.'
    };
    
    locationOps.addDistrict(testLocation.id, newDistrict);
    
    // Verify the district was added
    const retrievedLocation = locationOps.getLocation(testLocation.id);
    expect(retrievedLocation?.districts).toHaveLength(3);
    const addedDistrict = retrievedLocation?.districts.find(d => d.name === 'Temple District');
    expect(addedDistrict?.description).toBe('Where the town\'s religious buildings are located.');
  });

  it('should add a point of interest', () => {
    const newPOI = {
      name: 'The Grand Temple',
      description: 'A magnificent structure dedicated to the gods.'
    };
    
    locationOps.addPointOfInterest(testLocation.id, newPOI);
    
    // Verify the POI was added
    const retrievedLocation = locationOps.getLocation(testLocation.id);
    expect(retrievedLocation?.points_of_interest).toHaveLength(3);
    const addedPOI = retrievedLocation?.points_of_interest.find(p => p.name === 'The Grand Temple');
    expect(addedPOI?.description).toBe('A magnificent structure dedicated to the gods.');
  });

  it('should delete a location', () => {
    // Delete the locations
    locationOps.deleteLocation(testLocation.id);
    locationOps.deleteLocation(secondLocation.id);
    
    // Verify they were deleted
    const retrievedLocation1 = locationOps.getLocation(testLocation.id);
    const retrievedLocation2 = locationOps.getLocation(secondLocation.id);
    expect(retrievedLocation1).toBeNull();
    expect(retrievedLocation2).toBeNull();
  });
}); 