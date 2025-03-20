import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
// Define the main factions table
export const factions = sqliteTable("factions", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    type: text("type").notNull(),
    alignment: text("alignment"),
    description: text("description"),
    publicGoal: text("public_goal"),
    trueGoal: text("true_goal"),
    headquarters: text("headquarters"),
    territory: text("territory"),
    history: text("history"),
    notes: text("notes"),
    // JSON columns for one-to-many relations
    // resources: json<string[]>("resources"),
});
// Faction allies
export const factionAllies = sqliteTable("faction_allies", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    factionId: integer("faction_id")
        .notNull()
        .references(() => factions.id, { onDelete: "cascade" }),
    allyId: integer("ally_id")
        .notNull()
        .references(() => factions.id, { onDelete: "cascade" }),
    relationship: text("relationship"), // e.g., "trade partners", "military alliance"
    notes: text("notes"),
});
// Faction enemies
export const factionEnemies = sqliteTable("faction_enemies", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    factionId: integer("faction_id")
        .notNull()
        .references(() => factions.id, { onDelete: "cascade" }),
    enemyId: integer("enemy_id")
        .notNull()
        .references(() => factions.id, { onDelete: "cascade" }),
    conflict: text("conflict"), // e.g., "border dispute", "ideological"
    severity: text("severity"), // e.g., "cold war", "open hostility"
});
const testSchema = createInsertSchema(factions);
//# sourceMappingURL=faction.schema.js.map