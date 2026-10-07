import base44 from "@base44/vite-plugin"
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

// Base44 may invoke Vite directly rather than npm's build script. Keep the
// crawlable HTML and RSS generation inside that build lifecycle so both paths
// produce the same publication artifact. Fail the build if generation fails.
function publicSearchOutput() {
  const cwd = fileURLToPath(new URL('.', import.meta.url))
  const run = script => execFileSync(process.execPath, [
    '--experimental-loader=./scripts/resolve-extensionless-modules.mjs', script,
  ], { cwd, stdio: 'inherit' })
  return {
    name: 'nta-public-search-output',
    apply: 'build',
    buildStart() { run('scripts/generate-podcast-feed.mjs') },
    closeBundle() { run('scripts/generate-seo-pages.mjs') },
  }
}

// https://vite.dev/config/
export default defineConfig({
  logLevel: 'error', // Suppress warnings, only show errors
  // Keep the editor/dev server as an SPA, but let production serve the
  // route-aware HTML files generated after the Vite build.
  appType: process.env.NODE_ENV === 'production' ? 'mpa' : 'spa',
  plugins: [
    base44({
      // Support for legacy code that imports the base44 SDK with @/integrations, @/entities, etc.
      // can be removed if the code has been updated to use the new SDK imports from @base44/sdk
      legacySDKImports: process.env.BASE44_LEGACY_SDK_IMPORTS === 'true'
    }),
    react(),
    publicSearchOutput(),
  ]
});