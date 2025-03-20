import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { json } from "../db/utils";
// Define the main quests table
export const quests = sqliteTable("quests", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    type: text("type").notNull(),
    difficulty: text("difficulty").notNull(),
    description: text("description").notNull(),
    adaptable: integer("adaptable", { mode: "boolean" }).default(true),
    // JSON columns for one-to-many relations
    stages: json("stages"),
    objectives: json("objectives"),
    completionPaths: json("completion_paths"),
    decisionPoints: json("decision_points"),
    decisionChoices: json("decision_choices"),
    twists: json("twists"),
    rewards: json("rewards"),
});
//# sourceMappingURL=quest.schema.js.map