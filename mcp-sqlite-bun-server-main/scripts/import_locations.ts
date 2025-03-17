#!/usr/bin/env bun
import { Database } from "bun:sqlite"
import { readFileSync } from "fs"
import { parse } from "yaml"
import { LocationsFileSchema } from "../src/schemas/locationsSchema"
// Initialize database
const db = new Database("data.sqlite", { create: true })

// Drop existing tables
db.run("BEGIN TRANSACTION")
try {
	db.run("DROP TABLE IF EXISTS area_treasures")
	db.run("DROP TABLE IF EXISTS area_encounters")
	db.run("DROP TABLE IF EXISTS area_features")
	db.run("DROP TABLE IF EXISTS location_areas")
	db.run("DROP TABLE IF EXISTS district_features")
	db.run("DROP TABLE IF EXISTS location_districts")
	db.run("DROP TABLE IF EXISTS location_points_of_interest")
	db.run("DROP TABLE IF EXISTS location_connections")
	db.run("DROP TABLE IF EXISTS location_features")
	db.run("DROP TABLE IF EXISTS locations")
	db.run("COMMIT")
} catch (error) {
	db.run("ROLLBACK")
	throw error
}

// Create tables
db.run("BEGIN TRANSACTION")
try {
	db.run(`CREATE TABLE locations (
		id TEXT PRIMARY KEY,
		name TEXT,
		type TEXT NOT NULL,
		region TEXT,
		description TEXT NOT NULL,
		history TEXT,
		danger_level TEXT,
		faction_control TEXT,
		FOREIGN KEY (faction_control) REFERENCES factions(id) ON DELETE SET NULL
	)`)

	db.run(`CREATE TABLE location_features (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		location_id TEXT NOT NULL,
		feature TEXT NOT NULL,
		FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
	)`)

	db.run(`CREATE TABLE location_connections (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		location_id TEXT NOT NULL,
		connected_location_id TEXT NOT NULL,
		FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE,
		FOREIGN KEY (connected_location_id) REFERENCES locations(id) ON DELETE CASCADE
	)`)

	db.run(`CREATE TABLE location_points_of_interest (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		location_id TEXT NOT NULL,
		name TEXT NOT NULL,
		description TEXT,
		FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
	)`)

	db.run(`CREATE TABLE location_districts (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		location_id TEXT NOT NULL,
		name TEXT NOT NULL,
		description TEXT,
		FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
	)`)

	db.run(`CREATE TABLE district_features (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		district_id INTEGER NOT NULL,
		feature TEXT NOT NULL,
		FOREIGN KEY (district_id) REFERENCES location_districts(id) ON DELETE CASCADE
	)`)

	db.run(`CREATE TABLE location_areas (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		location_id TEXT NOT NULL,
		name TEXT NOT NULL,
		description TEXT,
		FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
	)`)

	db.run(`CREATE TABLE area_features (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		area_id INTEGER NOT NULL,
		feature TEXT NOT NULL,
		FOREIGN KEY (area_id) REFERENCES location_areas(id) ON DELETE CASCADE
	)`)

	db.run(`CREATE TABLE area_encounters (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		area_id INTEGER NOT NULL,
		encounter TEXT NOT NULL,
		FOREIGN KEY (area_id) REFERENCES location_areas(id) ON DELETE CASCADE
	)`)

	db.run(`CREATE TABLE area_treasures (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		area_id INTEGER NOT NULL,
		treasure TEXT NOT NULL,
		FOREIGN KEY (area_id) REFERENCES location_areas(id) ON DELETE CASCADE
	)`)

	db.run("COMMIT")
} catch (error) {
	db.run("ROLLBACK")
	throw error
}


// Read and parse YAML file
const yamlContent = readFileSync(
	"/Users/mikemurray/Development/DND-Campaign/campaigns/shattered-spire/locations/locations.yaml",
	"utf8",
)
const locationsFile = LocationsFileSchema.parse(parse(yamlContent))

// Begin transaction for data import
db.run("BEGIN TRANSACTION")

