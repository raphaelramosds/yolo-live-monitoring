# Streaming

RTSP video simulator powered by [bstreamer](https://github.com/vzhn/bstreamer), used to emulate an IP camera feed for local development.

## Installing ffmpeg and ffplay

`ffplay` ships as part of the ffmpeg package.

**Ubuntu / Debian**
```bash
sudo apt update && sudo apt install -y ffmpeg
```

**macOS**
```bash
brew install ffmpeg
```

**Windows**
Download the latest build from https://www.gyan.dev/ffmpeg/builds/ and add the `bin/` folder to your `PATH`.

Verify the installation:
```bash
ffmpeg -version
ffplay -version
```

## Scripts

**Convert an MP4 to MKV** (required format for bstreamer file streaming):
```bash
./scripts/convert_to_mkv.sh <input.mp4> [output.mkv]
```
The converted file should be placed at `streaming/video/shale-shaker.mkv`.

**Play the RTSP stream** (requires the bstreamer container to be running):
```bash
./scripts/play_stream.sh
```

## Running bstreamer

```bash
docker-compose up bstreamer
```

The server listens on `rtsp://localhost:8555`. Available sources:

| URL | Description |
|-----|-------------|
| `rtsp://localhost:8555/file` | Streams `streaming/video/shale-shaker.mkv` |
| `rtsp://localhost:8555/picture` | Procedurally-generated picture (no file needed) |
