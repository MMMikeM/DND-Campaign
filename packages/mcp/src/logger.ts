import fs from "node:fs"

const LOG_FILE = "/Users/mikemurray/Development/DND-Campaign/server.log"

export const createLogger = () => {
	try {
		console.error("Log file does not exist, creating it.")
		fs.writeFileSync(LOG_FILE, "", { flag: "w" })
	} catch (error) {
		console.error("Error creating log file", { error })
	}

	type LogMeta = Record<string, unknown>

	const log = (level: string, message: string, meta?: LogMeta) => {
		const timestamp = new Date().toISOString()
		const logMessage = `${timestamp} [${level}] ${message} ${meta ? JSON.stringify(meta) : ""}\n`

		try {
			fs.appendFileSync(LOG_FILE, logMessage)
		} catch {}
	}
	return {
		debug: (message: string, meta?: LogMeta) => log("DEBUG", message, meta),
		info: (message: string, meta?: LogMeta) => log("INFO", message, meta),
		warn: (message: string, meta?: LogMeta) => log("WARN", message, meta),
		error: (message: string, meta?: LogMeta) => log("ERROR", message, meta),
		fatal: (message: string, meta?: LogMeta) => log("FATAL", message, meta),
	}
}
