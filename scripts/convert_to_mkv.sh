#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Usage: $0 <input.mp4> [output.mkv]"
  exit 1
fi

input="$1"
output="${2:-${input%.*}.mkv}"

ffmpeg -i "$input" -c:v libx264 -profile:v baseline -level 3.1 -an "$output"
echo "Done: $output"
