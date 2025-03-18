#!/bin/bash
# Start the MCP server

# Navigate to the directory containing this script
cd "$(dirname "$0")"

# Set environment variables for logging
export LOG_LEVEL=debug
# Uncomment the following line to save logs to a file
# export LOG_TO_FILE=true

# Run the server using tsx
echo "Starting MCP server..."
tsx src/index.ts 