#!/bin/bash
# Run the full StackRox UI locally
# This connects to a remote StackRox Central for backend API

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
STACKROX_UI_DIR="$PROJECT_DIR/stackrox-upstream/ui/apps/platform"

echo "========================================"
echo "StackRox UI Local Development Setup"
echo "========================================"

# Check if stackrox-upstream exists
if [ ! -d "$STACKROX_UI_DIR" ]; then
    echo "Error: stackrox-upstream not found. Run 'npm run clone-upstream' first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 22 ]; then
    echo "Warning: StackRox UI requires Node.js >= 22.13.0"
    echo "Current version: $(node -v)"
    echo "Please upgrade Node.js using nvm or similar."
    exit 1
fi

# Load environment variables if .env.local exists
if [ -f "$PROJECT_DIR/.env.local" ]; then
    source "$PROJECT_DIR/.env.local"
fi

# Check for StackRox URL
if [ -z "$VITE_STACKROX_URL" ]; then
    echo ""
    echo "No StackRox Central URL configured."
    echo ""
    echo "To connect to a real StackRox Central:"
    echo "  1. Create .env.local with:"
    echo "     VITE_STACKROX_URL=https://your-central.example.com"
    echo ""
    echo "  2. Or run with environment variable:"
    echo "     UI_START_TARGET=https://your-central.example.com ./scripts/run-full-stackrox-ui.sh"
    echo ""
    echo "Without a Central, the UI will start but API calls will fail."
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Set target from env if not already set
if [ -z "$UI_START_TARGET" ] && [ -n "$VITE_STACKROX_URL" ]; then
    export UI_START_TARGET="$VITE_STACKROX_URL"
fi

cd "$STACKROX_UI_DIR"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm ci
fi

echo ""
echo "Starting StackRox UI..."
if [ -n "$UI_START_TARGET" ]; then
    echo "API Target: $UI_START_TARGET"
fi
echo ""
echo "UI will be available at: https://localhost:3000"
echo ""

npm run start
