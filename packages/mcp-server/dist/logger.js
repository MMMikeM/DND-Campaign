import path from "node:path";
import fs from "node:fs";
const LOG_FILE = path.join(process.cwd(), "server.log");
// Ensure log directory exists
try {
    fs.writeFileSync(LOG_FILE, "", { flag: "w" });
}
catch (error) {
    // Silently fail - we don't want to interfere with stdout/stderr
}
// Simple logging function that ONLY writes to file
const log = (level, message, meta) => {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} [${level}] ${message} ${meta ? JSON.stringify(meta) : ""}\n`;
    try {
        fs.appendFileSync(LOG_FILE, logMessage);
    }
    catch {
        // Silently fail - we don't want to interfere with stdout/stderr
    }
};
// Export simple logging functions
export const debug = (message, meta) => log("DEBUG", message, meta);
export const info = (message, meta) => log("INFO", message, meta);
export const warn = (message, meta) => log("WARN", message, meta);
export const error = (message, meta) => log("ERROR", message, meta);
export const fatal = (message, meta) => log("FATAL", message, meta);
export default { debug, info, warn, error, fatal };
// Example usage:
// logger.info('Server started', { port: 3000 });
// logger.error('Database connection failed', { code: 'ECONNREFUSED' });
//# sourceMappingURL=logger.js.map