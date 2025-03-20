import { text } from "drizzle-orm/sqlite-core";
// Create a custom JSON type for SQLite
export const json = (description) => text(description, { mode: "json" }).$type();
//# sourceMappingURL=utils.js.map