// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { builtinModules } from 'node:module';

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  nitro: {
    preset: "vercel",
    serverAssets: [{ baseName: 'pdf-products', dir: './private-products' }],
    // Vercel supplies Node built-ins. Keep Stripe's bare http/https imports
    // external instead of resolving them as npm packages in the Nitro bundle.
    rollupConfig: { external: [...builtinModules, ...builtinModules.map(name => `node:${name}`)] },
  },
  vite: {
    build: {
      chunkSizeWarningLimit: 1500,
    },
  },
});