try {
	// Insert locations
	for (const [locationId, location] of Object.entries(data.locations)) {
		console.log(`Processing location: ${locationId}`)

		// Insert main location data
		const locationValues = [
			locationId,
			location.name || locationId,
			location.type,
			location.region || null,
			location.description,
			location.history || null,
			location.danger_level || null,
			location.faction_control || null,
		]
		console.log("Location values:", locationValues)

		try {
			const stmt = db.prepare(
				`INSERT INTO locations (
					id, name, type, region, description,
					history, danger_level, faction_control
				) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
			)
			const insertResult = stmt.run(...locationValues)
			console.log("Insert result:", insertResult)

			// Verify location was inserted
			const verifyStmt = db.prepare("SELECT id FROM locations WHERE id = ?")
			const locationCheck = verifyStmt.get(locationId)
			console.log("Location check result:", locationCheck)

			if (!locationCheck) {
				throw new Error(`Failed to insert location ${locationId}`)
			}
			console.log(`Successfully inserted location ${locationId}`)
		} catch (error) {
			console.error("Error inserting location:", error)
			throw error
		}

		// Insert notable features
		if (location.notable_features) {
			for (const feature of location.notable_features) {
				db.query("INSERT INTO location_features (location_id, feature) VALUES (?, ?)", [
					locationId,
					feature,
				])
			}
		}

		// Insert connections
		if (location.connections) {
			for (const connectedLocation of location.connections) {
				db.query(
					"INSERT INTO location_connections (location_id, connected_location_id) VALUES (?, ?)",
					[locationId, connectedLocation],
				)
			}
		}

		// Insert points of interest
		if (location.points_of_interest) {
			for (const poi of location.points_of_interest) {
				db.query(
					"INSERT INTO location_points_of_interest (location_id, name, description) VALUES (?, ?, ?)",
					[locationId, poi.name, poi.description || null],
				)
			}
		}

		// Insert districts
		if (location.districts) {
			for (const [districtName, district] of Object.entries(location.districts)) {
				// Insert district
				const districtStmt = db.prepare(
					"INSERT INTO location_districts (location_id, name, description) VALUES (?, ?, ?) RETURNING id",
				)
				const result = districtStmt.get(locationId, districtName, district.description || null)
				console.log("District insert result:", result)

				if (!result?.id) {
					throw new Error(`Failed to get district ID for ${districtName}`)
				}
				const districtId = result.id
				console.log(`Inserted district ${districtName} with ID ${districtId}`)

				// Insert district features
				if (district.features) {
					const featureStmt = db.prepare(
						"INSERT INTO district_features (district_id, feature) VALUES (?, ?)",
					)
					for (const feature of district.features) {
						featureStmt.run(districtId, feature)
					}
				}
			}
		}

		// Insert areas
		if (location.areas) {
			for (const [areaName, area] of Object.entries(location.areas)) {
				// Insert area
				const areaStmt = db.prepare(
					"INSERT INTO location_areas (location_id, name, description) VALUES (?, ?, ?) RETURNING id",
				)
				const result = areaStmt.get(locationId, areaName, area.description || null)
				console.log("Area insert result:", result)

				if (!result?.id) {
					throw new Error(`Failed to get area ID for ${areaName}`)
				}
				const areaId = result.id
				console.log(`Inserted area ${areaName} with ID ${areaId}`)

				// Insert area features
				if (area.features) {
					const featureStmt = db.prepare(
						"INSERT INTO area_features (area_id, feature) VALUES (?, ?)",
					)
					for (const feature of area.features) {
						featureStmt.run(areaId, feature)
					}
				}

				// Insert area encounters
				if (area.encounters) {
					const encounterStmt = db.prepare(
						"INSERT INTO area_encounters (area_id, encounter) VALUES (?, ?)",
					)
					for (const encounter of area.encounters) {
						encounterStmt.run(areaId, encounter)
					}
				}

				// Insert area treasures
				if (area.treasure) {
					const treasureStmt = db.prepare(
						"INSERT INTO area_treasures (area_id, treasure) VALUES (?, ?)",
					)
					for (const treasure of area.treasure) {
						treasureStmt.run(areaId, treasure)
					}
				}
			}
		}
	}

	// Commit transaction
	db.run("COMMIT")
	console.log("Successfully imported location data!")
} catch (error) {
	// Rollback on error
	db.run("ROLLBACK")
	console.error("Error importing location data:", error)
	throw error
}
