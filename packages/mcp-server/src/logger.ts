import path from "node:path"
import fs from "node:fs"

const LOG_FILE = path.join(process.cwd(), "server.log")

// Ensure log directory exists
try {
	fs.writeFileSync(LOG_FILE, "", { flag: "w" })
} catch (error) {
	// Silently fail - we don't want to interfere with stdout/stderr
}

// Define the metadata type for consistency
type LogMeta = Record<string, unknown>

// Simple logging function that ONLY writes to file
const log = (level: string, message: string, meta?: LogMeta) => {
	const timestamp = new Date().toISOString()
	const logMessage = `${timestamp} [${level}] ${message} ${meta ? JSON.stringify(meta) : ""}\n`

	try {
		fs.appendFileSync(LOG_FILE, logMessage)
	} catch {
		// Silently fail - we don't want to interfere with stdout/stderr
	}
}

// Export simple logging functions
export const debug = (message: string, meta?: LogMeta) => log("DEBUG", message, meta)
export const info = (message: string, meta?: LogMeta) => log("INFO", message, meta)
export const warn = (message: string, meta?: LogMeta) => log("WARN", message, meta)
export const error = (message: string, meta?: LogMeta) => log("ERROR", message, meta)
export const fatal = (message: string, meta?: LogMeta) => log("FATAL", message, meta)

export default { debug, info, warn, error, fatal }

// Example usage:
// logger.info('Server started', { port: 3000 });
// logger.error('Database connection failed', { code: 'ECONNREFUSED' });
