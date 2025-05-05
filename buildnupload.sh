#!/bin/bash

# ----Tag to trigger----
# git tag -a v1.3.0 -m "Release v1.3.0"
# git push origin v1.3.0

# Run Locally
# To run this script from your terminal (outside GitHub Actions):
# export NODE_AUTH_TOKEN=npm_xxxxxxxxxxxxxxxxxxxxxxxxx
# ./buildnupload.sh
# OR
# NODE_AUTH_TOKEN=npm_xxxxxxxxxxxxxxxxxxxxxxxxx ./buildnupload.sh



# Exit immediately if a command fails or any part of a pipeline fails
set -e
set -o pipefail

# ============================
# CONFIGURATION
# ============================

# Set the npm registry — override with env var if needed
# Example override: NPM_REGISTRY=https://registry.npmjs.org ./buildnupload.sh
NPM_REGISTRY="${NPM_REGISTRY:-https://registry.npmjs.org/}"

PACKAGE_JSON="package.json"
BUILD_DIR="dist"

# ============================
# PRECHECKS
# ============================

# Ensure `jq` is installed (used to extract version from package.json)
if ! command -v jq &> /dev/null; then
  echo "❌ ERROR: 'jq' is required but not installed. Please install jq."
  exit 1
fi

# Extract version from package.json
VERSION=$(jq -r '.version' "$PACKAGE_JSON")
if [ -z "$VERSION" ] || [ "$VERSION" == "null" ]; then
  echo "❌ ERROR: Could not extract version from $PACKAGE_JSON."
  exit 1
fi

echo "📦 Preparing to publish version $VERSION of cloudisense-client-lib..."

# ============================
# CLEANUP
# ============================

echo "🧹 Cleaning previous builds..."
rm -rf "$BUILD_DIR" node_modules

# ============================
# INSTALL & BUILD
# ============================

echo "📥 Installing dependencies..."
npm install --legacy-peer-deps

echo "🛠️ Building TypeScript project..."
npm run build

# Ensure the build output exists
if [ ! -d "$BUILD_DIR" ]; then
  echo "❌ ERROR: Build failed. '$BUILD_DIR' directory not found."
  exit 1
fi

# ============================
# PACKAGE CHECK
# ============================

echo "🔍 Running npm pack dry-run to verify publishability..."
npm pack --dry-run > /dev/null

echo "✅ Package check passed."

# ============================
# PUBLISH
# ============================

echo "🚀 Publishing to npm registry: $NPM_REGISTRY ..."
npm publish --access public --registry "$NPM_REGISTRY"

echo "🎉 Successfully published version $VERSION to npm."
