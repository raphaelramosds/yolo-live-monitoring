#!/usr/bin/env bash
set -euo pipefail

ffplay -rtsp_transport tcp rtsp://localhost:8555/file
