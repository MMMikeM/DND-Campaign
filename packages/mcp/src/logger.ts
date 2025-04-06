import pino from "pino"

const LOG_FILE = "/Users/mikemurray/Development/DND-Campaign/server.log"

export const createLogger = () => {
	const transport = pino.transport({
		targets: [
			// Pretty print to console only in development
			...(process.env.NODE_ENV !== "production"
				? [
						{
							target: "pino-pretty",
							options: {
								colorize: true,
								ignore: "pid,hostname", // Optional: hide pid and hostname
								translateTime: "SYS:standard", // Use system's standard time format
							},
							level: "debug", // Log level for console output
						},
					]
				: []),
			// Always write to the log file
			{
				target: "pino/file",
				options: { destination: LOG_FILE, mkdir: true }, // mkdir: true ensures the directory exists
				level: "info", // Log level for file output (adjust as needed)
			},
		],
	})

	const logger = pino(
		{
			level: process.env.LOG_LEVEL || "info", // Default log level, can be overridden by env var
			timestamp: pino.stdTimeFunctions.isoTime, // Use ISO time format
		},
		transport,
	)

	process.on("SIGINT", () => {
		logger.info("SIGINT received")
		process.exit(0)
	})
	logger.info("Logger initialized")

	return logger
}
