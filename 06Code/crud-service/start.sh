#!/bin/bash
# Install Python dependencies in a local virtual environment (required on AWS Linux)
python3 -m venv venv
./venv/bin/pip install -r requirements.txt

# Start the Python FastAPI server in the background using the venv
./venv/bin/python -m uvicorn src.modules.product.main:app --port 8000 &

# Start the Node.js Express server in the foreground
node dist/app.js
