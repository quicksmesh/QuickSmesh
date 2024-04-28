# Build Scripts

This directory contains build scripts for producing a standalone and distributable application.

## Requirements

To build a release yourself you will need:

- Node.js 20
- Python 3.10

Node dependencies:

    npm install -g yarn vite

Python dependencies:

    pip install -r requirements.txt

## Usage

To create a windows build run:

    ./build-windows.bat <quicksmesh version> <go-spacemesh version>

To create a linux build run:

    ./build-linux.sh <quicksmesh version> <go-spacemesh version>

For example:

    ./build-windows v0.0.0-alpha v1.5.0
