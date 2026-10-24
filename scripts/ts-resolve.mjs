// Node ESM requires file extensions; the app's source uses extensionless
// imports (Vite resolves them at build time). This loader maps a relative
// extensionless specifier to its .ts file so scripts/gate-test.mjs can import
// the real application modules under --experimental-strip-types.
//
// Usage: node --experimental-strip-types --loader ./scripts/ts-resolve.mjs scripts/gate-test.mjs

import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith(".") && !/\.[cm]?[jt]s$/i.test(specifier)) {
    if (context.parentURL) {
      const candidate = new URL(specifier + ".ts", context.parentURL);
      if (existsSync(fileURLToPath(candidate))) {
        return nextResolve(candidate.href, context);
      }
    }
  }
  return nextResolve(specifier, context);
}
