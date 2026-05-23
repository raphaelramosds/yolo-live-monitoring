#!/usr/bin/env bash
set -euo pipefail

usage() {
  echo "Usage: $0 <image-dir> [output.mkv] [fps] [duration]"
  echo ""
  echo "  image-dir   Directory containing JPG images (sorted by filename)"
  echo "  output.mkv  Output file (default: <image-dir>.mkv)"
  echo "  fps         Frames per second (default: 25)"
  echo "  duration    Seconds each image is shown (default: 5)"
  exit 1
}

[ $# -lt 1 ] && usage

image_dir="${1%/}"
output="${2:-${image_dir}.mkv}"
fps="${3:-25}"
duration="${4:-5}"

if [ ! -d "$image_dir" ]; then
  echo "Error: '$image_dir' is not a directory." >&2
  exit 1
fi

# Count JPGs (case-insensitive)
count=$(find "$image_dir" -maxdepth 1 -iname "*.jpg" -o -iname "*.jpeg" | wc -l)
if [ "$count" -eq 0 ]; then
  echo "Error: no JPG/JPEG files found in '$image_dir'." >&2
  exit 1
fi

echo "Found $count image(s) in '$image_dir' — encoding at ${fps} fps, ${duration}s per image → $output"

# Build a sorted concat list to handle mixed-case extensions (jpg/JPG/jpeg/JPEG).
concat_list=$(mktemp /tmp/ffmpeg_concat_XXXXXX.txt)
trap 'rm -f "$concat_list"' EXIT

find "$image_dir" -maxdepth 1 \( -iname "*.jpg" -o -iname "*.jpeg" \) | sort | while IFS= read -r f; do
  printf "file '%s'\nduration %s\n" "$f" "$duration"
done > "$concat_list"

ffmpeg -y \
  -f concat \
  -safe 0 \
  -i "$concat_list" \
  -r "$fps" \
  -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" \
  -c:v libx264 \
  -profile:v baseline \
  -level 3.1 \
  -pix_fmt yuv420p \
  -an \
  "$output"

echo "Done: $output"
