import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { json } from "../db/utils";
// Define the main npcs table
export const npcs = sqliteTable("npcs", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    race: text("race").notNull(),
    gender: text("gender").notNull(),
    occupation: text("occupation").notNull(),
    role: text("role"),
    quirk: text("quirk"),
    background: text("background").notNull(),
    motivation: text("motivation").notNull(),
    secret: text("secret").notNull(),
    stats: text("stats").notNull(),
    // JSON columns for one-to-many relations
    descriptions: json("descriptions"),
    personalityTraits: json("personality_traits"),
    inventory: json("inventory"),
    dialogue: json("dialogue"),
});
//# sourceMappingURL=npc.schema.js.map