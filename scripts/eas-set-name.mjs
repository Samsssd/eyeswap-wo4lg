#!/usr/bin/env node
// Sets the Expo project `name` and `slug` in app.json to the GitHub repo name.
//
// This boilerplate is meant to be cloned/renamed per project, so the EAS project
// is provisioned at CI time (by `eas init`) under the repo's name instead of a
// hardcoded slug. Run this BEFORE `eas init`.
//
// Usage: node scripts/eas-set-name.mjs "<repo-name>"

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const repoName = (process.argv[2] || "").trim();
if (!repoName) {
  console.error("Usage: node scripts/eas-set-name.mjs <repo-name>");
  process.exit(1);
}

// EAS slugs must be lowercase and URL-safe; name can stay human-readable.
const slug = repoName
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");

if (!slug) {
  console.error(`Could not derive a valid slug from "${repoName}"`);
  process.exit(1);
}

const appJsonPath = join(dirname(fileURLToPath(import.meta.url)), "..", "app.json");
const config = JSON.parse(readFileSync(appJsonPath, "utf8"));

config.expo = config.expo || {};
config.expo.name = repoName;
config.expo.slug = slug;

writeFileSync(appJsonPath, JSON.stringify(config, null, 2) + "\n");
console.log(`app.json updated -> name: "${repoName}", slug: "${slug}"`);
