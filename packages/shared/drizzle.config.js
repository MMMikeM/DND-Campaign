import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
import * as path from "node:path";
import { getDbPath } from "./src";
// Load environment variables
dotenv.config();
export default defineConfig({
    dialect: "sqlite",
    dbCredentials: {
        url: getDbPath(),
    },
    out: path.join(__dirname, "db/drizzle"),
    schema: path.join(__dirname, "src/schemas/**/**.schema.ts"),
});
//# sourceMappingURL=drizzle.config.js.map