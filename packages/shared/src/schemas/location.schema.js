import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { json } from "../db/utils";
// Define the main locations table
export const locations = sqliteTable("locations", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    type: text("type").notNull(),
    region: text("region"),
    description: text("description").notNull(),
    history: text("history"),
    dangerLevel: text("danger_level"),
    factionControl: text("faction_control"),
    // JSON columns for one-to-many relations
    notableFeatures: json("notable_features"),
});
export const locationAreas = sqliteTable("location_areas", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    locationId: integer("location_id")
        .notNull()
        .references(() => locations.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description").notNull(),
    areaType: text("area_type").notNull(),
    environment: text("environment").notNull(),
    terrain: text("terrain").notNull(),
    climate: text("climate").notNull(),
    // JSON columns for one-to-many relations
    features: json("features").notNull(),
    encounters: json("encounters").notNull(),
    treasures: json("treasures").notNull(),
    creatures: json("creatures").notNull(),
    plants: json("plants").notNull(),
    loot: json("loot").notNull(),
});
//# sourceMappingURL=location.schema.js.map