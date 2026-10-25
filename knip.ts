import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  "ignore": [
    "packages/react/app/components/ui/**"
  ],
  "includeEntryExports": true,
  "ignoreExportsUsedInFile": true
}

export default config;
