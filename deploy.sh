#!/bin/bash
# Build and deploy prototype to saved-filters/ and sync 404.html.
# Usage: ./deploy.sh
# (no arguments needed — build is run automatically with correct flags)

set -e

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
SOURCE_DIR="$HOME/Documents/ACS-workspace/stackrox-vm-sandbox/ui/apps/platform"
BUILD_DIR="$SOURCE_DIR/build"
DEPLOY_DIR="$REPO_DIR/saved-filters"

echo "→ Building with RHACS branding and saved-filters base path"
cd "$SOURCE_DIR"
VITE_MOCK_MODE=true \
VITE_BASE_PATH=/rhacs-ux-prototypes/saved-filters/ \
VITE_ROX_PRODUCT_BRANDING=RHACS_BRANDING \
npx vite build

echo "→ Clearing $DEPLOY_DIR"
find "$DEPLOY_DIR" -mindepth 1 -delete

echo "→ Copying build output"
cp -r "$BUILD_DIR"/. "$DEPLOY_DIR/"

echo "→ Syncing 404.html from saved-filters/index.html"
# 404.html = exact copy of saved-filters/index.html.
# GitHub Pages serves 404.html for any missing path (e.g. /saved-filters/main/systemconfig).
# The React app loads with the original URL intact, so React Router matches correctly.
cp "$DEPLOY_DIR/index.html" "$REPO_DIR/404.html"
echo "  404.html updated."

echo "→ Committing and pushing"
cd "$REPO_DIR"
git add -A
git commit -m "Deploy: sync saved-filters and 404.html"
git push origin main

echo "✓ Done"
