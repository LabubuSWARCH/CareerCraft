#!/bin/bash

# Exit immediately if any command fails
set -e

# --- Configuration ---
# Your Docker registry prefix (or just your username)
REGISTRY="my-registry"

# The tag to apply to all images
TAG="latest"

# List of all server services to build
# (These must match the 'SERVICE_NAME' your Dockerfile expects)
SERVICES=("auth" "template" "resume" "noti")
# --- End Configuration ---


# Main build loop
for service in "${SERVICES[@]}"
do
  # This is the name the image will have, e.g., "my-registry/auth-service"
  IMAGE_NAME="${REGISTRY}/${service}-service"

  echo "============================================="
  echo "Building ${service}..."
  echo "Image: ${IMAGE_NAME}:${TAG}"
  echo "============================================="

  docker build \
    -f Dockerfile \
    --build-arg SERVICE_NAME="${service}" \
    -t "${IMAGE_NAME}:${TAG}" \
    .

  echo "Successfully built ${IMAGE_NAME}:${TAG}"
done

echo "============================================="
echo "All services built successfully!"
echo "============================================="