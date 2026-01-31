#!/bin/bash

# Generate MeBot icon assets from SVG source logo
# Usage: ./scripts/generate-icons.sh
#
# Prerequisites:
# - Place secondme_logo.svg in /public/
# - Install librsvg: brew install librsvg
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
SOURCE_SVG="$PUBLIC_DIR/secondme_logo.svg"

# Check if source SVG exists
if [ ! -f "$SOURCE_SVG" ]; then
    echo "Error: Source SVG not found at $SOURCE_SVG"
    echo "Please add secondme_logo.svg to the public directory first."
    exit 1
fi

# Check if rsvg-convert is available
if ! command -v rsvg-convert &> /dev/null; then
    echo "Error: rsvg-convert not found."
    echo "Please install librsvg first:"
    echo "  brew install librsvg"
    exit 1
fi

echo "Generating icons from $SOURCE_SVG..."

# Create temporary directory for processing
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

# Function to resize SVG to PNG using rsvg-convert
resize_svg() {
    local size=$1
    local output=$2
    rsvg-convert -w $size -h $size "$SOURCE_SVG" -o "$output"
    echo "Created: $output ($size x $size)"
}

# Generate PNG icons
resize_svg 16 "$PUBLIC_DIR/favicon-16x16.png"
resize_svg 32 "$PUBLIC_DIR/favicon-32x32.png"
resize_svg 180 "$PUBLIC_DIR/apple-touch-icon.png"
resize_svg 192 "$PUBLIC_DIR/icon-192x192.png"
resize_svg 512 "$PUBLIC_DIR/icon-512x512.png"

# Generate multi-resolution favicon.ico
if command -v convert &> /dev/null; then
    echo "Using ImageMagick to create multi-resolution favicon.ico..."
    resize_svg 48 "$TEMP_DIR/favicon-48.png"
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
