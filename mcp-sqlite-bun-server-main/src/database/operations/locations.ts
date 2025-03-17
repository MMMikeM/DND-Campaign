import type { LocationOperations, RequiredLocation } from "./types"
import { SQLiteBaseOperations } from "./base"
import type { Database } from "bun:sqlite"

export class SQLiteLocationOperations extends SQLiteBaseOperations implements LocationOperations {
  constructor(db: Database) {
    super(db)
  }

  // Basic operations
  createLocation(id: string, location: RequiredLocation): void {
    const transaction = this.transaction()
    try {
      // Insert main location data
      this.prepare(
        "INSERT INTO locations (id, name, type, region, description, history, danger_level, faction_control) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      ).run(id, location.name, location.type, location.region, location.description, location.history, location.danger_level, location.faction_control)

      // Insert notable features
      if (location.notable_features) {
        for (const feature of location.notable_features) {
          this.prepare("INSERT INTO location_features (location_id, feature) VALUES (?, ?)").run(id, feature)
        }
      }

      // Insert NPCs
      if (location.npcs) {
        for (const npcId of location.npcs) {
          this.prepare("INSERT INTO location_npcs (location_id, npc_id) VALUES (?, ?)").run(id, npcId)
        }
      }

      // Insert factions
      if (location.factions) {
        for (const factionId of location.factions) {
          this.prepare("INSERT INTO location_factions (location_id, faction_id) VALUES (?, ?)").run(id, factionId)
        }
      }

      // Insert points of interest
      if (location.points_of_interest) {
        for (const poi of location.points_of_interest) {
          this.prepare(
            "INSERT INTO location_points_of_interest (location_id, name, description) VALUES (?, ?, ?)",
          ).run(id, poi.name, poi.description)
        }
      }

      // Insert connections
      if (location.connections) {
        for (const connectedId of location.connections) {
          this.prepare("INSERT INTO location_connections (location_id, connected_id) VALUES (?, ?)").run(id, connectedId)
        }
      }

      // Insert districts
      if (location.districts) {
        for (const [districtId, district] of Object.entries(location.districts)) {
          this.prepare(
            "INSERT INTO location_districts (location_id, district_id, description) VALUES (?, ?, ?)",
          ).run(id, districtId, district.description)

          // Insert district features
          if (district.features) {
            for (const feature of district.features) {
              this.prepare(
                "INSERT INTO district_features (location_id, district_id, feature) VALUES (?, ?, ?)",
              ).run(id, districtId, feature)
            }
          }

          // Insert district NPCs
          if (district.npcs) {
            for (const npcId of district.npcs) {
              this.prepare("INSERT INTO district_npcs (location_id, district_id, npc_id) VALUES (?, ?, ?)").run(id, districtId, npcId)
            }
          }
        }
      }

      // Insert areas
      if (location.areas) {
        for (const [areaId, area] of Object.entries(location.areas)) {
          this.prepare("INSERT INTO location_areas (location_id, area_id, description) VALUES (?, ?, ?)").run(id, areaId, area.description)

          // Insert area features
          if (area.features) {
            for (const feature of area.features) {
              this.prepare("INSERT INTO area_features (location_id, area_id, feature) VALUES (?, ?, ?)").run(id, areaId, feature)
            }
          }

          // Insert area encounters
          if (area.encounters) {
            for (const encounter of area.encounters) {
              this.prepare("INSERT INTO area_encounters (location_id, area_id, encounter) VALUES (?, ?, ?)").run(id, areaId, encounter)
            }
          }

          // Insert area treasures
          if (area.treasure) {
            for (const treasure of area.treasure) {
              this.prepare("INSERT INTO area_treasures (location_id, area_id, treasure) VALUES (?, ?, ?)").run(id, areaId, treasure)
            }
          }

          // Insert area NPCs
          if (area.npcs) {
            for (const npcId of area.npcs) {
              this.prepare("INSERT INTO area_npcs (location_id, area_id, npc_id) VALUES (?, ?, ?)").run(id, areaId, npcId)
            }
          }
        }
      }

      transaction.commit()
    } catch (error) {
      transaction.rollback()
      throw error
    }
  }

  getLocation(id: string): RequiredLocation | null {
    const location = this.get<any>(`
      SELECT l.*,
        GROUP_CONCAT(DISTINCT lf.feature) as features,
        GROUP_CONCAT(DISTINCT ln.npc_id) as npc_ids,
        GROUP_CONCAT(DISTINCT lfa.faction_id) as faction_ids,
        GROUP_CONCAT(DISTINCT lc.connected_id) as connection_ids
      FROM locations l
      LEFT JOIN location_features lf ON l.id = lf.location_id
      LEFT JOIN location_npcs ln ON l.id = ln.location_id
      LEFT JOIN location_factions lfa ON l.id = lfa.location_id
      LEFT JOIN location_connections lc ON l.id = lc.location_id
      WHERE l.id = '${id}'
      GROUP BY l.id
    `)

    if (!location) return null

    // Get points of interest
    const pointsOfInterest = this.query<any>(`
      SELECT name, description
      FROM location_points_of_interest
      WHERE location_id = '${id}'
    `)

    // Get districts with features and NPCs
    const districts: Record<string, any> = {}
    const districtRows = this.query<any>(`
      SELECT district_id, description
      FROM location_districts
      WHERE location_id = '${id}'
    `)

    for (const district of districtRows) {
      // Get district features
      const features = this.query<{ feature: string }>(`
        SELECT feature
        FROM district_features
        WHERE location_id = '${id}' AND district_id = '${district.district_id}'
      `).map(row => row.feature)

      // Get district NPCs
      const npcs = this.query<{ npc_id: string }>(`
        SELECT npc_id
        FROM district_npcs
        WHERE location_id = '${id}' AND district_id = '${district.district_id}'
      `).map(row => row.npc_id)

      districts[district.district_id] = {
        description: district.description,
        features,
        npcs,
      }
    }

    // Get areas with features, encounters, treasures, and NPCs
    const areas: Record<string, any> = {}
    const areaRows = this.query<any>(`
      SELECT area_id, description
      FROM location_areas
      WHERE location_id = '${id}'
    `)

    for (const area of areaRows) {
      // Get area features
      const features = this.query<{ feature: string }>(`
        SELECT feature
        FROM area_features
        WHERE location_id = '${id}' AND area_id = '${area.area_id}'
      `).map(row => row.feature)

      // Get area encounters
      const encounters = this.query<{ encounter: string }>(`
        SELECT encounter
        FROM area_encounters
        WHERE location_id = '${id}' AND area_id = '${area.area_id}'
      `).map(row => row.encounter)

      // Get area treasures
      const treasures = this.query<{ treasure: string }>(`
        SELECT treasure
        FROM area_treasures
        WHERE location_id = '${id}' AND area_id = '${area.area_id}'
      `).map(row => row.treasure)

      // Get area NPCs
      const npcs = this.query<{ npc_id: string }>(`
        SELECT npc_id
        FROM area_npcs
        WHERE location_id = '${id}' AND area_id = '${area.area_id}'
      `).map(row => row.npc_id)

      areas[area.area_id] = {
        description: area.description,
        features,
        encounters,
        treasure: treasures,
        npcs,
      }
    }

    return {
      ...location,
      notable_features: location.features ? location.features.split(",") : [],
      npcs: location.npc_ids ? location.npc_ids.split(",") : [],
      factions: location.faction_ids ? location.faction_ids.split(",") : [],
      connections: location.connection_ids ? location.connection_ids.split(",") : [],
      points_of_interest: pointsOfInterest,
      districts,
      areas,
    }
  }

  updateLocation(id: string, location: RequiredLocation): void {
    const transaction = this.transaction()
    try {
      // Update main location data
      this.prepare(
        "UPDATE locations SET name = ?, type = ?, region = ?, description = ?, history = ?, danger_level = ?, faction_control = ? WHERE id = ?",
      ).run(location.name, location.type, location.region, location.description, location.history, location.danger_level, location.faction_control, id)

      // Delete existing related data
      this.exec(`DELETE FROM location_features WHERE location_id = '${id}'`)
      this.exec(`DELETE FROM location_npcs WHERE location_id = '${id}'`)
      this.exec(`DELETE FROM location_factions WHERE location_id = '${id}'`)
      this.exec(`DELETE FROM location_points_of_interest WHERE location_id = '${id}'`)
      this.exec(`DELETE FROM location_connections WHERE location_id = '${id}'`)

      // Re-insert notable features
      if (location.notable_features) {
        for (const feature of location.notable_features) {
          this.prepare("INSERT INTO location_features (location_id, feature) VALUES (?, ?)").run(id, feature)
        }
      }

      // Re-insert NPCs
      if (location.npcs) {
        for (const npcId of location.npcs) {
          this.prepare("INSERT INTO location_npcs (location_id, npc_id) VALUES (?, ?)").run(id, npcId)
        }
      }

      // Re-insert factions
      if (location.factions) {
        for (const factionId of location.factions) {
          this.prepare("INSERT INTO location_factions (location_id, faction_id) VALUES (?, ?)").run(id, factionId)
        }
      }

      // Re-insert points of interest
      if (location.points_of_interest) {
        for (const poi of location.points_of_interest) {
          this.prepare(
            "INSERT INTO location_points_of_interest (location_id, name, description) VALUES (?, ?, ?)",
          ).run(id, poi.name, poi.description)
        }
      }

      // Re-insert connections
      if (location.connections) {
        for (const connectedId of location.connections) {
          this.prepare("INSERT INTO location_connections (location_id, connected_id) VALUES (?, ?)").run(id, connectedId)
        }
      }

      // Handle districts and areas separately (these have their own methods)
      // We don't delete/recreate these here to avoid cascading deletes

      transaction.commit()
    } catch (error) {
      transaction.rollback()
      throw error
    }
  }

  deleteLocation(id: string): void {
    const transaction = this.transaction()
    try {
      // Delete all related data
      this.exec(`DELETE FROM location_features WHERE location_id = '${id}'`)
      this.exec(`DELETE FROM location_npcs WHERE location_id = '${id}'`)
      this.exec(`DELETE FROM location_factions WHERE location_id = '${id}'`)
      this.exec(`DELETE FROM location_points_of_interest WHERE location_id = '${id}'`)
      this.exec(`DELETE FROM location_connections WHERE location_id = '${id}'`)
      
      // Delete districts and related data
      this.exec(`DELETE FROM district_features WHERE location_id = '${id}'`)
      this.exec(`DELETE FROM district_npcs WHERE location_id = '${id}'`)
      this.exec(`DELETE FROM location_districts WHERE location_id = '${id}'`)

      // Delete areas and related data
      this.exec(`DELETE FROM area_features WHERE location_id = '${id}'`)
      this.exec(`DELETE FROM area_encounters WHERE location_id = '${id}'`)
      this.exec(`DELETE FROM area_treasures WHERE location_id = '${id}'`)
      this.exec(`DELETE FROM area_npcs WHERE location_id = '${id}'`)
      this.exec(`DELETE FROM location_areas WHERE location_id = '${id}'`)

      // Delete the location itself
      this.exec(`DELETE FROM locations WHERE id = '${id}'`)

      transaction.commit()
    } catch (error) {
      transaction.rollback()
      throw error
    }
  }

  // Feature operations
  addNotableFeature(locationId: string, feature: string): void {
    this.prepare("INSERT INTO location_features (location_id, feature) VALUES (?, ?)").run(locationId, feature)
  }

  removeNotableFeature(locationId: string, feature: string): void {
    this.prepare("DELETE FROM location_features WHERE location_id = ? AND feature = ?").run(locationId, feature)
  }

  // NPC operations
  addNPC(locationId: string, npcId: string): void {
    this.prepare("INSERT INTO location_npcs (location_id, npc_id) VALUES (?, ?)").run(locationId, npcId)
  }

  removeNPC(locationId: string, npcId: string): void {
    this.prepare("DELETE FROM location_npcs WHERE location_id = ? AND npc_id = ?").run(locationId, npcId)
  }

  // Faction operations
  addFaction(locationId: string, factionId: string): void {
    this.prepare("INSERT INTO location_factions (location_id, faction_id) VALUES (?, ?)").run(locationId, factionId)
  }

  removeFaction(locationId: string, factionId: string): void {
    this.prepare("DELETE FROM location_factions WHERE location_id = ? AND faction_id = ?").run(locationId, factionId)
  }

  // Point of Interest operations
  addPointOfInterest(locationId: string, poi: RequiredLocation["points_of_interest"][number]): void {
    this.prepare("INSERT INTO location_points_of_interest (location_id, name, description) VALUES (?, ?, ?)").run(locationId, poi.name, poi.description)
  }

  removePointOfInterest(locationId: string, poiName: string): void {
    this.prepare("DELETE FROM location_points_of_interest WHERE location_id = ? AND name = ?").run(locationId, poiName)
  }

  // Connection operations
  addConnection(locationId: string, connectedLocationId: string): void {
    this.prepare("INSERT INTO location_connections (location_id, connected_id) VALUES (?, ?)").run(locationId, connectedLocationId)
  }

  removeConnection(locationId: string, connectedLocationId: string): void {
    this.prepare("DELETE FROM location_connections WHERE location_id = ? AND connected_id = ?").run(locationId, connectedLocationId)
  }

  // District operations
  addDistrict(locationId: string, districtId: string, district: RequiredLocation["districts"][string]): void {
    const transaction = this.transaction()
    try {
      // Insert district
      this.prepare("INSERT INTO location_districts (location_id, district_id, description) VALUES (?, ?, ?)").run(locationId, districtId, district.description)

      // Insert district features
      if (district.features) {
        for (const feature of district.features) {
          this.prepare("INSERT INTO district_features (location_id, district_id, feature) VALUES (?, ?, ?)").run(locationId, districtId, feature)
        }
      }

      // Insert district NPCs
      if (district.npcs) {
        for (const npcId of district.npcs) {
          this.prepare("INSERT INTO district_npcs (location_id, district_id, npc_id) VALUES (?, ?, ?)").run(locationId, districtId, npcId)
        }
      }

      transaction.commit()
    } catch (error) {
      transaction.rollback()
      throw error
    }
  }

  updateDistrict(locationId: string, districtId: string, district: RequiredLocation["districts"][string]): void {
    const transaction = this.transaction()
    try {
      // Update district data
      this.prepare("UPDATE location_districts SET description = ? WHERE location_id = ? AND district_id = ?").run(district.description, locationId, districtId)

      // Delete existing related data
      this.exec(`DELETE FROM district_features WHERE location_id = '${locationId}' AND district_id = '${districtId}'`)
      this.exec(`DELETE FROM district_npcs WHERE location_id = '${locationId}' AND district_id = '${districtId}'`)

      // Re-insert district features
      if (district.features) {
        for (const feature of district.features) {
          this.prepare("INSERT INTO district_features (location_id, district_id, feature) VALUES (?, ?, ?)").run(locationId, districtId, feature)
        }
      }

      // Re-insert district NPCs
      if (district.npcs) {
        for (const npcId of district.npcs) {
          this.prepare("INSERT INTO district_npcs (location_id, district_id, npc_id) VALUES (?, ?, ?)").run(locationId, districtId, npcId)
        }
      }

      transaction.commit()
    } catch (error) {
      transaction.rollback()
      throw error
    }
  }

  removeDistrict(locationId: string, districtId: string): void {
    const transaction = this.transaction()
    try {
      this.exec(`DELETE FROM district_features WHERE location_id = '${locationId}' AND district_id = '${districtId}'`)
      this.exec(`DELETE FROM district_npcs WHERE location_id = '${locationId}' AND district_id = '${districtId}'`)
      this.exec(`DELETE FROM location_districts WHERE location_id = '${locationId}' AND district_id = '${districtId}'`)
      transaction.commit()
    } catch (error) {
      transaction.rollback()
      throw error
    }
  }

  addDistrictFeature(locationId: string, districtId: string, feature: string): void {
    this.prepare("INSERT INTO district_features (location_id, district_id, feature) VALUES (?, ?, ?)").run(locationId, districtId, feature)
  }

  removeDistrictFeature(locationId: string, districtId: string, feature: string): void {
    this.prepare("DELETE FROM district_features WHERE location_id = ? AND district_id = ? AND feature = ?").run(locationId, districtId, feature)
  }

  addDistrictNPC(locationId: string, districtId: string, npcId: string): void {
    this.prepare("INSERT INTO district_npcs (location_id, district_id, npc_id) VALUES (?, ?, ?)").run(locationId, districtId, npcId)
  }

  removeDistrictNPC(locationId: string, districtId: string, npcId: string): void {
    this.prepare("DELETE FROM district_npcs WHERE location_id = ? AND district_id = ? AND npc_id = ?").run(locationId, districtId, npcId)
  }

  // Area operations
  addArea(locationId: string, areaId: string, area: RequiredLocation["areas"][string]): void {
    const transaction = this.transaction()
    try {
      // Insert area
      this.prepare("INSERT INTO location_areas (location_id, area_id, description) VALUES (?, ?, ?)").run(locationId, areaId, area.description)

      // Insert area features
      if (area.features) {
        for (const feature of area.features) {
          this.prepare("INSERT INTO area_features (location_id, area_id, feature) VALUES (?, ?, ?)").run(locationId, areaId, feature)
        }
      }

      // Insert area encounters
      if (area.encounters) {
        for (const encounter of area.encounters) {
          this.prepare("INSERT INTO area_encounters (location_id, area_id, encounter) VALUES (?, ?, ?)").run(locationId, areaId, encounter)
        }
      }

      // Insert area treasures
      if (area.treasure) {
        for (const treasure of area.treasure) {
          this.prepare("INSERT INTO area_treasures (location_id, area_id, treasure) VALUES (?, ?, ?)").run(locationId, areaId, treasure)
        }
      }

      // Insert area NPCs
      if (area.npcs) {
        for (const npcId of area.npcs) {
          this.prepare("INSERT INTO area_npcs (location_id, area_id, npc_id) VALUES (?, ?, ?)").run(locationId, areaId, npcId)
        }
      }

      transaction.commit()
    } catch (error) {
      transaction.rollback()
      throw error
    }
  }

  updateArea(locationId: string, areaId: string, area: RequiredLocation["areas"][string]): void {
    const transaction = this.transaction()
    try {
      // Update area data
      this.prepare("UPDATE location_areas SET description = ? WHERE location_id = ? AND area_id = ?").run(area.description, locationId, areaId)

      // Delete existing related data
      this.exec(`DELETE FROM area_features WHERE location_id = '${locationId}' AND area_id = '${areaId}'`)
      this.exec(`DELETE FROM area_encounters WHERE location_id = '${locationId}' AND area_id = '${areaId}'`)
      this.exec(`DELETE FROM area_treasures WHERE location_id = '${locationId}' AND area_id = '${areaId}'`)
      this.exec(`DELETE FROM area_npcs WHERE location_id = '${locationId}' AND area_id = '${areaId}'`)

      // Re-insert area features
      if (area.features) {
        for (const feature of area.features) {
          this.prepare("INSERT INTO area_features (location_id, area_id, feature) VALUES (?, ?, ?)").run(locationId, areaId, feature)
        }
      }

      // Re-insert area encounters
      if (area.encounters) {
        for (const encounter of area.encounters) {
          this.prepare("INSERT INTO area_encounters (location_id, area_id, encounter) VALUES (?, ?, ?)").run(locationId, areaId, encounter)
        }
      }

      // Re-insert area treasures
      if (area.treasure) {
        for (const treasure of area.treasure) {
          this.prepare("INSERT INTO area_treasures (location_id, area_id, treasure) VALUES (?, ?, ?)").run(locationId, areaId, treasure)
        }
      }

      // Re-insert area NPCs
      if (area.npcs) {
        for (const npcId of area.npcs) {
          this.prepare("INSERT INTO area_npcs (location_id, area_id, npc_id) VALUES (?, ?, ?)").run(locationId, areaId, npcId)
        }
      }

      transaction.commit()
    } catch (error) {
      transaction.rollback()
      throw error
    }
  }

  removeArea(locationId: string, areaId: string): void {
    const transaction = this.transaction()
    try {
      this.exec(`DELETE FROM area_features WHERE location_id = '${locationId}' AND area_id = '${areaId}'`)
      this.exec(`DELETE FROM area_encounters WHERE location_id = '${locationId}' AND area_id = '${areaId}'`)
      this.exec(`DELETE FROM area_treasures WHERE location_id = '${locationId}' AND area_id = '${areaId}'`)
      this.exec(`DELETE FROM area_npcs WHERE location_id = '${locationId}' AND area_id = '${areaId}'`)
      this.exec(`DELETE FROM location_areas WHERE location_id = '${locationId}' AND area_id = '${areaId}'`)
      transaction.commit()
    } catch (error) {
      transaction.rollback()
      throw error
    }
  }

  addAreaFeature(locationId: string, areaId: string, feature: string): void {
    this.prepare("INSERT INTO area_features (location_id, area_id, feature) VALUES (?, ?, ?)").run(locationId, areaId, feature)
  }

  removeAreaFeature(locationId: string, areaId: string, feature: string): void {
    this.prepare("DELETE FROM area_features WHERE location_id = ? AND area_id = ? AND feature = ?").run(locationId, areaId, feature)
  }

  addAreaEncounter(locationId: string, areaId: string, encounter: string): void {
    this.prepare("INSERT INTO area_encounters (location_id, area_id, encounter) VALUES (?, ?, ?)").run(locationId, areaId, encounter)
  }

  removeAreaEncounter(locationId: string, areaId: string, encounter: string): void {
    this.prepare("DELETE FROM area_encounters WHERE location_id = ? AND area_id = ? AND encounter = ?").run(locationId, areaId, encounter)
  }

  addAreaTreasure(locationId: string, areaId: string, treasure: string): void {
    this.prepare("INSERT INTO area_treasures (location_id, area_id, treasure) VALUES (?, ?, ?)").run(locationId, areaId, treasure)
  }

  removeAreaTreasure(locationId: string, areaId: string, treasure: string): void {
    this.prepare("DELETE FROM area_treasures WHERE location_id = ? AND area_id = ? AND treasure = ?").run(locationId, areaId, treasure)
  }

  addAreaNPC(locationId: string, areaId: string, npcId: string): void {
    this.prepare("INSERT INTO area_npcs (location_id, area_id, npc_id) VALUES (?, ?, ?)").run(locationId, areaId, npcId)
  }

  removeAreaNPC(locationId: string, areaId: string, npcId: string): void {
    this.prepare("DELETE FROM area_npcs WHERE location_id = ? AND area_id = ? AND npc_id = ?").run(locationId, areaId, npcId)
  }
} 