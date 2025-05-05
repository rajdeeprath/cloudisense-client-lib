# NPM CI/CD Workflow for `cloudisense-client-lib`

This document explains how your **React/TypeScript library** (`cloudisense-client-lib`) is automatically built and published to **npm** when a Git tag is pushed.

---

## Overview

Whenever you push a version **tag** like `v1.3.0`:

1. GitHub Actions is triggered  
2. Your `buildnupload.sh` is executed  
3. The library is built (`npm run build`)  
4. The package is published to **npm** using `NODE_AUTH_TOKEN` from GitHub Secrets

---

## Folder Structure

Your project layout is clean and CI/CD-ready:

```bash
cloudisense-client-lib/
├── .github/
│   └── workflows/
│       └── publish-npm.yml      # GitHub Actions workflow
├── buildnupload.sh              # Build & publish shell script
├── package.json
├── dist/                        # Build output
├── src/                         # TypeScript source files
└── .npmignore                   # Optional: excludes dev files from npm package
```

---

## GitHub Actions Workflow

**File:** `.github/workflows/publish-npm.yml`

```yaml
name: Publish to npm

on:
  push:
    tags:
      - "v*"  # Triggers on tags like v1.3.0

jobs:
  build-and-publish:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "18"
          registry-url: "https://registry.npmjs.org"

      - name: Authenticate with npm and run build script
        run: ./buildnupload.sh
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
          NPM_REGISTRY: https://registry.npmjs.org
```

---

## 🐚 Shell Script: `buildnupload.sh`

This script:

- Extracts version from `package.json` using `jq`
- Cleans `dist/` and `node_modules/`
- Installs dependencies
- Builds using `npm run build`
- Verifies package using `npm pack --dry-run`
- Publishes with `npm publish --access public`

You can also run it **locally**:

```bash
NODE_AUTH_TOKEN=npm_... ./buildnupload.sh
```

---

## GitHub Secret Required

| Name       | Description                  |
|------------|------------------------------|
| `NPM_TOKEN`| Your npm automation token from [https://www.npmjs.com/settings](https://www.npmjs.com/settings) |

---

## How to Trigger the Workflow

1. Make sure `package.json` version is updated (e.g. `1.3.0`)
2. Commit and push your changes
3. Tag and push:

```bash
git tag -a v1.3.0 -m "Release v1.3.0"
git push origin v1.3.0
```

This will start the GitHub Action and publish to npm automatically.

---

## Last Updated

2025-05-04
