import pino from "pino"

const LOG_FILE = process.env.LOG_FILE ?? new URL("../server.log", import.meta.url).pathname
// An unrecognised level makes pino throw while constructing the logger, which
// would take the server down over a typo'd env var. Fall back instead.
const VALID_LEVELS = new Set([...Object.keys(pino.levels.values), "silent"])
const LOG_LEVEL = process.env.LOG_LEVEL && VALID_LEVELS.has(process.env.LOG_LEVEL) ? process.env.LOG_LEVEL : "debug"

export const serializeError = (error: unknown) =>
	error instanceof Error
		? { name: error.name, message: error.message, stack: error.stack, cause: error.cause }
		: { errorType: typeof error, errorValue: error, errorString: String(error) }

// Call sites use both `err` and `error` as the key for a thrown value, and some
// pre-flatten it through serializeError. Handle real Errors with pino's
// serializer (it keeps custom enumerable props) and pass anything else through.
const errorSerializer = (value: unknown) =>
	value instanceof Error ? pino.stdSerializers.err(value) : serializeError(value)

export const createLogger = () => {
	// Everything goes to a file, never a stdio stream: the stdio transport uses
	// stdout for the MCP protocol itself, and writing there corrupts it.
	const transport = pino.transport({
		target: "pino-roll",
		options: {
			file: LOG_FILE,
			size: "10m",
			// `count` is rotated files kept *in addition* to the active one,
			// so 4 retains 5 total — matching the previous winston config.
			limit: { count: 4 },
			mkdir: true,
		},
	})

	const logger = pino(
		{
			level: LOG_LEVEL,
			timestamp: pino.stdTimeFunctions.isoTime,
			serializers: { err: errorSerializer, error: errorSerializer },
		},
		transport,
	)

	const shutdown = (code: number) => {
		logger.flush(() => process.exit(code))
		// The transport is a worker thread; don't hang forever if it never drains.
		setTimeout(() => process.exit(code), 1000).unref()
	}

	process.on("SIGINT", () => {
		logger.info("SIGINT received, shutting down gracefully.")
		shutdown(0)
	})

	process.on("uncaughtException", (err) => {
		logger.fatal({ err }, "Uncaught exception")
		shutdown(1)
	})

	process.on("unhandledRejection", (reason) => {
		logger.fatal({ err: reason }, "Unhandled rejection")
		shutdown(1)
	})

	logger.info({ logFile: LOG_FILE, logLevel: LOG_LEVEL }, "Logger initialized")

	return logger
}
