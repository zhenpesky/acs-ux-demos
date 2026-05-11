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

echo "→ Syncing 404.html from saved-filters/index.html"
# Prepend the /app/* → /saved-filters/* path translation script, then append index.html body.
INDEX="$DEPLOY_DIR/index.html"

# Extract the content after <html> opening and inject path translation before everything else.
python3 - <<'PYEOF'
import re, sys

repo = sys.argv[1] if len(sys.argv) > 1 else '.'

with open(f'{repo}/saved-filters/index.html', 'r') as f:
    content = f.read()

translation_script = """
    <!--
      Path translation: /app/* → /saved-filters/*
      Must run BEFORE any React/Vite scripts so React Router sees the correct path.
    -->
    <script>
      (function () {
        var path = window.location.pathname;
        var appPrefix = '/rhacs-ux-prototypes/app';
        var sfPrefix  = '/rhacs-ux-prototypes/saved-filters';

        if (path.indexOf(appPrefix) === 0) {
          var newPath = sfPrefix + (path.slice(appPrefix.length) || '/');
          history.replaceState(null, '', newPath + window.location.search + window.location.hash);
        }
      })();
    </script>"""

# Insert path translation script right after <head>
updated = re.sub(r'(<head[^>]*>)', r'\1' + translation_script, content, count=1)

with open(f'{repo}/404.html', 'w') as f:
    f.write(updated)

print('  404.html updated.')
PYEOF "$REPO_DIR"

echo "→ Committing and pushing"
cd "$REPO_DIR"
git add -A
git commit -m "Deploy: sync saved-filters and 404.html"
git push origin main

echo "✓ Done"
