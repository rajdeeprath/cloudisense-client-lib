#!/bin/bash

# Set the target repository (default: npm registry)
NPM_REGISTRY="https://registry.npmjs.org/"

# Extract the version from package.json
PACKAGE_JSON="package.json"
VERSION=$(jq -r '.version' "$PACKAGE_JSON")

# Ensure jq is installed
if [ -z "$VERSION" ] || [ "$VERSION" == "null" ]; then
  echo "❌ Error: Could not extract version from package.json."
  exit 1
fi

echo "📦 Preparing to publish version $VERSION of cloudisense client-lib..."

# Remove old build artifacts
echo "🧹 Cleaning old build files..."
rm -rf ./dist
rm -rf ./node_modules

# Install dependencies
echo "📥 Installing dependencies..."
npm install --legacy-peer-deps

# Build the TypeScript project
echo "⚙️ Building TypeScript project..."
npm run build

# Verify the build output exists
BUILD_DIR="dist"
if [ ! -d "$BUILD_DIR" ]; then
  echo "❌ Error: Build failed. '$BUILD_DIR' directory does not exist."
  exit 1
fi

# Run npm package verification
echo "🔍 Checking package integrity..."
npm pack --dry-run

if [ $? -ne 0 ]; then
  echo "❌ Package check failed. Please fix the issues and try again."
  exit 1
fi

# Publish to npm (or another registry)
echo "🚀 Publishing to npm..."
npm publish --access public --registry "$NPM_REGISTRY"

# Check if publish succeeded
if [ $? -eq 0 ]; then
  echo "✅ Successfully published version $VERSION to npm."
else
  echo "❌ Error publishing package. Check the logs above for details."
  exit 1
fi
