#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Get the path to the project directory
const projectDir = __dirname;

// Path to the TypeScript source file
const mcpServerTsPath = path.join(
  projectDir, 
  'packages', 
  'mcp', 
  'src', 
  'index.ts'
);

// Check if the source file exists
if (!fs.existsSync(mcpServerTsPath)) {
  console.error(`MCP server source file not found at: ${mcpServerTsPath}`);
  process.exit(1);
}

// Find the path to npx
const npxPath = process.platform === 'win32' 
  ? 'npx.cmd'  // Windows
  : 'npx';     // Unix-based systems

// Set NODE_PATH to allow direct imports from shared package
const env = {
  ...process.env,
  NODE_PATH: path.join(projectDir, 'packages')
};

// Run tsx on the TypeScript file
const nodeProcess = spawn(npxPath, ['tsx', '--tsconfig', path.join(projectDir, 'packages/mcp/tsconfig.json'), mcpServerTsPath], {
  stdio: 'inherit',
  cwd: projectDir,
  env
});

nodeProcess.on('error', (err) => {
  console.error('Failed to start MCP server:', err.message);
  process.exit(1);
});

nodeProcess.on('close', (code) => {
  if (code !== 0) {
    console.error(`MCP server exited with code ${code}`);
  }
  process.exit(code);
}); 