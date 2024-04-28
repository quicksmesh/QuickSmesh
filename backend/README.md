# QuickSmesh Backend

This directory contains the backend Python application.

## Requirements

To run the backend you will need Python 3.10 and have installed the following packages:

    pip3 install -r requirements.txt

## Usage

To run the backend and host the front end at the same time run:

    python3 quicksmesh.py --frontend-dir <path/to/dist>

Alternatively, if you are already serving the frontend (e.g. `yarn dev`) then you can run:

    python3 quicksmesh.py --no-frontend
