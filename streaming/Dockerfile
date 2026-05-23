FROM eclipse-temurin:17-jre-jammy

RUN apt-get update && apt-get install -y --no-install-recommends \
        curl \
    && rm -rf /var/lib/apt/lists/*

ENV BSTREAMER_VERSION=1.0.0
ENV BSTREAMER_HOME=/opt/bstreamer

RUN curl -fsSL \
    "https://github.com/vzhn/bstreamer/releases/download/v${BSTREAMER_VERSION}/bstreamer-${BSTREAMER_VERSION}-bin-linux-x86_64.tar.gz" \
    | tar -xz -C /opt \
    && mv /opt/bstreamer-${BSTREAMER_VERSION} ${BSTREAMER_HOME}

WORKDIR ${BSTREAMER_HOME}

# video/ is the default directory bserver looks for .mkv files.
# Mount a host directory here to stream real video files, or leave it
# empty and use the procedurally-generated RTSP source (rtsp://<host>:8554/picture).
RUN mkdir -p video

COPY server.yaml .

EXPOSE 8554

CMD ["bin/bserver", "-c", "server.yaml"]
