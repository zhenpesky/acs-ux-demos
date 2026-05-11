#!/bin/bash
# Deploy built prototype to saved-filters/ and sync 404.html.
# Usage: ./deploy.sh <path-to-build-output>
# Example: ./deploy.sh ~/Documents/ACS-workspace/stackrox-vm-sandbox/ui/apps/platform/build

set -e

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
BUILD_DIR="${1:-$HOME/Documents/ACS-workspace/stackrox-vm-sandbox/ui/apps/platform/build}"
DEPLOY_DIR="$REPO_DIR/saved-filters"

echo "→ Clearing $DEPLOY_DIR"
find "$DEPLOY_DIR" -mindepth 1 -delete

echo "→ Copying build output"
cp -r "$BUILD_DIR"/. "$DEPLOY_DIR/"

echo "→ Syncing 404.html from app/index.html"
# 404.html = exact copy of app/index.html.
# GitHub Pages serves 404.html for any missing path (e.g. /app/main/systemconfig).
# The React app loads with the original URL intact, so React Router matches correctly.
cp "$REPO_DIR/app/index.html" "$REPO_DIR/404.html"
echo "  404.html updated."

echo "→ Committing and pushing"
cd "$REPO_DIR"
git add -A
git commit -m "Deploy: sync saved-filters and 404.html"
git push origin main

echo "✓ Done"
