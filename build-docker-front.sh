#!/bin/bash

# Exit immediately if any command fails
set -e

# --- Configuration ---
# Your Docker registry prefix (or just your username)
REGISTRY="xappyy"

# The tag to apply to all images
TAG="latest"
IMAGE_NAME="${REGISTRY}/frontend-service"
docker build \
    -f Dockerfile-frontend \
    -t "${IMAGE_NAME}:${TAG}" \
    .