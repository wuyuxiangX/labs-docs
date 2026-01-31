#!/bin/bash

# Generate MeBot icon assets from source logo
# Usage: ./scripts/generate-icons.sh
#
# Prerequisites:
# - Place mebot_logo.png (at least 512x512, preferably 600x600+) in /public/
# - macOS with sips command available
#
# This script generates:
# - favicon-16x16.png
# - favicon-32x32.png
# - apple-touch-icon.png (180x180)
# - icon-192x192.png
# - icon-512x512.png
# - favicon.ico (multi-resolution)

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
PUBLIC_DIR="$PROJECT_ROOT/public"
SOURCE_IMAGE="$PUBLIC_DIR/mebot_logo.png"

# Check if source image exists
if [ ! -f "$SOURCE_IMAGE" ]; then
    echo "Error: Source image not found at $SOURCE_IMAGE"
    echo "Please add mebot_logo.png (600x600 recommended) to the public directory first."
    exit 1
fi

echo "Generating icons from $SOURCE_IMAGE..."

# Create temporary directory for processing
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

# Function to resize image using sips (macOS)
resize_image() {
    local size=$1
    local output=$2
    cp "$SOURCE_IMAGE" "$TEMP_DIR/temp.png"
    sips -z $size $size "$TEMP_DIR/temp.png" --out "$output" > /dev/null 2>&1
    echo "Created: $output ($size x $size)"
}

# Generate PNG icons
resize_image 16 "$PUBLIC_DIR/favicon-16x16.png"
resize_image 32 "$PUBLIC_DIR/favicon-32x32.png"
resize_image 180 "$PUBLIC_DIR/apple-touch-icon.png"
resize_image 192 "$PUBLIC_DIR/icon-192x192.png"
resize_image 512 "$PUBLIC_DIR/icon-512x512.png"

# Generate multi-resolution favicon.ico
# Using sips to create individual sizes, then combine with iconutil or just use the 32x32 as ico
# For a proper .ico file with multiple sizes, we need additional tools
# As a fallback, we'll create a simple .ico from the 32x32 version

# Check if we have imagemagick for proper ico generation
if command -v convert &> /dev/null; then
    echo "Using ImageMagick to create multi-resolution favicon.ico..."
    resize_image 48 "$TEMP_DIR/favicon-48.png"
    convert "$PUBLIC_DIR/favicon-16x16.png" "$PUBLIC_DIR/favicon-32x32.png" "$TEMP_DIR/favicon-48.png" "$PUBLIC_DIR/favicon.ico"
    echo "Created: $PUBLIC_DIR/favicon.ico (16x16, 32x32, 48x48)"
else
    echo "ImageMagick not found. Creating simple favicon.ico from 32x32 PNG..."
    echo "For a proper multi-resolution .ico file, install ImageMagick:"
    echo "  brew install imagemagick"
    # Copy the 32x32 as a fallback (browsers will accept PNG disguised as ico)
    cp "$PUBLIC_DIR/favicon-32x32.png" "$PUBLIC_DIR/favicon.ico"
    echo "Created: $PUBLIC_DIR/favicon.ico (32x32 only)"
fi

echo ""
echo "Icon generation complete!"
echo ""
echo "Generated files:"
ls -la "$PUBLIC_DIR"/*.png "$PUBLIC_DIR"/*.ico 2>/dev/null || true
