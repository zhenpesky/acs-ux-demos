#!/bin/bash
# Build and deploy prototype to app/ and sync 404.html.
# Usage: ./deploy.sh
# (no arguments needed — build is run automatically with correct flags)

set -e

# ── Feature flags ──────────────────────────────────────────────────────────
# Set to "false" to park a feature without deleting any code.
ENABLE_COMMENTS=true
# ──────────────────────────────────────────────────────────────────────────

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
SOURCE_DIR="$HOME/Documents/ACS-workspace/stackrox-prototype-sandbox/ui/apps/platform"
BUILD_DIR="$SOURCE_DIR/build"
DEPLOY_DIR="$REPO_DIR/app"

echo "→ Building with RHACS branding and app base path"
cd "$SOURCE_DIR"
VITE_MOCK_MODE=true \
VITE_BASE_PATH=/rhacs-ux-prototypes/app/ \
VITE_ROX_PRODUCT_BRANDING=RHACS_BRANDING \
npx vite build

echo "→ Clearing $DEPLOY_DIR"
find "$DEPLOY_DIR" -mindepth 1 -delete

echo "→ Removing stale saved-filters/ folder"
rm -rf "$REPO_DIR/saved-filters"

echo "→ Copying build output"
cp -r "$BUILD_DIR"/. "$DEPLOY_DIR/"

if [ "$ENABLE_COMMENTS" = "true" ]; then
  echo "→ Injecting commenting system into prototype app"
  CB="$(date +%s)"
  cp "$REPO_DIR/comments.js"  "$DEPLOY_DIR/comments.js"
  cp "$REPO_DIR/comments.css" "$DEPLOY_DIR/comments.css"

  # Inject early gate script into <head> — runs before React paints, prevents flash
  # Blocks the page immediately if: on a /app/main/ path, not share mode, and not already domain-verified
  PREGATE='<script>(function(){var p=window.location.pathname;if(p.indexOf("/app/main/")<0)return;if(/[?&]share=/.test(window.location.search))return;if(localStorage.getItem("rhacs_gh_token")&&localStorage.getItem("rhacs_domain_verified"))return;var s=document.createElement("style");s.textContent="#rhacs-pregate{position:fixed;inset:0;z-index:99998;background:#f5f5f5}";document.head.appendChild(s);var d=document.createElement("div");d.id="rhacs-pregate";document.documentElement.appendChild(d);})();</script>'
  sed -i '' "s|</head>|${PREGATE}</head>|" "$DEPLOY_DIR/index.html"

  sed -i '' "s|</body>|<link rel=\"stylesheet\" href=\"/rhacs-ux-prototypes/app/comments.css?v=${CB}\"><script src=\"/rhacs-ux-prototypes/app/comments.js?v=${CB}\"></script></body>|" "$DEPLOY_DIR/index.html"
  echo "  comments.js + comments.css injected (cache-buster: ${CB})."
else
  echo "→ Commenting system parked (ENABLE_COMMENTS=false) — skipping injection"
fi

echo "→ Syncing 404.html from app/index.html"
# 404.html = exact copy of app/index.html (after injection).
# GitHub Pages serves 404.html for any missing path (e.g. /app/main/systemconfig).
# The React app loads with the original URL intact, so React Router matches correctly.
cp "$DEPLOY_DIR/index.html" "$REPO_DIR/404.html"
echo "  404.html updated."

echo "→ Committing and pushing"
cd "$REPO_DIR"
git add -A
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M')"
git push origin main

echo "✓ Done"
