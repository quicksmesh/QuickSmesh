#!/bin/bash

# USAGE: ./build-linux.sh <quicksmesh version> <go-spacemesh version>

mkdir -p temp

# Set frontend build environment variables
export QUICKSMESH_VERSION=$1
export SPACEMESH_VERSION=$2

# Build frontend
yarn --cwd ../frontend install
yarn --cwd ../frontend build --out-dir "$(pwd)/temp/frontend-dist" --emptyOutDir

# Package into python executable
pyinstaller ../backend/quicksmesh.py --add-data ./temp/frontend-dist:./dist --icon ./icon.ico --distpath ./dist --workpath ./temp/build -y

# Get Spacemesh version from command line argument
if [ -z "$SPACEMESH_VERSION" ]; then
    echo "Error: Spacemesh version not provided"
    exit 1
fi

# Download go-spacemesh zip
curl -o ./temp/spacemesh.zip https://storage.googleapis.com/go-spacemesh-release-builds/"$SPACEMESH_VERSION"/go-spacemesh-"$SPACEMESH_VERSION"-linux-amd64.zip

mkdir -p temp/spacemesh
mkdir -p dist/quicksmesh/spacemesh

# Unzip Spacemesh binaries to dist folder
unzip -q ./temp/spacemesh.zip -d ./temp/spacemesh
mv -f ./temp/spacemesh/go-spacemesh-"$SPACEMESH_VERSION"-linux-amd64/* ./dist/quicksmesh/spacemesh
echo "$SPACEMESH_VERSION" > ./dist/quicksmesh/spacemesh/version.txt
