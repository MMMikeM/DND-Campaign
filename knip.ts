import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  "workspaces": {
    "packages/react": {
      "entry": [
        "app/routes/**/*.{ts,tsx}"
      ],
      "project": [
        "app/**/*.{ts,tsx}",
        "app/**/*.css"
      ]
    },
    "packages/mcp": {
      "project": [
        "src/**/*.ts"
      ]
    },
    "packages/shared": {
      // Each src/*.ts is a public subpath barrel; package.json maps "./*" to
      // dist, which knip cannot resolve back to source, so list them as entries.
      "entry": [
        "src/*.ts",
        "src/db/index.ts"
      ],
      "project": [
        "src/**/*.{ts,js}"
      ]
    }
  },
  "ignore": [
    "packages/react/app/components/ui/**"
  ],
  "includeEntryExports": true,
  "ignoreExportsUsedInFile": true
}

export default config;